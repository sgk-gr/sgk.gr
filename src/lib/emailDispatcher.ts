/**
 * Unified Email Dispatcher with Automatic Multi-Provider Fallback.
 * 
 * Order of execution:
 * 1. Resend (via Supabase Edge Function 'send-nurture-email' or direct RESEND_API_KEY)
 * 2. Brevo (Sendinblue) API v3 (Direct API call with BREVO_API_KEY)
 * 
 * This ensures that if Resend hits the 100/day limit, emails continue to flow
 * seamlessly via Brevo (300/day limit) without manual intervention or data loss.
 */

export interface EmailDispatchOptions {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  unsubscribeToken?: string;
  firstEmailSubject?: string;
  firstEmailBody?: string;
  step?: number;
}

export interface EmailDispatchResult {
  success: boolean;
  provider: "resend" | "brevo";
  messageId?: string;
  error?: string;
}

/**
 * Send an email directly via Brevo API v3
 */
export async function sendEmailViaBrevo(opts: {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  apiKey?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = opts.apiKey || process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { success: false, error: "BREVO_API_KEY is not defined in environment variables" };
  }
  const fromName = opts.fromName || "SGK Digital";
  const fromEmail = opts.fromEmail || "info@sgk.gr";
  const replyTo = opts.replyTo || "info@sgk.gr";

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: fromName, email: fromEmail },
        to: [{ email: opts.to.toLowerCase().trim() }],
        replyTo: { email: replyTo, name: fromName },
        subject: opts.subject,
        htmlContent: opts.html,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 201 || res.status === 200) {
      return { success: true, messageId: data.messageId };
    }

    const errMsg = data.message || data.error || `Brevo HTTP ${res.status}`;
    return { success: false, error: errMsg };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to reach Brevo API" };
  }
}

/**
 * Dispatches an email trying Resend first (via Supabase Edge Function).
 * If Resend fails or hits daily rate limits, automatically falls back to Brevo.
 */
export async function dispatchEmailWithFallback(
  opts: EmailDispatchOptions,
  supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseServiceKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
): Promise<EmailDispatchResult> {
  const cleanEmail = opts.to.toLowerCase().trim();

  // 1. Try Resend via Supabase Edge Function (if Supabase credentials are present)
  let edgeFnError = "";
  if (supabaseUrl && supabaseServiceKey) {
    try {
      const edgeResponse = await fetch(`${supabaseUrl}/functions/v1/send-nurture-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        email: cleanEmail,
        unsubscribe_token: opts.unsubscribeToken,
        customSubject: opts.subject,
        customHtml: opts.html,
        firstEmailSubject: opts.firstEmailSubject,
        firstEmailBody: opts.firstEmailBody,
        step: opts.step || 1,
      }),
    });

    if (edgeResponse.ok) {
      return { success: true, provider: "resend" };
    }

    const errText = await edgeResponse.text();
    edgeFnError = errText;
    console.warn(`[dispatchEmailWithFallback] Resend/EdgeFunction failed for ${cleanEmail}: ${errText}. Falling back to Brevo...`);
  } catch (e: any) {
    edgeFnError = e.message;
    console.warn(`[dispatchEmailWithFallback] Resend fetch exception for ${cleanEmail}: ${e.message}. Falling back to Brevo...`);
  }
  }

  // 2. Fallback to Brevo
  const brevoResult = await sendEmailViaBrevo({
    to: cleanEmail,
    subject: opts.subject,
    html: opts.html,
    fromName: opts.fromName || "SGK Digital",
    fromEmail: opts.fromEmail || "info@sgk.gr",
    replyTo: opts.replyTo || "info@sgk.gr",
  });

  if (brevoResult.success) {
    console.log(`[dispatchEmailWithFallback] Successfully delivered to ${cleanEmail} via Brevo fallback!`);
    return {
      success: true,
      provider: "brevo",
      messageId: brevoResult.messageId,
    };
  }

  // Both providers failed
  return {
    success: false,
    provider: "brevo",
    error: `Resend failed (${edgeFnError}) and Brevo fallback failed (${brevoResult.error})`,
  };
}
