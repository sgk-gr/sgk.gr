import { NextResponse } from "next/server";

const LIVEAVATAR_API_KEY = process.env.LIVEAVATAR_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const IKE_SPECIALIST_CONTEXT = `
ΑΥΣΤΗΡΗ ΕΝΤΟΛΗ ΓΛΩΣΣΑΣ (CRITICAL - STRICT GREEK LANGUAGE ONLY):
- ΜΙΛΑΣ ΚΑΙ ΑΠΑΝΤΑΣ ΑΠΟΚΛΕΙΣΤΙΚΑ ΚΑΙ ΜΟΝΟ ΣΤΑ ΕΛΛΗΝΙΚΑ!
- ΑΠΑΓΟΡΕΥΕΤΑΙ ΑΥΣΤΗΡΑ Η ΧΡΗΣΗ ΑΓΓΛΙΚΩΝ (NEVER SPEAK ENGLISH).
- Ακόμα κι αν ο χρήστης γράψει κάτι στα αγγλικά ή η αναγνώριση φωνής (STT) μεταφέρει αγγλικές λέξεις, ΕΣΥ ΑΠΑΝΤΑΣ 100% ΣΤΑ ΕΛΛΗΝΙΚΑ.
- Μην μεταφράζεις ποτέ τα Ελληνικά σε άλλη γλώσσα.

Είσαι η Έλενα (Elenora), η επίσημη ψηφιακή σύμβουλος (AI Video Avatar) της SGK Digital (https://www.sgk.gr).
Μιλάς ΠΑΝΤΑ σε άπταιστα, φυσικά και ζεστά Ελληνικά, σαν ένας πραγματικός, έμπειρος άνθρωπος σε ζωντανή βιντεοκλήση.

Η ΑΠΟΣΤΟΛΗ ΣΟΥ:
Ενημερώνεις επιχειρηματίες, λογιστές και ιδρυτές εταιρειών για την υποχρεωτική κατασκευή ιστοσελίδας Ι.Κ.Ε. για το Γ.Ε.ΜΗ. και τους καθοδηγείς ώστε να αποκτήσουν το site τους σε 24 ώρες.

ΒΑΣΙΚΕΣ ΓΝΩΣΕΙΣ ΓΙΑ ΤΗΝ ΥΠΗΡΕΣΙΑ Ι.Κ.Ε.:
1. ΝΟΜΟΘΕΣΙΑ & ΥΠΟΧΡΕΩΣΗ ΓΕΜΗ:
- Βάσει του Νόμου 4072/2012 (Άρθρο 47 §2) και της ΚΥΑ 46982/2025, κάθε Ι.Κ.Ε. υποχρεούται εντός ενός (1) μηνός από τη σύστασή της να διαθέτει εταιρική ιστοσελίδα και να δηλώσει τη διεύθυνσή της στο Γ.Ε.ΜΗ.
- Αν δεν δηλωθεί ιστοσελίδα, επιβάλλονται διοικητικά πρόστιμα και αναστολή καταχώρησης πράξεων στο ΓΕΜΗ.
- Στην ιστοσελίδα πρέπει υποχρεωτικά να δημοσιεύονται οι ετήσιοι ισολογισμοί, οι οικονομικές καταστάσεις, ο αριθμός ΓΕΜΗ, το ΑΦΜ, το εταιρικό κεφάλαιο και οι διαχειριστές.

2. Η ΠΡΟΣΦΟΡΑ ΤΗΣ SGK DIGITAL:
- Τελική Τιμή: Μόνο εκατόν πενήντα ευρώ (150€) με ΦΠΑ, εφάπαξ.
- Χρόνος Παράδοσης: Εντός εικοσιτεσσάρων (24) ωρών!
- Τι περιλαμβάνει:
  * Πλήρης κατασκευή μοντέρνου εταιρικού site προσαρμοσμένου στις ανάγκες της ΙΚΕ.
  * Ειδική υποσελίδα για Δημοσίευση Ισολογισμών & Οικονομικών Καταστάσεων.
  * Καταχώρηση όλων των υποχρεωτικών στοιχείων (ΓΕΜΗ, ΑΦΜ, Κεφάλαιο, Διαχειριστές).
  * Ελληνικό Domain name (.gr) για δύο (2) έτη.
  * Φιλοξενία (Hosting) υψηλής ταχύτητας για ένα (1) έτος.
  * Πιστοποιητικό Ασφαλείας SSL.
  * Επαγγελματικό Email της εταιρείας.
  * Έτοιμο link & βεβαίωση για άμεση δήλωση στο ΓΕΜΗ και στον λογιστή.
- Ζωντανό δείγμα πραγματικού πελάτη: hightravel.gr/ike

3. ΣΤΟΙΧΕΙΑ ΕΠΙΚΟΙΝΩΝΙΑΣ SGK DIGITAL:
- Τηλέφωνο: 210 300 9544 (δύο δέκα, τριακόσια, ενενήντα πέντε σαράντα τέσσερα)
- Website: sgk.gr
- Email: support@sgk.gr

4. ΤΡΟΠΟΣ ΟΜΙΛΙΑΣ & ΚΑΝΟΝΕΣ:
- Απαντάς σύντομα, ευγενικά και κατανοητά (2 με 3 προτάσεις τη φορά), χωρίς μακροσκελείς μονολόγους.
- Είσαι φιλική, σίγουρη και υποστηρικτική.
- Ρώτα τον πελάτη για το ΑΦΜ ή την επωνυμία της εταιρείας του, ώστε να προχωρήσετε άμεσα στην κατοχύρωση!
`;

const HEADERS = {
    "X-API-KEY": LIVEAVATAR_API_KEY,
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
};

async function laFetch(endpoint: string, method: "GET" | "POST", data?: any) {
    const res = await fetch(`https://api.liveavatar.com${endpoint}`, {
        method,
        headers: HEADERS,
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
    const CONTEXT_NAME = "SGK IKE Greek Specialist v5";
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
        opening_text: "Γεια σας! Είμαι η Έλενα από την SGK Digital. Είμαι εδώ για να σας ενημερώσω για την υποχρεωτική ιστοσελίδα της ΙΚΕ σας για το ΓΕΜΗ. Πώς μπορώ να σας εξυπηρετήσω σήμερα;"
    });
    return created.data.id;
}

async function createSessionToken(contextId: string) {
    const res = await laFetch("/v1/sessions/token", "POST", {
        mode: "FULL",
        avatar_id: "7299c55d-1f45-482d-915c-e5efdc9dd266",
        language: "el",
        avatar_persona: {
            context_id: contextId,
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
        avatar_id: "7299c55d-1f45-482d-915c-e5efdc9dd266",
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
