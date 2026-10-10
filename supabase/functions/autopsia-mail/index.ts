import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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
        const { customer, userEmail } = await req.json();
        
        let toEmails = ['spiros39t@gmail.com', 'kmfiber@teletronic.gr'];
        if (customer?.autopsia_tech_data?.recipient_email) {
            toEmails = customer.autopsia_tech_data.recipient_email.split(',').map((e: string) => e.trim()).filter((e: string) => e);
        }

        const data = await resend.emails.send({
            from: "SGK Digital <info@sgk.gr>",
            to: toEmails,
            subject: `Ολοκλήρωση Αυτοψίας: ${customer.address} - ${customer.city}`,
            html: `
                <h2>Η αυτοψία ολοκληρώθηκε</h2>
                <p><strong>Πελάτης:</strong> ${customer.first_name} ${customer.last_name}</p>
                <p><strong>Διεύθυνση:</strong> ${customer.address}, ${customer.city}</p>
                <p><strong>Building ID:</strong> ${customer.building_id || '-'}</p>
                <p><strong>Τεχνικός:</strong> ${userEmail || 'Άγνωστος'}</p>
            `,
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
