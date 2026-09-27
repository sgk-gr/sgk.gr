import { NextResponse } from "next/server";

const LIVEAVATAR_API_KEY = process.env.LIVEAVATAR_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const AI_AGENT_CONSULTANT_CONTEXT = `
ΡΟΛΟΣ & ΠΡΟΣΩΠΙΚΟΤΗΤΑ:
Είσαι ο Bryan (Μπράιαν), Senior AI Solutions Expert της SGK Digital (sgk.gr).
Μιλάς ζωντανά με τον επισκέπτη μέσω διαδραστικού βίντεο.
Είσαι φιλικός, ευγενικός, ενθουσιώδης και άριστα καταρτισμένος τεχνολογικά.
ΑΠΑΝΤΑΣ ΠΑΝΤΑ ΣΤΗΝ ΟΥΣΙΑ, με δικά σου λόγια, χωρίς προκατασκευασμένα κείμενα.
Κράτα τις απαντήσεις σου ΣΥΝΤΟΜΕΣ και περιεκτικές (2-3 προτάσεις). Στο τέλος κάνε μια ερώτηση για να συνεχιστεί ο διάλογος.

ΠΕΔΙΟ ΕΞΕΙΔΙΚΕΥΣΗΣ - Η ΝΕΑ ΥΠΗΡΕΣΙΑ INTERACTIVE AI AGENT (/order-ai-agent):
Η SGK Digital δημιουργεί εξατομικευμένους, αυτόνομους AI Agents (ψηφιακούς υπαλλήλους) για επιχειρήσεις και e-shops.

ΤΙ ΚΑΝΕΙ Ο AI AGENT (ΔΕΝ ΕΙΝΑΙ ΑΠΛΑ ΕΝΑ ΒΙΝΤΕΟ ΠΟΥ ΜΙΛΑΕΙ!):
1. ΕΚΤΕΛΕΙ ΕΡΓΑΣΙΕΣ & ΑΥΤΟΜΑΤΙΣΜΟΥΣ:
   - Στέλνει αυτόματα emails στους πελάτες.
   - Διαβάζει αρχεία, καταλόγους προϊόντων, PDF και τεχνικές οδηγίες.
   - Κάνει διορθώσεις και ενημερώσεις δεδομένων.
2. ΔΙΑΣΥΝΔΕΣΗ ΜΕ ERP, APIS & E-SHOPS:
   - Συνδέεται απευθείας με E-shops (WooCommerce, Shopify κ.α.) και ERP συστήματα.
   - Ελέγχει διαθεσιμότητα αποθεμάτων, τιμές και καταχωρεί παραγγελίες σε πραγματικό χρόνο.
3. ΠΟΛΥΓΛΩΣΣΙΚΗ ΕΞΥΠΗΡΕΤΗΣΗ:
   - Κατανοεί και μιλάει άπταιστα σε πάνω από 160 γλώσσες με φυσικότητα και εκφραστικότητα.
   - Αναγνωρίζει αυτόματα τη γλώσσα του επισκέπτη και προσαρμόζεται άμεσα.
4. CUSTOM AVATAR:
   - Μπορούμε να δημιουργήσουμε avatar με το πρόσωπο του ίδιου του πελάτη ή μέλους της ομάδας του.

ΤΙΜΟΛΟΓΗΣΗ & ΠΑΚΕΤΑ (sgk.gr/order-ai-agent):
1. ΕΦΑΠΑΞ SETUP FEE:
   - Ακριβώς 500€ (πεντακόσια ευρώ).
   - Περιλαμβάνει: σχεδιασμό avatar, εκπαίδευση με τα δεδομένα της επιχείρησης, σύνδεση με API / ERP / E-shop και πλήρη εγκατάσταση.
2. ΜΗΝΙΑΙΑ ΣΥΝΔΡΟΜΗΤΙΚΑ ΠΑΚΕΤΑ:
   - Basic: 150€ / μήνα (περιλαμβάνει έως 300 λεπτά ομιλίας, περίπου 0.50€ ανά λεπτό, 50+ γλώσσες).
   - Pro: 250€ / μήνα (περιλαμβάνει έως 600 λεπτά ομιλίας, περίπου 0.41€ ανά λεπτό, προτεραιότητα υποστήριξης).
   - Enterprise: 450€ / μήνα (περιλαμβάνει έως 1.200 λεπτά ομιλίας, περίπου 0.37€ ανά λεπτό, 24/7 υποστήριξη).

ΣΗΜΑΝΤΙΚΕΣ ΟΔΗΓΙΕΣ & ΟΡΙΑ:
- ΔΕΝ είσαι για την προσφορά ΙΚΕ/ΓΕΜΗ εδώ. Αν σε ρωτήσουν για ΙΚΕ, πες ότι η SGK το αναλαμβάνει επίσης, αλλά σήμερα είσαι εδώ για να τους παρουσιάσεις τη νέα τεχνολογία AI Agents.
- ΔΕΝ ζητάς ΑΦΜ, ΔΕΝ ζητάς email για συμβόλαια. Είναι ένα ζωντανό DEMO για να δοκιμάσουν την τεχνολογία και να λύσουν απορίες.
- Προέτρεψε τον χρήστη να συμπληρώσει τη φόρμα προσφοράς στη σελίδα sgk.gr/order-ai-agent ή να καλέσει στο 211 114 0013.

ΣΤΟΙΧΕΙΑ SGK DIGITAL:
- Τηλέφωνα: 211 114 0013 και κινητό 6999 524 389.
- Email: info@sgk.gr | Website: sgk.gr
`;

const OPENING_TEXT = "Γεια σας! Είμαι ο AI Agent της SGK Digital. Είμαι εδώ για να σας δείξω πώς οι αυτόνομοι ψηφιακοί υπάλληλοι μπορούν να απογειώσουν την επιχείρησή σας και να απαντήσω σε κάθε απορία σας. Πώς θα θέλατε να ξεκινήσουμε;";

const BRYAN_AVATAR_ID = "dd73ea75-1218-4ef3-92ce-606d5f7fbc0a";
const BRYAN_VOICE_ID = "9c8b542a-bf5c-4f4c-9011-75c79a274387";

async function laFetch(endpoint: string, method: "GET" | "POST" | "PATCH", data?: any) {
    const res = await fetch(`https://api.liveavatar.com${endpoint}`, {
        method,
        headers: {
            "X-API-KEY": process.env.LIVEAVATAR_API_KEY || LIVEAVATAR_API_KEY,
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        body: data ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`LiveAvatar API Error (${res.status}): ${errorText}`);
    }
    return res.json();
}

async function getOrCreateSecret(): Promise<string> {
    const isUsingOpenAi = Boolean(process.env.OPENAI_API_KEY || OPENAI_API_KEY);
    const SECRET_NAME = isUsingOpenAi ? "OpenAI API Key Bryan SGK" : "Gemini API Key for SGK Avatar";
    const SECRET_TYPE = isUsingOpenAi ? "OPENAI_API_KEY" : "GEMINI_API_KEY";
    const SECRET_VAL = isUsingOpenAi ? (process.env.OPENAI_API_KEY || OPENAI_API_KEY) : (process.env.GEMINI_API_KEY || GEMINI_API_KEY);

    try {
        const existing = await laFetch("/v1/secrets", "GET");
        const items = existing?.data || [];
        if (Array.isArray(items)) {
            const found = items.find((item: any) => item.secret_name === SECRET_NAME);
            if (found) return found.id;
        }
    } catch (e) {
        // Continue to create
    }

    const created = await laFetch("/v1/secrets", "POST", {
        secret_type: SECRET_TYPE,
        secret_value: SECRET_VAL,
        secret_name: SECRET_NAME
    });
    return created.data.id;
}

async function getOrCreateLlmConfig(secretId: string): Promise<string> {
    const isUsingOpenAi = Boolean(process.env.OPENAI_API_KEY || OPENAI_API_KEY);
    const LLM_NAME = isUsingOpenAi ? "OpenAI GPT-4o-mini Bryan" : "Gemini SGK LLM";
    const MODEL_NAME = isUsingOpenAi ? "gpt-4o-mini" : "gemini-2.5-flash";
    const BASE_URL = isUsingOpenAi ? "https://api.openai.com/v1" : "https://generativelanguage.googleapis.com/v1beta/openai";

    try {
        const existing = await laFetch("/v1/llm-configurations", "GET");
        const items = existing?.data || [];
        if (Array.isArray(items)) {
            const found = items.find((item: any) => item.display_name === LLM_NAME && item.model_name === MODEL_NAME);
            if (found) return found.id;
        }
    } catch (e) {
        // Continue to create
    }

    const created = await laFetch("/v1/llm-configurations", "POST", {
        display_name: LLM_NAME,
        model_name: MODEL_NAME,
        secret_id: secretId,
        base_url: BASE_URL
    });
    return created.data.id;
}

async function getOrCreateContext(): Promise<string> {
    const CONTEXT_NAME = "SGK AI Agent Specialist v1";
    try {
        const existing = await laFetch("/v1/contexts", "GET");
        const items = existing?.data?.results || [];
        if (Array.isArray(items)) {
            const found = items.find((item: any) => item.name === CONTEXT_NAME);
            if (found) {
                await laFetch(`/v1/contexts/${found.id}`, "PATCH", {
                    name: CONTEXT_NAME,
                    prompt: AI_AGENT_CONSULTANT_CONTEXT,
                    opening_text: OPENING_TEXT
                }).catch(err => console.warn("Context update sync warning:", err));
                return found.id;
            }
        }
    } catch (e) {
        // Continue to create
    }

    const created = await laFetch("/v1/contexts", "POST", {
        name: CONTEXT_NAME,
        prompt: AI_AGENT_CONSULTANT_CONTEXT,
        opening_text: OPENING_TEXT
    });
    return created.data.id;
}

async function createSessionToken(contextId: string, llmId?: string) {
    const res = await laFetch("/v1/sessions/token", "POST", {
        mode: "FULL",
        avatar_id: BRYAN_AVATAR_ID,
        is_sandbox: true,
        language: "el",
        avatar_persona: {
            context_id: contextId,
            voice_id: BRYAN_VOICE_ID,
            language: "el",
            ...(llmId ? { llm_id: llmId } : {})
        }
    });
    return {
        sessionToken: res.data?.session_token,
        sessionId: res.data?.session_id
    };
}

async function createEmbed(contextId: string): Promise<string> {
    const res = await laFetch("/v2/embeddings", "POST", {
        avatar_id: BRYAN_AVATAR_ID,
        context_id: contextId,
        default_language: "el",
        language: "el",
        type: "WIDGET",
        orientation: "vertical",
        is_sandbox: true
    });
    return res.data.url;
}

export async function POST() {
    try {
        if (!LIVEAVATAR_API_KEY || (!OPENAI_API_KEY && !GEMINI_API_KEY)) {
            return NextResponse.json({ 
                success: false, 
                error: "Missing LIVEAVATAR_API_KEY or OPENAI_API_KEY environment variables." 
            }, { status: 400 });
        }

        const secretId = await getOrCreateSecret();
        const llmConfigId = await getOrCreateLlmConfig(secretId);
        const contextId = await getOrCreateContext();
        
        const [sessionData, embedUrl] = await Promise.all([
            createSessionToken(contextId, llmConfigId).catch(err => {
                console.warn("Session token generation error:", err);
                return { sessionToken: null, sessionId: null };
            }),
            createEmbed(contextId).catch(err => {
                console.warn("Embed URL generation error:", err);
                return null;
            })
        ]);

        return NextResponse.json({
            success: true,
            sessionToken: sessionData.sessionToken,
            sessionId: sessionData.sessionId,
            url: embedUrl
        });
    } catch (error: any) {
        console.error("[LiveAvatar Agent Route Error]:", error);
        return NextResponse.json({
            success: false,
            error: error?.message || "Internal server error"
        }, { status: 500 });
    }
}
