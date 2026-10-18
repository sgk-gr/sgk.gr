import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { 
  calculateRenewalDate, 
  getLastHostingCronStatus, 
  runHostingRenewalsCron 
} from "../cron-hosting-renewals/route";
import { 
  getHostingRenewalEmail, 
  HostingClientData, 
  HostingReminderStage 
} from "@/lib/hostingRenewalsTemplates";
import { dispatchEmailWithFallback } from "@/lib/emailDispatcher";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    
    // Fetch converted clients from sgk_mails
    const { data: rawClients, error } = await supabase
      .from("sgk_mails")
      .select("id, email, company, created_at, afm, gemi_number, phone, first_email_body, last_email_sent_at")
      .eq("converted", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const clients = (rawClients || []).map((c) => {
      let metadata: any = {};
      try {
        if (c.first_email_body && c.first_email_body.startsWith("{")) {
          metadata = JSON.parse(c.first_email_body);
        }
      } catch (e) {
        metadata = {};
      }

      const hosting = metadata.hosting || {};
      const { renewalDate, daysRemaining } = calculateRenewalDate(c.created_at, hosting.customExpiresAt);

      const isPaid = Boolean(hosting.paid);
      let statusCategory: "paid" | "expired" | "critical" | "urgent" | "warning" | "active" = "active";
      
      if (isPaid) {
        statusCategory = "paid";
      } else if (daysRemaining <= 0) {
        statusCategory = "expired";
      } else if (daysRemaining <= 3) {
        statusCategory = "critical";
      } else if (daysRemaining <= 5) {
        statusCategory = "urgent";
      } else if (daysRemaining <= 20) {
        statusCategory = "warning";
      } else {
        statusCategory = "active";
      }

      // Default domain inference if not provided
      const cleanCompany = c.company || "Εταιρεία";
      const defaultDomain = cleanCompany
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 20) + ".gr";

      return {
        id: c.id,
        companyName: cleanCompany,
        email: c.email,
        phone: c.phone || "",
        afm: c.afm || "",
        gemiNumber: c.gemi_number || "",
        domainName: hosting.domainName || defaultDomain,
        registrationDate: c.created_at.split("T")[0],
        renewalDate,
        customExpiresAt: hosting.customExpiresAt || null,
        daysRemaining,
        isPaid,
        statusCategory,
        renewalPrice: hosting.renewalPrice || "80,00 € (συμπ. ΦΠΑ)",
        notes: hosting.notes || "",
        lastStageSent: hosting.lastStageSent || null,
        lastStageSentAt: hosting.lastStageSentAt || null,
      };
    });

    // Summary statistics
    const stats = {
      total: clients.length,
      paid: clients.filter((c) => c.isPaid).length,
      expiringSoon: clients.filter((c) => !c.isPaid && c.daysRemaining > 0 && c.daysRemaining <= 20).length,
      expired: clients.filter((c) => !c.isPaid && c.daysRemaining <= 0).length,
      active: clients.filter((c) => !c.isPaid && c.daysRemaining > 20).length,
    };

    const cronStatus = getLastHostingCronStatus();

    return NextResponse.json({
      success: true,
      clients,
      stats,
      cronStatus,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, clientId } = body;
    const supabase = getServiceSupabase();

    // ACTION: Run Cron Now
    if (action === "run_cron_now") {
      const cronResult = await runHostingRenewalsCron({ forceSendClientId: body.forceSendClientId });
      return NextResponse.json({ success: true, cronResult });
    }

    // ACTION: Send Test Email to info@sgk.gr
    if (action === "send_test_email") {
      const targetEmail = body.to || "info@sgk.gr";
      const stage: HostingReminderStage = body.stage || "20_days";

      const sampleClient: HostingClientData = {
        id: "test-client",
        companyName: body.companyName || "MELTECH Ι.Κ.Ε.",
        email: targetEmail,
        domainName: body.domainName || "meltech-ike.gr",
        registrationDate: "2025-02-06",
        renewalDate: new Date(Date.now() + (stage === "20_days" ? 20 : stage === "15_days" ? 15 : stage === "5_days" ? 5 : stage === "3_days" ? 3 : 0) * 86400000).toISOString().split("T")[0],
        renewalPrice: "80,00 € (συμπ. ΦΠΑ)",
        daysRemaining: stage === "20_days" ? 20 : stage === "15_days" ? 15 : stage === "5_days" ? 5 : stage === "3_days" ? 3 : 0,
      };

      const { subject, html } = getHostingRenewalEmail(sampleClient, stage);

      const dispatchRes = await dispatchEmailWithFallback({
        to: targetEmail,
        subject: `[ΔΟΚΙΜΑΣΤΙΚΟ SGK - ${stage}] ${subject}`,
        html,
        fromName: "SGK Digital (Hosting)",
        fromEmail: "info@sgk.gr",
        replyTo: "info@sgk.gr",
      });

      return NextResponse.json({
        success: dispatchRes.success,
        provider: dispatchRes.provider,
        sentTo: targetEmail,
        stage,
        subject,
        error: dispatchRes.error,
      });
    }

    // Client-specific actions require clientId
    if (!clientId) {
      return NextResponse.json({ success: false, error: "Missing clientId" }, { status: 400 });
    }

    // Fetch existing record
    const { data: client, error: fetchErr } = await supabase
      .from("sgk_mails")
      .select("id, email, company, first_email_body, created_at")
      .eq("id", clientId)
      .single();

    if (fetchErr || !client) {
      return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 });
    }

    let metadata: any = {};
    try {
      if (client.first_email_body && client.first_email_body.startsWith("{")) {
        metadata = JSON.parse(client.first_email_body);
      }
    } catch (e) {
      metadata = {};
    }

    const hosting = metadata.hosting || {};

    // ACTION: Toggle Paid Status
    if (action === "toggle_paid") {
      const newPaidState = body.paid !== undefined ? Boolean(body.paid) : !hosting.paid;
      hosting.paid = newPaidState;
      if (newPaidState) {
        hosting.paidAt = new Date().toISOString();
        // If paid, advance renewal to next year
        const currentExp = hosting.customExpiresAt ? new Date(hosting.customExpiresAt) : new Date(client.created_at);
        currentExp.setFullYear(currentExp.getFullYear() + 1);
        hosting.customExpiresAt = currentExp.toISOString().split("T")[0];
        hosting.lastStageSent = null; // reset stage for next cycle
      }
      metadata.hosting = hosting;

      await supabase
        .from("sgk_mails")
        .update({ first_email_body: JSON.stringify(metadata) })
        .eq("id", clientId);

      return NextResponse.json({
        success: true,
        isPaid: newPaidState,
        customExpiresAt: hosting.customExpiresAt,
      });
    }

    // ACTION: Update Client Hosting Metadata
    if (action === "update_client") {
      if (body.domainName !== undefined) hosting.domainName = body.domainName;
      if (body.customExpiresAt !== undefined) hosting.customExpiresAt = body.customExpiresAt;
      if (body.renewalPrice !== undefined) hosting.renewalPrice = body.renewalPrice;
      if (body.notes !== undefined) hosting.notes = body.notes;
      if (body.paid !== undefined) hosting.paid = Boolean(body.paid);

      metadata.hosting = hosting;

      await supabase
        .from("sgk_mails")
        .update({ first_email_body: JSON.stringify(metadata) })
        .eq("id", clientId);

      return NextResponse.json({ success: true, hosting });
    }

    // ACTION: Send Specific Stage Reminder Now to this Client
    if (action === "send_stage_reminder") {
      const stage: HostingReminderStage = body.stage || "20_days";
      const cleanCompany = client.company || "Εταιρεία";
      const domainName = hosting.domainName || (cleanCompany.toLowerCase().replace(/[^a-z0-9]/g, "") + ".gr");
      const { renewalDate, daysRemaining } = calculateRenewalDate(client.created_at, hosting.customExpiresAt);

      const clientData: HostingClientData = {
        id: client.id,
        companyName: cleanCompany,
        email: client.email,
        domainName,
        registrationDate: client.created_at.split("T")[0],
        renewalDate,
        renewalPrice: hosting.renewalPrice || "80,00 € (συμπ. ΦΠΑ)",
        daysRemaining,
      };

      const { subject, html } = getHostingRenewalEmail(clientData, stage);

      const dispatchRes = await dispatchEmailWithFallback({
        to: client.email,
        subject,
        html,
        fromName: "SGK Digital (Hosting)",
        fromEmail: "info@sgk.gr",
        replyTo: "info@sgk.gr",
      });

      if (dispatchRes.success) {
        hosting.lastStageSent = stage;
        hosting.lastStageSentAt = new Date().toISOString();
        metadata.hosting = hosting;

        await supabase
          .from("sgk_mails")
          .update({
            first_email_body: JSON.stringify(metadata),
            last_email_sent_at: new Date().toISOString(),
          })
          .eq("id", clientId);
      }

      return NextResponse.json({
        success: dispatchRes.success,
        provider: dispatchRes.provider,
        sentTo: client.email,
        stage,
        subject,
        error: dispatchRes.error,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
