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
import { buildProfessionalEmailHtml } from "@/lib/emailTemplates";
import {
  addPaymentToHistory,
  computeNewExpiry,
  getPayments,
  parseAmount,
  sendClientPaymentConfirmation,
} from "@/lib/hostingPayments";
import { getStripe } from "@/lib/stripe";

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
        payments: [...getPayments(hosting)].sort((a, b) => b.paidAt.localeCompare(a.paidAt)),
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

    // ACTION: Send Test Email to info@sgk.gr (Supports selecting any client to use their exact declared price & details)
    if (action === "send_test_email") {
      const targetEmail = body.to || "info@sgk.gr";
      const stage: HostingReminderStage = body.stage || "20_days";

      let companyName = body.companyName || "MELTECH Ι.Κ.Ε.";
      let domainName = body.domainName || "meltech-ike.gr";
      let renewalPrice = body.renewalPrice || "80,00 € (συμπ. ΦΠΑ)";
      let registrationDate = "2025-02-06";
      let renewalDate = new Date(Date.now() + (stage === "20_days" ? 20 : stage === "15_days" ? 15 : stage === "5_days" ? 5 : stage === "3_days" ? 3 : 0) * 86400000).toISOString().split("T")[0];
      let daysRemaining = stage === "20_days" ? 20 : stage === "15_days" ? 15 : stage === "5_days" ? 5 : stage === "3_days" ? 3 : 0;

      // If a specific client is requested, fetch their real metadata from Supabase
      if (body.clientId) {
        const { data: dbClient } = await supabase
          .from("sgk_mails")
          .select("id, email, company, first_email_body, created_at")
          .eq("id", body.clientId)
          .single();

        if (dbClient) {
          let meta: any = {};
          try {
            if (dbClient.first_email_body && dbClient.first_email_body.startsWith("{")) {
              meta = JSON.parse(dbClient.first_email_body);
            }
          } catch (e) {}
          const h = meta.hosting || {};
          companyName = dbClient.company || companyName;
          domainName = h.domainName || (companyName.toLowerCase().replace(/[^a-z0-9]/g, "") + ".gr");
          renewalPrice = h.renewalPrice || renewalPrice;
          registrationDate = dbClient.created_at.split("T")[0];
          const calc = calculateRenewalDate(dbClient.created_at, h.customExpiresAt);
          renewalDate = calc.renewalDate;
          daysRemaining = calc.daysRemaining;
        }
      }

      const sampleClient: HostingClientData = {
        id: body.clientId || "test-client",
        companyName,
        email: targetEmail,
        domainName,
        registrationDate,
        renewalDate,
        renewalPrice,
        daysRemaining,
      };

      const stripeMode: "live" | "test" = body.mode === "test" ? "test" : "live";
      const { subject, html } = getHostingRenewalEmail(sampleClient, stage, stripeMode);

      const dispatchRes = await dispatchEmailWithFallback({
        to: targetEmail,
        subject: `[ΔΟΚΙΜΑΣΤΙΚΟ SGK${stripeMode === "test" ? " - SANDBOX" : ""} - ${stage}] ${subject}`,
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
        clientUsed: companyName,
        priceUsed: renewalPrice,
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

    // ACTION: Toggle Paid Status (manual payment: cash / bank transfer / card taken by hand)
    if (action === "toggle_paid") {
      const newPaidState = body.paid !== undefined ? Boolean(body.paid) : !hosting.paid;
      const domainForEmail =
        hosting.domainName || ((client.company || "").toLowerCase().replace(/[^a-z0-9]/g, "") + ".gr");
      let emailSent = false;
      let emailError: string | undefined;

      if (newPaidState && hosting.paid) {
        // Already marked as paid - do not add another year
        return NextResponse.json({ success: true, isPaid: true, customExpiresAt: hosting.customExpiresAt, alreadyPaid: true });
      }

      if (newPaidState) {
        const prevExpiry = hosting.customExpiresAt || null;
        const newExpiry = computeNewExpiry(prevExpiry, client.created_at);
        const amount = parseAmount(body.amount || hosting.renewalPrice);

        hosting.paid = true;
        hosting.paidAt = new Date().toISOString();
        hosting.paidVia = "manual";
        hosting.customExpiresAt = newExpiry;
        hosting.lastStageSent = null; // reset stage for next cycle
        addPaymentToHistory(hosting, { amount, method: "manual", prevExpiry, newExpiry });
        metadata.hosting = hosting;

        const { error: saveErr } = await supabase
          .from("sgk_mails")
          .update({ first_email_body: JSON.stringify(metadata) })
          .eq("id", clientId);
        if (saveErr) {
          return NextResponse.json({ success: false, error: saveErr.message }, { status: 500 });
        }

        // Confirmation email to the customer (same as card payments)
        if (body.sendEmail !== false && client.email) {
          const res = await sendClientPaymentConfirmation({
            clientId,
            email: client.email,
            company: client.company || "Πελάτης",
            domain: domainForEmail,
            amount,
            newExpiry,
          });
          emailSent = Boolean(res.success);
          emailError = res.error;
        }

        // Notify admin
        await dispatchEmailWithFallback({
          to: "info@sgk.gr",
          subject: `✋ [Χειροκίνητη Πληρωμή] ${amount}€ από ${client.company} (${domainForEmail})`,
          html: buildProfessionalEmailHtml({
            businessName: "SGK System",
            subject: `Χειροκίνητη Πληρωμή Hosting: ${client.company}`,
            bodyHtml: `
              <h2 style="color: #10b981; font-size: 20px; font-weight: 800; margin: 0 0 14px 0;">✅ Καταχωρήθηκε χειροκίνητη πληρωμή</h2>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #1e293b; line-height: 1.6;">
                <li><strong>Πελάτης:</strong> ${client.company}</li>
                <li><strong>Domain:</strong> ${domainForEmail}</li>
                <li><strong>Ποσό:</strong> ${amount} €</li>
                <li><strong>Νέα Λήξη:</strong> ${newExpiry}</li>
                <li><strong>Email επιβεβαίωσης στον πελάτη:</strong> ${emailSent ? "Εστάλη" : "Δεν εστάλη"}</li>
              </ul>
            `,
            buttonText: "Άνοιγμα Admin Portal",
            buttonLink: "https://www.sgk.gr/admin?tab=hosting",
            unsubscribeToken: "admin-alert",
          }),
          fromName: "SGK System (Payments)",
          fromEmail: "info@sgk.gr",
        });
      } else {
        // Undo: void the last manual payment and restore the previous expiry
        const history = getPayments(hosting);
        for (let i = history.length - 1; i >= 0; i--) {
          if (!history[i].voided && history[i].method === "manual") {
            history[i].voided = true;
            if (history[i].prevExpiry) hosting.customExpiresAt = history[i].prevExpiry;
            break;
          }
        }
        hosting.payments = history;
        hosting.paid = false;
        metadata.hosting = hosting;

        const { error: saveErr } = await supabase
          .from("sgk_mails")
          .update({ first_email_body: JSON.stringify(metadata) })
          .eq("id", clientId);
        if (saveErr) {
          return NextResponse.json({ success: false, error: saveErr.message }, { status: 500 });
        }
      }

      return NextResponse.json({
        success: true,
        isPaid: newPaidState,
        customExpiresAt: hosting.customExpiresAt,
        emailSent,
        emailError,
      });
    }

    // ACTION: Simulate Payment (Demo Test - Creates real Stripe Sandbox transaction, updates Supabase DB and notifies)
    if (action === "simulate_payment") {
      const prevExpiry = hosting.customExpiresAt || null;
      const newExpFormatted = computeNewExpiry(prevExpiry, client.created_at);
      const demoAmount = parseAmount(hosting.renewalPrice);
      const domainForDemo =
        hosting.domainName || ((client.company || "").toLowerCase().replace(/[^a-z0-9]/g, "") + ".gr");

      let stripePaymentId = "demo_session_" + Date.now();
      try {
        const testStripe = getStripe("test");
        const amountCents = Math.max(50, Math.round(parseFloat(demoAmount) * 100));

        let customerId: string | undefined;
        if (client.email) {
          const existing = await testStripe.customers.list({ email: client.email, limit: 1 });
          if (existing.data.length > 0) {
            customerId = existing.data[0].id;
          } else {
            const created = await testStripe.customers.create({
              email: client.email,
              name: client.company || "Πελάτης",
            });
            customerId = created.id;
          }
        }

        const pi = await testStripe.paymentIntents.create({
          amount: amountCents,
          currency: "eur",
          customer: customerId,
          payment_method: "pm_card_visa",
          confirm: true,
          automatic_payment_methods: { enabled: true, allow_redirects: "never" },
          description: `Ετήσια Ανανέωση Hosting & Domain (${domainForDemo})`,
          metadata: {
            clientId: client.id,
            domain: domainForDemo,
            company: client.company || "",
            type: "hosting_renewal",
            stripeMode: "test",
          },
        });
        stripePaymentId = pi.id;
      } catch (stripeErr: any) {
        console.warn("[Demo Simulate Payment] Stripe Sandbox PI warning:", stripeErr.message);
      }

      hosting.paid = true;
      hosting.paidAt = new Date().toISOString();
      hosting.paidVia = "stripe_sandbox";
      hosting.stripeSessionId = stripePaymentId;
      hosting.customExpiresAt = newExpFormatted;
      hosting.lastStageSent = null;
      addPaymentToHistory(hosting, {
        amount: demoAmount,
        method: "stripe_sandbox",
        sessionId: stripePaymentId,
        prevExpiry,
        newExpiry: newExpFormatted,
      });

      metadata.hosting = hosting;

      const { error: updateErr } = await supabase
        .from("sgk_mails")
        .update({ first_email_body: JSON.stringify(metadata) })
        .eq("id", clientId);

      if (updateErr) {
        return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
      }

      // Send confirmation email to client
      if (client.email) {
        await sendClientPaymentConfirmation({
          clientId: client.id,
          email: client.email,
          company: client.company || "Πελάτης",
          domain: domainForDemo,
          amount: demoAmount,
          newExpiry: newExpFormatted,
        });
      }

      // Send test notification email to info@sgk.gr
      await dispatchEmailWithFallback({
        to: "info@sgk.gr",
        subject: `🧪 [STRIPE SANDBOX] Δοκιμαστική Πληρωμή Hosting: ${demoAmount}€ από ${client.company}`,
        html: buildProfessionalEmailHtml({
          businessName: "SGK System",
          subject: `🧪 [STRIPE SANDBOX] Δοκιμαστική Πληρωμή Hosting: ${demoAmount}€ από ${client.company}`,
          bodyHtml: `
            <h2 style="color: #f59e0b; font-size: 20px; font-weight: 800; margin: 0 0 14px 0;">
              🧪 Επιτυχής Δοκιμαστική Πληρωμή (Stripe Sandbox)!
            </h2>
            <p style="font-size: 15px; color: #1e293b;">
              Η δοκιμή πληρωμής για την εταιρεία <strong>${client.company}</strong> εκτελέστηκε επιτυχώς και καταγράφηκε στο Stripe Sandbox.
            </p>
            <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 14px; margin: 14px 0;">
              <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #1e293b; line-height: 1.6;">
                <li><strong>Πελάτης:</strong> ${client.company}</li>
                <li><strong>Ποσό:</strong> ${demoAmount} €</li>
                <li><strong>Stripe Payment ID:</strong> ${stripePaymentId}</li>
                <li><strong>Κατάσταση:</strong> ΠΛΗΡΩΘΗΚΕ (STRIPE SANDBOX)</li>
                <li><strong>Νέα Λήξη στη Βάση:</strong> ${newExpFormatted}</li>
              </ul>
            </div>
          `,
          buttonText: "Άνοιγμα Admin Portal",
          buttonLink: "https://www.sgk.gr/admin?tab=hosting",
          unsubscribeToken: "admin-alert",
        }),
        fromName: "SGK System (Sandbox Test)",
        fromEmail: "info@sgk.gr",
      });

      return NextResponse.json({
        success: true,
        isDemo: true,
        stripePaymentId,
        newExpFormatted,
        company: client.company,
      });
    }

    // ACTION: Reset Client Demo State (Sets to unpaid with urgent expiry for re-testing)
    if (action === "reset_client_demo") {
      const expDate = new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];
      hosting.paid = false;
      delete hosting.paidAt;
      delete hosting.paidVia;
      delete hosting.stripeSessionId;
      hosting.customExpiresAt = expDate;
      hosting.lastStageSent = "3_days";
      hosting.payments = getPayments(hosting).filter((p) => p.method !== "demo" && p.method !== "stripe_sandbox");

      metadata.hosting = hosting;

      const { error: resetErr } = await supabase
        .from("sgk_mails")
        .update({ first_email_body: JSON.stringify(metadata) })
        .eq("id", clientId);

      if (resetErr) {
        return NextResponse.json({ success: false, error: resetErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        isDemo: true,
        resetTo: expDate,
        company: client.company,
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

      const { subject, html } = getHostingRenewalEmail(clientData, stage, body.mode === "test" ? "test" : "live");

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
