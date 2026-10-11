import { NextResponse } from "next/server";
import { getServiceSupabase, getSupabaseServiceRoleKey, SUPABASE_URL } from "@/lib/supabase";
import { buildProfessionalEmailHtml } from "@/lib/emailTemplates";
import { isEmailBlacklisted } from "@/lib/blacklist";

export const dynamic = "force-dynamic";

export const IKE_FOLLOWUP_SUBJECT = "Υπενθύμιση: Προθεσμία 30 ημερών Γ.Ε.ΜΗ. για τη νέα σας Ι.Κ.Ε. (Ιστοσελίδα 150€)";

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
    📦 Πλήρες Πακέτο Γ.Ε.ΜΗ. στα 150€ (τελική τιμή με ΦΠΑ):
  </p>
  <ul style="margin: 0; padding-left: 18px; font-size: 13.5px; color: #1e293b; line-height: 1.55;">
    <li><strong>Έτοιμη σε 24 ώρες:</strong> Αντλούμε τα στοιχεία απευθείας από το API του Γ.Ε.ΜΗ., χωρίς να χρειάζεται να γράψετε κείμενα.</li>
    <li><strong>Κατοχύρωση .gr Domain &amp; Hosting για 1 έτος.</strong></li>
    <li><strong>Επαγγελματικό Λογότυπο &amp; Εταιρικό Email</strong> (π.χ. info@...).</li>
    <li><strong>Επίσημο Τιμολόγιο Εξόδων</strong> για τα βιβλία της εταιρείας σας.</li>
  </ul>
</div>

<p style="margin: 0 0 14px 0; font-size: 13.5px; color: #475569;">
  👉 <strong>Δείτε πρόσφατο δείγμα μας:</strong> 
  <a href="https://www.sellascountryhouses.gr/" target="_blank" style="color: #3b5bdb; font-weight: 700; text-decoration: underline;">sellascountryhouses.gr</a>
</p>

<div style="background-color: #f1f5f9; border-radius: 8px; padding: 10px 14px; margin: 16px 0 12px 0; text-align: center; font-size: 13.5px; color: #334155;">
  📞 Θέλετε να το κλείσουμε άμεσα τηλεφωνικά; Καλέστε μας:<br/>
  <a href="tel:2111140013" style="color: #3b5bdb; font-weight: 700; text-decoration: none;">☎️ 211 114 0013</a> &nbsp;|&nbsp; 
  <a href="tel:6999524389" style="color: #3b5bdb; font-weight: 700; text-decoration: none;">📱 6999 524 389</a>
</div>`;

export const IKE_FOLLOWUP_BUTTON_TEXT = "Έναρξη Ιστοσελίδας ΙΚΕ (150€)";
export const IKE_FOLLOWUP_BUTTON_LINK = "https://www.sgk.gr/ike-offer";

async function processFollowUp(days: number = 3, maxBatch: number = 25) {
  const supabase = getServiceSupabase();
  const supabaseUrl = SUPABASE_URL;
  const supabaseServiceKey = getSupabaseServiceRoleKey();

  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  // Find leads where Step 1 was sent >= 3 days ago, not converted, not unsubscribed
  const { data: leads, error } = await supabase
    .from("sgk_mails")
    .select("id, email, company, first_name, last_name, unsubscribe_token, type, email_sequence_step, last_email_sent_at, unsubscribed, marketing_consent, converted")
    .eq("marketing_consent", true)
    .eq("unsubscribed", false)
    .eq("converted", false)
    .eq("email_sequence_step", 1)
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

    // Filter to ensure it's an IKE
    const isIke = lead.type === "new_ike" || 
      lead.type === "imported" || 
      !lead.type || 
      (lead.company && (lead.company.toUpperCase().includes("ΙΚΕ") || lead.company.toUpperCase().includes("Ι.Κ.Ε.")));

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
      const edgeResponse = await fetch(`${supabaseUrl}/functions/v1/send-nurture-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          email: emailClean,
          unsubscribe_token: unsubscribeToken,
          customSubject: IKE_FOLLOWUP_SUBJECT,
          customHtml: finalHtml,
          step: 2,
        }),
      });

      if (!edgeResponse.ok) {
        const errTxt = await edgeResponse.text();
        throw new Error(errTxt || `HTTP ${edgeResponse.status}`);
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

  return {
    totalChecked: leads?.length || 0,
    sent: sentCount,
    failed: failCount,
    results,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "3", 10);
    const maxBatch = parseInt(searchParams.get("limit") || "25", 10);

    const data = await processFollowUp(days, maxBatch);
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    console.error("GET cron-followup-ike error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    let days = 3;
    let maxBatch = 25;
    try {
      const body = await req.json();
      if (body.days) days = parseInt(body.days, 10);
      if (body.limit) maxBatch = parseInt(body.limit, 10);
    } catch {
      // empty body
    }

    const data = await processFollowUp(days, maxBatch);
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    console.error("POST cron-followup-ike error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
