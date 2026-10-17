import { NextResponse } from "next/server";
import { getServiceSupabase, getSupabaseServiceRoleKey, SUPABASE_URL } from "@/lib/supabase";
import { isEmailBlacklisted } from "@/lib/blacklist";
import { dispatchEmailWithFallback } from "@/lib/emailDispatcher";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const {
      email,
      unsubscribe_token,
      customSubject,
      customHtml,
      firstEmailSubject,
      firstEmailBody,
      step = 1,
      leadId,
    } = payload;

    const supabaseUrl = SUPABASE_URL;
    const supabaseServiceKey = getSupabaseServiceRoleKey();

    // Send Single/Campaign Email (Manual only)
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. HARD BLOCK: Check Global In-Code Blacklist
    if (isEmailBlacklisted(cleanEmail)) {
      console.warn(`[send-email API] BLOCKED: ${cleanEmail} is in global suppression blacklist.`);
      return NextResponse.json({
        success: false,
        error: `BLOCKED: The email ${cleanEmail} is permanently blacklisted.`,
        blacklisted: true,
      }, { status: 403 });
    }

    // 2. HARD BLOCK: Check Supabase DB for Unsubscribed / Blacklisted status
    const supabase = getServiceSupabase();

    const { data: dbLead } = await supabase
      .from("sgk_mails")
      .select("id, email, unsubscribed, marketing_consent")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (dbLead && (dbLead.unsubscribed === true || dbLead.marketing_consent === false)) {
      console.warn(`[send-email API] BLOCKED: ${cleanEmail} has unsubscribed or opted out.`);
      return NextResponse.json({
        success: false,
        error: `BLOCKED: The recipient ${cleanEmail} has unsubscribed.`,
        blacklisted: true,
      }, { status: 403 });
    }

    const dispatchResult = await dispatchEmailWithFallback(
      {
        to: cleanEmail,
        subject: customSubject,
        html: customHtml,
        unsubscribeToken: unsubscribe_token,
        firstEmailSubject,
        firstEmailBody,
        step,
      },
      supabaseUrl,
      supabaseServiceKey
    );

    if (!dispatchResult.success) {
      return NextResponse.json({
        success: false,
        error: dispatchResult.error || "Failed to dispatch email via Resend and Brevo",
      }, { status: 500 });
    }

    const now = new Date().toISOString();
    const updatePayload: any = {
      last_email_sent_at: now,
      email_sequence_step: step,
    };

    if (step === 1) {
      if (firstEmailSubject) updatePayload.first_email_subject = firstEmailSubject;
      if (firstEmailBody) updatePayload.first_email_body = firstEmailBody;
    }

    if (leadId) {
      await supabase.from("sgk_mails").update(updatePayload).eq("id", leadId);
    } else {
      await supabase.from("sgk_mails").update(updatePayload).eq("email", cleanEmail);
    }

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      provider: dispatchResult.provider,
      sentAt: now,
    });
  } catch (err: any) {
    console.error("Send Email API error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
