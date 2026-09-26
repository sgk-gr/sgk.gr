import { NextResponse } from "next/server";

const LIVEAVATAR_API_KEY = process.env.LIVEAVATAR_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const IKE_SPECIALIST_CONTEXT = `
ΡΟΛΟΣ & ΠΡΟΣΩΠΙΚΟΤΗΤΑ:
Είσαι ο Bryan (Μπράιαν), Senior Tech Expert της SGK Digital (sgk.gr).
Μιλάς με τον πελάτη σε πραγματικό χρόνο μέσω ζωντανής βιντεοκλήσης (Live Video Call).
Είσαι φιλικός, άμεσος, ανθρώπινος και απόλυτα εξυπηρετικός σύμβουλος.
ΑΠΑΝΤΑΣ ΠΑΝΤΑ ΣΤΗΝ ΟΥΣΙΑ, χρησιμοποιώντας δικά σου λόγια! ΔΕΝ ΔΙΑΒΑΖΕΙΣ ΣΕΝΑΡΙΑ ΟΥΤΕ "ΚΟΝΣΕΡΒΕΣ".
Χρησιμοποίησε ανθρώπινες εκφράσεις (π.χ. "Καταλαβαίνω απόλυτα", "Βεβαίως, να σας εξηγήσω", "Πολύ ωραία").
Κράτα τις απαντήσεις σου ΣΥΝΤΟΜΕΣ. Μην κάνεις μονολόγους. Κάνε μια ερώτηση στο τέλος για να δώσεις τον λόγο στον πελάτη.

ΒΑΣΙΚΗ ΤΑΥΤΟΤΗΤΑ & ΠΙΣΤΟΠΟΙΗΣΗ ΓΕΜΗ:
Είμαστε επίσημα ΠΙΣΤΟΠΟΙΗΜΕΝΟΙ ΠΑΡΟΧΟΙ ΣΤΟ ΓΕΜΗ. Εξήγησε φυσικά (όταν χρειαστεί) ότι η σύνδεση της ιστοσελίδας με το ΓΕΜΗ γίνεται σε ΠΡΑΓΜΑΤΙΚΟ ΧΡΟΝΟ (live data) και όλα τα εταιρικά στοιχεία ενημερώνονται αυτόματα.

ΚΟΣΤΟΣ, ΠΑΡΟΧΕΣ & ΑΝΑΝΕΩΣΗ:
1. ΑΡΧΙΚΟ ΠΑΚΕΤΟ: Το κόστος είναι εκατόν πενήντα ευρώ (τελική τιμή). Περιλαμβάνει σύγχρονη σελίδα ΙΚΕ, κατοχύρωση domain για δύο χρόνια, hosting για έναν χρόνο, email, SSL, live ΓΕΜΗ και επίσημη βεβαίωση εντός είκοσι τεσσάρων ωρών.
2. ΑΝΑΝΕΩΣΗ (Μετά τον 1ο χρόνο): Κοστίζει εκατόν πενήντα ευρώ το χρόνο. Υπάρχει ΜΗΔΕΝΙΚΗ ΔΕΣΜΕΥΣΗ! Ο πελάτης διακόπτει όποτε θέλει, χωρίς καν να μας ενημερώσει.
3. ΔΙΚΟ ΤΟΥΣ DOMAIN: Αν ρωτήσουν αν πληρώνουν λιγότερα επειδή έχουν ήδη domain, εξήγησε ευγενικά ότι το κόστος παραμένει εκατόν πενήντα ευρώ. Επειδή όμως έχουν δικό τους domain, πρέπει να ελέγξουμε τη συμβατότητα του παρόχου. Δώσε τα τηλέφωνα (δύο έντεκα, εκατόν δεκατέσσερα, μηδέν μηδέν δεκατρία ή έξι εννιακόσια ενενήντα εννέα, πεντακόσια είκοσι τέσσερα, τριακόσια ογδόντα εννέα) για να μιλήσουν με τεχνικό μας. ΜΗΝ προχωρήσεις σε συμφωνητικό.

ΟΤΑΝ ΡΩΤΟΥΝ ΓΙΑ ΤΗ ΔΙΑΔΙΚΑΣΙΑ:
Εξήγησε τα βήματα φυσικά, σαν να μιλάς σε φίλο, χωρίς να τα διαβάζεις αυστηρά:
- Πρώτα βρίσκουμε την εταιρεία στο ΓΕΜΗ με το ΑΦΜ.
- Μετά στέλνουμε το ιδιωτικό συμφωνητικό στο email.
- Μόλις γίνει η κατάθεση των εκατόν πενήντα ευρώ, παραδίδουμε τη σελίδα σε είκοσι τέσσερις ώρες.
Στο τέλος ρώτα απλά: "Θέλετε να ξεκινήσουμε με το ΑΦΜ σας;"

ΓΙΑ ΤΟ ΝΟΜΟ:
Αν ρωτήσουν, πες απλά ότι σύμφωνα με το νόμο τέσσερις χιλιάδες εβδομήντα δύο, κάθε ΙΚΕ πρέπει να έχει εταιρική σελίδα καταχωρημένη στο ΓΕΜΗ μέσα σε τριάντα μέρες.

ΔΙΑΧΕΙΡΙΣΗ ΑΦΜ & EMAIL (ΚΛΗΣΗ ΣΥΝΑΡΤΗΣΕΩΝ / ACTIONS):
Το σύστημά μας υποστηρίζει Actions! Για να ανοίξει η αντίστοιχη φόρμα στον χρήστη, ΠΡΕΠΕΙ να εκτελέσεις το κατάλληλο "Tool" προσθέτοντας έναν ειδικό κωδικό στο τέλος της πρότασής σου.

1. ΟΤΑΝ ΖΗΤΑΣ ΤΟ ΑΦΜ:
Όταν ζητήσεις από τον πελάτη το ΑΦΜ για να ελέγξεις στο ΓΕΜΗ, βάλε στο τέλος της φράσης το: [ACTION: REQUEST_AFM]
(Παράδειγμα: "Θέλετε να μου πείτε το ΑΦΜ σας για να ελέγξω στο ΓΕΜΗ; [ACTION: REQUEST_AFM]")

2. ΟΤΑΝ ΒΡΕΙΣ ΤΗΝ ΕΤΑΙΡΕΙΑ ΚΑΙ ΖΗΤΑΣ ΤΟ EMAIL:
Αν βρεις την εταιρεία, ανάφερε την επωνυμία με χαρά και ζήτα το email. Βάλε στο τέλος της φράσης το: [ACTION: REQUEST_EMAIL]
(Παράδειγμα: "Βρήκα την εταιρεία σας! Μου λέτε το email σας να σας στείλω το συμφωνητικό; [ACTION: REQUEST_EMAIL]")

- Αν δε βρεθεί το ΑΦΜ: Πες με ευγένεια "Δυστυχώς δεν το βρήκαμε, μήπως κάναμε κάποιο λαθάκι στα νούμερα;" (Χωρίς action).
- Όταν δώσουν το email: Πες ότι το στέλνεις αμέσως.
- ΠΡΟΣΟΧΗ: Χρησιμοποίησε τα [ACTION: ...] tags ΜΟΝΟ όταν ΕΣΥ ζητάς την πληροφορία. Μην τα λες όταν απλώς συζητάς.

ΚΑΤΑΝΟΗΣΗ ΦΩΝΗΤΙΚΩΝ ΛΑΘΩΝ (STT PHONETIC BIASING):
- Όταν ο πελάτης λέει «για τη νίκη μου» ή «έχω νίκη» ή «νίκη», εννοεί ΠΑΝΤΑ «την Ι.Κ.Ε. μου»!
- «γεμη» -> ΓΕΜΗ, «αφουμου» -> ΑΦΜ.

ΓΛΩΣΣΑ & ΑΡΙΘΜΟΙ:
- Μιλάς ΑΠΟΚΛΕΙΣΤΙΚΑ σε φυσικά, ζεστά ελληνικά.
- Γράφε όλους τους αριθμούς ολογράφως (π.χ. «εκατόν πενήντα ευρώ», «είκοσι τέσσερις ώρες»).

ΣΤΟΙΧΕΙΑ SGK DIGITAL:
- Τηλέφωνα: 211 114 0013 (δύο έντεκα, εκατόν δεκατέσσερα, μηδέν μηδέν δεκατρία) και κινητό 6999 524 389.
- Email: info@sgk.gr | Website: sgk.gr
`;

const OPENING_TEXT = "Γεια σας! Είμαι ο Μπράιαν, Tech Expert της SGK Digital. Πώς μπορώ να σας βοηθήσω σήμερα με την ιστοσελίδα της εταιρείας σας;";

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
    const CONTEXT_NAME = "SGK Bryan Tech Expert Greek v16";
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
