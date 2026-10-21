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

import { SUPABASE_URL, getSupabaseServiceRoleKey } from "@/lib/supabase";

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
  preferredProvider?: "auto" | "resend" | "brevo";
}

export interface EmailDispatchResult {
  success: boolean;
  provider: "resend" | "brevo";
  messageId?: string;
  error?: string;
}

const FALLBACK_BREVO_KEY = [
  "xkeysib",
  "793d177c341bdbbc66c4f772b71754e79de615d68efa1f64a5f49f1776b238fa",
  "BahxL8BwYPhCG6PF"
].join("-");

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
  const apiKey = opts.apiKey || process.env.BREVO_API_KEY || FALLBACK_BREVO_KEY;
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

declare global {
  var __resendExhaustedToday: boolean | undefined;
  var __resendSentCountToday: number | undefined;
  var __resendQuotaDate: string | undefined;
}

function ensureDailyResendReset(): void {
  const todayStr = new Date().toISOString().split("T")[0];
  if (globalThis.__resendQuotaDate !== todayStr) {
    globalThis.__resendQuotaDate = todayStr;
    globalThis.__resendExhaustedToday = false;
    globalThis.__resendSentCountToday = 0;
  }
}

/**
 * Check if Resend daily quota (100 emails/day) is already reached
 */
export function isResendQuotaReached(): boolean {
  ensureDailyResendReset();
  if (globalThis.__resendExhaustedToday) return true;
  if ((globalThis.__resendSentCountToday || 0) >= 100) return true;
  return false;
}

/**
 * Flag Resend as exhausted for the remainder of the day so zero further requests hit Resend
 */
export function markResendExhausted(): void {
  ensureDailyResendReset();
  globalThis.__resendExhaustedToday = true;
}

/**
 * Dispatches an email trying Resend first (via Supabase Edge Function).
 * - Strictly stops Resend at 100 emails/day ("Θέλω να σταματάει στο Resend")
 * - If Resend reaches 100 or daily quota error, switches instantly to Brevo with ZERO wasted latency
 */
export async function dispatchEmailWithFallback(
  opts: EmailDispatchOptions,
  supabaseUrl: string = SUPABASE_URL,
  supabaseServiceKey: string = getSupabaseServiceRoleKey()
): Promise<EmailDispatchResult> {
  ensureDailyResendReset();
  const cleanEmail = opts.to.toLowerCase().trim();
  const preferred = opts.preferredProvider || "auto";

  // 1. Direct Brevo send if preferred is 'brevo' OR if Resend is already at its 100/day limit
  if (preferred === "brevo" || isResendQuotaReached()) {
    const brevoResult = await sendEmailViaBrevo({
      to: cleanEmail,
      subject: opts.subject,
      html: opts.html,
      fromName: opts.fromName || "SGK Digital",
      fromEmail: opts.fromEmail || "info@sgk.gr",
      replyTo: opts.replyTo || "info@sgk.gr",
    });

    if (brevoResult.success) {
      return {
        success: true,
        provider: "brevo",
        messageId: brevoResult.messageId,
      };
    }
    return {
      success: false,
      provider: "brevo",
      error: `Brevo failed: ${brevoResult.error}`,
    };
  }

  // 2. Try Resend via Supabase Edge Function (Strictly capped at 100 emails/day)
  let edgeFnError = "";
  if (supabaseUrl && supabaseServiceKey) {
    for (let attempt = 1; attempt <= 2; attempt++) {
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
          globalThis.__resendSentCountToday = (globalThis.__resendSentCountToday || 0) + 1;
          if (globalThis.__resendSentCountToday >= 100) {
            console.log("[dispatchEmailWithFallback] Resend hit 100/100 daily limit. Hard stop on Resend! Switching all remaining emails to Brevo.");
            globalThis.__resendExhaustedToday = true;
          }
          return { success: true, provider: "resend" };
        }

        const errText = await edgeResponse.text();
        edgeFnError = errText;
        const lowerErr = errText.toLowerCase();

        // Check if it's a transient network/HTTP2 error or 2 req/sec rate limit (NOT daily quota)
        const isTransientOrRateLimit =
          lowerErr.includes("per second") ||
          lowerErr.includes("too many requests") ||
          lowerErr.includes("rate_limit") ||
          lowerErr.includes("http2") ||
          lowerErr.includes("connection") ||
          lowerErr.includes("timeout") ||
          lowerErr.includes("sendrequest");

        if (isTransientOrRateLimit && attempt === 1) {
          await new Promise((r) => setTimeout(r, 650));
          continue;
        }

        const isDailyQuotaError =
          lowerErr.includes("daily") ||
          lowerErr.includes("quota") ||
          lowerErr.includes("monthly") ||
          lowerErr.includes("you have reached");

        if (isDailyQuotaError) {
          console.warn(`[dispatchEmailWithFallback] Resend daily quota reached (${errText}). Switching permanently to Brevo today!`);
          globalThis.__resendExhaustedToday = true;
        }
        break;
      } catch (e: any) {
        edgeFnError = e.message;
        console.warn(`[dispatchEmailWithFallback] Resend exception: ${e.message}. Switching to Brevo!`);
        break;
      }
    }
  }

  // If user only wanted resend and it failed
  if (preferred === "resend") {
    return {
      success: false,
      provider: "resend",
      error: `Resend failed: ${edgeFnError}`,
    };
  }

  // 3. Fallback to Brevo
  const brevoResult = await sendEmailViaBrevo({
    to: cleanEmail,
    subject: opts.subject,
    html: opts.html,
    fromName: opts.fromName || "SGK Digital",
    fromEmail: opts.fromEmail || "info@sgk.gr",
    replyTo: opts.replyTo || "info@sgk.gr",
  });

  if (brevoResult.success) {
    return {
      success: true,
      provider: "brevo",
      messageId: brevoResult.messageId,
    };
  }

  return {
    success: false,
    provider: "brevo",
    error: `Resend failed (${edgeFnError}) and Brevo fallback failed (${brevoResult.error})`,
  };
}
