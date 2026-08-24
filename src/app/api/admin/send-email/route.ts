import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const {
      processAllDue,
      batchLimit = 5,
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

    // Case 1: Process All Due Auto Follow-ups
    if (processAllDue) {
      try {
        const edgeResponse = await fetch(`${supabaseUrl}/functions/v1/send-nurture-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseServiceKey,
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            processAllDue: true,
            batchLimit,
          }),
        });

        const data = await edgeResponse.json();
        return NextResponse.json(data);
      } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
      }
    }

    // Case 2: Send Single/Campaign Email
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
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
          email,
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

    // Direct Supabase Client DB update to record last_email_sent_at and first_email details
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const now = new Date().toISOString();
    const updatePayload: any = {
      last_email_sent_at: now,
      email_sequence_step: step,
    };

    if (step === 1) {
      updatePayload.first_email_sent_at = now;
      if (firstEmailSubject) updatePayload.first_email_subject = firstEmailSubject;
      if (firstEmailBody) updatePayload.first_email_body = firstEmailBody;
    }

    if (leadId) {
      await supabase.from("sgk_mails").update(updatePayload).eq("id", leadId);
    } else {
      await supabase.from("sgk_mails").update(updatePayload).eq("email", email.toLowerCase().trim());
    }

    if (!edgeFnSuccess && edgeFnError) {
      return NextResponse.json({
        success: false,
        error: edgeFnError || "Failed to dispatch email",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      email,
      sentAt: now,
    });
  } catch (err: any) {
    console.error("Send Email API error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
