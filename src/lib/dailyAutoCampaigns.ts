import { getServiceSupabase } from "@/lib/supabase";
import { dispatchEmailWithFallback, isResendQuotaReached } from "@/lib/emailDispatcher";
import { buildProfessionalEmailHtml } from "@/lib/emailTemplates";
import { isEmailBlacklisted } from "@/lib/blacklist";

const GEMI_API_KEY = process.env.GEMI_API_KEY || "1QV0mFBoWsaprgiphMaBKEANZL0tRCc5";
const GEMI_API_BASE = "https://opendata-api.businessportal.gr/api/opendata/v1";

const IGNORED_DOMAINS = [
  "gemi.gr", "gov.gr", "businessportal.gr", "mindev.gov.gr",
  "gsis.gr", "minfin.gr", "uhc.gr", "kee.gr", "sentry.io", "example.com"
];

function hasOfficialWebsite(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.toLowerCase().replace(/^https?:\/\//, "").split("/")[0].trim();
  if (clean.length < 4) return false;
  return !IGNORED_DOMAINS.some(d => clean.includes(d));
}

function isValidEmail(email?: string | null): boolean {
  if (!email) return false;
  const trimmed = email.toLowerCase().replace(/^mailto:/i, "").trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(trimmed)) return false;
  const domain = trimmed.split("@")[1] || "";
  return !IGNORED_DOMAINS.some(d => domain.includes(d));
}

export interface DailyCronReport {
  timestamp: string;
  durationMs: number;
  totalTarget: number;
  totalSent: number;
  totalFailed: number;
  newIke: { target: number; sent: number; failed: number; samples: string[] };
  legacyIke: { target: number; sent: number; failed: number; samples: string[] };
  ftth: { target: number; sent: number; failed: number; samples: string[] };
  providers: { resend: number; brevo: number };
  adminNotified: boolean;
  errors: string[];
}

declare global {
  var __lastDailyCronReport: DailyCronReport | undefined;
  var __isDailyCronRunning: boolean | undefined;
}

export function getLastDailyCronReport(): DailyCronReport | null {
  return globalThis.__lastDailyCronReport || null;
}

export function isDailyCronRunning(): boolean {
  return Boolean(globalThis.__isDailyCronRunning);
}

export const CAMPAIGN_TEMPLATES = {
  new_ike: {
    subject: "Σχετικά με τη δήλωση εταιρικής ιστοσελίδας στο Γ.Ε.ΜΗ. (80€ με ΦΠΑ)",
    body: `<h2 style="color: #0f172a; font-size: 19px; font-weight: 800; line-height: 1.35; margin: 0 0 16px 0;">Η νέα σας Ι.Κ.Ε. χρειάζεται εταιρική ιστοσελίδα στο Γ.Ε.ΜΗ.</h2>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Αγαπητέ διαχειριστή, καλησπέρα σας.
</p>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Σύμφωνα με το <strong>Άρθρο 47 παρ. 2 του Ν.4072/2012</strong>, κάθε Ι.Κ.Ε. οφείλει να αποκτήσει εταιρική ιστοσελίδα και να την δηλώσει στο Γ.Ε.ΜΗ. <strong>Αν μείνει εκκρεμότητα, μπορεί να σας δημιουργήσει πρόβλημα σε έναν έλεγχο. Αξίζει να κλείσει από την αρχή.</strong>
</p>

<p style="margin: 0 0 12px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Στην <strong>SGK Digital</strong> το αναλαμβάνουμε εμείς, <strong>χωρίς κόπο από εσάς</strong>:
</p>

<div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 12px 16px; margin: 20px 0;">
  <p style="margin: 0 0 6px 0; font-size: 14px; color: #0f172a; font-weight: 700;">Πλήρης λύση για 80€ (τελική τιμή με ΦΠΑ):</p>
  <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #334155; line-height: 1.6;">
    <li><strong>Έτοιμη ιστοσελίδα σε 24 ώρες</strong>, απολύτως συμβατή με τον νόμο.</li>
    <li><strong>Πιστοποιημένη διασύνδεση με το Γ.Ε.ΜΗ. (API)</strong> μέσω επίσημης πρόσβασης gov.gr.</li>
    <li><strong>.gr Domain &amp; Hosting για 1 έτος</strong>, λογότυπο και εταιρικό email.</li>
    <li><strong>Νόμιμο τιμολόγιο</strong> για τα έξοδα της εταιρείας σας.</li>
  </ul>
</div>

<p style="margin: 0 0 14px 0; color: #475569; font-size: 14px; line-height: 1.5;">
  Δείγματα πελατών μας: meltech-ike.gr, sellascountryhouses.gr<br/><br/><em>(Αν το έχετε ήδη τακτοποιήσει, αγνοήστε το μήνυμα και καλή συνέχεια!)</em>
</p>`,
    buttonText: "Έναρξη Ιστοσελίδας ΙΚΕ (80€)",
    buttonLink: "https://www.sgk.gr/ike-offer",
  },
  legacy_ike: {
    subject: "Ενημέρωση Γ.Ε.ΜΗ.: Έλεγχος & τακτοποίηση εταιρικής ιστοσελίδας (80€ με ΦΠΑ)",
    body: `<h2 style="color: #0f172a; font-size: 19px; font-weight: 800; line-height: 1.35; margin: 0 0 16px 0;">Η Ι.Κ.Ε. σας δεν έχει δηλωμένη ιστοσελίδα στο Γ.Ε.ΜΗ.</h2>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Αγαπητέ διαχειριστή, καλησπέρα σας.
</p>

<div style="background-color: #fff7ed; border: 1px solid #fed7aa; border-left: 5px solid #f97316; border-radius: 8px; padding: 14px 16px; margin: 16px 0;">
  <p style="margin: 0; font-size: 14.5px; color: #7c2d12; line-height: 1.55;">
    ⚠️ Βάσει του <strong>Άρθρου 47 του Ν.4072/2012</strong>, κάθε Ι.Κ.Ε. οφείλει να έχει εταιρική ιστοσελίδα δηλωμένη στο Γ.Ε.ΜΗ. Η εταιρεία σας <strong>δεν έχει</strong> δηλωμένη ιστοσελίδα. <strong>Σε έναν έλεγχο, μπορεί να σας δημιουργήσει πρόβλημα. Αξίζει να κλείσει τώρα.</strong>
  </p>
</div>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
  Στην <strong>SGK Digital</strong> το αναλαμβάνουμε ολοκληρωτικά, <strong>χωρίς κόπο από εσάς</strong>:
</p>

<div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 14px 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
  <p style="margin: 0 0 8px 0; font-size: 14px; color: #0f172a; font-weight: 700;">
    Πλήρης τακτοποίηση για 80€ (τελική τιμή με ΦΠΑ):
  </p>
  <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #334155; line-height: 1.65;">
    <li><strong>Έτοιμη ιστοσελίδα σε 24 ώρες</strong>, συμβατή με τον Ν.4072/2012.</li>
    <li><strong>Πιστοποιημένη διασύνδεση με το Γ.Ε.ΜΗ. (API)</strong> μέσω επίσημης πρόσβασης gov.gr.</li>
    <li><strong>.gr Domain &amp; Hosting για 1 έτος</strong>, λογότυπο και εταιρικό email.</li>
    <li><strong>Νόμιμο τιμολόγιο</strong> για τα έξοδα της εταιρείας.</li>
  </ul>
</div>

<p style="margin: 0 0 12px 0; color: #475569; font-size: 14px; line-height: 1.55;">
  Δείγματα πελατών μας: meltech-ike.gr, sellascountryhouses.gr<br/><br/><em>(Αν το έχετε ήδη τακτοποιήσει, αγνοήστε το μήνυμα.)</em>
</p>`,
    buttonText: "Έναρξη Ιστοσελίδας ΙΚΕ (80€)",
    buttonLink: "https://www.sgk.gr/ike-offer",
  },
  ftth: {
    subject: "FTTH: Αυτοψία πολυκατοικίας σε 5' από το κινητό (χωρίς back-office & χαρτιά)",
    body: `<h2 style="color: #0f172a; font-size: 20px; font-weight: 800; line-height: 1.35; margin: 0 0 12px 0;">
  Πόσες ώρες χάνετε για να παραδώσετε μία αυτοψία FTTH στον εργολάβο;
</h2>

<p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.55;">
  Η αυτοψία μπορεί να ολοκληρωθεί <strong>σε 5 λεπτά απευθείας από το κινητό</strong> — χωρίς την ανάγκη εργασίας από το back-office, χωρίς χειρόγραφη συμπλήρωση εντύπων και χωρίς σχεδίαση σκαριφημάτων:
</p>

<div style="background-color: #f8fafc; border-left: 4px solid #3b5bdb; padding: 12px 14px; margin-bottom: 10px; border-radius: 0 8px 8px 0;">
  <div style="font-size: 13.5px; font-weight: 800; color: #0f172a; margin-bottom: 3px;">
    1. Αυτοψία σε 5 λεπτά στο κινητό (100% Paperless)
  </div>
  <div style="font-size: 13px; color: #475569; line-height: 1.45;">
    Φωτογραφίες, στοιχεία κτιρίου και <strong>ψηφιακή υπογραφή διαχειριστή</strong> απευθείας στην οθόνη. Τέρμα τα χαρτιά και οι διπλές επισκέψεις.
  </div>
</div>

<div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 12px 14px; margin-bottom: 10px; border-radius: 0 8px 8px 0;">
  <div style="font-size: 13.5px; font-weight: 800; color: #0f172a; margin-bottom: 3px;">
    2. Αυτόματος Υπολογισμός Floor Boxes, BEP & BMO
  </div>
  <div style="font-size: 13px; color: #475569; line-height: 1.45;">
    Εισάγετε απλώς ορόφους και διαμερίσματα. Η εφαρμογή υπολογίζει ακαριαία πόσα Floor Boxes χρειάζονται, σε ποιους ορόφους, τα BEP & BMO και την πλήρη προμέτρηση υλικών (μηδέν ανθρώπινο λάθος).
  </div>
</div>

<div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 12px 14px; margin-bottom: 14px; border-radius: 0 8px 8px 0;">
  <div style="font-size: 13.5px; font-weight: 800; color: #0f172a; margin-bottom: 3px;">
    3. Αυτόματη Παραγωγή Όλων των Εντύπων & Άμεση Αποστολή
  </div>
  <div style="font-size: 13px; color: #475569; line-height: 1.45;">
    Παράγονται αυτόματα όλα τα έντυπα, σκαρίφημα, τεχνική περιγραφή και στοιχεία μηχανικού — όλα συμπληρώνονται αυτόματα. Με το πάτημα «Ολοκλήρωση», ο <strong>πλήρης φάκελος σε ZIP είναι έτοιμος</strong> και φεύγει <em>άμεσα με email στον εργολάβο</em> — <strong>χωρίς να χρειάζεται back-office!</strong>
  </div>
</div>

<div style="background-color: #eff6ff; border: 1px dashed #93c5fd; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px;">
  <p style="margin: 0 !important; font-size: 13px; color: #1e40af; line-height: 1.45;">
    <strong>Ήδη σε παραγωγή:</strong> Λειτουργεί καθημερινά σε ελληνική τεχνική εταιρεία υποδομών οπτικών ινών, εξοικονομώντας 15+ ώρες γραφείου την εβδομάδα ανά συνεργείο.
  </p>
</div>

<div style="text-align: center; font-size: 13px; color: #64748b; margin-top: 14px; padding-top: 10px; border-top: 1px solid #e2e8f0;">
  Είστε στον δρόμο; Καλέστε μας απευθείας για 2λεπτη ενημέρωση:<br/>
  Τηλ: 211 114 0013 | 6999 524 389
</div>`,
    buttonText: "Δείτε Live Demo (2 λεπτά)",
    buttonLink: "https://www.sgk.gr/blog/pos-aftomatopoiisame-aftopsies-optikon-inon-ftth-se-5-lepta",
  }
};

/**
 * Automatically fetch eligible fresh leads from GEMI OpenData API.
 * Rules:
 * - NO dependency on pre-existing leads in DB ("δεν θα έχει leads αυτό σου λέω θα βρίσκει μόνο του")
 * - New IKEs strictly current month ("νέες ικε θα είναι οι εταιρείες του τρέχοντος μήνα")
 * - Strictly NEVER send to emails already existing in DB ("δεν στέλνει σε emails που υπάρχουν ήδη στη βάση")
 * - Strictly NEVER send to unsubscribed or blacklisted ("δεν στέλνεις σε unsubscribed / black list")
 * - Strictly exclude companies with declared website in GEMI ("εάν έχουν σελίδα να μην τους βάζει")
 * - Include corporate domain emails as long as they don't have a declared website ("εάν έχουν εταιρικό email να τους βάζει")
 * - FTTH targets KAD 43210006 from 2018 to today across all legal forms (ΑΕ, ΕΕ, ΟΕ, ΙΚΕ, Ατομικές)
 */
async function autoFetchGemiLeads(
  category: "new_ike" | "legacy_ike" | "ftth_telecom",
  targetCount: number,
  existingEmailSet: Set<string>,
  existingAfmSet: Set<string>,
  unsubscribedSet: Set<string>
): Promise<any[]> {
  const fetchedLeads: any[] = [];
  const pageSize = 50;
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthNum = String(now.getMonth() + 1).padStart(2, "0");
  const currentMonthPrefix = `${currentYear}-${currentMonthNum}`; // e.g. "2026-10"
  const currentMonthStart = `${currentMonthPrefix}-01`;
  const currentYearStart = `${currentYear}-01-01`;

  // For New IKEs: strictly current month.
  // If in the first 3 days of a new month, allow up to 30 days back so campaigns don't starve on day 1.
  const minDateNewIke = now.getDate() <= 3
    ? new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0]
    : currentMonthStart;

  // Starting offset benchmarks
  let offset = 0;
  if (category === "legacy_ike") {
    // Legacy IKEs (2018-2024): Start at offset ~25,000 (corresponding to 2024 down to 2018) with daily shift
    offset = 25000 + ((now.getDate() * 1500) % 50000);
  } else if (category === "ftth_telecom") {
    // FTTH: Start from offset 0 or small offset
    offset = 0;
  } else {
    // New IKEs: Always start at offset 0 (newest incorporations of current month)
    offset = 0;
  }

  const maxPages = 60; // Up to 3,000 records examined per category
  let pagesFetched = 0;
  let consecutiveOlderCount = 0;

  while (fetchedLeads.length < targetCount && pagesFetched < maxPages) {
    pagesFetched++;
    
    let url = "";
    if (category === "ftth_telecom") {
      // FTTH: All legal forms (AE, EE, OE, IKE, Sole) with KAD 43210006
      url = `${GEMI_API_BASE}/companies?isActive=true&resultsSize=${pageSize}&resultsOffset=${offset}&activities=43210006&resultsSortBy=-incorporationDate`;
    } else if (category === "legacy_ike") {
      // Legacy IKEs: Older incorporations (previous years)
      url = `${GEMI_API_BASE}/companies?isActive=true&resultsSize=${pageSize}&resultsOffset=${offset}&legalTypes=19&resultsSortBy=-incorporationDate`;
    } else {
      // New IKEs: Current month incorporations
      url = `${GEMI_API_BASE}/companies?isActive=true&resultsSize=${pageSize}&resultsOffset=${offset}&legalTypes=19&resultsSortBy=-incorporationDate`;
    }

    try {
      let res = await fetch(url, {
        headers: { 
          api_key: GEMI_API_KEY, 
          Accept: "application/json",
          "User-Agent": "SGK-Auto-Campaigns/2.0"
        },
        cache: "no-store",
      });

      // Handle GEMI rate limit (HTTP 429) with exponential backoff
      let retryCount = 0;
      while (res.status === 429 && retryCount < 4) {
        retryCount++;
        const waitTime = retryCount * 5000;
        console.warn(`[dailyAutoCampaigns] GEMI rate limit 429 for ${category}. Waiting ${waitTime / 1000}s...`);
        await new Promise(r => setTimeout(r, waitTime));
        res = await fetch(url, {
          headers: { 
            api_key: GEMI_API_KEY, 
            Accept: "application/json",
            "User-Agent": "SGK-Auto-Campaigns/2.0"
          },
          cache: "no-store",
        });
      }

      if (!res.ok) {
        console.warn(`[dailyAutoCampaigns] GEMI API responded with ${res.status} for ${category} at offset ${offset}`);
        break;
      }

      const data = await res.json();
      const results = data.searchResults || [];
      if (results.length === 0) break;

      for (const co of results) {
        const email = (co.email || "").toLowerCase().replace(/^mailto:/i, "").trim();
        const urlClean = co.url || "";
        const afm = co.afm ? String(co.afm).trim() : null;
        const incDate = co.incorporationDate ? String(co.incorporationDate).split("T")[0] : "";
        const companyTitle = co.coNameEl || (co.coTitlesEl && co.coTitlesEl[0]) || "Επιχείρηση";
        const legalForm = co.legalType?.descr || "Επιχείρηση";

        // 1. DATE RESTRICTIONS
        if (category === "new_ike") {
          // Rule: Must be of the current month ("νέες ικε θα είναι οι εταιρείες του τρέχοντος μήνα")
          if (!incDate || incDate < minDateNewIke) {
            consecutiveOlderCount++;
            // Because results are sorted descending, if we hit older records consistently, stop scanning
            if (consecutiveOlderCount >= 20) {
              break;
            }
            continue;
          } else {
            consecutiveOlderCount = 0;
          }
        } else if (category === "legacy_ike") {
          // Rule: Strictly between 2018 and 2024 ("Παλιές ικε από 2018 έως 2024")
          if (!incDate || incDate < "2018-01-01" || incDate > "2024-12-31") continue;
        } else if (category === "ftth_telecom") {
          // Rule: From 2018 to today
          if (incDate && incDate < "2018-01-01") continue;
        }

        // 2. EXCLUDE IF ALREADY HAS OFFICIAL WEBSITE IN GEMI
        if (hasOfficialWebsite(urlClean)) continue;

        // 3. EXCLUDE IF INVALID EMAIL
        if (!isValidEmail(email)) continue;

        // 4. EXCLUDE IF BLACKLISTED
        if (isEmailBlacklisted(email)) continue;

        // 5. EXCLUDE IF UNSUBSCRIBED
        if (unsubscribedSet.has(email)) continue;

        // 6. EXCLUDE IF ALREADY EXISTS IN DATABASE (Zero duplicates guarantee)
        if (existingEmailSet.has(email)) continue;
        if (afm && existingAfmSet.has(afm)) continue;

        // Mark as seen in this session so no duplicates inside the batch
        existingEmailSet.add(email);
        if (afm) existingAfmSet.add(afm);

        const newRecord = {
          email,
          company: companyTitle,
          first_name: companyTitle,
          last_name: legalForm,
          phone: co.phone ? String(co.phone).trim() : null,
          afm,
          gemi_number: co.arGemi ? String(co.arGemi).trim() : null,
          marketing_consent: true,
          unsubscribe_token: crypto.randomUUID(),
          email_sequence_step: 0,
          unsubscribed: false,
          converted: false,
          type: category,
          created_at: new Date().toISOString(),
        };

        fetchedLeads.push(newRecord);

        if (fetchedLeads.length >= targetCount) break;
      }

      if (category === "new_ike" && consecutiveOlderCount >= 20) {
        console.log(`[dailyAutoCampaigns] Passed the current month date threshold (${minDateNewIke}) for new_ike.`);
        break;
      }

      offset += results.length;
      await new Promise(r => setTimeout(r, 350)); // Respectful pacing between GEMI pages
    } catch (err: any) {
      console.error(`[dailyAutoCampaigns] GEMI fetch error for ${category}:`, err.message);
      break;
    }
  }

  console.log(`[dailyAutoCampaigns] Successfully gathered ${fetchedLeads.length}/${targetCount} fresh leads for ${category} from GEMI.`);
  return fetchedLeads;
}

/**
 * Discovers fresh live leads for category directly from GEMI OpenData API
 * (Does NOT rely on pre-existing database leads)
 */
async function getReadyLeadsForCategory(
  category: "new_ike" | "legacy_ike" | "ftth_telecom",
  targetCount: number,
  existingEmailSet: Set<string>,
  existingAfmSet: Set<string>,
  unsubscribedSet: Set<string>
): Promise<any[]> {
  console.log(`[dailyAutoCampaigns] Fetching fresh live leads directly from GEMI OpenData for ${category} (Target: ${targetCount})...`);
  const freshGemiLeads = await autoFetchGemiLeads(
    category, 
    targetCount, 
    existingEmailSet, 
    existingAfmSet, 
    unsubscribedSet
  );
  return freshGemiLeads.slice(0, targetCount);
}

/**
 * Main Daily Automated Execution: 100 New IKE + 100 Legacy IKE + 99 FTTH = 299 emails + Report to info@sgk.gr
 */
export async function runDailyAutoCampaigns(options?: {
  force?: boolean;
  dryRun?: boolean;
}): Promise<DailyCronReport> {
  if (globalThis.__isDailyCronRunning) {
    throw new Error("Η ημερήσια αυτόματη αποστολή εκτελείται ήδη αυτή τη στιγμή.");
  }

  globalThis.__isDailyCronRunning = true;
  const startTime = Date.now();
  const supabase = getServiceSupabase();
  const errors: string[] = [];

  const report: DailyCronReport = {
    timestamp: new Date().toISOString(),
    durationMs: 0,
    totalTarget: 299,
    totalSent: 0,
    totalFailed: 0,
    newIke: { target: 100, sent: 0, failed: 0, samples: [] },
    legacyIke: { target: 100, sent: 0, failed: 0, samples: [] },
    ftth: { target: 99, sent: 0, failed: 0, samples: [] },
    providers: { resend: 0, brevo: 0 },
    adminNotified: false,
    errors: [],
  };

  try {
    // 0. Load ALL existing emails, AFMs, and unsubscribed records from Supabase to prevent duplicates
    const existingEmailSet = new Set<string>();
    const existingAfmSet = new Set<string>();
    const unsubscribedSet = new Set<string>();

    let fetchFrom = 0;
    const chunk = 1000;
    let hasMore = true;
    while (hasMore) {
      const { data: recs, error: fetchErr } = await supabase
        .from("sgk_mails")
        .select("email, afm, unsubscribed")
        .range(fetchFrom, fetchFrom + chunk - 1);

      if (fetchErr) {
        console.error("[dailyAutoCampaigns] Error querying existing database records:", fetchErr);
        break;
      }

      if (recs && recs.length > 0) {
        for (const r of recs) {
          if (r.email) {
            const clean = r.email.toLowerCase().trim();
            existingEmailSet.add(clean);
            if (r.unsubscribed) {
              unsubscribedSet.add(clean);
            }
          }
          if (r.afm) existingAfmSet.add(String(r.afm).trim());
        }
        if (recs.length < chunk) hasMore = false;
        else fetchFrom += chunk;
      } else {
        hasMore = false;
      }
    }

    console.log(`[dailyAutoCampaigns] Database verification complete: ${existingEmailSet.size} existing emails, ${existingAfmSet.size} AFMs, ${unsubscribedSet.size} unsubscribed. None of these will be contacted.`);

    // 1. Gather all fresh leads sequentially from GEMI OpenData API (Zero DB duplicates & prevents GEMI 429)
    console.log("[dailyAutoCampaigns] Gathering fresh leads from GEMI: 100 New IKE (current month)...");
    const newIkeLeads = await getReadyLeadsForCategory("new_ike", 100, existingEmailSet, existingAfmSet, unsubscribedSet);

    await new Promise(r => setTimeout(r, 600));
    console.log("[dailyAutoCampaigns] Gathering fresh leads from GEMI: 100 Legacy IKE (2018–2024)...");
    const legacyIkeLeads = await getReadyLeadsForCategory("legacy_ike", 100, existingEmailSet, existingAfmSet, unsubscribedSet);

    await new Promise(r => setTimeout(r, 600));
    console.log("[dailyAutoCampaigns] Gathering fresh leads from GEMI: 99 FTTH (KAD 43210006)...");
    const ftthLeads = await getReadyLeadsForCategory("ftth_telecom", 99, existingEmailSet, existingAfmSet, unsubscribedSet);

    report.newIke.target = newIkeLeads.length;
    report.legacyIke.target = legacyIkeLeads.length;
    report.ftth.target = ftthLeads.length;
    report.totalTarget = newIkeLeads.length + legacyIkeLeads.length + ftthLeads.length;

    console.log(`[dailyAutoCampaigns] Ready to dispatch: ${newIkeLeads.length} New IKE, ${legacyIkeLeads.length} Legacy IKE, ${ftthLeads.length} FTTH. (Total: ${report.totalTarget})`);

    // Helper to send a batch of leads using concurrent worker chunks (prevents Vercel 60s timeout)
    const dispatchCategoryList = async (
      categoryKey: "newIke" | "legacyIke" | "ftth",
      leads: any[],
      template: { subject: string; body: string; buttonText: string; buttonLink: string }
    ) => {
      const CONCURRENCY = 4;
      for (let i = 0; i < leads.length; i += CONCURRENCY) {
        const chunk = leads.slice(i, i + CONCURRENCY);
        await Promise.all(chunk.map(async (lead) => {
          const cleanEmail = lead.email?.toLowerCase().trim();
          if (!isValidEmail(cleanEmail) || isEmailBlacklisted(cleanEmail) || unsubscribedSet.has(cleanEmail)) {
            report[categoryKey].failed++;
            report.totalFailed++;
            return;
          }

          if (options?.dryRun) {
            report[categoryKey].sent++;
            report.totalSent++;
            if (report[categoryKey].samples.length < 3) {
              report[categoryKey].samples.push(`${lead.company || cleanEmail} (${cleanEmail})`);
            }
            return;
          }

          try {
            const unsubscribeToken = lead.unsubscribe_token || crypto.randomUUID();
            const finalHtml = buildProfessionalEmailHtml({
              businessName: lead.first_name || lead.company || "Συνεργάτη",
              subject: template.subject,
              bodyHtml: template.body,
              buttonText: template.buttonText,
              buttonLink: template.buttonLink,
              unsubscribeToken,
              industry: lead.company,
            });

            // Hard stop on Resend at 100/day: if report already has >= 100 on Resend or quota is reached, route to Brevo!
            const preferred = (report.providers.resend >= 100 || isResendQuotaReached()) ? "brevo" : "auto";

            const result = await dispatchEmailWithFallback({
              to: cleanEmail,
              subject: template.subject,
              html: finalHtml,
              unsubscribeToken,
              firstEmailSubject: template.subject,
              firstEmailBody: template.body,
              step: 1,
              preferredProvider: preferred,
            });

            if (result.success) {
              report[categoryKey].sent++;
              report.totalSent++;
              if (result.provider === "brevo") report.providers.brevo++;
              else report.providers.resend++;

              if (report[categoryKey].samples.length < 3) {
                report[categoryKey].samples.push(`${lead.company || cleanEmail} (${cleanEmail})`);
              }

              // Save contact record in DB so future runs will NEVER contact this email again
              const nowIso = new Date().toISOString();
              await supabase.from("sgk_mails").upsert([{
                email: cleanEmail,
                company: lead.company || lead.first_name || "Επιχείρηση",
                first_name: lead.first_name || lead.company || "Επιχείρηση",
                last_name: lead.last_name || "Επιχείρηση",
                phone: lead.phone || null,
                afm: lead.afm || null,
                gemi_number: lead.gemi_number || null,
                marketing_consent: true,
                unsubscribe_token: unsubscribeToken,
                email_sequence_step: 1,
                last_email_sent_at: nowIso,
                first_email_subject: template.subject,
                first_email_body: template.body,
                unsubscribed: false,
                converted: false,
                type: lead.type || categoryKey,
                created_at: nowIso,
              }], { onConflict: "email" });

            } else {
              report[categoryKey].failed++;
              report.totalFailed++;
              errors.push(`${cleanEmail}: ${result.error}`);
            }
          } catch (err: any) {
            report[categoryKey].failed++;
            report.totalFailed++;
            errors.push(`${cleanEmail}: ${err.message}`);
          }
        }));

        // Respectful 80ms pacing between concurrent micro-chunks
        await new Promise(r => setTimeout(r, 80));
      }
    };

    // 2. Dispatch the 3 categories
    await dispatchCategoryList("newIke", newIkeLeads, CAMPAIGN_TEMPLATES.new_ike);
    await dispatchCategoryList("legacyIke", legacyIkeLeads, CAMPAIGN_TEMPLATES.legacy_ike);
    await dispatchCategoryList("ftth", ftthLeads, CAMPAIGN_TEMPLATES.ftth);

    report.durationMs = Date.now() - startTime;
    report.errors = errors.slice(0, 10);

    // 3. Send Executive Report Email to info@sgk.gr
    console.log("[dailyAutoCampaigns] Sending executive summary report to info@sgk.gr...");
    try {
      const durationSeconds = Math.round(report.durationMs / 1000);
      const minutes = Math.floor(durationSeconds / 60);
      const seconds = durationSeconds % 60;
      const durationStr = minutes > 0 ? `${minutes}λ και ${seconds}δ` : `${seconds} δευτερόλεπτα`;

      const reportHtml = `
      <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 14px 0;">
        📊 Ημερήσια Αυτόματη Αποστολή: ${report.totalSent}/${report.totalTarget} Emails
      </h2>

      <p style="margin: 0 0 16px 0; color: #334155; font-size: 15px; line-height: 1.55;">
        Η προγραμματισμένη ημερήσια καμπάνια ολοκληρώθηκε επιτυχώς σε <strong>${durationStr}</strong>.
      </p>

      <!-- KPI Grid -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; border-collapse: separate; border-spacing: 6px;">
        <tr>
          <td width="33%" style="background-color: #f1f5f9; padding: 14px; border-radius: 10px; text-align: center;">
            <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase;">Συνολο</div>
            <div style="font-size: 22px; font-weight: 900; color: #0f172a; margin-top: 4px;">${report.totalSent}</div>
            <div style="font-size: 10px; color: #10b981; font-weight: 700;">${Math.round((report.totalSent / Math.max(1, report.totalTarget)) * 100)}% επιτυχία</div>
          </td>
          <td width="33%" style="background-color: #eff6ff; padding: 14px; border-radius: 10px; text-align: center; border: 1px solid #bfdbfe;">
            <div style="font-size: 11px; font-weight: 800; color: #1e40af; text-transform: uppercase;">Resend API</div>
            <div style="font-size: 22px; font-weight: 900; color: #1e3a8a; margin-top: 4px;">${report.providers.resend}</div>
            <div style="font-size: 10px; color: #3b82f6; font-weight: 700;">Όριο: 100/ημ.</div>
          </td>
          <td width="33%" style="background-color: #fffbeb; padding: 14px; border-radius: 10px; text-align: center; border: 1px solid #fde68a;">
            <div style="font-size: 11px; font-weight: 800; color: #b45309; text-transform: uppercase;">Brevo API</div>
            <div style="font-size: 22px; font-weight: 900; color: #78350f; margin-top: 4px;">${report.providers.brevo}</div>
            <div style="font-size: 10px; color: #d97706; font-weight: 700;">Fallback &bull; 300/ημ.</div>
          </td>
        </tr>
      </table>

      <!-- Breakdown by Category -->
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
        <h3 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0;">Κατανομή Ανά Κατηγορία:</h3>
        
        <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>🏢 Νέες Ι.Κ.Ε. (Συμμόρφωση 80€):</strong>
            <div style="font-size: 12px; color: #64748b;">Στοχευμένες νέες συστάσεις από ΓΕΜΗ</div>
          </div>
          <div style="font-weight: 800; color: #0f172a; font-size: 15px;">
            ${report.newIke.sent} / ${report.newIke.target}
          </div>
        </div>

        <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>🏛️ Παλαιές Ι.Κ.Ε. (2018–2024 χωρίς Site 80€):</strong>
            <div style="font-size: 12px; color: #64748b;">Ι.Κ.Ε. συστάσεων 2018 έως 2024 χωρίς δήλωση ιστοσελίδας</div>
          </div>
          <div style="font-weight: 800; color: #0f172a; font-size: 15px;">
            ${report.legacyIke.sent} / ${report.legacyIke.target}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>🔌 FTTH / Οπτικές Ίνες &amp; Δίκτυα:</strong>
            <div style="font-size: 12px; color: #64748b;">ΚΑΔ 43210006 (ΑΕ, ΕΕ, ΟΕ, ΙΚΕ, Ατομικές) για Εφαρμογή Αυτοψίας</div>
          </div>
          <div style="font-weight: 800; color: #0f172a; font-size: 15px;">
            ${report.ftth.sent} / ${report.ftth.target}
          </div>
        </div>
      </div>

      <!-- Samples Preview -->
      <div style="background-color: #f8fafc; border-radius: 10px; padding: 14px; font-size: 12px; color: #475569; line-height: 1.6; margin-bottom: 16px;">
        <strong>Δείγμα Παραληπτών:</strong><br/>
        &bull; <em>Νέες ΙΚΕ:</em> ${report.newIke.samples.slice(0, 2).join(", ") || "-"}<br/>
        &bull; <em>Παλαιές ΙΚΕ:</em> ${report.legacyIke.samples.slice(0, 2).join(", ") || "-"}<br/>
        &bull; <em>FTTH:</em> ${report.ftth.samples.slice(0, 2).join(", ") || "-"}
      </div>

      <p style="font-size: 11.5px; color: #94a3b8; margin: 0; text-align: center;">
        Αυτοματοποιημένη ειδοποίηση συστήματος SGK Digital • info@sgk.gr
      </p>
      `;

      const notificationHtml = buildProfessionalEmailHtml({
        businessName: "SGK Admin",
        subject: `📊 Ημερήσια Αναφορά SGK: ${report.totalSent}/${report.totalTarget} Emails (100 Νέες, 100 Παλαιές, 99 FTTH)`,
        bodyHtml: reportHtml,
        unsubscribeToken: "admin-notification",
      });

      const reportResult = await dispatchEmailWithFallback({
        to: "info@sgk.gr",
        fromName: "SGK System Reports",
        fromEmail: "reports@sgk.gr",
        replyTo: "info@sgk.gr",
        subject: `📊 Ημερήσια Αναφορά SGK: ${report.totalSent}/${report.totalTarget} Emails (100 Νέες, 100 Παλαιές, 99 FTTH)`,
        html: notificationHtml,
        unsubscribeToken: "admin-notification",
        preferredProvider: isResendQuotaReached() ? "brevo" : "auto",
      });

      if (reportResult.success) {
        report.adminNotified = true;
        console.log(`[dailyAutoCampaigns] Admin notification email sent successfully via ${reportResult.provider} (msgId: ${reportResult.messageId || "ok"}) to info@sgk.gr!`);
      } else {
        report.adminNotified = false;
        console.error(`[dailyAutoCampaigns] Admin notification failed: ${reportResult.error}`);
        errors.push(`Admin notification failed: ${reportResult.error}`);
      }
    } catch (adminErr: any) {
      console.error("[dailyAutoCampaigns] Failed to send admin report email:", adminErr.message);
      report.adminNotified = false;
      errors.push(`Admin notification failed: ${adminErr.message}`);
    }

  } finally {
    globalThis.__isDailyCronRunning = false;
    globalThis.__lastDailyCronReport = report;
  }

  return report;
}
