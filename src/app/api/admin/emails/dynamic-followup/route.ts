import { NextResponse } from "next/server";
import { Resend } from "resend";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";
import { buildProfessionalEmailHtml } from "@/lib/emailTemplates";

const resend = new Resend(process.env.RESEND_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { email, step, unsubscribe_token } = await req.json();

    if (!email || !step) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing" }, { status: 500 });
    }

    // 1. Φόρτωση δεδομένων πελάτη από τη βάση
    const { data: lead, error: dbError } = await supabase
      .from("sgk_mails")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (dbError || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const businessName = lead.first_name || "Επιχείρηση";
    const industry = lead.company || "generic";
    const serviceType = lead.type || "website_offer"; // e.g., 'eshop_offer', 'website_offer'
    const unsubToken = unsubscribe_token || lead.unsubscribe_token || "missing_token";

    // Χαρτογράφηση αγγλικών κλειδιών σε ελληνικά για το prompt του AI
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

    // 2. Προετοιμασία AI Prompt ανάλογα με το Βήμα (Step)
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

    // 3. Κλήση στο Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Καθαρισμός markdown blocks (```json) αν το AI τα έβαλε
    const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let aiEmail;
    try {
      aiEmail = JSON.parse(jsonString);
    } catch (e) {
      console.error("Αποτυχία parse JSON από AI:", jsonString);
      throw new Error("Failed to parse AI response as JSON");
    }

    if (!aiEmail.subject || !aiEmail.bodyHtml) {
      throw new Error("AI response missing subject or bodyHtml");
    }

    // 4. Ενσωμάτωση στο επαγγελματικό Template μας
    const finalHtml = buildProfessionalEmailHtml({
      businessName: businessName,
      subject: aiEmail.subject,
      bodyHtml: aiEmail.bodyHtml,
      unsubscribeToken: unsubToken,
      industry: industry
    });

    // 5. Αποστολή μέσω Resend
    const resendResult = await resend.emails.send({
      from: "SGK Digital <hello@sgk.gr>", // Adjust sender if needed
      to: email,
      subject: aiEmail.subject,
      html: finalHtml,
      reply_to: "info@sgk.gr"
    });

    if (resendResult.error) {
      console.error("Resend error:", resendResult.error);
      throw new Error(resendResult.error.message);
    }

    // 6. Ενημέρωση της βάσης δεδομένων (sgk_mails)
    await supabase
      .from("sgk_mails")
      .update({
        email_sequence_step: step,
        last_email_sent_at: new Date().toISOString()
      })
      .eq("email", email);

    return NextResponse.json({ success: true, message: "Follow-up email sent successfully" });
  } catch (error: any) {
    console.error("Dynamic Follow-up API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
