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
 * Generate Subject & HTML Body for each of the 5 Snappy Reminder Stages
 */
export function getHostingRenewalEmail(client: HostingClientData, stage: HostingReminderStage): { subject: string; html: string } {
  const company = client.companyName || "Αξιότιμε συνεργάτη";
  const domain = client.domainName || "την ιστοσελίδα σας";
  const price = client.renewalPrice || "80,00 € (συμπ. ΦΠΑ)";
  const renewalDateFormatted = client.renewalDate;

  let subject = "";
  let bodyHtml = "";

  switch (stage) {
    case "20_days":
      subject = `Ειδοποίηση Ανανέωσης Hosting & Domain (.gr): 20 ημέρες μέχρι τη λήξη — ${company}`;
      bodyHtml = `
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; line-height: 1.35; margin: 0 0 14px 0;">
          Ετήσια Ανανέωση Φιλοξενίας (Hosting) &amp; Domain Name (.gr)
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
            <li><strong>Ανανέωση Domain Name (.gr)</strong> στο Εθνικό Μητρώο.</li>
            <li><strong>Πιστοποιητικό Ασφαλείας SSL</strong> (HTTPS encryption).</li>
            <li><strong>Εταιρικά Emails</strong> (π.χ. info@${domain}).</li>
            <li><strong>Συνεχής Τεχνική Υποστήριξη &amp; Συμμόρφωση Γ.Ε.ΜΗ.</strong></li>
          </ul>
        </div>

        ${MANDATORY_RED_WARNING_HTML}

        ${BANK_DETAILS_HTML}

        <p style="margin: 16px 0 0 0; font-size: 13.5px; color: #475569; line-height: 1.5;">
          Μόλις ολοκληρώσετε την κατάθεση, παρακαλούμε αποστείλετε το αποδεικτικό στο <a href="mailto:info@sgk.gr" style="color: #3b5bdb; font-weight: 700;">info@sgk.gr</a> για την άμεση έκδοση του τιμολογίου σας.
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

        ${BANK_DETAILS_HTML}

        <p style="margin: 16px 0 0 0; font-size: 13.5px; color: #475569;">
          Αν έχετε ήδη πραγματοποιήσει την κατάθεση εντός της ημέρας, παρακαλούμε αγνοήστε το παρόν μήνυμα ή προωθήστε μας το αποδεικτικό.
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
          ⏰ <strong>Χρονικό Όριο Εξόφλησης:</strong> Για να αποφευχθεί η αυτόματη απενεργοποίηση του domain και των εταιρικών σας emails, η κατάθεση των <strong>${price}</strong> πρέπει να καταχωρηθεί εντός 72 ωρών.
        </div>

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
          Εάν δεν αποσταλεί αποδεικτικό κατάθεσης των <strong>${price}</strong> εντός των επόμενων ωρών, το σύστημα θα θέσει τον ιστότοπο εκτός λειτουργίας (Suspended) και τα εταιρικά emails θα πάψουν να λαμβάνουν μηνύματα.
        </div>

        ${BANK_DETAILS_HTML}

        <div style="background-color: #eff6ff; border-radius: 8px; padding: 12px 16px; margin: 16px 0; text-align: center; font-size: 14px; color: #1e40af;">
          📞 <strong>Επείγουσα Επικοινωνία:</strong><br/>
          Καλέστε μας άμεσα στο <strong><a href="tel:6999524389" style="color: #1e40af; text-decoration: underline;">6999 524 389</a></strong> ή <strong><a href="tel:2111140013" style="color: #1e40af; text-decoration: underline;">211 114 0013</a></strong>.
        </div>
      `;
      break;
  }

  // Wrap in official SGK Email layout
  const fullHtml = buildProfessionalEmailHtml({
    businessName: company,
    subject,
    bodyHtml,
    buttonText: `Εξόφληση Ανανέωσης (${client.renewalPrice || "80€"})`,
    buttonLink: "https://www.sgk.gr/terms",
    unsubscribeToken: client.id || "hosting-renewal",
  });

  return { subject, html: fullHtml };
}
