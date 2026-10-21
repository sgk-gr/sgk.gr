import { NextRequest, NextResponse } from "next/server";
import { 
  runDailyAutoCampaigns, 
  getLastDailyCronReport, 
  isDailyCronRunning 
} from "@/lib/dailyAutoCampaigns";
import { getServiceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Allow sufficient execution window for 400 emails

async function hasAlreadySentDailyQuotaToday(): Promise<boolean> {
  try {
    const supabase = getServiceSupabase();
    const todayStartUtc = new Date().toISOString().split("T")[0] + "T00:00:00.000Z";
    const { count } = await supabase
      .from("sgk_mails")
      .select("id", { count: "exact", head: true })
      .gte("last_email_sent_at", todayStartUtc);
    return (count || 0) >= 390;
  } catch {
    return false;
  }
}

// GET: Triggered automatically by Cron (Vercel Cron, Supabase pg_cron, or external cron trigger)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "true";
    const dryRun = url.searchParams.get("dryRun") === "true";
    const body: any = {
      newIkeTarget: url.searchParams.get("newIkeTarget") ? Number(url.searchParams.get("newIkeTarget")) : undefined,
      legacyIkeTarget: url.searchParams.get("legacyIkeTarget") ? Number(url.searchParams.get("legacyIkeTarget")) : undefined,
      ftthTarget: url.searchParams.get("ftthTarget") ? Number(url.searchParams.get("ftthTarget")) : undefined,
      nonIkeTarget: url.searchParams.get("nonIkeTarget") ? Number(url.searchParams.get("nonIkeTarget")) : undefined,
    };

    // Prevent duplicate daily runs unless force=true
    const lastReport = getLastDailyCronReport();
    if (!force && lastReport && lastReport.timestamp) {
      const lastRunDate = new Date(lastReport.timestamp).toDateString();
      const todayDate = new Date().toDateString();
      if (lastRunDate === todayDate && lastReport.totalSent > 0) {
        return NextResponse.json({
          success: true,
          skipped: true,
          message: "Η ημερήσια αποστολή έχει ήδη εκτελεστεί επιτυχώς για σήμερα.",
          lastReport,
        });
      }
    }

    if (!force && !dryRun && (await hasAlreadySentDailyQuotaToday())) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: "Η ημερήσια αποστολή έχει ήδη εκτελεστεί σήμερα στη βάση δεδομένων.",
        lastReport,
      });
    }

    if (isDailyCronRunning()) {
      return NextResponse.json({
        success: false,
        message: "Η ημερήσια αυτόματη αποστολή εκτελείται ήδη.",
      }, { status: 429 });
    }

    const report = await runDailyAutoCampaigns({ 
      force, 
      dryRun,
      newIkeTarget: typeof body.newIkeTarget === "number" ? body.newIkeTarget : undefined,
      legacyIkeTarget: typeof body.legacyIkeTarget === "number" ? body.legacyIkeTarget : undefined,
      ftthTarget: typeof body.ftthTarget === "number" ? body.ftthTarget : undefined,
      nonIkeTarget: typeof body.nonIkeTarget === "number" ? body.nonIkeTarget : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Daily automated campaigns completed successfully",
      report,
    });
  } catch (error: any) {
    console.error("[cron-daily-campaigns GET] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Triggered manually from Admin UI or GitHub Actions backup
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const force = body.force !== false; // Manual triggers default to force=true
    const dryRun = Boolean(body.dryRun);

    if (!force && !dryRun && (await hasAlreadySentDailyQuotaToday())) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: "Η ημερήσια αποστολή έχει ήδη εκτελεστεί σήμερα στη βάση δεδομένων.",
        lastReport: getLastDailyCronReport(),
      });
    }

    if (isDailyCronRunning()) {
      return NextResponse.json({
        success: false,
        message: "Η ημερήσια αυτόματη αποστολή εκτελείται ήδη.",
      }, { status: 429 });
    }

    const report = await runDailyAutoCampaigns({ 
      force, 
      dryRun,
      newIkeTarget: typeof body.newIkeTarget === "number" ? body.newIkeTarget : undefined,
      legacyIkeTarget: typeof body.legacyIkeTarget === "number" ? body.legacyIkeTarget : undefined,
      ftthTarget: typeof body.ftthTarget === "number" ? body.ftthTarget : undefined,
      nonIkeTarget: typeof body.nonIkeTarget === "number" ? body.nonIkeTarget : undefined,
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error("[cron-daily-campaigns POST] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
