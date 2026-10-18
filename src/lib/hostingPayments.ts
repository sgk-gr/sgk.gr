import { buildProfessionalEmailHtml } from "./emailTemplates";
import { dispatchEmailWithFallback } from "./emailDispatcher";

export type HostingPaymentMethod = "stripe_live" | "stripe_sandbox" | "demo" | "manual";

export interface HostingPayment {
  id: string;
  paidAt: string; // ISO
  amount: string; // e.g. "80.00"
  method: HostingPaymentMethod;
  sessionId?: string;
  prevExpiry: string | null; // YYYY-MM-DD
  newExpiry: string; // YYYY-MM-DD
  voided?: boolean;
}

/**
 * New expiry = current expiry + 1 year. If the current expiry is already in the past,
 * the year is counted from today.
 */
export function computeNewExpiry(currentExpiry: string | null | undefined, createdAt: string): string {
  const base = currentExpiry ? new Date(currentExpiry) : new Date(createdAt);
  if (base.getTime() < Date.now()) {
    base.setTime(Date.now());
  }
  base.setFullYear(base.getFullYear() + 1);
  return base.toISOString().split("T")[0];
}

/** Extracts a numeric amount from a price string such as "80,00 € (συμπ. ΦΠΑ)" -> "80.00" */
export function parseAmount(priceStr?: string): string {
  if (!priceStr) return "80.00";
  const m = priceStr.replace(/\s+/g, "").match(/(\d+[.,]?\d*)/);
  if (!m) return "80.00";
  const n = parseFloat(m[1].replace(",", "."));
  return isNaN(n) ? "80.00" : n.toFixed(2);
}

export function getPayments(hosting: any): HostingPayment[] {
  return Array.isArray(hosting?.payments) ? hosting.payments : [];
}

/** Appends a payment entry to the hosting history and returns it. */
export function addPaymentToHistory(
  hosting: any,
  data: Omit<HostingPayment, "id" | "paidAt"> & { paidAt?: string }
): HostingPayment {
  const payment: HostingPayment = {
    id: `pay_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    paidAt: data.paidAt || new Date().toISOString(),
    amount: data.amount,
    method: data.method,
    sessionId: data.sessionId,
    prevExpiry: data.prevExpiry,
    newExpiry: data.newExpiry,
  };
  hosting.payments = [...getPayments(hosting), payment];
  return payment;
}

/** Sends the "payment completed / subscription renewed" confirmation to the customer. */
export async function sendClientPaymentConfirmation(opts: {
  clientId: string;
  email: string;
  company: string;
  domain: string;
  amount: string;
  newExpiry: string;
}) {
  const { clientId, email, company, domain, amount, newExpiry } = opts;
  if (!email) return { success: false, error: "No client email" };

  const subject = `Επιβεβαίωση Πληρωμής & Ανανέωση Φιλοξενίας: ${domain} — SGK Digital`;
  return dispatchEmailWithFallback({
    to: email,
    subject,
    html: buildProfessionalEmailHtml({
      businessName: company,
      subject,
      bodyHtml: `
      <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 14px 0;">
        Σας ευχαριστούμε για την ανανέωση της συνδρομής σας!
      </h2>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        Αξιότιμε συνεργάτη,
      </p>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        Επιβεβαιώνουμε ότι η πληρωμή σας ποσού <strong>${amount} €</strong> για την ετήσια ανανέωση της φιλοξενίας (hosting) και του domain <strong>${domain}</strong> ολοκληρώθηκε επιτυχώς.
      </p>
      <div style="background-color: #f8fafc; border-left: 5px solid #10b981; border-radius: 8px; padding: 14px 18px; margin: 18px 0;">
        <p style="margin: 0 0 6px 0; font-weight: 800; color: #0f172a; font-size: 14px;">
          📋 Στοιχεία Ανανεωμένου Πακέτου:
        </p>
        <ul style="margin: 0; padding-left: 18px; font-size: 13.5px; color: #334155; line-height: 1.6;">
          <li><strong>Ιστοσελίδα:</strong> https://${domain}</li>
          <li><strong>Νέα Ημερομηνία Λήξης:</strong> ${newExpiry}</li>
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
