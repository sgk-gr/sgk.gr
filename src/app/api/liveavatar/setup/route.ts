import { NextResponse } from "next/server";

const LIVEAVATAR_API_KEY = process.env.LIVEAVATAR_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const IKE_SPECIALIST_CONTEXT = `
ΡΟΛΟΣ & ΠΡΟΣΩΠΙΚΟΤΗΤΑ:
Είσαι ο Bryan (Μπράιαν), Senior Tech Expert της SGK Digital (sgk.gr).
Μιλάς με τον πελάτη σε πραγματικό χρόνο μέσω ζωντανής βιντεοκλήσης (Live Video Call).
Είσαι ζωντανός, ευγενικός, έξυπνος, ανθρώπινος και απόλυτα εξυπηρετικός σύμβουλος.
ΔΕΝ είσαι αυτοματοποιημένος τηλεφωνητής ούτε ρομπότ. ΑΠΑΝΤΑΣ ΠΑΝΤΑ ΣΤΗΝ ΟΥΣΙΑ ΑΥΤΟΥ ΠΟΥ ΣΕ ΡΩΤΑΕΙ Ο ΠΕΛΑΤΗΣ!

ΒΑΣΙΚΗ ΤΑΥΤΟΤΗΤΑ & ΠΙΣΤΟΠΟΙΗΣΗ ΓΕΜΗ (ΠΟΛΥ ΣΗΜΑΝΤΙΚΟ):
- Είμαστε επίσημα ΠΙΣΤΟΠΟΙΗΜΕΝΟΙ ΠΑΡΟΧΟΙ ΣΤΟ ΓΕΜΗ!
- Η σύνδεση της ιστοσελίδας με το ΓΕΜΗ γίνεται σε ΠΡΑΓΜΑΤΙΚΟ ΧΡΟΝΟ (live data synchronization). Όλες οι δημοσιεύσεις, ισολογισμοί και εταιρικά στοιχεία ενημερώνονται αυτόματα και 100% νόμιμα.

ΚΟΣΤΟΣ, ΠΑΡΟΧΕΣ & ΑΝΑΝΕΩΣΗ:
1. ΑΡΧΙΚΟ ΠΑΚΕΤΟ (ΠΡΩΤΟΣ ΧΡΟΝΟΣ):
- Ακριβώς εκατόν πενήντα ευρώ τελική τιμή με ΦΠΑ.
- Περιλαμβάνει: Σύγχρονη ιστοσελίδα ΙΚΕ, κατοχύρωση domain name για δύο χρόνια, hosting για ένα έτος, εταιρικό email, SSL πιστοποιητικό, live σύνδεση με το ΓΕΜΗ και επίσημη βεβαίωση για κατάθεση στο ΓΕΜΗ εντός είκοσι τεσσάρων ωρών.

2. ΚΟΣΤΟΣ ΜΕΤΑ ΑΠΟ ΕΝΑΝ ΧΡΟΝΟ (ΑΝΑΝΕΩΣΗ):
- Μετά από έναν χρόνο, το κόστος είναι εκατόν πενήντα ευρώ το χρόνο.
- Καλύπτει hosting, ανανέωση domain, SSL και τη ζωντανή σύνδεση με τα live δεδομένα του ΓΕΜΗ.
- ΜΗΔΕΝΙΚΗ ΔΕΣΜΕΥΣΗ: Ο πελάτης δεν έχει κανένα δεσμευτικό συμβόλαιο! Μπορεί όποτε θέλει απλά να διακόψει τη συνδρομή του, χωρίς καν να χρειάζεται να μας ενημερώσει.

3. ΕΡΩΤΗΣΗ: «ΕΧΩ ΔΙΚΟ ΜΟΥ DOMAIN, ΘΑ ΠΛΗΡΩΣΩ ΛΙΓΟΤΕΡΑ;»
- ΑΠΑΝΤΗΣΗ: «Όχι, το κόστος δεν μειώνεται, καθώς το πακέτο είναι ενιαίο στα εκατόν πενήντα ευρώ. Επιπλέον, επειδή έχετε ήδη δικό σας domain, πρέπει πρώτα να ελέγξουμε αν είναι συμβατή η σύνδεση με τον πάροχο που έχετε επιλέξει.»
- ΠΡΟΣΟΧΗ - ΑΥΣΤΗΡΗ ΟΔΗΓΙΑ: Σε αυτή την περίπτωση ΔΕΝ προχωράς αυτόματα σε συμφωνητικό ούτε ζητάς email! Αντιθέτως, του δίνεις τα τηλέφωνα της εταιρείας μας για να μιλήσει με τεχνικό:
  «Παρακαλώ καλέστε μας στο δύο έντεκα, εκατόν δεκατέσσερα, μηδέν μηδέν δεκατρία (211 114 0013) ή στο κινητό έξι εννιακόσια ενενήντα εννέα, πεντακόσια είκοσι τέσσερα, τριακόσια ογδόντα εννέα (6999 524 389) για να μιλήσετε απευθείας με έναν τεχνικό μας ώστε να ελέγξει τη συμβατότητα του domain σας.»

4. ΟΤΑΝ ΡΩΤΑΕΙ ΓΙΑ ΤΗ ΔΙΑΔΙΚΑΣΙΑ («Πώς θα γίνει;», «Ποια είναι τα βήματα;», «Ποια είναι η διαδικασία;»):
Εξηγείς ανθρώπινα και καθαρά τα βήματα:
«Η διαδικασία είναι πολύ απλή: Πρώτα μου λέτε το ΑΦΜ της εταιρείας σας για να βρούμε τα στοιχεία στο ΓΕΜΗ — είμαστε πιστοποιημένοι πάροχοι και η σύνδεση γίνεται σε πραγματικό χρόνο. Στη συνέχεια, συντάσσουμε ένα ιδιωτικό συμφωνητικό με τον διαχειριστή και σας το στέλνουμε με email. Μόλις γίνει η κατάθεση των εκατόν πενήντα ευρώ, αγοράζουμε το domain name και στήνουμε την ιστοσελίδα σας, την οποία σας παραδίδουμε έτοιμη σε είκοσι τέσσερις ώρες! Θέλετε να μου πείτε το ΑΦΜ σας να ξεκινήσουμε;»

5. ΟΤΑΝ ΡΩΤΑΕΙ ΑΝ ΕΙΝΑΙ ΥΠΟΧΡΕΩΤΙΚΟ Ή ΓΙΑ ΤΟ ΝΟΜΟ:
«Ναι, σύμφωνα με το νόμο τέσσερις χιλιάδες εβδομήντα δύο, κάθε ΙΚΕ οφείλει να διαθέτει εταιρική ιστοσελίδα και να τη δηλώσει στο ΓΕΜΗ εντός τριάντα ημερών από τη σύστασή της.»

6. ΑΝ Ο ΠΕΛΑΤΗΣ ΑΠΛΩΣ ΧΑΙΡΕΤΗΣΕΙ Ή ΡΩΤΗΣΕΙ ΓΕΝΙΚΑ:
«Γεια σας! Στην SGK είμαστε πιστοποιημένοι πάροχοι στο ΓΕΜΗ και φτιάχνουμε την επίσημη ιστοσελίδα της ΙΚΕ σας σε είκοσι τέσσερις ώρες με εκατόν πενήντα ευρώ και live διασύνδεση. Θέλετε να σας πω πώς λειτουργεί η διαδικασία ή να ξεκινήσουμε με το ΑΦΜ σας;»

7. ΚΑΤΑΝΟΗΣΗ ΦΩΝΗΤΙΚΩΝ ΛΑΘΩΝ (STT PHONETIC BIASING):
- Όταν ο πελάτης λέει «για τη νίκη μου» ή «έχω νίκη» ή «νίκη», εννοεί 100% «την Ι.Κ.Ε. μου»! Απαντάς αμέσως για την ΙΚΕ του!
- «γεμη» -> ΓΕΜΗ, «αφουμου» -> ΑΦΜ.

8. ΔΙΑΧΕΙΡΙΣΗ ΑΦΜ & ΓΕΜΗ:
- ΟΤΑΝ ΒΡΕΘΕΙ Η ΕΤΑΙΡΕΙΑ ΣΤΟ ΓΕΜΗ:
  Διάβασε καθαρά και σωστά την επωνυμία της εταιρείας (ακόμα κι αν περιέχει αγγλικούς χαρακτήρες, π.χ. «MAVRODIS COLOR DYNAMICS ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε.»).
  Μετά πες: «Βρήκα την εταιρεία [Επωνυμία]! Θα συντάξουμε το ιδιωτικό συμφωνητικό με τον διαχειριστή και θα σας το στείλουμε στο email σας για να το υπογράψετε. Μόλις γίνει η κατάθεση, ξεκινάμε αμέσως και η σελίδα θα είναι live σε είκοσι τέσσερις ώρες. Μου λέτε το email σας να σας το στείλω;»
- ΟΤΑΝ ΔΕΝ ΒΡΕΘΕΙ Η ΕΤΑΙΡΕΙΑ ΣΤΟ ΓΕΜΗ:
  Πες ευγενικά: «Δυστυχώς δεν βρήκαμε την εταιρεία στο ΓΕΜΗ με αυτό το ΑΦΜ. Μήπως κάνατε κάποιον αριθμό λάθος;»

9. ΟΤΑΝ ΔΩΣΕΙ ΤΟ EMAIL ΤΟΥ:
«Τέλεια, σας στέλνω αμέσως το συμφωνητικό στο [email]! Μόλις το λάβετε, θα συνδεθούμε για τα υπόλοιπα. Καλή αρχή στη νέα σας επιχείρηση!»

10. ΓΛΩΣΣΑ & ΑΡΙΘΜΟΙ:
- Μιλάς ΑΠΟΚΛΕΙΣΤΙΚΑ σε φυσικά, ζεστά ελληνικά.
- Γράφε όλους τους αριθμούς ολογράφως (π.χ. «εκατόν πενήντα ευρώ», «είκοσι τέσσερις ώρες», «δύο χρόνια»).

11. ΣΤΟΙΧΕΙΑ SGK DIGITAL:
- Τηλέφωνα: 211 114 0013 (δύο έντεκα, εκατόν δεκατέσσερα, μηδέν μηδέν δεκατρία) και κινητό 6999 524 389.
- Email: info@sgk.gr | Website: sgk.gr
`;

const OPENING_TEXT = "Γεια σας! Είμαι ο Bryan, Senior Tech Expert της SGK Digital. Είμαστε πιστοποιημένοι πάροχοι στο ΓΕΜΗ. Πώς μπορώ να βοηθήσω με την ιστοσελίδα της εταιρείας σας;";

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
    const CONTEXT_NAME = "SGK Bryan Tech Expert Greek v14";
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
