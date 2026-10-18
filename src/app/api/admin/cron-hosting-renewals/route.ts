import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { dispatchEmailWithFallback } from "@/lib/emailDispatcher";
import { 
  getHostingRenewalEmail, 
  getAdminHeadsUpBriefingEmail,
  HostingClientData, 
  HostingReminderStage 
} from "@/lib/hostingRenewalsTemplates";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// In-memory / Global cache for Cron Status monitoring
declare global {
  var __lastHostingCronStatus: {
    lastRunAt: string | null;
    success: boolean;
    clientsChecked: number;
    emailsSent: number;
    details: any[];
    error?: string;
  } | undefined;
}

export function getLastHostingCronStatus() {
  return globalThis.__lastHostingCronStatus || {
    lastRunAt: null,
    success: true,
    clientsChecked: 0,
    emailsSent: 0,
    details: [],
  };
}

export function setLastHostingCronStatus(status: {
  lastRunAt: string;
  success: boolean;
  clientsChecked: number;
  emailsSent: number;
  details: any[];
  error?: string;
}) {
  globalThis.__lastHostingCronStatus = status;
}

/**
 * Calculate the next renewal date (1 year after created_at or subsequent years)
 */
export function calculateRenewalDate(createdAtStr: string, customExpiresAt?: string): { renewalDate: string; daysRemaining: number } {
  const now = new Date();
  const created = new Date(createdAtStr);
  const createdDateOnly = createdAtStr.split("T")[0];

  // If a valid custom expiry date is set that is distinct from the registration date
  if (customExpiresAt && customExpiresAt !== createdDateOnly) {
    const exp = new Date(customExpiresAt);
    if (exp.getTime() > created.getTime()) {
      const diffMs = exp.getTime() - now.getTime();
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return {
        renewalDate: exp.toISOString().split("T")[0],
        daysRemaining: days
      };
    }
  }

  const nextRenewal = new Date(created);
  
  // Advance by 1 year until nextRenewal is after or around now
  nextRenewal.setFullYear(created.getFullYear() + 1);
  while (nextRenewal.getTime() < now.getTime() - 1000 * 60 * 60 * 24 * 30) {
    // If it's way past, keep adding years
    nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
  }

  const diffMs = nextRenewal.getTime() - now.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    renewalDate: nextRenewal.toISOString().split("T")[0],
    daysRemaining: days
  };
}

/**
 * Determines which reminder stage a client is eligible for
 */
export function determineEligibleStage(daysRemaining: number, lastStageSent?: string | null): HostingReminderStage | null {
  // Ordered from most critical (0 days) to earliest (20 days)
  if (daysRemaining <= 0) {
    return lastStageSent === "0_days" ? null : "0_days";
  }
  if (daysRemaining <= 3) {
    return (lastStageSent === "3_days" || lastStageSent === "0_days") ? null : "3_days";
  }
  if (daysRemaining <= 5) {
    return (lastStageSent === "5_days" || lastStageSent === "3_days" || lastStageSent === "0_days") ? null : "5_days";
  }
  if (daysRemaining <= 15) {
    return (lastStageSent === "15_days" || lastStageSent === "5_days" || lastStageSent === "3_days" || lastStageSent === "0_days") ? null : "15_days";
  }
  if (daysRemaining <= 20) {
    return (lastStageSent === "20_days" || lastStageSent === "15_days" || lastStageSent === "5_days" || lastStageSent === "3_days" || lastStageSent === "0_days") ? null : "20_days";
  }
  return null;
}

/**
 * Determines if tomorrow the client will hit a reminder dispatch stage,
 * so that a heads-up email can be sent to info@sgk.gr 1 day earlier.
 */
export function determineAdminWarningStage(daysRemaining: number, lastAdminWarningSent?: string | null): HostingReminderStage | null {
  // 1 day before 20_days stage (e.g. 21 days remaining)
  if (daysRemaining <= 21 && daysRemaining > 20) {
    return lastAdminWarningSent === "20_days" ? null : "20_days";
  }
  // 1 day before 15_days stage (e.g. 16 days remaining)
  if (daysRemaining <= 16 && daysRemaining > 15) {
    return lastAdminWarningSent === "15_days" ? null : "15_days";
  }
  // 1 day before 5_days stage (e.g. 6 days remaining)
  if (daysRemaining <= 6 && daysRemaining > 5) {
    return lastAdminWarningSent === "5_days" ? null : "5_days";
  }
  // 1 day before 3_days stage (e.g. 4 days remaining)
  if (daysRemaining <= 4 && daysRemaining > 3) {
    return lastAdminWarningSent === "3_days" ? null : "3_days";
  }
  // 1 day before 0_days stage (e.g. 1 day remaining)
  if (daysRemaining <= 1 && daysRemaining > 0) {
    return lastAdminWarningSent === "0_days" ? null : "0_days";
  }
  return null;
}

/**
 * Main Cron Execution Routine
 */
export async function runHostingRenewalsCron(options?: {
  testMode?: boolean;
  testEmail?: string;
  testStage?: HostingReminderStage;
  forceSendClientId?: string;
}) {
  const supabase = getServiceSupabase();
  const nowIso = new Date().toISOString();

  // Test mode: Send specific stage email directly to test recipient (e.g. info@sgk.gr)
  if (options?.testMode && options.testEmail) {
    const testStage: HostingReminderStage = options.testStage || "20_days";
    const sampleClient: HostingClientData = {
      id: "test-client-sample",
      companyName: "MELTECH Ι.Κ.Ε.",
      email: options.testEmail,
      domainName: "meltech-ike.gr",
      registrationDate: "2025-02-06",
      renewalDate: new Date(Date.now() + (testStage === "20_days" ? 20 : testStage === "15_days" ? 15 : testStage === "5_days" ? 5 : testStage === "3_days" ? 3 : 0) * 86400000).toISOString().split("T")[0],
      renewalPrice: "80,00 € (συμπ. ΦΠΑ)",
      daysRemaining: testStage === "20_days" ? 20 : testStage === "15_days" ? 15 : testStage === "5_days" ? 5 : testStage === "3_days" ? 3 : 0,
    };

    const { subject, html } = getHostingRenewalEmail(sampleClient, testStage);
    const dispatchRes = await dispatchEmailWithFallback({
      to: options.testEmail,
      subject: `[ΔΟΚΙΜΑΣΤΙΚΟ - ${testStage}] ${subject}`,
      html,
      fromName: "SGK Digital (Hosting)",
      fromEmail: "info@sgk.gr",
      replyTo: "info@sgk.gr",
    });

    return {
      success: dispatchRes.success,
      provider: dispatchRes.provider,
      testMode: true,
      sentTo: options.testEmail,
      stage: testStage,
      subject,
      error: dispatchRes.error,
    };
  }

  // 1. Fetch converted clients from Supabase sgk_mails
  const { data: clients, error: fetchErr } = await supabase
    .from("sgk_mails")
    .select("id, email, company, created_at, afm, gemi_number, first_email_body, phone")
    .eq("converted", true);

  if (fetchErr) {
    setLastHostingCronStatus({
      lastRunAt: nowIso,
      success: false,
      clientsChecked: 0,
      emailsSent: 0,
      details: [],
      error: fetchErr.message,
    });
    throw new Error(`Failed to fetch clients: ${fetchErr.message}`);
  }

  const results: any[] = [];
  let sentCount = 0;

  for (const client of clients || []) {
    // Parse custom metadata if stored in first_email_body JSON
    let metadata: any = {};
    try {
      if (client.first_email_body && client.first_email_body.startsWith("{")) {
        metadata = JSON.parse(client.first_email_body);
      }
    } catch (e) {
      metadata = {};
    }

    const hostingMeta = metadata.hosting || {};
    const isPaid = Boolean(hostingMeta.paid);

    // If already marked as paid, skip sending reminder
    if (isPaid && !options?.forceSendClientId) {
      results.push({
        id: client.id,
        company: client.company,
        status: "skipped_paid",
        reason: "Client renewal is already marked as paid",
      });
      continue;
    }

    const { renewalDate, daysRemaining } = calculateRenewalDate(
      client.created_at, 
      hostingMeta.customExpiresAt
    );

    // Prepare client data for email template
    const cleanCompany = client.company || "Εταιρεία";
    const domainName = hostingMeta.domainName || (cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, "") + ".gr");
    const clientData: HostingClientData = {
      id: client.id,
      companyName: cleanCompany,
      email: client.email,
      domainName,
      registrationDate: client.created_at.split("T")[0],
      renewalDate,
      renewalPrice: hostingMeta.renewalPrice || "80,00 € (συμπ. ΦΠΑ)",
      daysRemaining,
    };

    let clientUpdated = false;

    // 1. Check if client is due for a reminder TODAY
    const eligibleStage = options?.forceSendClientId === client.id 
      ? (options.testStage || "20_days")
      : determineEligibleStage(daysRemaining, hostingMeta.lastStageSent);

    if (eligibleStage) {
      const { subject, html } = getHostingRenewalEmail(clientData, eligibleStage);

      // Dispatch email to client
      const dispatchRes = await dispatchEmailWithFallback({
        to: client.email,
        subject,
        html,
        fromName: "SGK Digital (Hosting)",
        fromEmail: "info@sgk.gr",
        replyTo: "info@sgk.gr",
      });

      if (dispatchRes.success) {
        sentCount++;
        hostingMeta.lastStageSent = eligibleStage;
        hostingMeta.lastStageSentAt = nowIso;
        clientUpdated = true;

        results.push({
          id: client.id,
          company: cleanCompany,
          email: client.email,
          stage: eligibleStage,
          daysRemaining,
          status: "sent_to_client",
          provider: dispatchRes.provider,
        });
      } else {
        results.push({
          id: client.id,
          company: cleanCompany,
          email: client.email,
          stage: eligibleStage,
          status: "error",
          error: dispatchRes.error,
        });
      }
    } else {
      results.push({
        id: client.id,
        company: cleanCompany,
        daysRemaining,
        status: "skipped_client_not_due_today",
        lastStageSent: hostingMeta.lastStageSent || "none",
      });
    }

    // 2. Check if an Admin Heads-Up Briefing needs to be sent to info@sgk.gr (1 day before tomorrow's dispatch)
    const adminWarningStage = determineAdminWarningStage(daysRemaining, hostingMeta.lastAdminWarningSent);
    if (adminWarningStage) {
      const tomorrow = new Date(Date.now() + 86400000);
      const tomorrowFormatted = tomorrow.toLocaleDateString("el-GR", { day: "2-digit", month: "2-digit", year: "numeric" });
      const adminBriefing = getAdminHeadsUpBriefingEmail(clientData, adminWarningStage, tomorrowFormatted);

      const adminDispatchRes = await dispatchEmailWithFallback({
        to: "info@sgk.gr",
        subject: adminBriefing.subject,
        html: adminBriefing.html,
        fromName: "SGK System Alert",
        fromEmail: "info@sgk.gr",
        replyTo: "info@sgk.gr",
      });

      if (adminDispatchRes.success) {
        hostingMeta.lastAdminWarningSent = adminWarningStage;
        hostingMeta.lastAdminWarningSentAt = nowIso;
        clientUpdated = true;

        results.push({
          id: client.id,
          company: cleanCompany,
          status: "admin_heads_up_sent",
          stageForTomorrow: adminWarningStage,
          to: "info@sgk.gr",
        });
      }
    }

    if (clientUpdated) {
      metadata.hosting = hostingMeta;
      await supabase
        .from("sgk_mails")
        .update({
          first_email_body: JSON.stringify(metadata),
          last_email_sent_at: nowIso,
        })
        .eq("id", client.id);
    }
  }

  // Update in-memory cron tracking status
  const cronStatus = {
    lastRunAt: nowIso,
    success: true,
    clientsChecked: (clients || []).length,
    emailsSent: sentCount,
    details: results,
  };
  setLastHostingCronStatus(cronStatus);

  return cronStatus;
}

// GET: Triggered by cron job (e.g. Vercel Cron or uptime monitor)
export async function GET(req: NextRequest) {
  try {
    const result = await runHostingRenewalsCron();
    return NextResponse.json({
      success: true,
      message: "Hosting renewals cron executed successfully",
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Triggered manually from Admin UI or with test options
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const result = await runHostingRenewalsCron(body);
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
