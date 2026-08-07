/**
 * ΓΕΜΗ Auto Scraper - Supabase Edge Function
 * ============================================
 * Τρέχει αυτόματα με cron schedule (πρωί & βράδυ)
 * Αντλεί μόνο ΙΚΕ (legalType=19) που ιδρύθηκαν από Αύγουστο 2026+
 * Ταξινόμηση: νεότερες πρώτα (-incorporationDate)
 * Σταματά μόλις δει εταιρεία παλαιότερη της cutoff ημερομηνίας
 *
 * Rate limit API: 8 req/min -> delay 8.2s μεταξύ requests
 * Κάθε εκτέλεση: max 7 requests x 200 = ~1400 εταιρείες
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GEMI_API_KEY = Deno.env.get("GEMI_API_KEY") || "1QV0mFBoWsaprgiphMaBKEANZL0tRCc5";
const GEMI_API_BASE = "https://opendata-api.businessportal.gr/api/opendata/v1";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ΙΚΕ = legalType ID 19
const IKE_LEGAL_TYPE = 19;
const PAGE_SIZE = 200;
const DELAY_MS = 8200;
const MAX_REQUESTS_PER_RUN = 7;

// Cutoff: μόνο ΙΚΕ που ιδρύθηκαν από 1 Αυγούστου 2026 και μετά
const CUTOFF_DATE = new Date("2026-08-01");

const IGNORED_EMAIL_DOMAINS = [
  "gov.gr", "uhc.gr", "kee.gr", "businessportal.gr", "mindev.gov.gr",
  "gsis.gr", "minfin.gr", "facebook.com", "gmail.com", "hotmail.com",
  "yahoo.gr", "yahoo.com", "outlook.com", "live.com", "windowslive.com",
  "hotmail.gr", "msn.com", "icloud.com",
];

const IGNORED_WEBSITE_DOMAINS = [
  "gov.gr", "uhc.gr", "kee.gr", "facebook.com", "instagram.com",
  "twitter.com", "linkedin.com", "youtube.com", "tiktok.com",
];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isPersonalEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return IGNORED_EMAIL_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`));
}

function hasRealWebsite(url: string | null): boolean {
  if (!url || url.trim() === "") return false;
  try {
    const domain = new URL(url.startsWith("http") ? url : `https://${url}`)
      .hostname.toLowerCase().replace("www.", "");
    return !IGNORED_WEBSITE_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

function isNewerThanCutoff(incorporationDate: string | null): boolean {
  if (!incorporationDate) return false;
  const d = new Date(incorporationDate);
  return d >= CUTOFF_DATE;
}

async function apiGet(endpoint: string, params: Record<string, string | number | boolean>) {
  const url = new URL(`${GEMI_API_BASE}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const res = await fetch(url.toString(), {
    headers: { api_key: GEMI_API_KEY, Accept: "application/json" },
  });

  if (res.status === 429) {
    console.log("Rate limit! Waiting 65s...");
    await sleep(65000);
    return apiGet(endpoint, params);
  }

  if (!res.ok) throw new Error(`GEMI API ${res.status}: ${await res.text()}`);
  return res.json();
}

Deno.serve(async (_req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  console.log("🚀 ΓΕΜΗ IKE Scraper (Αύγουστος 2026+) starting...");
  console.log(`📅 Cutoff ημερομηνία: ${CUTOFF_DATE.toISOString().split("T")[0]}`);

  // Φόρτωσε existing emails
  const { data: existingData } = await supabase.from("sgk_mails").select("email");
  const existingEmails = new Set<string>(
    (existingData || []).map((r: any) => (r.email || "").toLowerCase().trim()).filter(Boolean)
  );
  console.log(`📥 Υπάρχουν ήδη ${existingEmails.size} emails στη βάση`);

  // State: διαβάζουμε το τελευταίο offset
  const { data: stateData } = await supabase
    .from("scraper_state")
    .select("*")
    .eq("scraper_name", "gemi_ike")
    .single();

  let currentOffset = stateData?.last_offset || 0;
  console.log(`📍 Offset: ${currentOffset}`);

  let totalSaved = 0;
  let totalDuplicate = 0;
  let totalNoEmail = 0;
  let totalHasWebsite = 0;
  let totalPersonal = 0;
  let totalTooOld = 0;
  let requestCount = 0;
  let reachedCutoff = false;

  for (let i = 0; i < MAX_REQUESTS_PER_RUN; i++) {
    console.log(`📄 Request ${i + 1}/${MAX_REQUESTS_PER_RUN} | offset=${currentOffset}`);

    try {
      const data = await apiGet("/companies", {
        legalTypes: IKE_LEGAL_TYPE,
        isActive: "true",
        resultsSize: PAGE_SIZE,
        resultsOffset: currentOffset,
        // Νεότερες πρώτα -> σταματάμε μόλις δούμε παλαιότερη από cutoff
        resultsSortBy: "-incorporationDate",
      });

      requestCount++;
      const companies = data.searchResults || [];
      const totalCount = data.searchMetadata?.totalCount;
      console.log(`   Σύνολο ΙΚΕ: ${totalCount} | Αυτή η σελίδα: ${companies.length}`);

      if (companies.length === 0) {
        console.log("✅ Τέλος αποτελεσμάτων. Reset offset -> 0");
        currentOffset = 0;
        break;
      }

      const toInsert: any[] = [];

      for (const company of companies) {
        const incorporationDate = company.incorporationDate || null;

        // Αν η εταιρεία είναι παλαιότερη από cutoff -> σταματάμε εντελώς
        if (!isNewerThanCutoff(incorporationDate)) {
          console.log(`⏹️  Φτάσαμε σε εταιρεία του ${incorporationDate} (παλαιότερη από cutoff). Σταματώ.`);
          totalTooOld++;
          reachedCutoff = true;
          break;
        }

        const email = (company.email || "").toLowerCase().trim();

        if (!email) { totalNoEmail++; continue; }
        if (isPersonalEmail(email)) { totalPersonal++; continue; }
        if (hasRealWebsite(company.url)) { totalHasWebsite++; continue; }
        if (existingEmails.has(email)) { totalDuplicate++; continue; }

        existingEmails.add(email);
        toInsert.push({
          email,
          first_name: company.coNameEl || "Επιχείρηση",
          last_name: "",
          company: company.coNameEl || "",
          phone: company.phone || null,
          marketing_consent: true,
          unsubscribe_token: crypto.randomUUID(),
          email_sequence_step: 0,
          unsubscribed: false,
          converted: false,
        });
      }

      // Batch insert
      if (toInsert.length > 0) {
        const { error } = await supabase
          .from("sgk_mails")
          .upsert(toInsert, { onConflict: "email", ignoreDuplicates: true });

        if (error) console.error("Insert error:", error.message);
        else {
          totalSaved += toInsert.length;
          console.log(`   ✅ Αποθηκεύτηκαν: ${toInsert.length} νέες ΙΚΕ`);
        }
      }

      if (reachedCutoff) {
        // Επόμενη φορά ξαναρχίζει από offset 0 (ψάχνει νέες εταιρείες)
        currentOffset = 0;
        break;
      }

      currentOffset += companies.length;

      if (companies.length < PAGE_SIZE) {
        console.log("✅ Τελευταία σελίδα. Reset offset -> 0");
        currentOffset = 0;
        break;
      }

      if (i < MAX_REQUESTS_PER_RUN - 1) {
        console.log(`   ⏳ Delay ${DELAY_MS / 1000}s...`);
        await sleep(DELAY_MS);
      }

    } catch (err: any) {
      console.error("❌ Error:", err.message);
      await sleep(15000);
    }
  }

  // Αποθήκευσε state
  await supabase.from("scraper_state").upsert(
    {
      scraper_name: "gemi_ike",
      last_offset: currentOffset,
      last_run_at: new Date().toISOString(),
      total_saved: (stateData?.total_saved || 0) + totalSaved,
    },
    { onConflict: "scraper_name" }
  );

  const summary = {
    success: true,
    cutoff_date: CUTOFF_DATE.toISOString().split("T")[0],
    requests_made: requestCount,
    reached_cutoff: reachedCutoff,
    next_offset: currentOffset,
    saved: totalSaved,
    duplicates: totalDuplicate,
    too_old: totalTooOld,
    no_email: totalNoEmail,
    has_website: totalHasWebsite,
    personal_email: totalPersonal,
  };

  console.log("📊 ΑΠΟΤΕΛΕΣΜΑΤΑ:", JSON.stringify(summary, null, 2));

  return new Response(JSON.stringify(summary), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
