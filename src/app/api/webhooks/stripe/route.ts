import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getServiceSupabase } from "@/lib/supabase";
import { dispatchEmailWithFallback } from "@/lib/emailDispatcher";
import { buildProfessionalEmailHtml } from "@/lib/emailTemplates";
import {
  addPaymentToHistory,
  computeNewExpiry,
  getPayments,
  sendClientPaymentConfirmation,
} from "@/lib/hostingPayments";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const liveStripe = getStripe("live");
  const testStripe = getStripe("test");
  const liveSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const testSecret = process.env.STRIPE_TEST_WEBHOOK_SECRET || "";
  if (!liveSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET in environment");
    return NextResponse.json({ error: "Webhook secret unconfigured" }, { status: 500 });
  }

  let event: any = null;
  let isSandbox = false;
  const rawBody = await req.text();

  try {
    event = liveStripe.webhooks.constructEvent(rawBody, signature, liveSecret);
    isSandbox = !event.livemode;
  } catch (liveErr: any) {
    try {
      event = testStripe.webhooks.constructEvent(rawBody, signature, testSecret);
      isSandbox = true;
    } catch (testErr: any) {
      console.error("Stripe Webhook Signature Verification Failed:", liveErr.message, testErr.message);
      return NextResponse.json({ error: `Webhook signature verification failed: ${liveErr.message}` }, { status: 400 });
    }
  }

  // Handle Event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const clientId = session.metadata?.clientId || session.client_reference_id;
    const domain = session.metadata?.domain || "";
    const company = session.metadata?.company || "Πελάτης";
    const amountPaid = session.amount_total ? (session.amount_total / 100).toFixed(2) : "80.00";

    console.log(`[Stripe Webhook] Received payment for client: ${clientId} (${company} - ${domain}) - Amount: ${amountPaid}€ (Sandbox: ${isSandbox})`);

    if (clientId) {
      try {
        const supabase = getServiceSupabase();

        // Fetch client
        const { data: client, error: fetchErr } = await supabase
          .from("sgk_mails")
          .select("id, email, company, first_email_body, created_at")
          .eq("id", clientId)
          .single();

        if (fetchErr || !client) {
          console.error("[Stripe Webhook] Client not found:", clientId);
        } else {
          let metadata: any = {};
          try {
            if (client.first_email_body && client.first_email_body.startsWith("{")) {
              metadata = JSON.parse(client.first_email_body);
            }
          } catch (e) {}

          const hosting = metadata.hosting || {};

          // Idempotency: Stripe may deliver the same event more than once
          if (getPayments(hosting).some((p) => p.sessionId === session.id)) {
            console.log(`[Stripe Webhook] Session ${session.id} already processed, skipping.`);
            return NextResponse.json({ received: true, duplicate: true });
          }

          // Advance renewal date by 1 year (from today if already expired)
          const prevExpiry = hosting.customExpiresAt || null;
          const newExpFormatted = computeNewExpiry(prevExpiry, client.created_at);
          const paymentMethod = isSandbox ? "stripe_sandbox" : "stripe_live";

          // Update hosting metadata
          hosting.paid = true;
          hosting.paidAt = new Date().toISOString();
          hosting.paidVia = paymentMethod;
          hosting.stripeSessionId = session.id;
          hosting.stripePaymentIntent = session.payment_intent;
          hosting.customExpiresAt = newExpFormatted;
          hosting.lastStageSent = null; // reset reminders for next annual cycle
          addPaymentToHistory(hosting, {
            amount: amountPaid,
            method: paymentMethod,
            sessionId: session.id,
            prevExpiry,
            newExpiry: newExpFormatted,
          });

          metadata.hosting = hosting;

          // Save to Supabase
          const { error: updateErr } = await supabase
            .from("sgk_mails")
            .update({ first_email_body: JSON.stringify(metadata) })
            .eq("id", clientId);

          if (updateErr) {
            console.error("[Stripe Webhook] Failed to update client in Supabase:", updateErr);
          } else {
            console.log(`[Stripe Webhook] Client ${company} successfully updated. Renewed until: ${newExpFormatted}`);

            const adminSubject = isSandbox
              ? `🧪 [STRIPE SANDBOX] Δοκιμαστική Πληρωμή Hosting: ${amountPaid}€ από ${company} (${domain})`
              : `💰 [STRIPE LIVE] Νέα Πληρωμή Hosting: ${amountPaid}€ από ${company} (${domain})`;

            // 1. Send Admin Notification to info@sgk.gr
            await dispatchEmailWithFallback({
              to: "info@sgk.gr",
              subject: adminSubject,
              html: buildProfessionalEmailHtml({
                businessName: "SGK System",
                subject: adminSubject,
                bodyHtml: `
                <h2 style="color: ${isSandbox ? "#f59e0b" : "#10b981"}; font-size: 20px; font-weight: 800; margin: 0 0 14px 0;">
                  ${isSandbox ? "🧪 Επιτυχής Δοκιμαστική Πληρωμή (Stripe Sandbox)!" : "✅ Επιτυχής Πληρωμή Hosting μέσω Stripe!"}
                </h2>
                <div style="background-color: ${isSandbox ? "#fffbeb" : "#f0fdf4"}; border: 1px solid ${isSandbox ? "#fef3c7" : "#bbf7d0"}; border-radius: 10px; padding: 16px; margin: 16px 0;">
                  <p style="margin: 0 0 8px 0; font-size: 15px; color: ${isSandbox ? "#92400e" : "#166534"}; font-weight: 700;">
                    Στοιχεία Συναλλαγής:
                  </p>
                  <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #1e293b; line-height: 1.6;">
                    <li><strong>Πελάτης / Brand:</strong> ${company}</li>
                    <li><strong>Domain:</strong> ${domain}</li>
                    <li><strong>Ποσό που Εισπράχθηκε:</strong> ${amountPaid} €</li>
                    <li><strong>Email Πελάτη:</strong> ${client.email}</li>
                    <li><strong>Stripe Mode:</strong> ${isSandbox ? "SANDBOX (Test Mode)" : "LIVE PRODUCTION"}</li>
                    <li><strong>Νέα Ημερομηνία Λήξης:</strong> ${newExpFormatted} (+1 Έτος)</li>
                    <li><strong>Stripe Session ID:</strong> ${session.id}</li>
                    <li><strong>Κατάσταση Ιστοσελίδας:</strong> Πλήρως Ενεργή (Active)</li>
                  </ul>
                </div>
                <p style="font-size: 13px; color: #64748b; margin-top: 14px;">
                  Το σύστημα ανανέωσε αυτόματα τη συνδρομή του πελάτη στη βάση δεδομένων και ξεμπλόκαρε την ιστοσελίδα.
                </p>
              `,
                buttonText: "Άνοιγμα Admin Portal",
                buttonLink: "https://www.sgk.gr/admin?tab=hosting",
                unsubscribeToken: "admin-alert",
              }),
              fromName: "SGK System (Payments)",
              fromEmail: "info@sgk.gr",
              replyTo: client.email || "info@sgk.gr",
            });

            // 2. Send Receipt / Confirmation to Client
            if (client.email) {
              await sendClientPaymentConfirmation({
                clientId,
                email: client.email,
                company,
                domain,
                amount: amountPaid,
                newExpiry: newExpFormatted,
              });
            }
          }
        }
      } catch (dbErr: any) {
        console.error("[Stripe Webhook] DB update error:", dbErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
