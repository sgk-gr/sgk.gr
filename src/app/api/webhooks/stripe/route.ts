import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getServiceSupabase } from "@/lib/supabase";
import { dispatchEmailWithFallback } from "@/lib/emailDispatcher";
import { buildProfessionalEmailHtml } from "@/lib/emailTemplates";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET in environment");
    return NextResponse.json({ error: "Webhook secret unconfigured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: any;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error("Stripe Webhook Signature Verification Failed:", err.message);
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  // Handle Event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const clientId = session.metadata?.clientId || session.client_reference_id;
    const domain = session.metadata?.domain || "";
    const company = session.metadata?.company || "Πελάτης";
    const amountPaid = session.amount_total ? (session.amount_total / 100).toFixed(2) : "80.00";

    console.log(`[Stripe Webhook] Received payment for client: ${clientId} (${company} - ${domain}) - Amount: ${amountPaid}€`);

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

          // Advance renewal date by 1 year
          const currentExp = hosting.customExpiresAt ? new Date(hosting.customExpiresAt) : new Date(client.created_at);
          const newExp = new Date(currentExp);
          // If current was in the past, renew 1 year from today; otherwise add 1 year to current
          if (newExp.getTime() < Date.now()) {
            newExp.setTime(Date.now());
          }
          newExp.setFullYear(newExp.getFullYear() + 1);
          const newExpFormatted = newExp.toISOString().split("T")[0];

          // Update hosting metadata
          hosting.paid = true;
          hosting.paidAt = new Date().toISOString();
          hosting.paidVia = "stripe";
          hosting.stripeSessionId = session.id;
          hosting.stripePaymentIntent = session.payment_intent;
          hosting.customExpiresAt = newExpFormatted;
          hosting.lastStageSent = null; // reset reminders for next annual cycle

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

            // 1. Send Admin Notification to info@sgk.gr
            await dispatchEmailWithFallback({
              to: "info@sgk.gr",
              subject: `💰 [Stripe] Νέα Πληρωμή Hosting: ${amountPaid}€ από ${company} (${domain})`,
              html: buildProfessionalEmailHtml({
                businessName: "SGK System",
                subject: `💰 [Stripe] Νέα Πληρωμή Hosting: ${amountPaid}€ από ${company} (${domain})`,
                bodyHtml: `
                <h2 style="color: #10b981; font-size: 20px; font-weight: 800; margin: 0 0 14px 0;">
                  ✅ Επιτυχής Πληρωμή Hosting μέσω Stripe!
                </h2>
                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; margin: 16px 0;">
                  <p style="margin: 0 0 8px 0; font-size: 15px; color: #166534; font-weight: 700;">
                    Στοιχεία Συναλλαγής:
                  </p>
                  <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #1e293b; line-height: 1.6;">
                    <li><strong>Πελάτης / Brand:</strong> ${company}</li>
                    <li><strong>Domain:</strong> ${domain}</li>
                    <li><strong>Ποσό που Εισπράχθηκε:</strong> ${amountPaid} €</li>
                    <li><strong>Email Πελάτη:</strong> ${client.email}</li>
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
              const confirmSubj = `Επιβεβαίωση Πληρωμής & Ανανέωση Φιλοξενίας: ${domain} — SGK Digital`;
              await dispatchEmailWithFallback({
                to: client.email,
                subject: confirmSubj,
                html: buildProfessionalEmailHtml({
                  businessName: company,
                  subject: confirmSubj,
                  bodyHtml: `
                  <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 14px 0;">
                    Σας ευχαριστούμε για την ανανέωση της συνδρομής σας!
                  </h2>
                  <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                    Αξιότιμε συνεργάτη,
                  </p>
                  <p style="font-size: 15px; color: #334155; line-height: 1.6;">
                    Επιβεβαιώνουμε ότι η πληρωμή σας ποσού <strong>${amountPaid} €</strong> για την ετήσια ανανέωση της φιλοξενίας (hosting) και του domain <strong>${domain}</strong> ολοκληρώθηκε επιτυχώς.
                  </p>
                  <div style="background-color: #f8fafc; border-left: 5px solid #10b981; border-radius: 8px; padding: 14px 18px; margin: 18px 0;">
                    <p style="margin: 0 0 6px 0; font-weight: 800; color: #0f172a; font-size: 14px;">
                      📋 Στοιχεία Ανανεωμένου Πακέτου:
                    </p>
                    <ul style="margin: 0; padding-left: 18px; font-size: 13.5px; color: #334155; line-height: 1.6;">
                      <li><strong>Ιστοσελίδα:</strong> https://${domain}</li>
                      <li><strong>Νέα Ημερομηνία Λήξης:</strong> ${newExpFormatted}</li>
                      <li><strong>Κατάσταση:</strong> Ενεργή &amp; Πλήρως Συμμορφωμένη με το Γ.Ε.ΜΗ.</li>
                      <li><strong>Τεχνική Υποστήριξη &amp; SSL:</strong> Σε ισχύ για 1 επιπλέον έτος</li>
                    </ul>
                  </div>
                  <p style="font-size: 13.5px; color: #475569; line-height: 1.6;">
                    Το νόμιμο φορολογικό παραστατικό / τιμολόγιο θα εκδοθεί και θα σας αποσταλεί στο παρόν email. Για οποιαδήποτε απορία, παραμένουμε στη διάθεσή σας στο <a href="mailto:info@sgk.gr" style="color: #3b5bdb; font-weight: 700;">info@sgk.gr</a> και στο 211 114 0013.
                  </p>
                `,
                  unsubscribeToken: clientId,
                }),
                fromName: "SGK Digital (Hosting)",
                fromEmail: "info@sgk.gr",
                replyTo: "info@sgk.gr",
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
