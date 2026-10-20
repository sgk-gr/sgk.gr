import { NextRequest, NextResponse } from "next/server";
import { 
  runDailyAutoCampaigns, 
  getLastDailyCronReport, 
  isDailyCronRunning 
} from "@/lib/dailyAutoCampaigns";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Allow sufficient execution window for 300 emails

// GET: Triggered automatically by Cron (Vercel Cron, Supabase pg_cron, or external cron trigger)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "true";
    const dryRun = url.searchParams.get("dryRun") === "true";

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

    if (isDailyCronRunning()) {
      return NextResponse.json({
        success: false,
        message: "Η ημερήσια αυτόματη αποστολή εκτελείται ήδη.",
      }, { status: 429 });
    }

    const report = await runDailyAutoCampaigns({ force, dryRun });

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

// POST: Triggered manually from Admin UI with full controls
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const force = body.force !== false; // Manual triggers default to force=true
    const dryRun = Boolean(body.dryRun);

    if (isDailyCronRunning()) {
      return NextResponse.json({
        success: false,
        message: "Η ημερήσια αυτόματη αποστολή εκτελείται ήδη.",
      }, { status: 429 });
    }

    const report = await runDailyAutoCampaigns({ force, dryRun });

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
