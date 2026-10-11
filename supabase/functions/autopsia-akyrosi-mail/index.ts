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
        const { customer, reason, userEmail } = await req.json();

        const toEmails: string[] = ["info@sgk.gr"];
        if (userEmail && typeof userEmail === "string" && userEmail.includes("@") && !toEmails.includes(userEmail.trim())) {
            toEmails.push(userEmail.trim());
        }

        const srPart = customer?.sr ? `${customer.sr}` : "Χωρίς SR";
        const subject = `ΑΚΥΡΩΣΗ ΑΥΤΟΨΙΑΣ: ${srPart}`;

        const customerName = `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() || "-";
        const address = customer?.address || "-";
        const contractor = customer?.contractor || "-";
        const phone = customer?.phone || customer?.manager_phone || "-";
        const cancellationReason = reason || "Δεν καταχωρήθηκε αιτιολογία.";

        const html = `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>sgk.</title>
  <style>
    p { margin: 0 0 10px 0 !important; line-height: 1.5 !important; }
    h2, h3 { margin: 0 0 12px 0 !important; line-height: 1.3 !important; }
    ul, ol { margin: 0 0 12px 0 !important; padding-left: 20px !important; }
    li { margin-bottom: 5px !important; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;">
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Top Link -->
    <div style="text-align: right; padding: 8px 20px;">
        <a href="https://www.sgk.gr" style="color: #3b5bdb; text-decoration: none; font-size: 10px;">sgk.gr</a>
    </div>

    <!-- Logo -->
    <div style="text-align: center; padding: 12px 0;">
        <h1 style="margin: 0; font-size: 36px; font-weight: 800; letter-spacing: -2px; color: #000;">sgk<span style="color:#3b5bdb;">.</span></h1>
    </div>

    <!-- Color Strip -->
    <div style="display: flex; height: 12px; width: 100%;">
        <div style="width: 15%; background-color: #ef4444;"></div>
        <div style="width: 5%; background-color: #f59e0b;"></div>
        <div style="width: 80%; background-color: #ffffff;"></div>
    </div>

    <!-- Content Area -->
    <div style="padding: 24px 20px; color: #333333; font-size: 15px; line-height: 1.5;">
        <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <h2 style="color: #991b1b; font-size: 18px; margin: 0 0 4px 0; font-weight: 800;">
                Ειδοποίηση Ακύρωσης Αυτοψίας
            </h2>
            <p style="color: #b91c1c; font-size: 13px; margin: 0; font-weight: 600;">
                Η παρακάτω αυτοψία ακυρώθηκε από την πλατφόρμα και αφαιρέθηκε από τις εκκρεμείς.
            </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 35%;">SR:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 800;">${srPart}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Διεύθυνση:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 700;">${address}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Όνομα:</td>
                <td style="padding: 8px 0; color: #111827;">${customerName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Τηλέφωνο:</td>
                <td style="padding: 8px 0; color: #111827;">${phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Εργολάβος / Ανάδοχος:</td>
                <td style="padding: 8px 0; color: #111827;">${contractor}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Χειριστής / Τεχνικός:</td>
                <td style="padding: 8px 0; color: #111827;">${userEmail || "-"}</td>
            </tr>
        </table>

        <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="color: #92400e; font-size: 12px; font-weight: 800; text-transform: uppercase; margin: 0 0 6px 0; letter-spacing: 0.5px;">
                Λόγος Ακύρωσης:
            </p>
            <p style="color: #78350f; font-size: 15px; font-weight: 600; margin: 0; white-space: pre-wrap;">
                ${cancellationReason}
            </p>
        </div>
    </div>

    <!-- Blue Footer -->
    <div style="position: relative;">
        <!-- Top strips -->
        <div style="display: flex; height: 12px; width: 100%;">
            <div style="width: 75%; background-color: #d1d5db;"></div>
            <div style="width: 25%; background-color: #facc15;"></div>
        </div>
        
        <div style="background-color: #3b5bdb; color: #ffffff; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -2px; color: #ffffff;">sgk<span style="color:#4ade80;">.</span></h1>
            
            <div style="margin: 15px 0;">
                <a href="https://www.facebook.com/profile.php?id=61552383862787" target="_blank" style="color: #ffffff; text-decoration: none; margin: 0 8px; font-weight: bold; border: 1px solid white; border-radius: 50%; padding: 4px 9px; font-size: 12px;">f</a>
                <a href="https://www.tiktok.com/@sgk.gr?is_from_webapp=1&sender_device=pc" target="_blank" style="color: #ffffff; text-decoration: none; margin: 0 8px; font-weight: bold; border: 1px solid white; border-radius: 50%; padding: 4px 9px; font-size: 12px;">t</a>
            </div>
            
            <div style="font-size: 11px; margin: 15px 0; color: #ffffff; line-height: 1.5;">
                <strong>SGK Digital</strong><br/>
                ΑΦΜ: 131398972 | ΔΟΥ: ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ<br/>
                Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής<br/>
                ☎️ 211 114 0013 | 📱 6999 524 389 | ✉️ <a href="mailto:info@sgk.gr" target="_blank" style="color: #ffffff; text-decoration: none;">info@sgk.gr</a>
            </div>

            <p style="font-size: 11px; margin: 15px 0 0 0; color: #ffffff;">
                <a href="https://www.sgk.gr/terms" target="_blank" style="color: #ffffff; text-decoration: underline; font-weight: bold;">Όροι Χρήσης</a> | 
                <a href="https://www.sgk.gr/privacy" target="_blank" style="color: #ffffff; text-decoration: underline; font-weight: bold;">Πολιτική Απορρήτου</a>
            </p>
            <p style="font-size: 11px; margin: 5px 0 0 0; color: #ffffff;">
                Copyright ${new Date().getFullYear()}. All rights reserved.
            </p>
        </div>
    </div>

    <!-- Unsubscribe -->
    <div style="background-color: #f4f4f5; padding: 15px 20px; text-align: left; font-size: 11px; color: #666666;">
        If you have reason to believe that you are not the intended recipient or you wish to unsubscribe from this mailing list please visit 
        <a href="https://www.sgk.gr/unsubscribe" target="_blank" style="color: #3b5bdb; text-decoration: underline;">https://www.sgk.gr/unsubscribe</a>
    </div>
</div>
</body>
</html>`;

        const data = await resend.emails.send({
            from: "SGK Digital <info@sgk.gr>",
            to: toEmails,
            subject: subject,
            html: html,
        });

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});
