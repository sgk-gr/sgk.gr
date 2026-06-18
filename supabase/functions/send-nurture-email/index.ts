import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.24.1";

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
  <div style="text-align: center; margin: 30px 0 10px;">
      <a href="${buttonLink}" target="_blank" style="display:inline-block;background:#4ade80;color:#111;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:700;padding:14px 32px;border-radius:20px;text-decoration:none;">
        ${buttonText}
      </a>
  </div>` : "";

  return `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>sgk.</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;">
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Top Link -->
    <div style="text-align: right; padding: 10px 20px;">
        <a href="https://sgk.gr" style="color: #3b5bdb; text-decoration: none; font-size: 10px;">sgk.gr</a>
    </div>

    <!-- Logo -->
    <div style="text-align: center; padding: 20px 0;">
        <h1 style="margin: 0; font-size: 42px; font-weight: 800; letter-spacing: -2px; color: #000;">sgk<span style="color:#3b5bdb;">.</span></h1>
    </div>

    <!-- Color Strip -->
    <div style="display: flex; height: 12px; width: 100%;">
        <div style="width: 15%; background-color: #3b5bdb;"></div>
        <div style="width: 5%; background-color: #4ade80;"></div>
        <div style="width: 80%; background-color: #ffffff;"></div>
    </div>

    <!-- Content Area -->
    <div style="padding: 40px 30px; color: #333333; font-size: 16px; line-height: 1.6;">
        ${bodyHtml}
        ${ctaButton}
    </div>

    <!-- Blue Footer -->
    <div style="position: relative;">
        <!-- Top strips -->
        <div style="display: flex; height: 12px; width: 100%;">
            <div style="width: 75%; background-color: #d1d5db;"></div>
            <div style="width: 25%; background-color: #facc15;"></div>
        </div>
        
        <div style="background-color: #3b5bdb; color: #ffffff; padding: 40px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 38px; font-weight: 800; letter-spacing: -2px; color: #ffffff;">sgk<span style="color:#4ade80;">.</span></h1>
            
            <div style="margin: 20px 0;">
                <a href="https://www.facebook.com/profile.php?id=61552383862787" target="_blank" style="color: #ffffff; text-decoration: none; margin: 0 8px; font-weight: bold; border: 1px solid white; border-radius: 50%; padding: 5px 10px;">f</a>
                <a href="https://www.tiktok.com/@sgk.gr?is_from_webapp=1&sender_device=pc" target="_blank" style="color: #ffffff; text-decoration: none; margin: 0 8px; font-weight: bold; border: 1px solid white; border-radius: 50%; padding: 5px 10px;">t</a>
            </div>
            
            <div style="font-size: 11px; margin: 20px 0; color: #ffffff; line-height: 1.5;">
                <strong>SGK Software Development</strong><br/>
                ΑΦΜ: 131398972 | ΔΟΥ: ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ<br/>
                Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής<br/>
                📞 6999 524 389 | ✉️ <a href="mailto:info@sgk.gr" target="_blank" style="color: #ffffff; text-decoration: none;">info@sgk.gr</a>
            </div>

            <p style="font-size: 11px; margin: 20px 0 0 0; color: #ffffff;">
                <a href="https://sgk.gr/terms" target="_blank" style="color: #ffffff; text-decoration: underline; font-weight: bold;">Όροι Χρήσης</a> | 
                <a href="https://sgk.gr/privacy" target="_blank" style="color: #ffffff; text-decoration: underline; font-weight: bold;">Πολιτική Απορρήτου</a>
            </p>
            <p style="font-size: 11px; margin: 5px 0 0 0; color: #ffffff;">
                Copyright ${new Date().getFullYear()}. All rights reserved.
            </p>
        </div>
    </div>

    <!-- Unsubscribe -->
    <div style="background-color: #f4f4f5; padding: 20px; text-align: left; font-size: 11px; color: #666666;">
        If you have reason to believe that you are not the intended recipient or you wish to unsubscribe from this mailing list please visit the following link 
        <br/><a href="${unsubLink}" target="_blank" style="color: #3b5bdb; text-decoration: underline;">${unsubLink}</a>
    </div>
</div>
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
        const { email, step, unsubscribe_token, customSubject, customHtml, business_name } = payload;

        if (!email || !step) {
            throw new Error("Missing email or step");
        }

        // Bypassing AI generation for Manual Step 1 (sent from ScraperTab)
        if (step === 1 && customSubject && customHtml) {
            const resendResult = await resend.emails.send({
                from: "SGK Digital <noreply@sgk.gr>",
                to: email,
                subject: customSubject,
                html: customHtml,
                reply_to: "info@sgk.gr"
            });

            if (resendResult.error) {
                throw new Error(resendResult.error.message);
            }

            return new Response(JSON.stringify({ success: true, message: "Manual email sent" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
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

        const isOutreach = leadData.type === "outreach";
        let businessName = isOutreach 
            ? (leadData.first_name || "") 
            : (leadData.company || "");
            
        if (!businessName || businessName === "Barbershop Promo" || businessName.toLowerCase() === "generic" || businessName === "Επιχείρηση") {
            businessName = "Δεν δόθηκε (μίλα γενικά, π.χ. γράψε 'για το κομμωτήριό σας' αντί για συγκεκριμένο όνομα)";
        }

        const contactName = isOutreach ? "Δεν δόθηκε" : (leadData.first_name || "Δεν δόθηκε");

        const industry = isOutreach
            ? (leadData.company || "generic")
            : (leadData.type === "promo_barbershop" ? "hair_salon" : (leadData.type === "eshop_offer" ? "retail" : "generic"));

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
- Όνομα Υπευθύνου: ${contactName}
- Επωνυμία Επιχείρησης: ${businessName}
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

        let result;
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            result = await model.generateContent(prompt);
        } catch (err: any) {
            console.error("gemini-2.5-flash failed:", err.message);
            try {
                const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                result = await fallbackModel.generateContent(prompt);
            } catch (err2: any) {
                console.error("gemini-2.0-flash failed:", err2.message);
                throw new Error(err2.message);
            }
        }
        
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
