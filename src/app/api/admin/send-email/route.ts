import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isEmailBlacklisted } from "@/lib/blacklist";

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

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

    let edgeFnSuccess = false;
    let edgeFnError = "";

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
          unsubscribe_token,
          customSubject,
          customHtml,
          firstEmailSubject,
          firstEmailBody,
          step,
        }),
      });

      if (edgeResponse.ok) {
        edgeFnSuccess = true;
      } else {
        const errorText = await edgeResponse.text();
        console.warn("send-nurture-email notice:", edgeResponse.status, errorText);
        edgeFnError = errorText;
      }
    } catch (e: any) {
      console.error("Fetch to send-nurture-email failed:", e);
      edgeFnError = e.message;
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

    if (!edgeFnSuccess && edgeFnError) {
      return NextResponse.json({
        success: false,
        error: edgeFnError || "Failed to dispatch email",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      sentAt: now,
    });
  } catch (err: any) {
    console.error("Send Email API error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
