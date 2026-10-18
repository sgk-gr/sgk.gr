import { buildProfessionalEmailHtml } from "./emailTemplates";

export type HostingReminderStage = "20_days" | "15_days" | "5_days" | "3_days" | "0_days";

export interface HostingClientData {
  id?: string;
  companyName: string;
  email: string;
  domainName: string;
  registrationDate: string; // YYYY-MM-DD
  renewalDate: string;      // YYYY-MM-DD
  renewalPrice?: string;    // e.g. "80€ + ΦΠΑ" or "80€"
  daysRemaining: number;
}

/**
 * Standard mandatory Red Warning Box required by user rules
 */
export const MANDATORY_RED_WARNING_HTML = `
<!-- RED WARNING BOX -->
<div style="background-color: #fef2f2; border: 2px solid #ef4444; border-left: 6px solid #dc2626; border-radius: 10px; padding: 16px 18px; margin: 22px 0;">
  <p style="margin: 0; color: #dc2626; font-size: 15px; font-weight: 800; line-height: 1.55;">
    ⚠️ ΣΗΜΑΝΤΙΚΗ ΠΡΟΕΙΔΟΠΟΙΗΣΗ &amp; ΚΙΝΔΥΝΟΣ ΠΡΟΣΤΙΜΟΥ:<br/>
    <span style="font-weight: 600; color: #b91c1c;">
      Σε περίπτωση μη ανανέωσης, η ιστοσελίδα σας θα σταματήσει αυτόματα να ισχύει και να λειτουργεί, με άμεσο αποτέλεσμα το <u>χάσιμο κρατήσεων και πελατών</u>, καθώς και την <u>επιβολή προστίμου από αυτεπάγγελτο έλεγχο του Γ.Ε.ΜΗ.</u> λόγω παραβίασης της νόμιμης υποχρέωσης δημοσιότητας εταιρικών στοιχείων στο διαδίκτυο (Άρθρο 47, Ν. 4072/2012).
    </span>
  </p>
</div>
`;

/**
 * Bank Details Card for Payment
 */
export const BANK_DETAILS_HTML = `
<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 18px; margin: 20px 0;">
  <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 800; color: #1e3a8a;">
    💳 Στοιχεία Τραπεζικού Λογαριασμού για την Ανανέωση:
  </p>
  <div style="font-size: 13.5px; color: #1e293b; line-height: 1.6;">
    <strong>Τράπεζα:</strong> Eurobank<br/>
    <strong>IBAN:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px;">GR4602601970000830201330337</code><br/>
    <strong>Δικαιούχος:</strong> Σπυρίδων Τσάβος (SGK Digital)<br/>
    <strong>Αιτιολογία:</strong> Ανανέωση Hosting [Επωνυμία Εταιρείας σας ή Domain]
  </div>
</div>
`;

/**
 * Stripe Online Payment Card
 */
export function getStripePaymentCardHtml(client: HostingClientData): string {
  const price = client.renewalPrice || "80,00 € (συμπ. ΦΠΑ)";
  const checkoutUrl = client.id 
    ? `https://www.sgk.gr/api/hosting/checkout?client=${encodeURIComponent(client.id)}`
    : `https://www.sgk.gr/api/hosting/checkout?domain=${encodeURIComponent(client.domainName || "")}`;

  return `
<!-- STRIPE ONLINE PAYMENT CARD -->
<div style="background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%); border: 2px solid #3b5bdb; border-radius: 12px; padding: 22px 20px; margin: 22px 0; text-align: center;">
  <p style="margin: 0 0 6px 0; font-size: 15px; font-weight: 800; color: #1e3a8a;">
    💳 Άμεση Εξόφληση Online με Κάρτα / Apple Pay / Google Pay
  </p>
  <p style="margin: 0 0 16px 0; font-size: 13px; color: #475569; line-height: 1.5;">
    Ολοκληρώστε την ανανέωση άμεσα online για αδιάλειπτη λειτουργία της ιστοσελίδας σας:
  </p>
  <div style="margin: 14px 0;">
    <a href="${checkoutUrl}" 
       style="display: inline-block; background-color: #3b5bdb; background: linear-gradient(135deg, #3b5bdb 0%, #2563eb 100%); color: #ffffff; font-size: 15px; font-weight: 800; text-decoration: none; padding: 14px 34px; border-radius: 10px; box-shadow: 0 4px 14px rgba(59, 91, 219, 0.35); letter-spacing: 0.3px;">
      🔒 Πληρωμή Online (${price}) &rarr;
    </a>
  </div>
  <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b; line-height: 1.4;">
    🛡️ Ασφαλής κρυπτογραφημένη συναλλαγή μέσω <strong>Stripe</strong> • Άμεση αυτόματη ενεργοποίηση
  </p>
</div>

<div style="text-align: center; margin: 18px 0 10px 0;">
  <span style="display: inline-block; background-color: #f1f5f9; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; color: #64748b;">
    ή εναλλακτικά μέσω Τραπεζικής Κατάθεσης
  </span>
</div>
`;
}

/**
 * Generate Subject & HTML Body for each of the 5 Snappy Reminder Stages
 */
export function getHostingRenewalEmail(client: HostingClientData, stage: HostingReminderStage): { subject: string; html: string; bodyHtml: string } {
  const company = client.companyName || "Αξιότιμε συνεργάτη";
  const domain = client.domainName || "την ιστοσελίδα σας";
  const price = client.renewalPrice || "80,00 € (συμπ. ΦΠΑ)";
  const renewalDateFormatted = client.renewalDate;

  let subject = "";
  let bodyHtml = "";

  switch (stage) {
    case "20_days":
      subject = `Ειδοποίηση Ανανέωσης Hosting & Domain: 20 ημέρες μέχρι τη λήξη — ${company}`;
      bodyHtml = `
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; line-height: 1.35; margin: 0 0 14px 0;">
          Ετήσια Ανανέωση Φιλοξενίας (Hosting) &amp; Domain Name
        </h2>
        <p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.6;">
          Αγαπητέ συνεργάτη,
        </p>
        <p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
          Σας ενημερώνουμε ότι σε <strong>20 ημέρες</strong> (στις <strong>${renewalDateFormatted}</strong>) συμπληρώνεται το ετήσιο διάστημα φιλοξενίας της ιστοσελίδας σας <strong>${domain}</strong>.
        </p>
        <p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
          Για να διατηρηθεί η αδιάλειπτη και ασφαλής λειτουργία του ιστότοπου, των εταιρικών σας emails και η νόμιμη καταχώρηση στο Γ.Ε.ΜΗ., παρακαλούμε για την έγκαιρη ανανέωση του πακέτου σας:
        </p>

        <!-- Package Features Box -->
        <div style="background-color: #f1f5f9; border-left: 5px solid #3b5bdb; border-radius: 8px; padding: 14px 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px 0; font-weight: 800; color: #1e3a8a; font-size: 14.5px;">
            📦 Ετήσιο Πακέτο Φιλοξενίας &amp; Συμμόρφωσης (${price}):
          </p>
          <ul style="margin: 0; padding-left: 18px; font-size: 13.5px; color: #334155; line-height: 1.55;">
            <li><strong>High-Speed Cloud Hosting</strong> για 1 επιπλέον έτος (99.9% Uptime).</li>
            <li><strong>Ανανέωση Domain Name (${domain})</strong> στο αρμόδιο Μητρώο.</li>
            <li><strong>Πιστοποιητικό Ασφαλείας SSL</strong> (HTTPS encryption).</li>
            <li><strong>Εταιρικά Emails</strong> (π.χ. info@${domain}).</li>
            <li><strong>Συνεχής Τεχνική Υποστήριξη &amp; Συμμόρφωση Γ.Ε.ΜΗ.</strong></li>
          </ul>
        </div>

        ${MANDATORY_RED_WARNING_HTML}

        ${getStripePaymentCardHtml(client)}

        ${BANK_DETAILS_HTML}

        <p style="margin: 16px 0 0 0; font-size: 13.5px; color: #475569; line-height: 1.5;">
          Σε περίπτωση τραπεζικής κατάθεσης, παρακαλούμε αποστείλετε το αποδεικτικό στο <a href="mailto:info@sgk.gr" style="color: #3b5bdb; font-weight: 700;">info@sgk.gr</a> για την άμεση έκδοση του τιμολογίου σας.
        </p>
      `;
      break;

    case "15_days":
      subject = `Υπενθύμιση: 15 ημέρες απομένουν για την ανανέωση Hosting & Γ.Ε.ΜΗ. — ${company}`;
      bodyHtml = `
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; line-height: 1.35; margin: 0 0 14px 0;">
          Υπενθύμιση: 15 Ημέρες μέχρι τη Λήξη Φιλοξενίας
        </h2>
        <p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.6;">
          Αγαπητέ συνεργάτη,
        </p>
        <p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
          Επικοινωνούμε εκ νέου καθώς απομένουν μόλις <strong>15 ημέρες</strong> μέχρι τη λήξη της φιλοξενίας της ιστοσελίδας σας <strong>${domain}</strong> (Ημ. Λήξης: <strong>${renewalDateFormatted}</strong>).
        </p>
        <p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
          Καθώς δεν έχουμε λάβει ακόμα ενημέρωση εξόφλησης για το ετήσιο κόστος των <strong>${price}</strong>, παρακαλούμε όπως τακτοποιήσετε την οφειλή για να αποτραπεί οποιαδήποτε διακοπή.
        </p>

        ${MANDATORY_RED_WARNING_HTML}

        ${getStripePaymentCardHtml(client)}

        ${BANK_DETAILS_HTML}

        <p style="margin: 16px 0 0 0; font-size: 13.5px; color: #475569;">
          Αν έχετε ήδη πραγματοποιήσει την πληρωμή εντός της ημέρας, παρακαλούμε αγνοήστε το παρόν μήνυμα.
        </p>
      `;
      break;

    case "5_days":
      subject = `⚠️ ΕΠΕΙΓΟΝ: 5 ημέρες απομένουν για τη λήξη του Hosting σας — ${company}`;
      bodyHtml = `
        <h2 style="color: #b91c1c; font-size: 20px; font-weight: 800; line-height: 1.35; margin: 0 0 14px 0;">
          ⚠️ Επείγουσα Ειδοποίηση: 5 Ημέρες μέχρι τη Λήξη
        </h2>
        <p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.6;">
          Αγαπητέ διαχειριστή της <strong>${company}</strong>,
        </p>
        <p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
          Σας ενημερώνουμε ότι απομένουν <strong>μόλις 5 ημέρες</strong> μέχρι τη λήξη της συνδρομής φιλοξενίας (hosting) του ιστότοπου <strong>${domain}</strong> (στις <strong>${renewalDateFormatted}</strong>).
        </p>

        ${MANDATORY_RED_WARNING_HTML}

        <p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
          Το ποσό ανανέωσης ανέρχεται σε <strong>${price}</strong>. Παρακαλούμε να προβείτε στην εξόφληση άμεσα προς αποφυγή αυτόματης αναστολής λειτουργίας των servers.
        </p>

        ${getStripePaymentCardHtml(client)}

        ${BANK_DETAILS_HTML}
      `;
      break;

    case "3_days":
      subject = `🚨 ΤΕΛΙΚΗ ΠΡΟΕΙΔΟΠΟΙΗΣΗ (72 Ώρες): Άμεση διακοπή ιστοσελίδας & κίνδυνος προστίμου — ${company}`;
      bodyHtml = `
        <h2 style="color: #dc2626; font-size: 21px; font-weight: 900; line-height: 1.3; margin: 0 0 14px 0;">
          🚨 ΤΕΛΙΚΗ ΠΡΟΕΙΔΟΠΟΙΗΣΗ: 72 Ώρες μέχρι τη Διακοπή
        </h2>
        <p style="margin: 0 0 12px 0; color: #1e293b; font-size: 15px; line-height: 1.6;">
          Αξιότιμε διαχειριστή,
        </p>
        <p style="margin: 0 0 14px 0; color: #1e293b; font-size: 15px; line-height: 1.6;">
          Απομένουν <strong>μόλις 3 ημέρες (72 ώρες)</strong> μέχρι την οριστική λήξη του hosting για την ιστοσελίδα <strong>${domain}</strong> (Ημ. Λήξης: <strong>${renewalDateFormatted}</strong>).
        </p>

        ${MANDATORY_RED_WARNING_HTML}

        <div style="background-color: #fff7ed; border-left: 5px solid #ea580c; border-radius: 8px; padding: 12px 16px; margin: 16px 0; font-size: 14px; color: #9a3412;">
          ⏰ <strong>Χρονικό Όριο Εξόφλησης:</strong> Για να αποφευχθεί η αυτόματη απενεργοποίηση του domain και των εταιρικών σας emails, η εξόφληση των <strong>${price}</strong> πρέπει να καταχωρηθεί εντός 72 ωρών.
        </div>

        ${getStripePaymentCardHtml(client)}

        ${BANK_DETAILS_HTML}

        <p style="margin: 14px 0 0 0; font-size: 13.5px; color: #475569;">
          📞 Για άμεση τηλεφωνική υποστήριξη καλέστε μας στα <strong>211 114 0013</strong> / <strong>6999 524 389</strong>.
        </p>
      `;
      break;

    case "0_days":
    default:
      subject = `⛔ ΣΗΜΕΡΑ ΛΗΓΕΙ ΤΟ HOSTING: Άμεση διακοπή ιστοσελίδας & κίνδυνος προστίμου Γ.Ε.ΜΗ. — ${company}`;
      bodyHtml = `
        <h2 style="color: #991b1b; font-size: 22px; font-weight: 900; line-height: 1.3; margin: 0 0 14px 0;">
          ⛔ ΣΗΜΕΡΑ ΛΗΓΕΙ Η ΦΙΛΟΞΕΝΙΑ (HOSTING): Διακοπή εντός της ημέρας
        </h2>
        <p style="margin: 0 0 12px 0; color: #1e293b; font-size: 15px; line-height: 1.6;">
          Αξιότιμε διαχειριστή,
        </p>
        <p style="margin: 0 0 14px 0; color: #1e293b; font-size: 15px; line-height: 1.6;">
          Η ετήσια συνδρομή φιλοξενίας της ιστοσελίδας σας <strong>${domain}</strong> <strong>ΕΛΗΞΕ ΣΗΜΕΡΑ (${renewalDateFormatted})</strong> και δεν έχει καταγραφεί πληρωμή στο σύστημά μας.
        </p>

        ${MANDATORY_RED_WARNING_HTML}

        <div style="background-color: #fef2f2; border: 1px dashed #ef4444; border-radius: 8px; padding: 14px 16px; margin: 16px 0; font-size: 14px; color: #991b1b; line-height: 1.55;">
          🛑 <strong>ΑΥΤΟΜΑΤΗ ΑΝΑΣΤΟΛΗ ΥΠΗΡΕΣΙΩΝ:</strong><br/>
          Εάν δεν ολοκληρωθεί η εξόφληση των <strong>${price}</strong> εντός των επόμενων ωρών, το σύστημα θα θέσει τον ιστότοπο εκτός λειτουργίας (Suspended) και τα εταιρικά emails θα πάψουν να λαμβάνουν μηνύματα.
        </div>

        ${getStripePaymentCardHtml(client)}

        ${BANK_DETAILS_HTML}

        <div style="background-color: #eff6ff; border-radius: 8px; padding: 12px 16px; margin: 16px 0; text-align: center; font-size: 14px; color: #1e40af;">
          📞 <strong>Επείγουσα Επικοινωνία:</strong><br/>
          Καλέστε μας άμεσα στο <strong><a href="tel:6999524389" style="color: #1e40af; text-decoration: underline;">6999 524 389</a></strong> ή <strong><a href="tel:2111140013" style="color: #1e40af; text-decoration: underline;">211 114 0013</a></strong>.
        </div>
      `;
      break;
  }

  const checkoutUrl = client.id 
    ? `https://www.sgk.gr/api/hosting/checkout?client=${encodeURIComponent(client.id)}`
    : `https://www.sgk.gr/api/hosting/checkout?domain=${encodeURIComponent(client.domainName || "")}`;

  // Wrap in official SGK Email layout
  const fullHtml = buildProfessionalEmailHtml({
    businessName: company,
    subject,
    bodyHtml,
    buttonText: `💳 Άμεση Εξόφληση Online (${price})`,
    buttonLink: checkoutUrl,
    unsubscribeToken: client.id || "hosting-renewal",
  });

  return { subject, html: fullHtml, bodyHtml };
}

/**
 * Admin Pre-Dispatch Heads-Up Email
 * Sent to info@sgk.gr 1 day BEFORE an email is sent to any client
 */
export function getAdminHeadsUpBriefingEmail(
  client: HostingClientData, 
  stageToDispatchTomorrow: HostingReminderStage,
  dispatchDateFormatted: string
): { subject: string; html: string } {
  const company = client.companyName || "Πελάτης";
  const domain = client.domainName || "domain";
  const price = client.renewalPrice || "80,00 € (συμπ. ΦΠΑ)";
  const email = client.email;

  const stageLabels: Record<HostingReminderStage, string> = {
    "20_days": "1η Ειδοποίηση (20 ημέρες πριν τη λήξη)",
    "15_days": "2η Υπενθύμιση (15 ημέρες πριν τη λήξη)",
    "5_days": "3η Επείγουσα Ειδοποίηση (5 ημέρες πριν τη λήξη)",
    "3_days": "4η Τελική Προειδοποίηση (72 Ώρες Countdown)",
    "0_days": "5η Άμεση Διακοπή (Ημέρα Λήξης)",
  };

  const stageText = stageLabels[stageToDispatchTomorrow] || stageToDispatchTomorrow;
  const clientDraft = getHostingRenewalEmail(client, stageToDispatchTomorrow);

  const subject = `[ΕΝΗΜΕΡΩΣΗ SGK] Αύριο θα σταλεί email πληρωμής σε: ${company} (${price})`;

  const bodyHtml = `
    <div style="background-color: #f0fdf4; border: 2px solid #22c55e; border-left: 6px solid #16a34a; border-radius: 10px; padding: 16px 18px; margin: 0 0 20px 0;">
      <h2 style="color: #166534; font-size: 18px; font-weight: 800; margin: 0 0 6px 0;">
        🔔 Ενημέρωση Διαχειριστή: Προγραμματισμένη Αποστολή Αύριο
      </h2>
      <p style="margin: 0; color: #15803d; font-size: 14px; line-height: 1.5;">
        Το αυτοματοποιημένο σύστημα ανανεώσεων της SGK Digital θα αποστείλει <strong>αύριο (${dispatchDateFormatted}) στις 11:00 π.μ.</strong> email υπενθύμισης πληρωμής στον παρακάτω πελάτη.
      </p>
    </div>

    <!-- Client & Pricing Summary Table -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin: 18px 0;">
      <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 800; color: #0f172a;">
        📋 Στοιχεία Επερχόμενης Χρέωσης &amp; Αποστολής:
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; line-height: 1.6;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; width: 35%;"><strong>Επωνυμία Πελάτη:</strong></td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 700;">${company}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;"><strong>Email Παραλήπτη:</strong></td>
          <td style="padding: 6px 0; color: #2563eb; font-weight: 700;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;"><strong>Ιστοσελίδα / Domain:</strong></td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 700;"><a href="https://${domain}" target="_blank" style="color: #3b5bdb; text-decoration: underline;">${domain}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;"><strong>Ποσό Χρέωσης:</strong></td>
          <td style="padding: 6px 0; color: #16a34a; font-weight: 800; font-size: 15px;">${price}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;"><strong>Στάδιο που θα σταλεί:</strong></td>
          <td style="padding: 6px 0; color: #b45309; font-weight: 700;">${stageText}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b;"><strong>Ημερομηνία Λήξης:</strong></td>
          <td style="padding: 6px 0; color: #dc2626; font-weight: 700;">${client.renewalDate} (απομένουν ${client.daysRemaining} ημέρες)</td>
        </tr>
      </table>
    </div>

    <!-- Action Prompt for Admin -->
    <div style="background-color: #fffbeb; border: 1px solid #fef08a; border-radius: 8px; padding: 14px 16px; margin: 18px 0; font-size: 13.5px; color: #854d0e; line-height: 1.55;">
      💡 <strong>Σημείωση για τον Διαχειριστή:</strong><br/>
      Εάν ο πελάτης έχει ήδη πληρώσει με μετρητά, κατάθεση ή άλλη συμφωνία, μπείτε στο <strong>Admin ➔ Ανανεώσεις Hosting</strong> και πατήστε <strong>«Δήλωση Πληρωμής»</strong> ώστε η αυριανή αποστολή να ακυρωθεί αυτόματα.
    </div>

    <!-- Actual Email Preview Box -->
    <div style="margin: 24px 0 10px 0; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 18px; background-color: #ffffff;">
      <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 800; color: #334155;">
        ✉️ Προεπισκόπηση Email που θα λάβει ο πελάτης:
      </p>
      <div style="background-color: #f1f5f9; padding: 8px 12px; border-radius: 6px; font-size: 13px; color: #1e293b; margin-bottom: 14px; font-family: monospace;">
        <strong>Subject:</strong> ${clientDraft.subject}
      </div>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 14px;">
        ${clientDraft.bodyHtml}
      </div>
    </div>
  `;

  const fullHtml = buildProfessionalEmailHtml({
    businessName: "SGK Admin Portal",
    subject,
    bodyHtml,
    buttonText: "Άνοιγμα Admin Portal",
    buttonLink: "https://www.sgk.gr/admin?tab=hosting",
    unsubscribeToken: "admin-alert",
  });

  return { subject, html: fullHtml };
}
