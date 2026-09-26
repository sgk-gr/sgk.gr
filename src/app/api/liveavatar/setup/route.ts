import { NextResponse } from "next/server";

const LIVEAVATAR_API_KEY = process.env.LIVEAVATAR_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const PRODUCTS_CONTEXT = `
You are a helpful and polite virtual assistant for SGK Digital and customer support.
You MUST converse in GREEK (Ελληνικά) unless the user speaks in English.

Your capabilities:
- You represent SGK Digital (https://www.sgk.gr), the leading agency in Greece for Custom AI Agents, Voice AI, E-shop development, and Business Automations.
- You can answer questions about AI agents, costs, implementations, and ERP integrations (Softone, Entersoft).
- Keep your answers friendly, natural, professional, and concise.
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
    const CONTEXT_NAME = "SGK Live Support";
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
        prompt: PRODUCTS_CONTEXT,
        opening_text: "Γεια σας! Είμαι η AI ψηφιακή εκπρόσωπος της SGK Digital. Πώς μπορώ να σας εξυπηρετήσω σήμερα;"
    });
    return created.data.id;
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
        const embedUrl = await createEmbed(contextId);

        return NextResponse.json({
            success: true,
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
