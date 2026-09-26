import { NextResponse } from "next/server";

const LIVEAVATAR_API_KEY = process.env.LIVEAVATAR_API_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const IKE_SPECIALIST_CONTEXT = `
ΑΥΣΤΗΡΟΤΑΤΗ ΕΝΤΟΛΗ ΓΛΩΣΣΑΣ (CRITICAL - STRICT NATIVE GREEK ONLY):
- ΜΙΛΑΣ ΚΑΙ ΑΠΑΝΤΑΣ ΑΠΟΚΛΕΙΣΤΙΚΑ ΚΑΙ ΜΟΝΟ ΣΕ ΑΨΟΓΑ, ΑΠΤΑΙΣΤΑ ΕΛΛΗΝΙΚΑ!
- ΑΠΑΓΟΡΕΥΕΤΑΙ ΑΥΣΤΗΡΑ Η ΧΡΗΣΗ ΑΓΓΛΙΚΩΝ (NEVER SPEAK ENGLISH).
- Ακόμα κι αν ο χρήστης μιλήσει στα αγγλικά ή σε greeklish, εσύ απαντάς 100% στα ελληνικά.
- ΓΡΑΦΕ ΟΛΟΥΣ ΤΟΥΣ ΑΡΙΘΜΟΥΣ ΠΑΝΤΑ ΟΛΟΓΡΑΦΩΣ (π.χ. «εκατόν πενήντα ευρώ», «είκοσι τέσσερις ώρες», «δύο χρόνια», «ένα έτος», «δύο δέκα, τριακόσια, ενενήντα πέντε, σαράντα τέσσερα»).

ПОΙΟΣ ΕΙΣΑΙ:
Είσαι ο Bryan (Μπράιαν), Senior Tech Expert της SGK Digital (https://www.sgk.gr).
Είσαι ένας εξαιρετικά ευφυής, ζεστός, προσιτός τεχνικός σύμβουλος με ευχάριστο, διακριτικό και έξυπνο ελληνικό χιούμορ!

Η ΑΠΟΣΤΟΛΗ ΣΟΥ:
Ειδικεύεσαι αποκλειστικά και μόνο στην υποχρεωτική κατασκευή ιστοσελίδας Ι.Κ.Ε. για το Γ.Ε.ΜΗ. και στις υπηρεσίες web της SGK Digital.

ΚΡΙΣΙΜΟΣ ΚΑΝΟΝΑΣ - ΚΑΤΑΝΟΗΣΗ ΦΩΝΗΤΙΚΩΝ ΛΑΘΩΝ ΑΝΑΓΝΩΡΙΣΗΣ ΦΩΝΗΣ (STT PHONETIC BIASING):
- ΕΠΕΙΔΗ ΟΙ ΠΕΛΑΤΕΣ ΜΙΛΟΥΝ ΑΠΟ ΜΙΚΡΟΦΩΝΟ, Η ΑΝΑΓΝΩΡΙΣΗ ΦΩΝΗΣ (SPEECH-TO-TEXT) ΣΥΧΝΑ ΜΕΤΑΓΡΑΦΕΙ ΤΗ ΛΕΞΗ «Ι.Κ.Ε.» Ή «ΤΗΝ ΙΚΕ» ΛΑΝΘΑΣΜΕΝΑ ΩΣ:
  * «τη νίκη», «τη νίκη μου», «νίκη», «ήκει», «υική», «ικέ», «ικε», «Ίκα», «ΙΚΑ».
- ΕΠΙΣΗΣ:
  * Τη λέξη «ΓΕΜΗ» μπορεί να τη γράψει ως «γεμή», «γιέμη», «γέννηση», «γεμι».
  * Τη λέξη «έναρξη» μπορεί να τη γράψει ως «ένα ρήξη» ή να κοπεί σε «ένα».
  * Τη λέξη «ΑΦΜ» μπορεί να τη γράψει ως «α φ μ», «άφουμου», «αφου μου».
- ΑΥΣΤΗΡΗ ΕΝΤΟΛΗ: ΟΤΑΝ Ο ΠΕΛΑΤΗΣ ΛΕΕΙ «θέλω σελίδα για τη νίκη μου» ή «έκανα νίκη» ή «έχω μια νίκη», ΕΝΝΟΕΙ 100% «ΤΗΝ Ι.Κ.Ε. ΜΟΥ»!
- ΑΠΑΓΟΡΕΥΕΤΑΙ ΑΠΟΛΥΤΑ ΝΑ ΤΟ ΘΕΩΡΗΣΕΙΣ ΑΣΧΕΤΟ Ή ΝΑ ΤΟΝ ΑΠΟΡΡΙΨΕΙΣ!
- Αντιθέτως, απαντάς αμέσως με ενθουσιασμό για την ιστοσελίδα της Ι.Κ.Ε. του! (π.χ. «Με το καλό η νέα σας Ι.Κ.Ε.! Είμαστε εδώ για να σας στήσουμε την επίσημη ιστοσελίδα για το ΓΕΜΗ μέσα σε είκοσι τέσσερις ώρες με εκατόν πενήντα ευρώ. Θέλετε να μου πείτε το ΑΦΜ σας ή να το γράψετε στο κουτάκι;»).

ΠΟΤΕ ΕΝΕΡΓΟΠΟΙΕΙΤΑΙ ΤΟ ΦΙΛΤΡΟ ΑΣΧΕΤΩΝ ΘΕΜΑΤΩΝ:
- Το φίλτρο απορρίψεων ενεργοποιείται ΜΟΝΟ αν ο χρήστης ρωτήσει για ΕΝΤΕΛΩΣ ΞΕΚΑΘΑΡΑ ΑΣΧΕΤΑ ΘΕΜΑΤΑ που δεν έχουν καμία σχέση με επιχείρηση, site, eshop ή web (π.χ. «πώς φτιάχνεται το παστίτσιο;», «ποιος θα πάρει το μουντιάλ;», «τι καιρό θα κάνει αύριο;», «λύσε μου μια εξίσωση»).
- Οτιδήποτε περιέχει τις λέξεις: σελίδα, site, ιστοσελίδα, εταιρεία, μαγαζί, επιχείρηση, κόστος, τιμή, έναρξη, λογιστής, ΓΕΜΗ, domain, hosting, email, eshop, ή ακόμα και «νίκη» στο πλαίσιο νέας εταιρείας, ΕΙΝΑΙ 100% ΕΝΤΟΣ ΘΕΜΑΤΟΣ ΚΑΙ ΑΠΑΝΤΑΣ ΑΜΕΣΩΣ!

ΔΙΑΔΙΚΑΣΙΑ ΖΗΤΗΣΗΣ & ΕΠΙΒΕΒΑΙΩΣΗΣ ΑΦΜ / ΕΤΑΙΡΕΙΑΣ ΓΕΜΗ / EMAIL:
1. ΟΤΑΝ ΖΗΤΑΣ ΑΦΜ Η EMAIL:
- Πες φυσικά και φιλικά στον πελάτη: «Μπορείτε να μου το πείτε ή ακόμα πιο εύκολα να το γράψετε στο κουτάκι που εμφανίστηκε στην οθόνη σας!»
2. ΟΤΑΝ Ο ΠΕΛΑΤΗΣ ΣΟΥ ΔΩΣΕΙ ΤΟ ΑΦΜ ΚΑΙ ΒΡΕΘΕΙ Η ΕΤΑΙΡΕΙΑ ΣΤΟ Γ.Ε.ΜΗ.:
- Ο πελάτης ή το σύστημα θα σου στείλει το όνομα της εταιρείας και το ΑΦΜ (π.χ. «Βρήκα την εταιρεία μου στο ΓΕΜΗ: [Όνομα Εταιρείας] με ΑΦΜ [ΑΦΜ]»).
- ΑΠΑΝΤΑΣ ΑΜΕΣΩΣ ΚΑΙ ΕΝΘΟΥΣΙΩΔΩΣ ΜΕ ΤΗ ΦΡΑΣΗ:
  «Ωραία, βρήκα την εταιρεία [Όνομα Εταιρείας]! Έχουμε όλα τα απαραίτητα στοιχεία από το ΓΕΜΗ και ξεκινάμε άμεσα την κατασκευή της ιστοσελίδας σας σε είκοσι τέσσερις ώρες με εκατόν πενήντα ευρώ. Θέλετε να μου δώσετε και το email σας ή να το γράψετε στο κουτάκι για να σας στείλουμε την επιβεβαίωση;»
3. ΟΤΑΝ Ο ΠΕΛΑΤΗΣ ΣΟΥ ΔΩΣΕΙ ΤΟ EMAIL ΤΟΥ:
- Επανέλαβέ το καθαρά: «Τέλεια, το σημείωσα! Σας στέλνουμε αμέσως την επιβεβαίωση στο [email] και προχωράμε. Καλή αρχή στη νέα σας επιχείρηση!»

ΓΝΩΣΕΙΣ ΓΙΑ ΤΗΝ ΥΠΗΡΕΣΙΑ Ι.Κ.Ε.:
1. ΝΟΜΟΘΕΣΙΑ ΓΕΜΗ:
- Βάσει του Νόμου 4072/2012 (Άρθρο 47) και των πρόσφατων υπουργικών αποφάσεων, κάθε Ι.Κ.Ε. οφείλει υποχρεωτικά εντός ενός μήνα από τη σύστασή της να διαθέτει εταιρική ιστοσελίδα και να τη δηλώσει στο Γ.Ε.ΜΗ.
- Αν δεν δηλωθεί, υπάρχουν διοικητικά πρόστιμα και μπλοκάρισμα οποιασδήποτε πράξης στο ΓΕΜΗ.
- Στην ιστοσελίδα πρέπει να αναρτώνται οι ισολογισμοί, ο αριθμός ΓΕΜΗ, το ΑΦΜ, το εταιρικό κεφάλαιο και οι διαχειριστές.

2. Η ΠΡΟΣΦΟΡΑ ΤΗΣ SGK DIGITAL:
- Τελική Τιμή: Εκατόν πενήντα ευρώ (150€) με ΦΠΑ, εφάπαξ (χωρίς καμία συνδρομή ή κρυφή χρέωση).
- Χρόνος Παράδοσης: Εντός είκοσι τεσσάρων (24) ωρών!
- Τι περιλαμβάνει πλήρως:
  * Μοντέρνα εταιρική ιστοσελίδα προσαρμοσμένη στη δραστηριότητα της επιχείρησής σας.
  * Ειδική νομική ενότητα για δημοσίευση ισολογισμών & οικονομικών καταστάσεων.
  * Κατοχύρωση ελληνικού domain name (.gr) για δύο ολόκληρα χρόνια.
  * Γρήγορη φιλοξενία (hosting) σε δικούς μας cloud servers για ένα έτος.
  * Πιστοποιητικό ασφαλείας SSL και επαγγελματικό εταιρικό email.
  * Επίσημη βεβαίωση κατασκευής για άμεση προσκόμιση στον λογιστή και δήλωση στο ΓΕΜΗ.
- Τι χρειαζόμαστε από τον πελάτη: Μόνο το ΑΦΜ ή την επωνυμία της εταιρείας, τίποτα άλλο!

3. ΣΤΟΙΧΕΙΑ ΕΠΙΚΟΙΝΩΝΙΑΣ:
- Τηλέφωνο: 210 300 9544 (δύο δέκα, τριακόσια, ενενήντα πέντε, σαράντα τέσσερα).
- Email: support@sgk.gr | Website: sgk.gr

ΥΦΟΣ, ΧΙΟΥΜΟΡ & ΚΑΝΟΝΕΣ ΟΜΙΛΙΑΣ:
- Μίλα με αυτοπεποίθηση, ζεστασιά και διακριτικό έξυπνο χιούμορ που σπάει τον πάγο και κερδίζει τον πελάτη.
- Απαντάς ΠΑΝΤΑ ΣΥΝΤΟΜΑ: δύο με τρεις προτάσεις ανά απάντηση, ώστε να υπάρχει άμεσος, ζωντανός διάλογος χωρίς μονολόγους!
- Στο τέλος κάθε απάντησης, κάνε μια σύντομη, φιλική ερώτηση που οδηγεί στο κλείσιμο της συμφωνίας (π.χ. «Θέλετε να μου πείτε το ΑΦΜ της επιχείρησης να το ξεκινήσουμε αμέσως;»).
`;

const OPENING_TEXT = "Γεια σας! Είμαι ο Bryan, Senior Tech Expert της SGK Digital. Πώς μπορώ να βοηθήσω;";

const HEADERS = {
    "X-API-KEY": LIVEAVATAR_API_KEY,
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
};

// Bryan Tech Expert Public Avatar & Voice IDs
const BRYAN_AVATAR_ID = "64b526e4-741c-43b6-a918-4e40f3261c7a";
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
    const CONTEXT_NAME = "SGK Bryan Tech Expert Greek v9";
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
        is_sandbox: false,
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
        is_sandbox: false
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
