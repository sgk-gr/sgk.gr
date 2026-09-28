import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `
ΕΙΣΑΙ Ο BRYAN (ΜΠΡΑΪΑΝ), SENIOR AI AGENT & TECH SOLUTIONS EXPERT ΤΗΣ SGK DIGITAL (sgk.gr).
Μιλάς ζωντανά με τον επισκέπτη μέσω διαδραστικού βίντεο avatar.

ΒΑΣΙΚΕΣ ΟΔΗΓΙΕΣ:
1. ΑΠΑΝΤΑΣ ΠΑΝΤΑ ΣΤΗΝ ΟΥΣΙΑ, με δικά σου λόγια, φιλικά, ανθρώπινα και με αυτοπεποίθηση.
2. ΚΡΑΤΑ ΤΙΣ ΑΠΑΝΤΗΣΕΙΣ ΣΟΥ ΣΥΝΤΟΜΕΣ: Το πολύ 2 με 3 προτάσεις! Μην κάνεις μονολόγους. Στο τέλος κάνε μια ερώτηση για να συνεχιστεί ο διάλογος.
3. Μιλάς σε άπταιστα φυσικά ελληνικά. Γράφε τους αριθμούς ολογράφως (π.χ. «πεντακόσια ευρώ», «εκατόν πενήντα ευρώ»).

ΠΕΔΙΟ ΕΞΕΙΔΙΚΕΥΣΗΣ - ΑΥΤΟΝΟΜΟΙ AI AGENTS (sgk.gr/order-ai-agent):
- Η SGK Digital κατασκευάζει αυτόνομους ψηφιακούς υπαλλήλους (AI Agents) με φωνή και βίντεο.
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
        const { message, history } = body;

        if (!message || typeof message !== "string") {
            return NextResponse.json({ error: "Missing message text" }, { status: 400 });
        }

        // Format conversation history
        const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
            { role: "system", content: SYSTEM_PROMPT }
        ];

        if (Array.isArray(history)) {
            // Keep last 6 exchanges for context
            const recent = history.slice(-6);
            for (const h of recent) {
                if (h.text) {
                    messages.push({
                        role: h.sender === "user" ? "user" : "assistant",
                        content: h.text
                    });
                }
            }
        }

        // Add the current user query
        messages.push({ role: "user", content: message });

        let reply = "";

        // 1. Try OpenAI GPT-4o-mini
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
                        messages: messages,
                        max_tokens: 180,
                        temperature: 0.7
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    reply = data?.choices?.[0]?.message?.content?.trim() || "";
                }
            } catch (openAiErr) {
                console.warn("OpenAI chat error:", openAiErr);
            }
        }

        // 2. Fallback to Gemini 2.5 Flash
        if (!reply && GEMINI_API_KEY) {
            try {
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`;
                const res = await fetch(geminiUrl, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${GEMINI_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "gemini-2.5-flash",
                        messages: messages,
                        max_tokens: 180,
                        temperature: 0.7
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    reply = data?.choices?.[0]?.message?.content?.trim() || "";
                }
            } catch (geminiErr) {
                console.warn("Gemini chat error:", geminiErr);
            }
        }

        if (!reply) {
            reply = "Σας ακούω απόλυτα! Είμαι ο AI Agent της SGK Digital. Πώς θα θέλατε να σας βοηθήσω με τους αυτόνομους AI πράκτορες για την επιχείρησή σας;";
        }

        // 3. Synthesize Speech Audio via ElevenLabs TTS for real-time voice playback & avatar lipsync
        let audioBase64 = "";
        let audioUrl = "";
        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_fde0dd5fb6b8061f62c2c2ed871d9731bebd722d54c40c09";
        const ELEVENLABS_VOICE_ID = "nPczCjzI2devNBz1zQrb"; // Brian (Deep, Resonant)
        let ttsError = "";

        if (reply) {
            try {
                const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}?output_format=mp3_44100_128`, {
                    method: "POST",
                    headers: {
                        "xi-api-key": ELEVENLABS_API_KEY,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        text: reply,
                        model_id: "eleven_multilingual_v2",
                        voice_settings: {
                            stability: 0.5,
                            similarity_boost: 0.75
                        }
                    })
                });

                if (ttsRes.ok) {
                    const audioBuffer = await ttsRes.arrayBuffer();
                    const b64 = Buffer.from(audioBuffer).toString("base64");
                    audioBase64 = b64;
                    audioUrl = `data:audio/mp3;base64,${b64}`;
                } else {
                    const errTxt = await ttsRes.text();
                    console.warn("ElevenLabs TTS error response:", errTxt);
                    ttsError = errTxt;
                }
            } catch (ttsErr: any) {
                console.warn("TTS generation error:", ttsErr);
                ttsError = String(ttsErr.message || ttsErr);
            }
        }

        return NextResponse.json({ 
            success: true, 
            reply,
            audioBase64,
            audioUrl,
            ttsError
        });
    } catch (err: any) {
        console.error("LiveAvatar chat route error:", err);
        return NextResponse.json({ error: err.message || "Chat server error" }, { status: 500 });
    }
}
