import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { email, phone, offerPrice } = await req.json();

        console.log(`Sending email for: ${email}, Phone: ${phone}, Offer: ${offerPrice || 'N/A'}`);

        const offerSection = offerPrice
            ? `<div style="background:#FFF8E1;padding:16px;border-radius:8px;border-left:4px solid #C5A267;margin:16px 0;">
                <p style="margin:0;font-weight:bold;color:#C5A267;">⚡ Προσφορά Eshop Demo</p>
                <p style="margin:4px 0 0;font-size:18px;font-weight:bold;">Τιμή προσφοράς: €${offerPrice}</p>
               </div>`
            : '';

        const data = await resend.emails.send({
            from: "SGK Digital <sgk@sigmalabs.gr>",
            to: ["spiros@sigmalabs.gr"],
            subject: offerPrice
                ? `🟡 Νέο αίτημα Eshop (Προσφορά €${offerPrice}) - SGK Digital`
                : "Νέο αίτημα συνεργασίας - SGK Digital",
            html: `
        <h2>Νέο αίτημα επικοινωνίας από το website</h2>
        <p>Ένας ενδιαφερόμενος άφησε τα στοιχεία του για επικοινωνία.</p>
        <hr />
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Τηλέφωνο:</strong> ${phone}</p>
        ${offerSection}
        <hr />
        <p>Αυτό το μήνυμα στάλθηκε αυτόματα από το σύστημα της SGK Digital.</p>
      `,
        });

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 500,
            }
        );
    }
});
