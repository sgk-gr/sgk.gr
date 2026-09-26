import { NextResponse } from "next/server";

const LIVEAVATAR_API_KEY = process.env.LIVEAVATAR_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const IKE_SPECIALIST_CONTEXT = `
ΑΥΣΤΗΡΟΤΑΤΗ ΕΝΤΟΛΗ ΓΛΩΣΣΑΣ (CRITICAL - STRICT NATIVE GREEK ONLY):
- ΜΙΛΑΣ ΚΑΙ ΑΠΑΝΤΑΣ ΑΠΟΚΛΕΙΣΤΙΚΑ ΚΑΙ ΜΟΝΟ ΣΕ ΑΨΟΓΑ, ΑΠΤΑΙΣΤΑ ΕΛΛΗΝΙΚΑ!
- ΑΠΑΓΟΡΕΥΕΤΑΙ ΑΥΣΤΗΡΑ Η ΧΡΗΣΗ ΑΓΓΛΙΚΩΝ (NEVER SPEAK ENGLISH).
- Ακόμα κι αν ο χρήστης γράψει ή πει κάτι στα αγγλικά ή σε greeklish ή η αναγνώριση φωνής μεταφέρει λέξεις όπως "hi" ή "hello", ΕΣΥ ΑΠΑΝΤΑΣ 100% ΣΤΑ ΕΛΛΗΝΙΚΑ με φυσικό, ζεστό και ευγενικό τρόπο.
- Μην χρησιμοποιείς ξένες λέξεις. Μιλάς καθαρά, φυσικά και με τέλεια ελληνική ροή.

ПОΙΟΣ ΕΙΣΑΙ:
Είσαι ο Bryan (Μπράιαν), Senior Tech Expert και επικεφαλής τεχνικός σύμβουλος της SGK Digital (https://www.sgk.gr).
Μιλάς με τη σιγουριά, την ευγένεια και την καθαρότητα ενός κορυφαίου Έλληνα τεχνικού συμβούλου σε ζωντανή βιντεοκλήση.

Η ΑΠΟΣΤΟΛΗ ΣΟΥ:
Ενημερώνεις επιχειρηματίες, λογιστές και ιδρυτές εταιρειών για την υποχρεωτική κατασκευή ιστοσελίδας Ι.Κ.Ε. για το Γ.Ε.ΜΗ. και τους καθοδηγείς ώστε να αποκτήσουν το site τους σε είκοσι τέσσερις ώρες.

ΒΑΣΙΚΕΣ ΓΝΩΣΕΙΣ ΓΙΑ ΤΗΝ ΥΠΗΡΕΣΙΑ Ι.Κ.Ε.:
1. ΝΟΜΟΘΕΣΙΑ & ΥΠΟΧΡΕΩΣΗ ΓΕΜΗ:
- Βάσει του Νόμου 4072/2012 (Άρθρο 47) και της υπουργικής απόφασης του 2025, κάθε Ι.Κ.Ε. οφείλει υποχρεωτικά εντός ενός μήνα από τη σύστασή της να διαθέτει εταιρική ιστοσελίδα και να τη δηλώσει στο Γ.Ε.ΜΗ.
- Αν δεν δηλωθεί, υπάρχουν διοικητικά πρόστιμα και μπλοκάρισμα πράξεων στο ΓΕΜΗ.
- Στο site δημοσιεύονται οι ισολογισμοί, ο αριθμός ΓΕΜΗ, το ΑΦΜ, το εταιρικό κεφάλαιο και τα ονόματα των διαχειριστών.

2. Η ΠΡΟΣΦΟΡΑ ΤΗΣ SGK DIGITAL:
- Τιμή: Μόνο εκατόν πενήντα ευρώ (150€) τελική τιμή με ΦΠΑ, εφάπαξ (χωρίς καμία άλλη κρυφή χρέωση).
- Χρόνος Παράδοσης: Εντός είκοσι τεσσάρων (24) ωρών!
- Τι περιλαμβάνει πλήρως:
  * Μοντέρνα εταιρική ιστοσελίδα προσαρμοσμένη στην εταιρεία σας.
  * Ειδική ενότητα για δημοσίευση ισολογισμών & οικονομικών καταστάσεων.
  * Κατοχύρωση ελληνικού domain name (.gr) για δύο ολόκληρα χρόνια.
  * Γρήγορη φιλοξενία σε δικούς μας servers για ένα έτος.
  * Πιστοποιητικό ασφαλείας SSL και εταιρικό email.
  * Βεβαίωση κατασκευής για άμεση προσκόμιση στο λογιστή και στο ΓΕΜΗ.
- Πραγματικό παράδειγμα πελάτη μας: hightravel.gr/ike

3. ΣΤΟΙΧΕΙΑ ΕΠΙΚΟΙΝΩΝΙΑΣ:
- Τηλέφωνο: 210 300 9544 (δύο δέκα, τριακόσια, ενενήντα πέντε, σαράντα τέσσερα).
- Email: support@sgk.gr | Website: sgk.gr

ΚΑΝΟΝΕΣ ΟΜΙΛΙΑΣ & ΠΡΟΦΟΡΑΣ (ΓΙΑ ΑΨΟΓΟ ΦΥΣΙΚΟ ΗΧΟ):
- Γράφε όλους τους αριθμούς ΟΛΟΓΡΑΦΩΣ (π.χ. «εκατόν πενήντα ευρώ», «είκοσι τέσσερις ώρες», «δύο χρόνια», «ένα έτος»).
- Μίλα με σύντομες, μεστές προτάσεις (δύο με τρεις προτάσεις ανά απάντηση).
- Μην κάνεις μονολόγους. Μετά την εξήγηση, ρώτησε ευγενικά τον πελάτη για το ΑΦΜ ή την επωνυμία της εταιρείας του για να ξεκινήσετε άμεσα!
`;

const HEADERS = {
    "X-API-KEY": LIVEAVATAR_API_KEY,
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
};

// Bryan Tech Expert Public Avatar & Voice IDs
const BRYAN_AVATAR_ID = "64b526e4-741c-43b6-a918-4e40f3261c7a";
const BRYAN_VOICE_ID = "9c8b542a-bf5c-4f4c-9011-75c79a274387";

async function laFetch(endpoint: string, method: "GET" | "POST", data?: any) {
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
    const SECRET_NAME = "Gemini API Key for SGK Avatar";
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
        secret_type: "GEMINI_API_KEY",
        secret_value: GEMINI_API_KEY,
        secret_name: SECRET_NAME
    });
    return created.data.id;
}

async function getOrCreateLlmConfig(secretId: string): Promise<string> {
    const LLM_NAME = "Gemini SGK LLM";
    try {
        const existing = await laFetch("/v1/llm-configurations", "GET");
        const items = existing?.data || [];
        if (Array.isArray(items)) {
            const found = items.find((item: any) => item.display_name === LLM_NAME && item.model_name === "gemini-2.5-flash");
            if (found) return found.id;
        }
    } catch (e) {
        // Continue to create
    }

    const created = await laFetch("/v1/llm-configurations", "POST", {
        display_name: LLM_NAME,
        model_name: "gemini-2.5-flash",
        secret_id: secretId,
        base_url: "https://generativelanguage.googleapis.com/v1beta/openai"
    });
    return created.data.id;
}

async function getOrCreateContext(): Promise<string> {
    const CONTEXT_NAME = "SGK Bryan Tech Expert Greek v8";
    try {
        const existing = await laFetch("/v1/contexts", "GET");
        const items = existing?.data?.results || [];
        if (Array.isArray(items)) {
            const found = items.find((item: any) => item.name === CONTEXT_NAME);
            if (found) return found.id;
        }
    } catch (e) {
        // Continue to create
    }

    const created = await laFetch("/v1/contexts", "POST", {
        name: CONTEXT_NAME,
        prompt: IKE_SPECIALIST_CONTEXT,
        opening_text: "Γεια σας! Είμαι ο Bryan, Senior Tech Expert της SGK Digital. Είμαι εδώ για να σας ενημερώσω σχετικά με την υποχρεωτική ιστοσελίδα της Ι.Κ.Ε. σας για το Γ.Ε.ΜΗ., έτοιμη σε μόλις είκοσι τέσσερις ώρες με εκατόν πενήντα ευρώ. Πώς μπορώ να σας εξυπηρετήσω σήμερα;"
    });
    return created.data.id;
}

async function createSessionToken(contextId: string) {
    const res = await laFetch("/v1/sessions/token", "POST", {
        mode: "FULL",
        avatar_id: BRYAN_AVATAR_ID,
        is_sandbox: false,
        language: "el",
        avatar_persona: {
            context_id: contextId,
            voice_id: BRYAN_VOICE_ID,
            language: "el"
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
        if (!LIVEAVATAR_API_KEY || !GEMINI_API_KEY) {
            return NextResponse.json({ 
                success: false, 
                error: "Missing LIVEAVATAR_API_KEY or GEMINI_API_KEY environment variables." 
            }, { status: 400 });
        }

        const secretId = await getOrCreateSecret();
        await getOrCreateLlmConfig(secretId);
        const contextId = await getOrCreateContext();
        
        // Generate both SDK session token and embed URL
        const [sessionData, embedUrl] = await Promise.all([
            createSessionToken(contextId).catch(err => {
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
