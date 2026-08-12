/**
 * ΓΕΜΗ Legacy IKE Auto Scraper - Supabase Edge Function
 * ========================================================
 * Αντλεί μόνο ΙΚΕ (legalType=19) που ιδρύθηκαν από 1 Ιανουαρίου 2026 έως 31 Ιουλίου 2026
 * Αποθηκεύει με type = 'legacy_ike'
 * Στέλνει Telegram notification μετά από κάθε εκτέλεση
 *
 * Rate limit API: 8 req/min -> delay 8.2s μεταξύ requests
 * Κάθε εκτέλεση: max 7 requests x 200 = ~1400 εταιρείες
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GEMI_API_KEY = Deno.env.get("GEMI_API_KEY") || "1QV0mFBoWsaprgiphMaBKEANZL0tRCc5";
const GEMI_API_BASE = "https://opendata-api.businessportal.gr/api/opendata/v1";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const TELEGRAM_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "8603311936:AAG1e-zxKzU48elsr-t7dGyvQCSfvt0E32g";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") || "8162958857";

// ΙΚΕ = legalType ID 19
const IKE_LEGAL_TYPE = 19;
const PAGE_SIZE = 200;
const DELAY_MS = 8200;
const MAX_REQUESTS_PER_RUN = 7;

// Εύρος ημερομηνιών: Ιανουάριος 2026 - Ιούλιος 2026
const START_DATE = new Date("2026-01-01");
const END_DATE = new Date("2026-07-31T23:59:59");

const IGNORED_EMAIL_DOMAINS = [
  "gov.gr", "uhc.gr", "kee.gr", "businessportal.gr", "mindev.gov.gr",
  "gsis.gr", "minfin.gr"
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

function isWithinLegacyPeriod(incorporationDate: string | null): { isMatch: boolean; isTooOld: boolean } {
  if (!incorporationDate) return { isMatch: false, isTooOld: false };
  const d = new Date(incorporationDate);
  if (d < START_DATE) {
    return { isMatch: false, isTooOld: true };
  }
  if (d > END_DATE) {
    return { isMatch: false, isTooOld: false };
  }
  return { isMatch: true, isTooOld: false };
}

// Στέλνει μήνυμα στο Telegram
async function sendTelegram(message: string) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (e) {
    console.error("Telegram error:", e);
  }
}

function greekTime(date: Date): string {
  return date.toLocaleString("el-GR", {
    timeZone: "Europe/Athens",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function nextRunTime(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Athens",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  
  let h = 0, m = 0;
  for (const p of formatter.formatToParts(now)) {
    if (p.type === "hour") h = parseInt(p.value, 10);
    if (p.type === "minute") m = parseInt(p.value, 10);
  }

  const scheduleMinutes = [8 * 60 + 30, 10 * 60 + 30, 12 * 60 + 30, 14 * 60 + 30, 16 * 60 + 30, 18 * 60];
  const currentMin = h * 60 + m;

  let nextTargetMin = scheduleMinutes.find((min) => min > currentMin + 2);
  let daysToAdd = 0;

  if (!nextTargetMin) {
    nextTargetMin = scheduleMinutes[0];
    daysToAdd = 1;
  }

  const nextDate = new Date(now);
  nextDate.setDate(nextDate.getDate() + daysToAdd);

  const dayOfWeek = nextDate.getDay();
  if (dayOfWeek === 6) nextDate.setDate(nextDate.getDate() + 2);
  else if (dayOfWeek === 0) nextDate.setDate(nextDate.getDate() + 1);

  const targetH = Math.floor(nextTargetMin / 60);
  const targetM = nextTargetMin % 60;
  const dStr = nextDate.toLocaleDateString("el-GR", { timeZone: "Europe/Athens", day: "2-digit", month: "2-digit", year: "numeric" });

  return `${dStr}, ${String(targetH).padStart(2, "0")}:${String(targetM).padStart(2, "0")}`;
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
  const startTime = new Date();

  console.log("🚀 ΓΕΜΗ Παλιές ΙΚΕ Scraper (Ιαν-Ιουλ 2026) starting...");

  // Φόρτωσε existing emails
  const { data: existingData } = await supabase.from("sgk_mails").select("email");
  const existingEmails = new Set<string>(
    (existingData || []).map((r: any) => (r.email || "").toLowerCase().trim()).filter(Boolean)
  );

  // State
  const { data: stateData } = await supabase
    .from("scraper_state")
    .select("*")
    .eq("scraper_name", "gemi_legacy_ike")
    .single();

  let currentOffset = stateData?.last_offset || 0;

  let totalSaved = 0;
  let totalDuplicate = 0;
  let totalNoEmail = 0;
  let totalHasWebsite = 0;
  let totalPersonal = 0;
  let totalTooOld = 0;
  let requestCount = 0;
  let reachedCutoff = false;
  const pageLog: string[] = [];

  for (let i = 0; i < MAX_REQUESTS_PER_RUN; i++) {
    try {
      const data = await apiGet("/companies", {
        legalTypes: IKE_LEGAL_TYPE,
        isActive: "true",
        resultsSize: PAGE_SIZE,
        resultsOffset: currentOffset,
        resultsSortBy: "-arGemi",
      });

      requestCount++;
      const companies = data.searchResults || [];

      if (companies.length === 0) {
        currentOffset = 0;
        pageLog.push(`📄 Σελ.${requestCount}: Κενή σελίδα — τέλος αποτελεσμάτων`);
        break;
      }

      const toInsert: any[] = [];
      let pageSaved = 0, pageDup = 0, pageNoEmail = 0, pageWebsite = 0, pagePersonal = 0;

      for (const company of companies) {
        const { isMatch, isTooOld } = isWithinLegacyPeriod(company.incorporationDate);

        if (isTooOld) {
          totalTooOld++;
          reachedCutoff = true;
          break;
        }

        if (!isMatch) {
          // Νεότερη από Ιούλιο 2026 -> απλά συνεχίζουμε προς τα πίσω
          continue;
        }

        const email = (company.email || "").toLowerCase().trim();
        if (!email) { totalNoEmail++; pageNoEmail++; continue; }
        if (isPersonalEmail(email)) { totalPersonal++; pagePersonal++; continue; }
        if (hasRealWebsite(company.url)) { totalHasWebsite++; pageWebsite++; continue; }
        if (existingEmails.has(email)) { totalDuplicate++; pageDup++; continue; }

        existingEmails.add(email);
        toInsert.push({
          email,
          first_name: company.coNameEl || "Επιχείρηση",
          last_name: "",
          company: company.coNameEl || "",
          phone: company.phone || null,
          type: "legacy_ike",
          marketing_consent: true,
          unsubscribe_token: crypto.randomUUID(),
          email_sequence_step: 0,
          unsubscribed: false,
          converted: false,
        });
      }

      if (toInsert.length > 0) {
        const { error } = await supabase
          .from("sgk_mails")
          .insert(toInsert);
        if (!error) {
          totalSaved += toInsert.length;
          pageSaved = toInsert.length;
        } else {
          console.error("Insert error:", error.message);
        }
      }

      const pageTotal = companies.length;
      let pageInfo = `📄 Σελ.${requestCount} (${pageTotal} ΙΚΕ): `;
      const parts = [];
      if (pageSaved > 0) parts.push(`✅ ${pageSaved} νέα (Παλιές ΙΚΕ)`);
      if (pageDup > 0) parts.push(`🔁 ${pageDup} dup`);
      if (pageNoEmail > 0) parts.push(`📧 ${pageNoEmail} χωρίς email`);
      if (pagePersonal > 0) parts.push(`📮 ${pagePersonal} personal`);
      if (pageWebsite > 0) parts.push(`🌐 ${pageWebsite} website`);
      if (reachedCutoff) parts.push(`⏹️ Σταμάτησε (παλαιότερη από 01/2026)`);

      pageInfo += parts.join(" | ") || "Τίποτα νέο";
      pageLog.push(pageInfo);
      console.log(pageInfo);

      if (reachedCutoff) {
        currentOffset = 0;
        break;
      }

      currentOffset += companies.length;

      if (companies.length < PAGE_SIZE) {
        currentOffset = 0;
        break;
      }

      if (i < MAX_REQUESTS_PER_RUN - 1) await sleep(DELAY_MS);

    } catch (err: any) {
      console.error("Error:", err.message);
      await sleep(15000);
    }
  }

  // Αποθήκευσε state
  const newTotalSaved = (stateData?.total_saved || 0) + totalSaved;
  await supabase.from("scraper_state").upsert(
    {
      scraper_name: "gemi_legacy_ike",
      last_offset: currentOffset,
      last_run_at: new Date().toISOString(),
      total_saved: newTotalSaved,
    },
    { onConflict: "scraper_name" }
  );

  const duration = Math.round((Date.now() - startTime.getTime()) / 1000);

  // 📩 Telegram notification
  const pagesSection = pageLog.length > 0
    ? `━━━━━━━━━━━━━━━━━━━━\n<b>📋 Αναλυση ανα σελιδα:</b>\n` + pageLog.join("\n") + "\n"
    : "";

  const telegramMsg =
    `🏛️ <b>ΓΕΜΗ Παλιες IKE (Ιαν-Ιουλ 2026) — Αναφορα</b>\n` +
    `📅 ${greekTime(startTime)}\n` +
    pagesSection +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `✅ <b>Νεα leads (Παλιες ΙΚΕ):</b> ${totalSaved}\n` +
    `🔁 <b>Duplicates:</b> ${totalDuplicate}\n` +
    `📧 <b>Χωρις email:</b> ${totalNoEmail}\n` +
    `🌐 <b>Εχουν website:</b> ${totalHasWebsite}\n` +
    `📮 <b>Personal emails:</b> ${totalPersonal}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📊 <b>Συνολο leads στη βαση:</b> ${existingEmails.size}\n` +
    `⏱️ <b>Διαρκεια:</b> ${duration}s\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🕐 <b>Επομενη εκτελεση:</b> ${nextRunTime()}`;

  await sendTelegram(telegramMsg);

  return new Response(JSON.stringify({ success: true, saved: totalSaved }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
