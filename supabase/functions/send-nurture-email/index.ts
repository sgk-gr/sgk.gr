import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") || "");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

// ─── Επαγγελματικό HTML Template ─────────────────────────────────────────────
function buildProfessionalEmailHtml(opts: {
  businessName?: string;
  subject?: string;
  bodyHtml: string;
  buttonText?: string;
  buttonLink?: string;
  unsubscribeToken: string;
  industry?: string;
}): string {
  const { bodyHtml, buttonText, buttonLink, unsubscribeToken } = opts;
  const unsubLink = `https://sgk.gr/unsubscribe?token=${unsubscribeToken}`;
  
  const ctaButton = buttonText && buttonLink ? `
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 8px;">
    <tr>
      <td align="center">
        <a href="${buttonLink}" target="_blank" style="display:inline-block;background:#FF6B00;color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;mso-padding-alt:0;">
          ${buttonText}
        </a>
      </td>
    </tr>
  </table>` : "";

  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>SGK Digital</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:Arial,Helvetica,sans-serif;">

<!-- Wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f0f2f5">
  <tr>
    <td align="center" style="padding:24px 16px;">

      <!-- Email Card -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width:600px;border-radius:2px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);">

        <!-- LOGO BAR -->
        <tr>
          <td bgcolor="#ffffff" style="padding:16px 28px;border-bottom:1px solid #f0f0f0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <span style="font-family:Arial,sans-serif;font-size:20px;font-weight:900;color:#1a1a2e;">SGK <span style="color:#FF6B00;">Digital</span></span>
                </td>
                <td align="right">
                  <a href="https://sgk.gr/web-development" style="color:#555;text-decoration:none;font-size:12px;font-weight:600;margin-left:14px;">Υπηρεσίες</a>
                  <a href="https://sgk.gr" style="color:#555;text-decoration:none;font-size:12px;font-weight:600;margin-left:14px;">Portfolio</a>
                  <a href="tel:6999524389" style="color:#FF6B00;text-decoration:none;font-size:12px;font-weight:600;margin-left:14px;">📞 6999 524389</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td bgcolor="#1a1a2e" style="padding:40px 40px 55px;text-align:center;background:linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%);">
            <span style="font-family:Arial,sans-serif;font-size:26px;font-weight:900;color:#ffffff;line-height:1.3;">Γεια σας από την <span style="color:#FF8C3A;">SGK Digital!</span></span>
            <br>
            <span style="font-size:14px;color:rgba(255,255,255,0.65);display:block;margin-top:10px;">Ψηφιακές λύσεις για επιχειρήσεις στην Ελλάδα</span>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td bgcolor="#ffffff" style="padding:36px 40px 28px;">
            ${bodyHtml}
            ${ctaButton}
          </td>
        </tr>

        <!-- WHATSAPP + PHONE CTA -->
        <tr>
          <td bgcolor="#fff8f4" style="padding:24px 40px;border-top:1px solid #ffe0cc;border-bottom:1px solid #ffe0cc;text-align:center;">
            <p style="font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#1a1a2e;margin:0 0 14px 0;">Θέλετε να μάθετε περισσότερα ή να κάνουμε μια φιλική κουβέντα;</p>
            <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
              <tr>
                <td style="padding-right:10px;">
                  <a href="https://wa.me/306999524389" style="display:inline-block;background:#25D366;color:#fff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;padding:12px 22px;border-radius:8px;text-decoration:none;">💬 WhatsApp</a>
                </td>
                <td>
                  <a href="tel:6999524389" style="display:inline-block;background:#ffffff;color:#FF6B00;font-family:Arial,sans-serif;font-size:14px;font-weight:700;padding:11px 22px;border-radius:8px;text-decoration:none;border:2px solid #FF6B00;">📞 6999 524 389</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td bgcolor="#f5f6f8" style="padding:24px 40px;text-align:center;">
            <p style="font-family:Arial,sans-serif;font-size:12px;color:#888;margin:0 0 10px 0;">
              <a href="https://sgk.gr" style="color:#555;text-decoration:none;margin:0 8px;">Σχετικά</a>
              <a href="https://sgk.gr/portfolio" style="color:#555;text-decoration:none;margin:0 8px;">Portfolio</a>
              <a href="https://sgk.gr/privacy-policy" style="color:#555;text-decoration:none;margin:0 8px;">Πολιτική Απορρήτου</a>
              <a href="${unsubLink}" style="color:#aaa;text-decoration:none;margin:0 8px;">Κατάργηση εγγραφής</a>
            </p>
            <p style="font-family:Arial,sans-serif;font-size:11px;color:#aaa;margin:0;line-height:1.7;">
              <strong style="color:#999;">SGK Software Development</strong><br>
              ΑΦΜ: 167520448<br>
              Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής<br>
              <a href="mailto:info@sgk.gr" style="color:#FF6B00;text-decoration:none;">info@sgk.gr</a> | <a href="tel:6999524389" style="color:#FF6B00;text-decoration:none;">6999 524 389</a><br>
              © ${new Date().getFullYear()} SGK Digital. Όλα τα δικαιώματα διατηρούνται.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
// ─────────────────────────────────────────────────────────────────────────────

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const payload = await req.json();
        const { email, step, unsubscribe_token } = payload;

        if (!email || !step) {
            throw new Error("Missing email or step");
        }

        const geminiKey = Deno.env.get("GEMINI_API_KEY");
        if (!geminiKey) {
            throw new Error("GEMINI_API_KEY is missing in Supabase Edge Function secrets");
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // Fetch lead data
        const { data: leadData, error: leadError } = await supabase
            .from("sgk_mails")
            .select("*")
            .eq("email", email)
            .maybeSingle();

        if (leadError || !leadData) {
            throw new Error("Lead not found in sgk_mails");
        }

        const businessName = leadData.first_name || "Επιχείρηση";
        const industry = leadData.company || "generic";
        const serviceType = leadData.type || "website_offer";
        const unsubToken = unsubscribe_token || leadData.unsubscribe_token || "missing";

        const serviceMap: Record<string, string> = {
            website_offer: "Ιστοσελίδα",
            eshop_offer: "Ηλεκτρονικό Κατάστημα (Eshop)",
            ai_agents_offer: "Σύστημα AI (Τεχνητής Νοημοσύνης)",
            mobile_app_offer: "Εφαρμογή για Κινητά (Mobile App)",
            erp_crm_offer: "Σύστημα ERP/CRM",
        };
        const mappedService = serviceMap[serviceType] || "Ιστοσελίδα";

        const industryMap: Record<string, string> = {
            generic: "Επιχείρηση",
            dentist: "Οδοντιατρείο",
            food_service: "Εστίαση (Ταβέρνα, Εστιατόριο, Καφετέρια)",
            hotel: "Ξενοδοχείο/Κατάλυμα",
            rent_a_car: "Rent a Car",
            hair_salon: "Κομμωτήριο",
            pharmacy: "Φαρμακείο",
            accountant: "Λογιστικό Γραφείο",
            lawyer: "Δικηγορικό Γραφείο",
            retail: "Κατάστημα Λιανικής",
        };
        const mappedIndustry = industryMap[industry] || industry;

        let promptGoal = "";
        if (step === 2) {
            promptGoal = "Στόχος: Να χτυπήσεις στα 'pain points' του πελάτη (τι χάνει επειδή δεν έχει αυτή την υπηρεσία) και να προσφέρεις αξία. Πρότεινε μια σύντομη 5λεπτη κλήση γνωριμίας. Τόνος: Φιλικός, όχι επιθετικός.";
        } else if (step === 3) {
            promptGoal = "Στόχος: Να δημιουργήσεις αίσθηση επείγοντος (π.χ. τι κάνουν οι ανταγωνιστές, αλλαγές στον αλγόριθμο της Google). Κάνε το κείμενο πιο μικρό και πειστικό.";
        } else if (step >= 4) {
            promptGoal = "Στόχος: Breakup email. Είναι το τελευταίο email. Πρόσφερε μια ειδική έκπτωση (π.χ. 10% δώρο) αν δράσουν τώρα, και πες αντίο αν δεν ενδιαφέρονται.";
        }

        const prompt = `Είσαι ένας κορυφαίος Copywriter Πωλήσεων για την SGK Digital, μια εταιρεία κατασκευής ιστοσελίδων και λογισμικού στην Ελλάδα.
Θέλω να γράψεις το Email Follow-up Νο. ${step} για έναν υποψήφιο πελάτη.

ΣΤΟΙΧΕΙΑ ΠΕΛΑΤΗ:
- Όνομα/Επιχείρηση: ${businessName}
- Κλάδος: ${mappedIndustry}
- Υπηρεσία που προσφέρουμε: ${mappedService}

${promptGoal}

ΑΠΑΙΤΗΣΕΙΣ ΜΟΡΦΟΠΟΙΗΣΗΣ:
- Επίστρεψε ΜΟΝΟ ΕΝΑ ΕΓΚΥΡΟ JSON ΑΝΤΙΚΕΙΜΕΝΟ με τα εξής πεδία: "subject" (το θέμα του email) και "bodyHtml" (το κείμενο του email).
- Το "bodyHtml" πρέπει να περιέχει ΜΟΝΟ τα εσωτερικά HTML tags (π.χ. <p>, <ul>, <strong>). ΜΗΝ βάλεις <html>, <body>, <html> wrappers γιατί θα μπει σε δικό μας template.
- Γράψε το κείμενο άμεσα, με ανθρώπινο τόνο, χωρίς περιττούς τεχνικούς όρους.
- ΜΗΝ βάλεις την προσφώνηση "Αγαπητέ..." στην αρχή, διότι το email μας ξεκινάει ήδη με "Γεια σας από την SGK Digital!". Ξεκίνα κατευθείαν το κείμενο (π.χ. "Θα ήθελα να επανέλθω σχετικά με...").
- ΜΗΝ βάλεις υπογραφή στο τέλος, μπαίνει αυτόματα στο template μας.

JSON Παράδειγμα:
{
  "subject": "Το θέμα εδώ",
  "bodyHtml": "<p>Κείμενο παράγραφος 1.</p><ul><li>Σημείο 1</li></ul><p>Κείμενο παράγραφος 2.</p>"
}
`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        let aiEmail;
        try {
            aiEmail = JSON.parse(jsonString);
        } catch (e) {
            console.error("AI JSON Error:", jsonString);
            throw new Error("Failed to parse AI response as JSON");
        }

        if (!aiEmail.subject || !aiEmail.bodyHtml) {
            throw new Error("AI response missing subject or bodyHtml");
        }

        const finalHtml = buildProfessionalEmailHtml({
            businessName: businessName,
            subject: aiEmail.subject,
            bodyHtml: aiEmail.bodyHtml,
            unsubscribeToken: unsubToken,
            industry: industry
        });

        const resendResult = await resend.emails.send({
            from: "SGK Digital <noreply@sgk.gr>",
            to: email,
            subject: aiEmail.subject,
            html: finalHtml,
            reply_to: "info@sgk.gr"
        });

        if (resendResult.error) {
            throw new Error(resendResult.error.message);
        }

        await supabase
            .from("sgk_mails")
            .update({
                email_sequence_step: step,
                last_email_sent_at: new Date().toISOString()
            })
            .eq("email", email);

        return new Response(JSON.stringify({ success: true, message: "Email sent" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });

    } catch (error: any) {
        console.error("Error in send-nurture-email:", error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
