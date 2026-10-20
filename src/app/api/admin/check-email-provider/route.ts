import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    // 1. Calculate how many emails were sent today (UTC midnight to now)
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayIso = todayStart.toISOString();

    const { count: sentTodayCount, error: countErr } = await supabase
      .from("sgk_mails")
      .select("id", { count: "exact", head: true })
      .gte("last_email_sent_at", todayIso);

    const totalSentToday = typeof sentTodayCount === "number" ? sentTodayCount : 0;
    const resendDailyLimit = 100;
    // Resend handles live error fallback directly at send time (so Brevo emails do not block Resend)
    const resendHasCapacity = true;

    // 2. Check Brevo remaining credits
    let brevoCredits = 300;
    let brevoAvailable = true;
    const brevoApiKey = process.env.BREVO_API_KEY;

    if (brevoApiKey) {
      try {
        const brevoRes = await fetch("https://api.brevo.com/v3/account", {
          headers: { "api-key": brevoApiKey },
          cache: "no-store",
        });
        if (brevoRes.ok) {
          const accountData = await brevoRes.json();
          const freePlan = (accountData.plan || []).find((p: any) => p.type === "free");
          if (freePlan && typeof freePlan.credits === "number") {
            brevoCredits = freePlan.credits;
          }
        }
      } catch (err: any) {
        console.warn("[check-email-provider] Failed to fetch Brevo account:", err.message);
      }
    } else {
      brevoAvailable = false;
    }

    const recommended = "resend";
    const reason = `Η Resend είναι ο κύριος πάροχος αποστολής. Αν εξαντληθεί το ημερήσιο όριο των 100, η αποστολή γυρίζει αυτόματα σε Brevo (${brevoCredits} διαθέσιμα).`;

    return NextResponse.json({
      success: true,
      totalSentToday,
      resend: {
        sentToday: totalSentToday,
        dailyLimit: resendDailyLimit,
        hasCapacity: resendHasCapacity,
      },
      brevo: {
        credits: brevoCredits,
        available: brevoAvailable,
      },
      recommended,
      reason,
    });
  } catch (error: any) {
    console.error("Error in check-email-provider:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to check email provider status",
      recommended: "brevo", // Safe fallback
    }, { status: 500 });
  }
}
