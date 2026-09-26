import { NextResponse } from "next/server";

const LIVEAVATAR_API_KEY = process.env.LIVEAVATAR_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const IKE_SPECIALIST_CONTEXT = `
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
- Τελική Τιμή: Μόνο 150€ (συμπεριλαμβανομένου ΦΠΑ, εφάπαξ).
- Χρόνος Παράδοσης: Εντός 24 ωρών!
- Τι περιλαμβάνει:
  * Πλήρης κατασκευή μοντέρνου εταιρικού site προσαρμοσμένου στις ανάγκες της ΙΚΕ.
  * Ειδική υποσελίδα για Δημοσίευση Ισολογισμών & Οικονομικών Καταστάσεων.
  * Καταχώρηση όλων των υποχρεωτικών στοιχείων (ΓΕΜΗ, ΑΦΜ, Κεφάλαιο, Διαχειριστές).
  * Ελληνικό Domain name (.gr) για 2 έτη.
  * Φιλοξενία (Hosting) υψηλής ταχύτητας για 1 έτος.
  * Πιστοποιητικό Ασφαλείας SSL.
  * Επαγγελματικό Email της εταιρείας.
  * Έτοιμο link & βεβαίωση για άμεση δήλωση στο ΓΕΜΗ / Λογιστή.
- Ζωντανό δείγμα πραγματικού πελάτη: https://www.hightravel.gr/ike

3. ΣΤΟΙΧΕΙΑ ΕΠΙΚΟΙΝΩΝΙΑΣ SGK DIGITAL:
- Τηλέφωνο: 210 300 9544
- Website: https://www.sgk.gr / https://www.sgk.gr/ike-offer
- Email: support@sgk.gr

4. ΤΡΟΠΟΣ ΟΜΙΛΙΑΣ & ΚΑΝΟΝΕΣ:
- Απαντάς σύντομα, ευγενικά και κατανοητά (2-3 προτάσεις τη φορά), χωρίς μακροσκελείς μονολόγους.
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
    const CONTEXT_NAME = "SGK IKE Specialist Support v3";
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
        avatar_persona: {
            voice_id: "254ffe1e-c89f-430f-8c36-9e7611d310c0",
            context_id: contextId
        }
    });
    return {
        sessionToken: res.data?.session_token,
        sessionId: res.data?.session_id
    };
}

async function createEmbed(contextId: string): Promise<string> {
    const res = await laFetch("/v2/embeddings", "POST", {
        avatar_id: "7299c55d-1f45-482d-915c-e5efdc9dd266", // Elenora Coach
        context_id: contextId,
        voice_id: "254ffe1e-c89f-430f-8c36-9e7611d310c0",  // Elenora - Professional
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
