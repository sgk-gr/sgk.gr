import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const payload = await req.json();
        const {
            type = "estimate",
            firstName,
            lastName,
            email,
            phone,
            company,
            howDidYouHear,
            projectInfo,
            needsNDA,
            offerPrice,
            marketingConsent
        } = payload;

        // 1. Save to Database
        const { error: dbError } = await supabase
            .from("sgk_mails")
            .insert([{
                type,
                email,
                first_name: firstName,
                last_name: lastName,
                phone,
                company,
                how_did_you_hear: howDidYouHear,
                project_info: projectInfo,
                needs_nda: needsNDA,
                offer_price: offerPrice,
                marketing_consent: marketingConsent
            }]);

        if (dbError) {
            console.error("Database Insert Error:", dbError);
        }

        // 2. Send Emails
        let emailResult;

        if (type === "newsletter") {
            // Newsletter Specific Email
            emailResult = await resend.emails.send({
                from: "SGK Digital <noreply@sgk.gr>",
                to: ["info@sgk.gr"],
                subject: `📩 Νέα εγγραφή στο Newsletter: ${email}`,
                html: `<p>Νέα εγγραφή στο newsletter από το <strong>${email}</strong></p>`
            });
        } else {
            // Estimate Specific Email
            const offerSection = offerPrice
                ? `<div style="background:#FFF8E1;padding:16px;border-radius:8px;border-left:4px solid #C5A267;margin:16px 0;">
                    <p style="margin:0;font-weight:bold;color:#C5A267;">⚡ Προσφορά Eshop Demo</p>
                    <p style="margin:4px 0 0;font-size:18px;font-weight:bold;">Τιμή προσφοράς: €${offerPrice}</p>
                   </div>`
                : '';

            emailResult = await resend.emails.send({
                from: "SGK Digital <noreply@sgk.gr>",
                to: ["info@sgk.gr"],
                subject: projectInfo
                    ? `🚀 Νέο Project: ${firstName} ${lastName}`
                    : `🟡 Νέο αίτημα επικοινωνίας - SGK Digital`,
                html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #333; border-bottom: 2px solid #00D16B; padding-bottom: 10px;">Νέο αίτημα Εκτίμησης Έργου</h2>
                
                <div style="margin: 20px 0; display: grid; grid-template-cols: 1fr 1fr; gap: 10px;">
                    <p><strong>Όνομα:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Τηλέφωνο:</strong> ${phone || 'Δεν δηλώθηκε'}</p>
                    <p><strong>Εταιρεία:</strong> ${company || 'Δεν δηλώθηκε'}</p>
                    <p><strong>Πηγή:</strong> ${howDidYouHear || 'Δεν δηλώθηκε'}</p>
                    <p><strong>Χρειάζεται NDA:</strong> ${needsNDA === 'Yes' ? '✅ Ναι' : '❌ Όχι'}</p>
                </div>

                ${projectInfo ? `
                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; font-size: 16px;">Περιγραφή Έργου:</h3>
                    <p style="white-space: pre-wrap;">${projectInfo}</p>
                </div>
                ` : ''}

                ${offerSection}
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                <p style="font-size: 12px; color: #999; text-align: center;">
                    Αυτό το μήνυμα στάλθηκε αυτόματα από το σύστημα της <strong>SGK Digital</strong>.
                </p>
            </div>
          `,
            });
        }

        return new Response(JSON.stringify(emailResult), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 500,
            }
        );
    }
});
