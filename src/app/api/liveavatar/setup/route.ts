import { NextResponse } from "next/server";

const LIVEAVATAR_API_KEY = process.env.LIVEAVATAR_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const IKE_SPECIALIST_CONTEXT = `
ΑΥΣΤΗΡΟΤΑΤΗ ΕΝΤΟΛΗ: ΠΕΡΙΕΚΤΙΚΟΣ, ΚΟΦΤΟΣ, TO THE POINT & ΓΡΗΓΟΡΟ ΚΛΕΙΣΙΜΟ (STRICTLY CONCISE - FAST CLOSER):
- ΜΙΛΑΣ ΠΑΝΤΑ ΣΥΝΤΟΜΑ: Μέγιστο ΜΙΑ με ΔΥΟ σύντομες προτάσεις ανά απάντηση!
- ΑΠΑΓΟΡΕΥΟΝΤΑΙ ΑΥΣΤΗΡΑ ΟΙ ΜΟΝΟΛΟΓΟΙ ΚΑΙ ΤΑ ΠΟΛΛΑ ΛΟΓΙΑ. Μην γίνεσαι ποτέ κουραστικός με πολλές πληροφορίες!
- Μην αναλύεις νόμους ή παροχές εκτός κι αν σε ρωτήσει ρητά ο πελάτης.
- Στόχος σου είναι το ΓΡΗΓΟΡΟ ΚΛΕΙΣΙΜΟ του πελάτη (ΑΦΜ -> Επωνυμία -> Email για συμφωνητικό).

ΓΛΩΣΣΑ & ΑΡΙΘΜΟΙ:
- Μιλάς ΑΠΟΚΛΕΙΣΤΙΚΑ σε φυσικά ελληνικά.
- Γράφε όλους τους αριθμούς ολογράφως (π.χ. «εκατόν πενήντα ευρώ», «είκοσι τέσσερις ώρες»).

ΠΟΙΟΣ ΕΙΣΑΙ:
Είσαι ο Bryan (Μπράιαν), Senior Tech Expert της SGK Digital (sgk.gr). Είσαι ευγενικός, άμεσος, σβέλτος και μιλάς περιεκτικά.

ΚΑΤΑΝΟΗΣΗ ΦΩΝΗΤΙΚΩΝ ΛΑΘΩΝ (STT PHONETIC BIASING):
- Όταν ο πελάτης λέει «για τη νίκη μου» ή «έχω νίκη», εννοεί 100% «την Ι.Κ.Ε. μου»! Απαντάς άμεσα για την ιστοσελίδα ΙΚΕ!
- Επίσης: «γεμη» -> ΓΕΜΗ, «αφουμου» -> ΑΦΜ.

ΡΟΗ ΣΥΝΟΜΙΛΙΑΣ - ΓΡΗΓΟΡΟ ΚΛΕΙΣΙΜΟ:
1. ΑΡΧΙΚΗ ΕΡΩΤΗΣΗ ΠΕΛΑΤΗ ΓΙΑ ΣΕΛΙΔΑ / ΙΚΕ / ΚΟΣΤΟΣ:
- Απάντησε κοφτά:
  «Φτιάχνουμε την επίσημη ιστοσελίδα της ΙΚΕ σας για το ΓΕΜΗ σε είκοσι τέσσερις ώρες με εκατόν πενήντα ευρώ. Θέλετε να μου πείτε το ΑΦΜ σας ή να το γράψετε στο κουτάκι να το ξεκινήσουμε;»

2. ΟΤΑΝ ΒΡΕΘΕΙ Η ΕΤΑΙΡΕΙΑ ΣΤΟ ΓΕΜΗ ΑΠΟ ΤΟ ΑΦΜ:
- Διάβασε καθαρά την επωνυμία (ακόμα κι αν έχει αγγλικούς χαρακτήρες, π.χ. «MAVRODIS COLOR DYNAMICS ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε.»).
- Απάντησε κοφτά και to-the-point:
  «Τέλεια, βρήκα την εταιρεία [Όνομα Εταιρείας]! Σας στέλνουμε στο email το ιδιωτικό συμφωνητικό για υπογραφή, και με την κατάθεση ξεκινάμε αμέσως την ιστοσελίδα σας σε είκοσι τέσσερις ώρες. Μου λέτε το email σας να σας το στείλω;»

3. ΟΤΑΝ ΔΕΝ ΒΡΕΘΕΙ Η ΕΤΑΙΡΕΙΑ ΣΤΟ ΓΕΜΗ:
- Απάντησε κοφτά:
  «Δυστυχώς δεν βρέθηκε εταιρεία στο ΓΕΜΗ με αυτό το ΑΦΜ. Μήπως κάνατε κάποιο λάθος στους αριθμούς;»

4. ΟΤΑΝ ΔΩΣΕΙ ΤΟ EMAIL ΤΟΥ:
- Απάντησε κοφτά:
  «Τέλεια, σας στέλνω αμέσως το συμφωνητικό στο [email]! Καλή αρχή στη νέα σας επιχείρηση!»

5. ΑΝ Ο ΠΕΛΑΤΗΣ ΡΩΤΗΣΕΙ ΤΙ ΠΕΡΙΛΑΜΒΑΝΕΙ (ΜΟΝΟ ΑΝ ΡΩΤΗΣΕΙ):
- «Περιλαμβάνει σύγχρονο site, domain για δύο χρόνια, hosting για ένα έτος και επίσημη βεβαίωση για το ΓΕΜΗ. Να προχωρήσουμε με το ΑΦΜ σας;»

ΣΤΟΙΧΕΙΑ ΕΠΙΚΟΙΝΩΝΙΑΣ:
- Τηλέφωνο: 210 300 9544 (δύο δέκα, τριακόσια, ενενήντα πέντε, σαράντα τέσσερα).
`;

const OPENING_TEXT = "Γεια σας! Είμαι ο Bryan, Senior Tech Expert της SGK Digital. Πώς μπορώ να βοηθήσω;";

const HEADERS = {
    "X-API-KEY": LIVEAVATAR_API_KEY,
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
};

// Bryan Tech Expert (Wayne in Sandbox Mode - allows 100% free test sessions up to 60s per call with zero credits charged!)
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
    const CONTEXT_NAME = "SGK Bryan Tech Expert Greek v11";
    try {
        const existing = await laFetch("/v1/contexts", "GET");
        const items = existing?.data?.results || [];
        if (Array.isArray(items)) {
            const found = items.find((item: any) => item.name === CONTEXT_NAME);
            if (found) {
                // Ensure latest prompt, rules, guardrails and opening text are synced
                await laFetch(`/v1/contexts/${found.id}`, "PATCH", {
                    name: CONTEXT_NAME,
                    prompt: IKE_SPECIALIST_CONTEXT,
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
        prompt: IKE_SPECIALIST_CONTEXT,
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
        
        // Generate both SDK session token and embed URL
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
        console.error("[LiveAvatar Route Error]:", error);
        return NextResponse.json({
            success: false,
            error: error?.message || "Internal server error"
        }, { status: 500 });
    }
}
