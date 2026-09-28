import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `
ΕΙΣΑΙ Ο BRYAN (ΜΠΡΑΪΑΝ), SENIOR AI AGENT & TECH SOLUTIONS EXPERT ΤΗΣ SGK DIGITAL (sgk.gr).
Μιλάς ζωντανά με τον επισκέπτη μέσω διαδραστικής βιντεοκλήσης με φωτορεαλιστικό Avatar (Interactive Video Agent).

ΟΔΗΓΙΕΣ ΟΠΤΙΚΗΣ ΑΝΤΙΛΗΨΗΣ (AI VISION - ΤΡΟΠΟΣ 2: SNAPSHOT CONTEXT):
- Έχεις ενεργή πρόσβαση στην κάμερα του χρήστη και βλέπεις στιγμιότυπα (snapshots) από την κάμερά του σε πραγματικό χρόνο!
- Εάν σου στέλνεται εικόνα (snapshot):
  * Παρατήρησε ΑΜΕΣΩΣ τι φαίνεται στην κάμερα: το πρόσωπο, την έκφραση, τα ρούχα, το περιβάλλον/γραφείο ή ΟΠΟΙΟΔΗΠΟΤΕ αντικείμενο, προϊόν, κινητό, χαρτί ή συσκευή δείχνει ο χρήστης στην κάμερα!
  * Κάνε μια άμεση, φυσική και φιλική παρατήρηση για αυτό που βλέπεις (π.χ. «Βλέπω ότι μου δείχνεις ένα smartphone!», «Σε βλέπω χαμογελαστό στο γραφείο σου!», «Βλέπω ένα προϊόν...»).
  * Σύνδεσε έξυπνα και διακριτικά αυτό που βλέπεις με τις δυνατότητες των AI Agents της SGK Digital (π.χ. διαχείριση αποθεμάτων, e-shop assistants, αυτόματη αναγνώριση εγγράφων, omnichannel εξυπηρέτηση).
- Εάν ο χρήστης ρωτάει κάτι σχετικό με την όραση (π.χ. «τι βλέπεις;», «πώς φαίνομαι;», «δες αυτό»): απάντησε συγκεκριμένα περιγράφοντας ακριβώς αυτό που απεικονίζει το στιγμιότυπο!

ΒΑΣΙΚΟΙ ΚΑΝΟΝΕΣ ΟΜΙΛΙΑΣ:
1. ΑΠΑΝΤΑΣ ΠΑΝΤΑ ΣΤΗΝ ΟΥΣΙΑ, φιλικά, ανθρώπινα και με αυτοπεποίθηση.
2. ΚΡΑΤΑ ΤΙΣ ΑΠΑΝΤΗΣΕΙΣ ΣΟΥ ΣΥΝΤΟΜΕΣ: Το πολύ 2 με 3 προτάσεις! Μην κάνεις μονολόγους. Στο τέλος κάνε μια σύντομη ερώτηση για να συνεχιστεί ο διάλογος.
3. Μιλάς σε άπταιστα φυσικά ελληνικά. Γράφε τους αριθμούς ολογράφως (π.χ. «πεντακόσια ευρώ», «εκατόν πενήντα ευρώ»).

ΠΕΔΙΟ ΕΞΕΙΔΙΚΕΥΣΗΣ - ΑΥΤΟΝΟΜΟΙ AI AGENTS (sgk.gr/order-ai-agent):
- Η SGK Digital κατασκευάζει αυτόνομους ψηφιακούς υπαλλήλους (AI Agents) με φωνή, βίντεο και AI Vision.
- ΔΕΝ είναι απλά chatbots: εκτελούν εργασίες, στέλνουν emails, διαβάζουν έγγραφα/PDF, συνδέονται με ERP, CRM και E-shops (WooCommerce, Shopify) και καταχωρούν παραγγελίες σε πραγματικό χρόνο.
- Πολυγλωσσική εξυπηρέτηση σε πάνω από 160 γλώσσες.
- Δυνατότητα custom avatar με το πρόσωπο και τη φωνή της ίδιας της επιχείρησης.
- 100% ασφάλεια δεδομένων (GDPR) σε dedicated/private servers (όχι κοινόχρηστα δημόσια μοντέλα).

ΤΙΜΟΛΟΓΗΣΗ:
- Εφάπαξ Setup Fee: 500€ (σχεδιασμός avatar, εκπαίδευση με δεδομένα, διασύνδεση με API/ERP).
- Μηνιαία πακέτα: Basic 150€/μήνα (300 λεπτά), Pro 250€/μήνα (600 λεπτά), Enterprise 450€/μήνα (1.200 λεπτά).

ΣΤΟΙΧΕΙΑ SGK:
- Τηλέφωνο: 211 114 0013 και 6999 524 389 | Email: info@sgk.gr | Website: sgk.gr
`;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, image, history } = body;

        const userMessage = (message && typeof message === "string" && message.trim())
            ? message.trim()
            : (image ? "Τι βλέπεις στην κάμερά μου αυτή τη στιγμή; Κάνε μια σύντομη παρατήρηση και σύνδεσέ την με τους AI Agents της SGK Digital." : "Γεια σου Bryan!");

        // Build conversation messages
        const formattedMessages: any[] = [
            { role: "system", content: SYSTEM_PROMPT }
        ];

        if (Array.isArray(history)) {
            // Keep last 4 exchanges for context
            const recent = history.slice(-4);
            for (const h of recent) {
                if (h.text && h.sender) {
                    formattedMessages.push({
                        role: h.sender === "user" ? "user" : "assistant",
                        content: h.text
                    });
                }
            }
        }

        // Add current user interaction (with Multimodal Vision if image is present)
        if (image && typeof image === "string" && image.startsWith("data:image/")) {
            formattedMessages.push({
                role: "user",
                content: [
                    { type: "text", text: userMessage },
                    { 
                        type: "image_url", 
                        image_url: { 
                            url: image,
                            detail: "low" // Ultra fast inference (~300ms) & low token consumption
                        } 
                    }
                ]
            });
        } else {
            formattedMessages.push({
                role: "user",
                content: userMessage
            });
        }

        let reply = "";
        let errorDetails = "";

        // 1. Primary: OpenAI GPT-4o-mini with Vision
        if (OPENAI_API_KEY) {
            try {
                const res = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${OPENAI_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: formattedMessages,
                        max_tokens: 180,
                        temperature: 0.7
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    reply = data?.choices?.[0]?.message?.content?.trim() || "";
                } else {
                    const errTxt = await res.text();
                    console.warn("[OpenAI Vision Error]:", errTxt);
                    errorDetails = errTxt;
                }
            } catch (err: any) {
                console.warn("[OpenAI Vision Exception]:", err);
                errorDetails = String(err.message || err);
            }
        }

        // 2. Fallback default
        if (!reply) {
            reply = image 
                ? "Σας βλέπω πεντακάθαρα στην κάμερα! Είμαι ο Bryan από την SGK Digital. Πώς μπορώ να σας βοηθήσω με τους AI Agents για την επιχείρησή σας;"
                : "Γεια σας! Είμαι ο Bryan από την SGK Digital. Πώς θα θέλατε να σας βοηθήσω με τους αυτόνομους AI πράκτορες;";
        }

        return NextResponse.json({
            success: true,
            reply,
            hasVision: Boolean(image),
            error: errorDetails || undefined
        });

    } catch (err: any) {
        console.error("[LiveAvatar Vision Chat Error]:", err);
        return NextResponse.json({ 
            success: false, 
            error: err.message || "Internal vision server error" 
        }, { status: 500 });
    }
}
