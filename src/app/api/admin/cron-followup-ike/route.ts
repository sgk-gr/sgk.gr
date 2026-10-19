import { NextResponse } from "next/server";
import { getServiceSupabase, getSupabaseServiceRoleKey, SUPABASE_URL } from "@/lib/supabase";
import { buildProfessionalEmailHtml } from "@/lib/emailTemplates";
import { isEmailBlacklisted } from "@/lib/blacklist";
import { dispatchEmailWithFallback } from "@/lib/emailDispatcher";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export const IKE_FOLLOWUP_SUBJECT = "Re: Σχετικά με τη δήλωση εταιρικής ιστοσελίδας στο Γ.Ε.ΜΗ. (80€ με ΦΠΑ)";

// Calculate calendar-based cutoff in Greek timezone (Europe/Athens)
// If today is day D in Greece, any email sent on or before (D - days) calendar date is eligible on morning run!
export function getCalendarCutoffIso(days: number = 3): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Athens",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const greekTodayStr = formatter.format(now); // e.g. "2026-10-15"
  const [y, m, d] = greekTodayStr.split("-").map(Number);

  // Target day in Greece: D - days (e.g. on Oct 15 with days=3, target is Oct 12)
  // Any email sent up to the end of that day in Greece (23:59:59.999 local time) is eligible
  const targetDate = new Date(Date.UTC(y, m - 1, d - days, 23, 59, 59, 999));
  
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Athens",
    timeZoneName: "shortOffset",
  }).formatToParts(targetDate);
  const tzPart = parts.find(p => p.type === "timeZoneName")?.value || "GMT+3";
  const offsetHours = tzPart.includes("+3") ? 3 : 2;

  const cutoffUtc = new Date(targetDate.getTime() - offsetHours * 60 * 60 * 1000);
  return cutoffUtc.toISOString();
}

export const IKE_FOLLOWUP_BODY = `<h2 style="color: #0f172a; font-size: 19px; font-weight: 800; line-height: 1.35; margin: 0 0 14px 0;">
  Υπενθύμιση: Υποχρεωτική Εταιρική Ιστοσελίδα Ι.Κ.Ε. στο Γ.Ε.ΜΗ.
</h2>

<p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Αγαπητέ διαχειριστή,
</p>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Επικοινωνούμε σύντομα σε συνέχεια του προηγούμενου μηνύματός μας. Σύμφωνα με το <strong>Άρθρο 47 του Ν.4072/2012</strong>, κάθε Ι.Κ.Ε. οφείλει να διαθέτει και να δηλώσει εταιρική ιστοσελίδα στο Γ.Ε.ΜΗ.
</p>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Η εκκρεμότητα δεν φεύγει από μόνη της και φαίνεται σε όλους στο Γ.Ε.ΜΗ. <strong>Σε έναν έλεγχο, μπορεί να σας δημιουργήσει πρόβλημα.</strong> Στην <strong>SGK Digital</strong> το αναλαμβάνουμε <strong>με 0 κόπο από εσάς</strong>:
</p>

<!-- Value Box -->
<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #3b5bdb; border-radius: 10px; padding: 14px 16px; margin: 16px 0;">
  <p style="margin: 0 0 8px 0; font-size: 14.5px; font-weight: 800; color: #1e3a8a;">
    📦 Πλήρες Πακέτο Γ.Ε.ΜΗ. στα 80€ (τελική τιμή με ΦΠΑ):
  </p>
  <ul style="margin: 0; padding-left: 18px; font-size: 13.5px; color: #1e293b; line-height: 1.55;">
    <li><strong>Έτοιμη σε 24 ώρες:</strong> Πιστοποιημένη διασύνδεση με το Γ.Ε.ΜΗ. (API) μέσω επίσημης πρόσβασης gov.gr, χωρίς να γράψετε κείμενα.</li>
    <li><strong>Κατοχύρωση .gr Domain &amp; Hosting για 1 έτος.</strong></li>
    <li><strong>Επαγγελματικό Λογότυπο &amp; Εταιρικό Email</strong> (π.χ. info@...).</li>
    <li><strong>Επίσημο Τιμολόγιο Εξόδων</strong> για τα βιβλία της εταιρείας σας.</li>
  </ul>
</div>

<p style="margin: 0 0 14px 0; font-size: 13.5px; color: #475569;">
  👉 <strong>Δείτε πρόσφατα δείγματα πελατών μας:</strong> 
  <a href="https://meltech-ike.gr/" target="_blank" style="color: #3b5bdb; font-weight: 700; text-decoration: underline;">meltech-ike.gr</a> &nbsp;|&nbsp; 
  <a href="https://www.sellascountryhouses.gr/" target="_blank" style="color: #3b5bdb; font-weight: 700; text-decoration: underline;">sellascountryhouses.gr</a>
</p>

<!-- Quick Action Box with Phone & Reply -->
<div style="background-color: #f1f5f9; border-radius: 8px; padding: 12px 14px; margin: 16px 0 12px 0; text-align: center; font-size: 13.5px; color: #334155;">
  📞 <strong>Επικοινωνία &amp; Άμεση Τακτοποίηση:</strong><br/>
  <a href="tel:2111140013" style="color: #3b5bdb; font-weight: 800; text-decoration: none; font-size: 15px;">☎️ 211 114 0013</a> &nbsp;|&nbsp; 
  <a href="tel:6999524389" style="color: #3b5bdb; font-weight: 800; text-decoration: none; font-size: 15px;">📱 6999 524 389</a>
  <div style="font-size: 12.5px; color: #64748b; margin-top: 4px;">(ή απαντήστε απευθείας σε αυτό το email με το ΑΦΜ σας)</div>
</div>`;

export const IKE_FOLLOWUP_BUTTON_TEXT = "Έναρξη Ιστοσελίδας ΙΚΕ (80€)";
export const IKE_FOLLOWUP_BUTTON_LINK = "https://www.sgk.gr/ike-offer";

export const IKE_FINAL_SUBJECT = "Τελευταία ενημέρωση: δήλωση εταιρικής ιστοσελίδας στο Γ.Ε.ΜΗ. (80€ με ΦΠΑ)";

export const IKE_FINAL_BODY = `<h2 style="color: #0f172a; font-size: 19px; font-weight: 800; line-height: 1.35; margin: 0 0 14px 0;">
  Τελευταία ενημέρωση για την εταιρική ιστοσελίδα στο Γ.Ε.ΜΗ.
</h2>

<p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Αγαπητέ διαχειριστή,
</p>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Σας έχουμε ενημερώσει με δύο προηγούμενα μηνύματα για την υποχρέωση δήλωσης εταιρικής ιστοσελίδας για την Ι.Κ.Ε. σας στο Γ.Ε.ΜΗ. <strong>Αυτό είναι το τελευταίο μήνυμα που θα λάβετε από εμάς για το θέμα.</strong> Η εκκρεμότητα παραμένει και φαίνεται σε όλους στο Γ.Ε.ΜΗ. και <strong>σε έναν έλεγχο μπορεί να σας δημιουργήσει πρόβλημα.</strong>
</p>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Αν το έχετε ήδη τακτοποιήσει με άλλον συνεργάτη, αγνοήστε το παρόν και σας ευχόμαστε καλή συνέχεια. Αν εκκρεμεί, το αναλαμβάνουμε εμείς ολοκληρωμένα:
</p>

<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #3b5bdb; border-radius: 10px; padding: 14px 16px; margin: 16px 0;">
  <p style="margin: 0 0 8px 0; font-size: 14.5px; font-weight: 800; color: #1e3a8a;">
    📦 Πλήρες Πακέτο Γ.Ε.ΜΗ. στα 80€ (τελική τιμή με ΦΠΑ):
  </p>
  <ul style="margin: 0; padding-left: 18px; font-size: 13.5px; color: #1e293b; line-height: 1.55;">
    <li><strong>Έτοιμη σε 24 ώρες</strong> με πιστοποιημένη διασύνδεση (API) μέσω επίσημης πρόσβασης gov.gr.</li>
    <li><strong>Domain .gr &amp; Hosting για 1 έτος</strong> συμπεριλαμβάνονται.</li>
    <li><strong>Επίσημο Τιμολόγιο Εξόδων</strong> για τα βιβλία της εταιρείας.</li>
  </ul>
</div>

<p style="margin: 0 0 14px 0; font-size: 13.5px; color: #475569;">
  👉 <strong>Δείτε πρόσφατα δείγματα πελατών μας:</strong> <a href="https://meltech-ike.gr/" target="_blank" style="color: #3b5bdb; font-weight: 700; text-decoration: underline;">meltech-ike.gr</a> &nbsp;|&nbsp; <a href="https://www.sellascountryhouses.gr/" target="_blank" style="color: #3b5bdb; font-weight: 700; text-decoration: underline;">sellascountryhouses.gr</a>
</p>

<div style="background-color: #f1f5f9; border-radius: 8px; padding: 12px 14px; margin: 16px 0 12px 0; text-align: center; font-size: 13.5px; color: #334155;">
  📞 <strong>Αν θέλετε να το κλείσετε τώρα:</strong><br/>
  <a href="tel:2111140013" style="color: #3b5bdb; font-weight: 800; text-decoration: none; font-size: 15px;">☎️ 211 114 0013</a> &nbsp;|&nbsp; 
  <a href="tel:6999524389" style="color: #3b5bdb; font-weight: 800; text-decoration: none; font-size: 15px;">📱 6999 524 389</a>
  <div style="font-size: 12.5px; color: #64748b; margin-top: 4px;">(ή απαντήστε απευθείας σε αυτό το email με το ΑΦΜ σας)</div>
</div>`;

// Days to wait after Step 2 before sending the final Step 3 notice
export const STEP3_WAIT_DAYS = 4;

type LeadRow = {
  id: string;
  email: string;
  company: string | null;
  first_name: string | null;
  last_name: string | null;
  unsubscribe_token: string | null;
  type: string | null;
  email_sequence_step: number;
  last_email_sent_at: string | null;
  unsubscribed: boolean;
  marketing_consent: boolean;
  converted: boolean;
  first_email_subject: string | null;
};

async function processFollowUp(days: number = 3, maxBatch: number = 100, forceReport: boolean = false) {
  const supabase = getServiceSupabase();
  const supabaseUrl = SUPABASE_URL;
  const supabaseServiceKey = getSupabaseServiceRoleKey();

  const cutoffStep1 = getCalendarCutoffIso(days);
  const cutoffStep2 = getCalendarCutoffIso(STEP3_WAIT_DAYS);
  const selectCols = "id, email, company, first_name, last_name, unsubscribe_token, type, email_sequence_step, last_email_sent_at, unsubscribed, marketing_consent, converted, first_email_subject";

  // Stage A: leads that already got Step 2 -> due for the final Step 3 (finish sequences first)
  const { data: step2Leads, error: err2 } = await supabase
    .from("sgk_mails")
    .select(selectCols)
    .eq("marketing_consent", true)
    .eq("unsubscribed", false)
    .eq("converted", false)
    .eq("email_sequence_step", 2)
    .lte("last_email_sent_at", cutoffStep2)
    .order("last_email_sent_at", { ascending: true })
    .limit(maxBatch);

  if (err2) {
    throw new Error(`Database query error: ${err2.message}`);
  }

  // Stage B: leads that got only Step 1 (any date) -> due for Step 2
  const remaining = Math.max(0, maxBatch - (step2Leads?.length || 0));
  let step1Leads: LeadRow[] = [];
  if (remaining > 0) {
    const { data, error } = await supabase
      .from("sgk_mails")
      .select(selectCols)
      .eq("marketing_consent", true)
      .eq("unsubscribed", false)
      .eq("converted", false)
      .eq("email_sequence_step", 1)
      .lte("last_email_sent_at", cutoffStep1)
      .order("last_email_sent_at", { ascending: true })
      .limit(remaining);
    if (error) {
      throw new Error(`Database query error: ${error.message}`);
    }
    step1Leads = (data || []) as LeadRow[];
  }

  const leads: LeadRow[] = [...((step2Leads || []) as LeadRow[]), ...step1Leads];

  const results: any[] = [];
  let sentCount = 0;
  let failCount = 0;

  for (const lead of leads || []) {
    const emailClean = (lead.email || "").toLowerCase().trim();
    if (!emailClean) continue;

    // Skip blacklisted
    if (isEmailBlacklisted(emailClean)) {
      results.push({ email: emailClean, status: "skipped_blacklisted" });
      continue;
    }

    // Skip FTTH (Fiber/Telecom) leads - FTTH leads NEVER receive follow-up emails
    const checkText = `${lead.company || ""} ${lead.email || ""} ${lead.first_name || ""} ${lead.last_name || ""}`.toLowerCase();
    const isFtth = lead.type === "ftth_telecom" || 
      checkText.includes("ftth") || 
      checkText.includes("fiber") || 
      checkText.includes("οπτικ") || 
      checkText.includes("καλωδιωσ") || 
      checkText.includes("τηλεπικοινων");

    const isNonIke = lead.type === "new_business_presence" || 
      lead.type === "non_ike" ||
      checkText.includes("ατομικ") ||
      checkText.includes("ομορρυθμ") ||
      checkText.includes("ετερορρυθμ") ||
      checkText.includes("ανωνυμ") ||
      checkText.includes(" ο.ε") ||
      checkText.includes(" οε") ||
      checkText.includes(" ε.ε") ||
      checkText.includes(" εε") ||
      checkText.includes(" α.ε") ||
      checkText.includes(" αε");

    // Do NOT skip legacy_ike! Both new_ike and legacy_ike are IKE companies requiring GEMI website (80€).
    if (isFtth || isNonIke) {
      results.push({ email: emailClean, status: "skipped_ftth_or_non_ike" });
      continue;
    }

    // Filter to ensure it's an IKE lead eligible for follow-up (matches frontend dueFollowUpIkeLeads)
    const isIke = (
      lead.type === "new_ike" ||
      lead.type === "legacy_ike" ||
      lead.type === "old_ike" ||
      lead.type === "imported" ||
      !lead.type ||
      (lead.company && (lead.company.toUpperCase().includes("ΙΚΕ") || lead.company.toUpperCase().includes("Ι.Κ.Ε."))) ||
      (lead.first_email_subject && (lead.first_email_subject.includes("Ι.Κ.Ε.") || lead.first_email_subject.includes("ΓΕΜΗ")))
    ) && !isFtth && !isNonIke;

    if (!isIke) {
      results.push({ email: emailClean, status: "skipped_not_ike" });
      continue;
    }

    const unsubscribeToken = lead.unsubscribe_token || crypto.randomUUID();
    const targetStep = lead.email_sequence_step === 2 ? 3 : 2;
    const isFinal = targetStep === 3;
    const stepSubject = isFinal ? IKE_FINAL_SUBJECT : IKE_FOLLOWUP_SUBJECT;

    const finalHtml = buildProfessionalEmailHtml({
      businessName: lead.first_name || lead.company || "Συνεργάτη",
      subject: stepSubject,
      bodyHtml: isFinal ? IKE_FINAL_BODY : IKE_FOLLOWUP_BODY,
      buttonText: IKE_FOLLOWUP_BUTTON_TEXT,
      buttonLink: IKE_FOLLOWUP_BUTTON_LINK,
      unsubscribeToken: unsubscribeToken,
      industry: lead.company,
    });

    try {
      const dispatchResult = await dispatchEmailWithFallback(
        {
          to: emailClean,
          subject: stepSubject,
          html: finalHtml,
          unsubscribeToken: unsubscribeToken,
          step: targetStep,
        },
        supabaseUrl,
        supabaseServiceKey
      );

      if (!dispatchResult.success) {
        throw new Error(dispatchResult.error || "Failed to dispatch email");
      }

      const now = new Date().toISOString();
      await supabase
        .from("sgk_mails")
        .update({
          email_sequence_step: targetStep,
          last_email_sent_at: now,
        })
        .eq("id", lead.id);

      sentCount++;
      results.push({ email: emailClean, company: lead.company, status: "sent", step: targetStep });
    } catch (e: any) {
      console.error(`Follow-up failed for ${emailClean}:`, e);
      failCount++;
      results.push({ email: emailClean, status: "error", error: e.message });
    }
  }

  // Send Admin Report to info@sgk.gr whenever emails are sent (or forceReport is enabled)
  if (sentCount > 0 || forceReport) {
    try {
      await sendAdminReport({
        supabaseUrl,
        supabaseServiceKey,
        sentCount,
        failCount,
        totalChecked: leads?.length || 0,
        sentLeads: results.filter(r => r.status === "sent"),
      });
    } catch (repErr) {
      console.error("Failed to send admin report to info@sgk.gr:", repErr);
    }
  }

  return {
    totalChecked: leads?.length || 0,
    sent: sentCount,
    failed: failCount,
    results,
  };
}

async function sendAdminReport({
  supabaseUrl,
  supabaseServiceKey,
  sentCount,
  failCount,
  totalChecked,
  sentLeads,
}: {
  supabaseUrl: string;
  supabaseServiceKey: string;
  sentCount: number;
  failCount: number;
  totalChecked: number;
  sentLeads: { email: string; company?: string }[];
}) {
  const dateStr = new Date().toLocaleDateString("el-GR");
  const timeStr = new Date().toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit" });

  const leadItemsHtml = sentLeads.map((l, i) => `
    <li style="margin-bottom: 6px; font-size: 13.5px; color: #1e293b;">
      <strong>${i + 1}.</strong> ${l.email} ${l.company ? `— <em>${l.company}</em>` : ""}
    </li>
  `).join("");

  const bodyHtml = `
    <h2 style="color: #0f172a; font-size: 18px; font-weight: 800; line-height: 1.35; margin: 0 0 12px 0;">
      📊 Αναφορά Αυτόματου Follow-Up Ι.Κ.Ε.
    </h2>
    <p style="margin: 0 0 14px 0; color: #334155; font-size: 14px; line-height: 1.6;">
      Η διαδικασία εκτελέστηκε στις <strong>${dateStr} ${timeStr}</strong>.
    </p>

    <!-- Stats Box -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #10b981; border-radius: 8px; padding: 14px 16px; margin: 16px 0;">
      <p style="margin: 0 0 8px 0; font-size: 14.5px; font-weight: 800; color: #065f46;">
        📈 Σύνοψη Αποστολής:
      </p>
      <ul style="margin: 0; padding-left: 18px; font-size: 13.5px; color: #1e293b; line-height: 1.6;">
        <li><strong>Απεστάλησαν Follow-Up (Βήμα 2 & 3):</strong> <span style="color: #059669; font-weight: 800; font-size: 15px;">${sentCount}</span></li>
        <li><strong>Σφάλματα:</strong> ${failCount}</li>
        <li><strong>Συνολικές Εγγραφές που Ελέγχθηκαν:</strong> ${totalChecked}</li>
      </ul>
    </div>

    ${sentLeads.length > 0 ? `
      <div style="margin: 18px 0;">
        <p style="margin: 0 0 8px 0; font-size: 13.5px; font-weight: 700; color: #334155;">
          Παραλήπτες που έλαβαν το Follow-Up:
        </p>
        <ul style="margin: 0; list-style-type: none; padding: 0;">
          ${leadItemsHtml}
        </ul>
      </div>
    ` : `
      <p style="margin: 12px 0; font-size: 13.5px; color: #64748b;">
        Δεν υπήρχαν εκκρεμείς Ι.Κ.Ε. που να συμπλήρωσαν 3+ ημέρες από την αποστολή του 1ου email.
      </p>
    `}

    <p style="margin: 16px 0 0 0; font-size: 12px; color: #64748b; line-height: 1.5; border-top: 1px solid #e2e8f0; padding-top: 10px;">
      💡 <em>Κανόνας ασφαλείας: Δεν αποστέλλονται emails σε blacklist, unsubscribed ή πελάτες που έχουν μετατραπεί. Μετά το 3ο email η ακολουθία τερματίζεται.</em>
    </p>
  `;

  const reportEmailHtml = buildProfessionalEmailHtml({
    businessName: "SGK Admin",
    subject: `📊 Αναφορά Follow-Up Ι.Κ.Ε.: Εστάλησαν ${sentCount} emails`,
    bodyHtml,
    buttonText: "Μετάβαση στο Admin Leads",
    buttonLink: "https://www.sgk.gr/admin",
    unsubscribeToken: "admin-report",
  });

  await dispatchEmailWithFallback(
    {
      to: "info@sgk.gr",
      subject: `📊 Αναφορά Follow-Up Ι.Κ.Ε.: Εστάλησαν ${sentCount} emails`,
      html: reportEmailHtml,
      step: 2,
    },
    supabaseUrl,
    supabaseServiceKey
  );
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "3", 10);
    const maxBatch = parseInt(searchParams.get("limit") || "100", 10);
    const forceReport = searchParams.get("report") === "true" || searchParams.get("forceReport") === "1";

    const data = await processFollowUp(days, maxBatch, forceReport);
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    console.error("GET cron-followup-ike error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    let days = 3;
    let maxBatch = 100;
    let forceReport = false;
    try {
      const body = await req.json();
      if (body.days) days = parseInt(body.days, 10);
      if (body.limit) maxBatch = parseInt(body.limit, 10);
      if (body.forceReport || body.report) forceReport = true;
    } catch {
      // empty body
    }

    const data = await processFollowUp(days, maxBatch, forceReport);
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    console.error("POST cron-followup-ike error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

