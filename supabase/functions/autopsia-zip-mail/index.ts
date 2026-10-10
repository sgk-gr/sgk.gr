import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { encode } from "https://deno.land/std@0.190.0/encoding/base64.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { customer } = await req.json();

        let toEmails = ['info@sgk.gr'];
        if (customer?.autopsia_tech_data?.recipient_email) {
            toEmails = customer.autopsia_tech_data.recipient_email.split(',').map((e: string) => e.trim()).filter((e: string) => e);
        }

        const entypaCategories = ['aut_decl', 'aut_report', 'aut_tech', 'aut_form1', 'aut_form2', 'aut_form3', 'aut_form4', 'aut_fb'];
        let attachments: any[] = [];

        if (customer.photo_urls && Array.isArray(customer.photo_urls)) {
            for (const cat of entypaCategories) {
                const url = customer.photo_urls.find((u: string) => u.includes(cat));
                if (url) {
                    try {
                        const res = await fetch(url);
                        const arrayBuffer = await res.arrayBuffer();
                        const base64 = encode(arrayBuffer);

                        attachments.push({
                            filename: `${cat}_${customer.id}.jpg`,
                            content: base64,
                        });
                    } catch (e) {
                        console.error('Failed to fetch attachment', url, e);
                    }
                }
            }
        }

        const data = await resend.emails.send({
            from: "SGK Digital <info@sgk.gr>",
            to: toEmails,
            subject: `Έγγραφα Αυτοψίας (ZIP): ${customer.address} - ${customer.city}`,
            html: `
                <h2>Έντυπα Αυτοψίας</h2>
                <p><strong>Διεύθυνση:</strong> ${customer.address}, ${customer.city}</p>
                <p><strong>SR:</strong> ${customer.sr || '-'}</p>
                <p>Επισυνάπτονται τα παραγόμενα ψηφιακά έγγραφα.</p>
            `,
            attachments: attachments.length > 0 ? attachments : undefined
        });

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
