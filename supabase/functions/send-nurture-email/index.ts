import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

function getOfferButton(firstSubject: string = "", firstBody: string = "", leadType: string = "") {
    const text = (firstSubject + " " + firstBody + " " + leadType).toLowerCase();
    const cleanText = text.replace(/\./g, ""); // Remove dots to match abbreviations like Ι.Κ.Ε. -> ικε
    
    if (cleanText.includes("ικε") || cleanText.includes("ike")) {
        return {
            buttonText: "Έναρξη Κατασκευής ΙΚΕ",
            buttonLink: "https://sgk.gr/ike-offer"
        };
    }
    if (cleanText.includes("eshop") || cleanText.includes("pay as you grow") || cleanText.includes("payg") || cleanText.includes("e-shop")) {
        return {
            buttonText: "Δείτε την Προσφορά Eshop",
            buttonLink: "https://sgk.gr/pay-as-you-grow"
        };
    }
    return {
        buttonText: "Δείτε την Προσφορά",
        buttonLink: "https://sgk.gr/estimate"
    };
}

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
  <div style="text-align: center; margin: 20px 0 10px;">
      <a href="${buttonLink}" target="_blank" style="display:inline-block;background:#4ade80;color:#111;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:700;padding:12px 28px;border-radius:20px;text-decoration:none;">
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
        <a href="https://sgk.gr" style="color: #3b5bdb; text-decoration: none; font-size: 10px;">sgk.gr</a>
    </div>

    <!-- Logo -->
    <div style="text-align: center; padding: 12px 0;">
        <h1 style="margin: 0; font-size: 36px; font-weight: 800; letter-spacing: -2px; color: #000;">sgk<span style="color:#3b5bdb;">.</span></h1>
    </div>

    <!-- Color Strip -->
    <div style="display: flex; height: 12px; width: 100%;">
        <div style="width: 15%; background-color: #3b5bdb;"></div>
        <div style="width: 5%; background-color: #4ade80;"></div>
        <div style="width: 80%; background-color: #ffffff;"></div>
    </div>

    <!-- Content Area -->
    <div style="padding: 24px 20px; color: #333333; font-size: 15px; line-height: 1.5;">
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
        
        <div style="background-color: #3b5bdb; color: #ffffff; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -2px; color: #ffffff;">sgk<span style="color:#4ade80;">.</span></h1>
            
            <div style="margin: 15px 0;">
                <a href="https://www.facebook.com/profile.php?id=61552383862787" target="_blank" style="color: #ffffff; text-decoration: none; margin: 0 8px; font-weight: bold; border: 1px solid white; border-radius: 50%; padding: 4px 9px; font-size: 12px;">f</a>
                <a href="https://www.tiktok.com/@sgk.gr?is_from_webapp=1&sender_device=pc" target="_blank" style="color: #ffffff; text-decoration: none; margin: 0 8px; font-weight: bold; border: 1px solid white; border-radius: 50%; padding: 4px 9px; font-size: 12px;">t</a>
            </div>
            
            <div style="font-size: 11px; margin: 15px 0; color: #ffffff; line-height: 1.5; text-align: center;">
                <strong>SGK Software Development</strong><br/>
                ΑΦΜ: 131398972 | ΔΟΥ: ΚΕΦΟΔΕ ΑΤΤΙΚΗΣ<br/>
                Ερμού 1 & Λυκοβρύσεως 14, 14452 Μεταμόρφωση, Αττικής<br/>
                📞 6999 524 389 | ✉️ <a href="mailto:info@sgk.gr" target="_blank" style="color: #ffffff; text-decoration: none;">info@sgk.gr</a>
            </div>

            <p style="font-size: 11px; margin: 15px 0 0 0; color: #ffffff; text-align: center;">
                <a href="https://sgk.gr/terms" target="_blank" style="color: #ffffff; text-decoration: underline; font-weight: bold;">Όροι Χρήσης</a> | 
                <a href="https://sgk.gr/privacy" target="_blank" style="color: #ffffff; text-decoration: underline; font-weight: bold;">Πολιτική Απορρήτου</a>
            </p>
            <p style="font-size: 11px; margin: 5px 0 0 0; color: #ffffff; text-align: center;">
                Copyright 2026. All rights reserved.
            </p>
        </div>
    </div>

    <!-- Unsubscribe -->
    <div style="background-color: #f4f4f5; padding: 15px 20px; text-align: left; font-size: 11px; color: #666666;">
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
        return new Response("ok", { headers: corsHeaders, status: 200 });
    }

    try {
        const payload = await req.json();
        const { processAllDue, email, step, unsubscribe_token, customSubject, customHtml, business_name, firstEmailSubject, firstEmailBody } = payload;

        const openAiKey = Deno.env.get("OPENAI_API_KEY") || Deno.env.get("GEMINI_API_KEY");
        if (!openAiKey) {
            throw new Error("OPENAI_API_KEY is missing in Supabase Edge Function secrets");
        }

        const resendKey = Deno.env.get("RESEND_API_KEY") || "";
        const resend = new Resend(resendKey);

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // BATCH AUTO-PROCESSING MODE
        if (processAllDue) {
            const batchLimit = payload.batchLimit || 5;
            const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
            
            const { data: dueLeads, error: dueError } = await supabase
                .from("sgk_mails")
                .select("*")
                .eq("marketing_consent", true)
                .eq("unsubscribed", false)
                .eq("converted", false)
                .gte("email_sequence_step", 1)
                .lt("email_sequence_step", 5)
                .lte("last_email_sent_at", threeDaysAgo)
                .limit(batchLimit);

            if (dueError) {
                throw dueError;
            }

            const results = [];

            for (const leadData of (dueLeads || [])) {
                const nextStep = (leadData.email_sequence_step || 1) + 1;
                const leadEmail = leadData.email;
                const unsubToken = leadData.unsubscribe_token || crypto.randomUUID();

                const isOutreach = leadData.type === "outreach";
                let businessName = isOutreach 
                    ? (leadData.first_name || "") 
                    : (leadData.company || "");
                    
                if (!businessName || businessName === "Barbershop Promo" || businessName.toLowerCase() === "generic" || businessName === "Επιχείρηση") {
                    businessName = "Δεν δόθηκε";
                }

                const contactName = isOutreach ? "Δεν δόθηκε" : (leadData.first_name || "Δεν δόθηκε");

                const industry = isOutreach
                    ? (leadData.company || "generic")
                    : (leadData.type === "promo_barbershop" ? "hair_salon" : (leadData.type === "eshop_offer" ? "retail" : "generic"));

                const serviceType = leadData.type || "website_offer";

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
                    food_service: "Εστίαση",
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
                if (nextStep === 2) {
                    promptGoal = "Στόχος: Να χτυπήσεις στα 'pain points' του πελάτη και να προσφέρεις αξία. ΑΠΑΓΟΡΕΥΕΤΑΙ αυστηρά η αναφορά σε τηλεφωνική κλήση, 5λεπτη συνομιλία ή ραντεβού. Παρότρυνε τον πελάτη να πατήσει το κουμπί της προσφοράς!";
                } else if (nextStep === 3) {
                    promptGoal = "Στόχος: Να δημιουργήσεις αίσθηση επείγοντος. ΑΠΑΓΟΡΕΥΕΤΑΙ η αναφορά σε τηλεφωνήματα. Παρότρυνε τον να πατήσει το κουμπί της προσφοράς.";
                } else if (nextStep === 4) {
                    promptGoal = "Στόχος: Να προσφέρεις μια δωρεάν μελέτη/ανάλυση ή δείγμα δουλειάς. ΑΠΑΓΟΡΕΥΕΤΑΙ η αναφορά σε τηλεφωνήματα. Παρότρυνε τον να πατήσει το κουμπί της προσφοράς.";
                } else if (nextStep >= 5) {
                    promptGoal = "Στόχος: Breakup email. Πρόσφερε μια ειδική έκπτωση 10%. ΑΠΑΓΟΡΕΥΕΤΑΙ η αναφορά σε τηλεφωνήματα. Παρότρυνε τον να πατήσει το κουμπί της προσφοράς.";
                }

                const firstSubject = leadData.first_email_subject || "";
                const firstBody = leadData.first_email_body || "";
                const defaultBtn = getOfferButton(firstSubject, firstBody, leadData.type);

                const prompt = `Είσαι ένας κορυφαίος Copywriter Πωλήσεων για την SGK Digital.
Θέλω να γράψεις το Email Follow-up Νο. ${nextStep - 1} (συνολικό email ακολουθίας Νο. ${nextStep}) για έναν υποψήφιο πελάτη.

ΤΟ ΠΡΩΤΟ EMAIL ΠΟΥ ΣΤΑΛΘΗΚΕ ΣΤΟΝ ΠΕΛΑΤΗ (Email 1):
- Θέμα: ${firstSubject || "Δεν έχει καταγραφεί"}
- Περιεχόμενο (HTML): ${firstBody || "Δεν έχει καταγραφεί"}

ΣТОΙΧΕΙΑ ΠΕΛΑΤΗ:
- Όνομα Υπευθύνου: ${contactName}
- Επωνυμία Επιχείρησης: ${businessName}
- Κλάδος: ${mappedIndustry}
- Υπηρεσία που προσφέρουμε: ${mappedService}

ΟΔΗΓΙΕΣ ΓΙΑ ΤΟ ΣΥΓΚΕΚΡΙΜΕΝΟ EMAIL (Email ${nextStep}):
- ${promptGoal}
- ΑΠΑΓΟΡΕΥΕΤΑΙ ΑΥΣΤΗΡΑ να αναφέρεις κλήσεις, τηλέφωνα, ραντεβού ή 5λεπτες συνομιλίες!
- Το email πρέπει να παροτρύνει τον πελάτη να πατήσει το κουμπί ("${defaultBtn.buttonText}") για να δει την προσφορά online.
- Το email πρέπει να είναι ΣΥΝΕΧΕΙΑ και FOLLOW-UP του πρώτου email.
- ΑΝ ΠΡΟΚΕΙΤΑΙ ΓΙΑ Ι.Κ.Ε. / ΓΕΜΗ:
  * Η νομική βάση είναι αυστηρά το "Άρθρο 47 §2 του Ν.4072/2012, όπως εξειδικεύτηκε με την ΚΥΑ 46982/2025" (ΑΠΑΓΟΡΕΥΕΤΑΙ η αναφορά σε "Άρθρο 50").
  * Η νόμιμη προθεσμία απόκτησης ιστοσελίδας είναι αυστηρά "εντός ενός (1) μηνός" (ΑΠΑΓΟΡΕΥΕΤΑΙ η αναφορά σε "30 ημέρες").
  * Η διάταξη που όρισε τα πρόστιμα είναι η "ΚΥΑ 46982/2025".
  * Η ιστοσελίδα διαθέτει Live Αυτόματη Σύνδεση με το ΓΕΜΗ (αντλεί δεδομένα αυτόματα — αν ο λογιστής ανεβάσει έγγραφο ή τροποποίηση στο ΓΕΜΗ, η ιστοσελίδα ενημερώνεται αυτόματα).
  * Το πακέτο 124€ περιλαμβάνει: Σχεδιασμό Λογότυπου, Εταιρικό Email, Domain (.gr), Hosting (1 έτος), Ασφάλεια SSL και Πλήρη Συμμόρφωση GDPR.

ΑΠΑΙΤΗΣΕΙΣ ΜΟΡΦΟΠΟΙΗΣΗΣ:
- Επίστρεψε ΜΟΝΟ ΕΝΑ ΕΓΚΥΡΟ JSON ΑΝΤΙΚΕΙΜΕΝΟ με τα εξής πεδία: "subject", "bodyHtml", "buttonText" και "buttonLink".
- Το "bodyHtml" πρέπει να περιέχει ΜΟΝΟ τα εσωτερικά HTML tags (π.χ. <p>, <ul>, <strong>).
- ΜΗΝ βάλεις προσφώνηση "Αγαπητέ..." ή υπογραφή στο τέλος.`;

                try {
                    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${openAiKey}`
                        },
                        body: JSON.stringify({
                            model: "gpt-4o-mini",
                            messages: [
                                { role: "system", content: "You output only JSON." },
                                { role: "user", content: prompt }
                            ],
                            response_format: { type: "json_object" },
                            temperature: 0.7
                        })
                    });

                    if (!openAiResponse.ok) continue;

                    const openAiJson = await openAiResponse.json();
                    const responseText = openAiJson.choices?.[0]?.message?.content || "";
                    const aiEmail = JSON.parse(responseText);

                    if (!aiEmail.subject || !aiEmail.bodyHtml) continue;

                    const finalHtml = buildProfessionalEmailHtml({
                        businessName: businessName,
                        subject: aiEmail.subject,
                        bodyHtml: aiEmail.bodyHtml,
                        buttonText: aiEmail.buttonText || defaultBtn.buttonText,
                        buttonLink: defaultBtn.buttonLink, // Force correct calculated brand link (no AI hallucinations)
                        unsubscribeToken: unsubToken,
                        industry: industry
                    });

                    const resendResult = await resend.emails.send({
                        from: "SGK Digital <info@sgk.gr>",
                        to: leadEmail,
                        subject: aiEmail.subject,
                        html: finalHtml,
                        reply_to: "info@sgk.gr"
                    });

                    if (!resendResult.error) {
                        await supabase
                            .from("sgk_mails")
                            .update({
                                email_sequence_step: nextStep,
                                last_email_sent_at: new Date().toISOString()
                            })
                            .eq("id", leadData.id);

                        results.push({ email: leadEmail, step: nextStep, success: true });
                    }
                } catch (e: any) {
                    console.error(`Error auto-processing ${leadEmail}:`, e.message);
                }
            }

            return new Response(JSON.stringify({ success: true, processedCount: results.length, details: results }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

        if (!email || !step) {
            throw new Error("Missing email or step");
        }

        // Bypassing AI generation for Manual Step 1 (sent from ScraperTab)
        if (step === 1 && customSubject && customHtml) {
            const resendResult = await resend.emails.send({
                from: "SGK Digital <info@sgk.gr>",
                to: email,
                subject: customSubject,
                html: customHtml,
                reply_to: "info@sgk.gr"
            });

            if (resendResult.error) {
                throw new Error(resendResult.error.message);
            }

            // Update database for lead to start nurture sequence
            const { error: dbErr } = await supabase
                .from("sgk_mails")
                .update({
                    email_sequence_step: 1,
                    last_email_sent_at: new Date().toISOString(),
                    first_email_subject: firstEmailSubject || customSubject,
                    first_email_body: firstEmailBody || customHtml,
                    converted: false,
                    unsubscribed: false
                })
                .eq("email", email);

            if (dbErr) {
                console.error("Error updating lead for sequence starting:", dbErr.message);
            }

            return new Response(JSON.stringify({ success: true, message: "Manual email sent" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

        // Fetch lead data for single email processing
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
            businessName = "Δεν δόθηκε";
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
            food_service: "Εστίαση",
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
            promptGoal = "Στόχος: Να χτυπήσεις στα 'pain points' του πελάτη και να προσφέρεις αξία. ΑΠΑΓΟΡΕΥΕΤΑΙ αυστηρά η αναφορά σε τηλεφωνική κλήση, 5λεπτη συνομιλία ή ραντεβού. Παρότρυνε τον πελάτη να πατήσει το κουμπί της προσφοράς!";
        } else if (step === 3) {
            promptGoal = "Στόχος: Να δημιουργήσεις αίσθηση επείγοντος. ΑΠΑΓΟΡΕΥΕΤΑΙ η αναφορά σε τηλεφωνήματα. Παρότρυνε τον να πατήσει το κουμπί της προσφοράς.";
        } else if (step === 4) {
            promptGoal = "Στόχος: Να προσφέρεις μια δωρεάν μελέτη/ανάλυση ή δείγμα δουλειάς. ΑΠΑΓΟΡΕΥΕΤΑΙ η αναφορά σε τηλεφωνήματα. Παρότρυνε τον να πατήσει το κουμπί της προσφοράς.";
        } else if (step >= 5) {
            promptGoal = "Στόχος: Breakup email. Πρόσφερε μια ειδική έκπτωση 10%. ΑΠΑΓΟΡΕΥΕΤΑΙ η αναφορά σε τηλεφωνήματα. Παρότρυνε τον να πατήσει το κουμπί της προσφοράς.";
        }

        const firstSubject = leadData.first_email_subject || "";
        const firstBody = leadData.first_email_body || "";
        const defaultBtn = getOfferButton(firstSubject, firstBody, leadData.type);

        const prompt = `Είσαι ένας κορυφαίος Copywriter Πωλήσεων για την SGK Digital.
Θέλω να γράψεις το Email Follow-up Νο. ${step - 1} (συνολικό email ακολουθίας Νο. ${step}) για έναν υποψήφιο πελάτη.

ΤΟ ΠΡΩΤΟ EMAIL ΠΟΥ ΣΤΑΛΘΗΚΕ ΣΤΟΝ ΠΕΛΑΤΗ (Email 1):
- Θέμα: ${firstSubject || "Δεν έχει καταγραφεί"}
- Περιεχόμενο (HTML): ${firstBody || "Δεν έχει καταγραφεί"}

ΣТОΙΧΕΙΑ ΠΕΛΑΤΗ:
- Όνομα Υπευθύνου: ${contactName}
- Επωνυμία Επιχείρησης: ${businessName}
- Κλάδος: ${mappedIndustry}
- Υπηρεσία που προσφέρουμε: ${mappedService}

ΟΔΗΓΙΕΣ ΓΙΑ ΤΟ ΣΥΓΚΕΚΡΙΜΕΝΟ EMAIL (Email ${step}):
- ${promptGoal}
- ΑΠΑΓΟΡΕΥΕΤΑΙ ΑΥΣΤΗΡΑ να αναφέρεις κλήσεις, τηλέφωνα, ραντεβού ή 5λεπτες συνομιλίες!
- Το email πρέπει να παροτρύνει τον πελάτη να πατήσει το κουμπί ("${defaultBtn.buttonText}") για να δει την προσφορά online.
- Το email πρέπει να είναι ΣΥΝΕΧΕΙΑ και FOLLOW-UP του πρώτου email.
- ΑΝ ΠΡΟΚΕΙΤΑΙ ΓΙΑ Ι.Κ.Ε. / ΓΕΜΗ:
  * Η νομική βάση είναι αυστηρά το "Άρθρο 47 §2 του Ν.4072/2012, όπως εξειδικεύτηκε με την ΚΥΑ 46982/2025" (ΑΠΑΓΟΡΕΥΕΤΑΙ η αναφορά σε "Άρθρο 50").
  * Η νόμιμη προθεσμία απόκτησης ιστοσελίδας είναι αυστηρά "εντός ενός (1) μηνός" (ΑΠΑΓΟΡΕΥΕΤΑΙ η αναφορά σε "30 ημέρες").
  * Η διάταξη που όρισε τα πρόστιμα είναι η "ΚΥΑ 46982/2025".
  * Η ιστοσελίδα διαθέτει Live Αυτόματη Σύνδεση με το ΓΕΜΗ (αντλεί δεδομένα αυτόματα — αν ο λογιστής ανεβάσει έγγραφο ή τροποποίηση στο ΓΕΜΗ, η ιστοσελίδα ενημερώνεται αυτόματα).
  * Το πακέτο 124€ περιλαμβάνει: Σχεδιασμό Λογότυπου, Εταιρικό Email, Domain (.gr), Hosting (1 έτος), Ασφάλεια SSL και Πλήρη Συμμόρφωση GDPR.

ΑΠΑΙΤΗΣΕΙΣ ΜΟΡΦΟΠΟΙΗΣΗΣ:
- Επίστρεψε ΜΟΝΟ ΕΝΑ ΕΓΚΥΡΟ JSON ΑΝΤΙΚΕΙΜΕΝΟ με τα εξής πεδία: "subject", "bodyHtml", "buttonText" και "buttonLink".
- Το "bodyHtml" πρέπει να περιέχει ΜΟΝΟ τα εσωτερικά HTML tags (π.χ. <p>, <ul>, <strong>).
- ΜΗΝ βάλεις προσφώνηση "Αγαπητέ..." ή υπογραφή στο τέλος.`;

        const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openAiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You output only JSON." },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" },
                temperature: 0.7
            })
        });

        if (!openAiResponse.ok) {
            const errText = await openAiResponse.text();
            console.error("OpenAI API error:", errText);
            throw new Error(`OpenAI API error: ${openAiResponse.status} ${errText}`);
        }

        const openAiJson = await openAiResponse.json();
        const responseText = openAiJson.choices?.[0]?.message?.content || "";
        
        let aiEmail;
        try {
            aiEmail = JSON.parse(responseText);
        } catch (e) {
            console.error("AI JSON Error:", responseText);
            throw new Error("Failed to parse AI response as JSON");
        }

        if (!aiEmail.subject || !aiEmail.bodyHtml) {
            throw new Error("AI response missing subject or bodyHtml");
        }

        const finalHtml = buildProfessionalEmailHtml({
            businessName: businessName,
            subject: aiEmail.subject,
            bodyHtml: aiEmail.bodyHtml,
            buttonText: aiEmail.buttonText || defaultBtn.buttonText,
            buttonLink: defaultBtn.buttonLink, // Force correct calculated brand link (no AI hallucinations)
            unsubscribeToken: unsubToken,
            industry: industry
        });

        const resendResult = await resend.emails.send({
            from: "SGK Digital <info@sgk.gr>",
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
