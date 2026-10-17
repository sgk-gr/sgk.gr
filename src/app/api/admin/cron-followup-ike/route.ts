import { NextResponse } from "next/server";
import { getServiceSupabase, getSupabaseServiceRoleKey, SUPABASE_URL } from "@/lib/supabase";
import { buildProfessionalEmailHtml } from "@/lib/emailTemplates";
import { isEmailBlacklisted } from "@/lib/blacklist";
import { dispatchEmailWithFallback } from "@/lib/emailDispatcher";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export const IKE_FOLLOWUP_SUBJECT = "Υπενθύμιση: Προθεσμία 30 ημερών Γ.Ε.ΜΗ. για τη νέα σας Ι.Κ.Ε. (Ιστοσελίδα 80€)";

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
  Υπενθύμιση: Προθεσμία 30 Ημερών για Ιστοσελίδα Ι.Κ.Ε. στο Γ.Ε.ΜΗ.
</h2>

<p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Αγαπητέ διαχειριστή,
</p>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Επικοινωνούμε σύντομα ως υπενθύμιση, καθώς σύμφωνα με το <strong>Άρθρο 47 του Ν.4072/2012</strong>, κάθε νέα Ι.Κ.Ε. οφείλει να αποκτήσει και να δηλώσει εταιρική ιστοσελίδα στο Γ.Ε.ΜΗ. <strong>εντός 1 μηνός από τη σύστασή της</strong>.
</p>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Γνωρίζουμε ότι αυτές τις πρώτες μέρες τρέχετε με λογιστήρια και τράπεζες. Γι' αυτό στην <strong>SGK Digital</strong> το αναλαμβάνουμε <strong>με 0 κόπο από εσάς</strong>:
</p>

<!-- Value Box -->
<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #3b5bdb; border-radius: 10px; padding: 14px 16px; margin: 16px 0;">
  <p style="margin: 0 0 8px 0; font-size: 14.5px; font-weight: 800; color: #1e3a8a;">
    📦 Πλήρες Πακέτο Γ.Ε.ΜΗ. στα 80€ (τελική τιμή με ΦΠΑ):
  </p>
  <ul style="margin: 0; padding-left: 18px; font-size: 13.5px; color: #1e293b; line-height: 1.55;">
    <li><strong>Έτοιμη σε 24 ώρες:</strong> Αντλούμε τα στοιχεία απευθείας από το API του Γ.Ε.ΜΗ., χωρίς να χρειάζεται να γράψετε κείμενα.</li>
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

<div style="background-color: #f1f5f9; border-radius: 8px; padding: 10px 14px; margin: 16px 0 12px 0; text-align: center; font-size: 13.5px; color: #334155;">
  📞 Θέλετε να το κλείσουμε άμεσα τηλεφωνικά; Καλέστε μας:<br/>
  <a href="tel:2111140013" style="color: #3b5bdb; font-weight: 700; text-decoration: none;">☎️ 211 114 0013</a> &nbsp;|&nbsp; 
  <a href="tel:6999524389" style="color: #3b5bdb; font-weight: 700; text-decoration: none;">📱 6999 524 389</a>
</div>`;

export const IKE_FOLLOWUP_BUTTON_TEXT = "Έναρξη Ιστοσελίδας ΙΚΕ (80€)";
export const IKE_FOLLOWUP_BUTTON_LINK = "https://www.sgk.gr/ike-offer";

// Strict rule: Follow-up is sent ONLY to IKEs that received Step 1 from today onwards!
export const SEQUENCE_START_DATE = "2026-10-11T00:00:00.000Z";

async function processFollowUp(days: number = 3, maxBatch: number = 100, forceReport: boolean = false) {
  const supabase = getServiceSupabase();
  const supabaseUrl = SUPABASE_URL;
  const supabaseServiceKey = getSupabaseServiceRoleKey();

  const cutoff = getCalendarCutoffIso(days);

  // Find leads where Step 1 was sent FROM TODAY ONWARDS (>= 2026-10-11) AND >= 3 calendar days ago
  const { data: leads, error } = await supabase
    .from("sgk_mails")
    .select("id, email, company, first_name, last_name, unsubscribe_token, type, email_sequence_step, last_email_sent_at, unsubscribed, marketing_consent, converted, first_email_subject")
    .eq("marketing_consent", true)
    .eq("unsubscribed", false)
    .eq("converted", false)
    .eq("email_sequence_step", 1)
    .gte("last_email_sent_at", SEQUENCE_START_DATE)
    .lte("last_email_sent_at", cutoff)
    .order("last_email_sent_at", { ascending: true })
    .limit(maxBatch);

  if (error) {
    throw new Error(`Database query error: ${error.message}`);
  }

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

    const isLegacyIke = lead.type === "legacy_ike" || lead.type === "old_ike";

    if (isFtth || isNonIke || isLegacyIke) {
      results.push({ email: emailClean, status: "skipped_ftth_or_non_ike" });
      continue;
    }

    // Filter to ensure it's an IKE lead eligible for follow-up (matches frontend dueFollowUpIkeLeads)
    const isIke = (
      lead.type === "new_ike" ||
      lead.type === "imported" ||
      !lead.type ||
      (lead.company && (lead.company.toUpperCase().includes("ΙΚΕ") || lead.company.toUpperCase().includes("Ι.Κ.Ε."))) ||
      (lead.first_email_subject && (lead.first_email_subject.includes("Ι.Κ.Ε.") || lead.first_email_subject.includes("ΓΕΜΗ")))
    ) && !isFtth && !isNonIke && !isLegacyIke;

    if (!isIke) {
      results.push({ email: emailClean, status: "skipped_not_ike" });
      continue;
    }

    const unsubscribeToken = lead.unsubscribe_token || crypto.randomUUID();

    const finalHtml = buildProfessionalEmailHtml({
      businessName: lead.first_name || lead.company || "Συνεργάτη",
      subject: IKE_FOLLOWUP_SUBJECT,
      bodyHtml: IKE_FOLLOWUP_BODY,
      buttonText: IKE_FOLLOWUP_BUTTON_TEXT,
      buttonLink: IKE_FOLLOWUP_BUTTON_LINK,
      unsubscribeToken: unsubscribeToken,
      industry: lead.company,
    });

    try {
      const dispatchResult = await dispatchEmailWithFallback(
        {
          to: emailClean,
          subject: IKE_FOLLOWUP_SUBJECT,
          html: finalHtml,
          unsubscribeToken: unsubscribeToken,
          step: 2,
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
          email_sequence_step: 2,
          last_email_sent_at: now,
        })
        .eq("id", lead.id);

      sentCount++;
      results.push({ email: emailClean, company: lead.company, status: "sent", step: 2 });
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
        <li><strong>Απεστάλησαν Follow-Up (Βήμα 2 - 80€):</strong> <span style="color: #059669; font-weight: 800; font-size: 15px;">${sentCount}</span></li>
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
      💡 <em>Κανόνας ασφαλείας: Το follow-up αποστέλλεται αποκλειστικά σε Ι.Κ.Ε. που έλαβαν το 1ο email από 11/10/2026 και έπειτα.</em>
    </p>
  `;

  const reportEmailHtml = buildProfessionalEmailHtml({
    businessName: "SGK Admin",
    subject: `📊 Αναφορά Follow-Up Ι.Κ.Ε.: Εστάλησαν ${sentCount} emails`,
    bodyHtml,
    buttonText: "Μετάβαση στο Admin Leads",
    buttonLink: "https://www.sgk.gr/admin",
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
