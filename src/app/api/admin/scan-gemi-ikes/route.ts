import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { isEmailBlacklisted, isCustomDomainEmail } from "@/lib/blacklist";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
  const trimmed = email.toLowerCase().trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(trimmed)) return false;
  const domain = trimmed.split("@")[1] || "";
  return !IGNORED_DOMAINS.some(d => domain.includes(d));
}

function normalizeGreek(text: string): string {
  return (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function isTourismKad(kad: string): boolean {
  return (
    kad.startsWith("55") ||      // Καταλύματα (ξενοδοχεία, ενοικιαζόμενα δωμάτια, βίλες, κάμπινγκ)
    kad.startsWith("79") ||      // Ταξιδιωτικά γραφεία, tour operators, υπηρεσίες κρατήσεων
    kad.startsWith("7711") ||    // Ενοικίαση επιβατικών αυτοκινήτων (Rent a car)
    kad.startsWith("7712") ||    // Ενοικίαση φορτηγών χωρίς οδηγό
    kad.startsWith("7721") ||    // Ενοικίαση ειδών αναψυχής και αθλητικών ειδών (σκάφη αναψυχής κλπ.)
    kad.startsWith("7734") ||    // Ενοικίαση εξοπλισμού υδάτινων μεταφορών (yacht charter)
    kad.startsWith("5010") ||    // Θαλάσσιες και ακτοπλοϊκές μεταφορές επιβατών (κρουαζιέρες)
    kad.startsWith("5030")       // Εσωτερικές υδάτινες μεταφορές επιβατών
  );
}

function isOperationsKad(kad: string): boolean {
  return (
    kad.startsWith("41") ||      // Κατασκευές κτιρίων
    kad.startsWith("42") ||      // Έργα πολιτικού μηχανικού
    kad.startsWith("43") ||      // Εξειδικευμένες κατασκευαστικές δραστηριότητες (ηλεκτρολογικά, υδραυλικά κλπ.)
    kad.startsWith("61") ||      // Τηλεπικοινωνίες (ενσύρματες, ασύρματες, δορυφορικές, οπτικές ίνες)
    kad.startsWith("494") ||     // Οδικές μεταφορές εμπορευμάτων & υπηρεσίες μετακόμισης (49.41, 49.42)
    kad.startsWith("521") ||     // Αποθήκευση (warehousing / logistics 52.10)
    kad.startsWith("522") ||     // Υποστηρικτικές προς τη μεταφορά δραστηριότητες (logistics 52.21-52.29)
    kad.startsWith("801") ||     // Υπηρεσίες ιδιωτικής προστασίας (security 80.10)
    kad.startsWith("802") ||     // Υπηρεσίες συστημάτων ασφαλείας (security systems 80.20)
    kad.startsWith("33") ||      // Επισκευή και εγκατάσταση μηχανημάτων και εξοπλισμού
    kad.startsWith("7112")       // Δραστηριότητες μηχανικών και τεχνικές συμβουλές
  );
}

export const FTTH_TARGET_KADS = [
  "43210006", // ΥΠΗΡΕΣΙΕΣ ΕΓΚΑΤΑΣΤΑΣΗΣ ΚΑΛΩΔΙΩΣΕΩΝ ΚΑΙ ΕΞΟΠΛΙΣΜΟΥ ΤΗΛΕΠΙΚΟΙΝΩΝΙΩΝ ΚΑΙ ΔΙΚΤΥΩΝ
  "43211006", // Επίσημος 8-ψήφιος ΚΑΔ ΓΕΜΗ (ΥΠΗΡΕΣΙΕΣ ΕΓΚΑΤΑΣΤΑΣΗΣ ΚΑΛΩΔΙΩΣΕΩΝ ΚΑΙ ΕΞΟΠΛΙΣΜΟΥ ΤΗΛΕΠΙΚΟΙΝΩΝΙΩΝ ΚΑΙ ΔΙΚΤΥΩΝ)
];

export function checkFtthTelecomTarget(co: any): { isMatch: boolean; reason: string } {
  const kadCodes: string[] = [];
  const activityTexts: string[] = [];

  if (Array.isArray(co.activities)) {
    for (const a of co.activities) {
      const rawId = a?.activity?.id || a?.id;
      if (rawId) {
        const clean = String(rawId).replace(/[^0-9]/g, "");
        kadCodes.push(clean);
      }
      if (a?.activity?.descr || a?.descr) {
        activityTexts.push(normalizeGreek(a?.activity?.descr || a?.descr));
      }
    }
  }

  if (co.objective) {
    activityTexts.push(normalizeGreek(co.objective));
    const matches = co.objective.match(/\b\d{4,8}\b/g);
    if (matches) {
      for (const m of matches) kadCodes.push(m);
    }
  }

  // 1. Direct or prefix match with target KAD (43210006 / 43211006)
  for (const kad of kadCodes) {
    for (const target of FTTH_TARGET_KADS) {
      if (kad === target || (kad.length >= 6 && target.startsWith(kad)) || (target.length >= 6 && kad.startsWith(target))) {
        return { isMatch: true, reason: `ΚΑΔ ${kad} (Εγκατάσταση Καλωδιώσεων & Τηλεπικοινωνιών)` };
      }
    }
  }

  // 2. Keyword match in name or activities
  const allText = [
    normalizeGreek(co.coNameEl || ""),
    ...(co.coTitlesEl || []).map((t: string) => normalizeGreek(t)),
    ...(co.coTitlesEn || []).map((t: string) => normalizeGreek(t)),
    ...activityTexts
  ].join(" ");

  const FTTH_EXACT_KEYWORDS = [
    "ΕΓΚΑΤΑΣΤΑΣΗΣ ΚΑΛΩΔΙΩΣΕΩΝ",
    "ΕΓΚΑΤΑΣΤΑΣΗ ΚΑΛΩΔΙΩΣΕΩΝ",
    "ΕΞΟΠΛΙΣΜΟΥ ΤΗΛΕΠΙΚΟΙΝΩΝΙΩΝ",
    "ΚΑΛΩΔΙΩΣΕΩΝ ΚΑΙ ΔΙΚΤΥΩΝ",
    "ΤΗΛΕΠΙΚΟΙΝΩΝΙΩΝ ΚΑΙ ΔΙΚΤΥΩΝ",
    "ΟΠΤΙΚΕΣ ΙΝΕΣ",
    "ΟΠΤΙΚΗΣ ΙΝΑΣ",
    "ΟΠΤΙΚΩΝ ΙΝΩΝ",
    "FTTH",
    "FIBER OPTIC",
    "FIBER"
  ];

  for (const kw of FTTH_EXACT_KEYWORDS) {
    if (allText.includes(kw)) {
      return { isMatch: true, reason: `Δραστηριότητα: ${kw}` };
    }
  }

  return { isMatch: false, reason: "" };
}

const TOURISM_TEXT_REGEX = /(?:\b(TOUR|TOURS|TOURISM|TOURIST|TOURISTIC|TRAVEL|RENT A CAR|CAR RENTAL|YACHT|CHARTER|BOAT RENTAL|HOTEL|HOTELS|VILLA|VILLAS|RESORT|RESORTS|CRUISE|HOLIDAY|HOLIDAYS|HOSPITALITY)\b|ΤΟΥΡΙΣΤ|ΞΕΝΟΔΟΧ|ΒΙΛΑ|ΒΙΛΕΣ|ΒΙΛΛΑ|ΒΙΛΛΕΣ|ΚΡΟΥΑΖΙΕΡ|ΕΚΔΡΟΜ|ΕΝΟΙΚΙΑΖΟΜΕΝ[Α-Ω\s]+ΔΩΜΑΤΙ|ΤΟΥΡΙΣΤΙΚ[Α-Ω\s]+ΚΑΤΑΛΥΜ|ΚΑΤΑΛΥΜΑΤΑ ΔΙΑΚΟΠΩΝ|ΤΟΥΡΙΣΤΙΚ[Α-Ω\s]+ΦΙΛΟΞΕΝ)/;

const OPS_TEXT_REGEX = /(?:\b(LOGISTICS|SECURITY|FIBER|FIBER OPTIC)\b|ΤΗΛΕΠΙΚΟΙΝΩΝ|ΟΠΤΙΚΕΣ ΙΝΕΣ|ΟΠΤΙΚΗ ΙΝΑ|ΟΠΤΙΚΩΝ ΙΝΩΝ|ΤΕΧΝΙΚΗ ΕΤΑΙΡΕΙΑ|ΤΕΧΝΙΚΕΣ ΕΡΓΑΣΙΕΣ|ΤΕΧΝΙΚΟ ΓΡΑΦΕΙΟ|ΤΕΧΝΙΚΩΝ ΕΡΓΩΝ|ΤΕΧΝΙΚΕΣ ΥΠΗΡΕΣΙΕΣ|ΤΕΧΝΙΚΟΣ ΕΛΕΓΧΟΣ|ΤΕΧΝΙΚΩΝ ΕΓΚΑΤΑΣΤΑΣΕΩΝ|ΕΡΓΟΛΑΒ|ΜΕΤΑΦΟΡΙΚΗ|ΜΕΤΑΦΟΡΕΣ ΕΜΠΟΡΕΥΜΑΤΩΝ|ΔΙΑΜΕΤΑΦΟΡ|ΣΥΝΤΗΡΗΣΗ ΚΤΙΡΙΩΝ|ΣΥΝΤΗΡΗΣΕΙΣ|ΣΥΝΤΗΡΗΣΗ ΕΓΚΑΤΑΣΤΑΣΕΩΝ|ΗΛΕΚΤΡΟΛΟΓΙΚ|ΥΔΡΑΥΛΙΚΕΣ ΕΓΚΑΤΑΣΤΑΣΕΙΣ|ΥΔΡΑΥΛΙΚΑ ΕΡΓΑ|ΥΔΡΑΥΛΙΚΟΣ|ΥΔΡΑΥΛΙΚΟΙ|ΨΥΚΤΙΚΕΣ ΕΓΚΑΤΑΣΤΑΣΕΙΣ|ΨΥΚΤΙΚΟΣ|ΨΥΚΤΙΚΟΙ|ΧΩΜΑΤΟΥΡΓ|ΦΥΛΑΞΗ|ΣΥΣΤΗΜΑΤΑ ΑΣΦΑΛΕΙΑΣ|ΙΔΙΩΤΙΚΗ ΑΣΦΑΛΕΙΑ|ΚΑΤΑΣΚΕΥΑΣΤΙΚΗ|ΚΑΤΑΣΚΕΥΕΣ ΚΤΙΡΙΩΝ|ΟΙΚΟΔΟΜΙΚΕΣ ΕΠΙΧΕΙΡΗΣΕΙΣ|ΑΝΕΛΚΥΣΤ|ΜΟΝΩΣΕΙΣ)/;

function detectLeadIndustry(co: any): { type: string; label: string; icon: string; legalForm: string } {
  const legalForm = co.legalType?.descr || "Επιχείρηση";

  // 1. Extract Primary KAD vs all KADs cleanly without text collisions
  let primaryKad = "";
  const allKadCodes: string[] = [];

  if (Array.isArray(co.activities)) {
    for (const a of co.activities) {
      const rawId = a?.activity?.id || a?.id;
      if (rawId) {
        const clean = String(rawId).replace(/[^0-9]/g, "");
        allKadCodes.push(clean);
        if (a.type === "Κύρια" || !primaryKad) {
          primaryKad = clean;
        }
      }
    }
  }
  if (co.objective) {
    const matches = co.objective.match(/\b\d{4,8}\b/g);
    if (matches) {
      for (const m of matches) allKadCodes.push(m);
      if (!primaryKad && matches.length > 0) primaryKad = matches[0];
    }
  }

  // 2. Check company name & trade titles specifically
  const nameAndTitles = normalizeGreek([
    co.coNameEl || "",
    ...(co.coTitlesEl || []),
    ...(co.coTitlesEn || []),
  ].join(" "));

  const nameHasTourism = TOURISM_TEXT_REGEX.test(nameAndTitles);
  const nameHasOps = OPS_TEXT_REGEX.test(nameAndTitles);

  // 3. Primary KAD checks
  const isPrimaryTourism = isTourismKad(primaryKad);
  const isPrimaryOps = isOperationsKad(primaryKad);

  // 4. Secondary KAD checks
  const hasAnyTourismKad = allKadCodes.some(k => isTourismKad(k));
  const hasAnyOpsKad = allKadCodes.some(k => isOperationsKad(k));

  // 5. Unrelated Major Primary Sectors (e.g. Real Estate, Investments, Consulting, Wholesale, Healthcare)
  // If a company is primarily Real Estate (68), Investment (64/66), Consulting (70), Wholesale (46), Medical (21/86)
  // it should NOT be flagged as Tourism just because of a secondary Airbnb KAD, UNLESS its name explicitly says so.
  const isUnrelatedPrimarySector = 
    primaryKad.startsWith("68") || 
    primaryKad.startsWith("64") || 
    primaryKad.startsWith("66") || 
    primaryKad.startsWith("70") || 
    primaryKad.startsWith("46") || 
    primaryKad.startsWith("21") || 
    primaryKad.startsWith("86");

  const isTourism = isPrimaryTourism || nameHasTourism || (hasAnyTourismKad && !isUnrelatedPrimarySector);
  const isOps = isPrimaryOps || nameHasOps || (hasAnyOpsKad && !isUnrelatedPrimarySector);

  // Tourism takes priority if matched
  if (isTourism) {
    return { type: "tourism", label: `Τουρισμός (${legalForm})`, icon: "✈️", legalForm };
  }

  // Operations & Tech
  if (isOps) {
    return { type: "operations_tech", label: `Operations & Τεχνική (${legalForm})`, icon: "⚡", legalForm };
  }

  const isIke = legalForm.toUpperCase().includes("ΙΚΕ") || legalForm.toUpperCase().includes("Ι.Κ.Ε.");
  return { 
    type: isIke ? "new_ike" : "general_co", 
    label: legalForm, 
    icon: "🏢",
    legalForm 
  };
}

async function fetchGemiWithTimeout(url: string, apiKey: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      headers: {
        api_key: apiKey,
        Accept: "application/json",
        "User-Agent": "SGK-Digital-Scanner/1.0",
      },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Lookup anchor benchmarks for GEMI OpenData API (descending -arGemi)
const GEMI_IKE_ANCHORS: { ym: number; offset: number }[] = [
  { ym: 202610, offset: 0 },
  { ym: 202605, offset: 5000 },
  { ym: 202601, offset: 10500 },
  { ym: 202512, offset: 11500 },
  { ym: 202509, offset: 15000 },
  { ym: 202501, offset: 23500 },
  { ym: 202412, offset: 25000 },
  { ym: 202406, offset: 30500 },
  { ym: 202401, offset: 37000 },
  { ym: 202312, offset: 38000 },
  { ym: 202306, offset: 44000 },
  { ym: 202301, offset: 49000 },
  { ym: 202212, offset: 50000 },
  { ym: 202206, offset: 55000 },
  { ym: 202201, offset: 61000 },
  { ym: 202112, offset: 62000 },
  { ym: 202108, offset: 65000 },
  { ym: 202101, offset: 71000 },
  { ym: 202012, offset: 72000 },
  { ym: 202009, offset: 75000 },
  { ym: 202001, offset: 80000 },
  { ym: 201912, offset: 81000 },
  { ym: 201906, offset: 85000 },
  { ym: 201901, offset: 89000 },
  { ym: 201812, offset: 89500 },
  { ym: 201811, offset: 90000 },
  { ym: 201806, offset: 94500 },
  { ym: 201801, offset: 98000 },
  { ym: 201704, offset: 100000 },
];

function getEstimatedOffset(year: number, targetMonth: string | null): number {
  const monthNum = targetMonth ? Number(targetMonth.split("-")[1]) : 12;
  const targetYM = year * 100 + monthNum;

  if (targetYM >= GEMI_IKE_ANCHORS[0].ym) return 0;
  if (targetYM <= GEMI_IKE_ANCHORS[GEMI_IKE_ANCHORS.length - 1].ym) {
    return GEMI_IKE_ANCHORS[GEMI_IKE_ANCHORS.length - 1].offset;
  }

  for (let i = 0; i < GEMI_IKE_ANCHORS.length - 1; i++) {
    const higher = GEMI_IKE_ANCHORS[i];     // Newer in time (lower offset)
    const lower = GEMI_IKE_ANCHORS[i + 1];  // Older in time (higher offset)
    if (targetYM <= higher.ym && targetYM >= lower.ym) {
      const ymRange = higher.ym - lower.ym;
      const progress = ymRange === 0 ? 0 : (higher.ym - targetYM) / ymRange;
      const interpolated = higher.offset + progress * (lower.offset - higher.offset);
      // Give a safe cushion of 300 records backwards so we never miss the beginning of the target period
      return Math.max(0, Math.floor(interpolated - 300));
    }
  }

  return 0;
}

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    body = {};
  }

  const maxResults = body.limit || 50;
  const targetCategory = body.targetCategory || "all";
  const isFtthMode = targetCategory === "ftth_telecom";
  const isNonIkeMode = targetCategory === "non_ike" || targetCategory === "new_non_ike";
  const targetLegalForm = isFtthMode ? "all" : isNonIkeMode ? "non_ike" : "ike";
  const nonIkeLegalType = body.nonIkeLegalType || "companies_only"; // "companies_only" (Ο.Ε., Ε.Ε., Α.Ε.), "all", "sole_only"
  const nonIkeLabel = nonIkeLegalType === "companies_only"
    ? "Ο.Ε., Ε.Ε., Α.Ε."
    : nonIkeLegalType === "sole_only"
    ? "Ατομικές"
    : "Ο.Ε., Ε.Ε., Α.Ε., Ατομικές";
  
  // Dynamic Month & Year Handling (supports 2018 up to 2026)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthNum = String(now.getMonth() + 1).padStart(2, "0");
  const currentMonthPrefix = `${currentYear}-${currentMonthNum}`; // e.g. "2026-10"

  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthNum = String(prevDate.getMonth() + 1).padStart(2, "0");
  const prevMonthPrefix = `${prevDate.getFullYear()}-${prevMonthNum}`; // e.g. "2026-09"

  let targetYear = body.year ? Number(body.year) : currentYear;
  const rawMonth = body.month || "current";

  let targetMonth: string | null = null;
  let minDate: string = "";
  let maxDate: string = "";

  if (rawMonth === "current") {
    targetYear = currentYear;
    targetMonth = currentMonthPrefix;
    minDate = `${currentMonthPrefix}-01`;
    maxDate = `${currentMonthPrefix}-31`;
  } else if (rawMonth === "previous") {
    targetYear = prevDate.getFullYear();
    targetMonth = prevMonthPrefix;
    minDate = `${prevMonthPrefix}-01`;
    maxDate = `${prevMonthPrefix}-31`;
  } else if (rawMonth === "all_year" || rawMonth === "all") {
    targetMonth = null;
    minDate = `${targetYear}-01-01`;
    maxDate = `${targetYear}-12-31`;
  } else if (typeof rawMonth === "string" && rawMonth.match(/^\d{4}-\d{2}$/)) {
    targetYear = Number(rawMonth.split("-")[0]);
    targetMonth = rawMonth;
    minDate = `${rawMonth}-01`;
    maxDate = `${rawMonth}-31`;
  } else if (typeof rawMonth === "string" && rawMonth.match(/^\d{2}$/)) {
    targetMonth = `${targetYear}-${rawMonth}`;
    minDate = `${targetYear}-${rawMonth}-01`;
    maxDate = `${targetYear}-${rawMonth}-31`;
  } else {
    if (targetYear < currentYear) {
      targetMonth = null;
      minDate = `${targetYear}-01-01`;
      maxDate = `${targetYear}-12-31`;
    } else {
      targetMonth = currentMonthPrefix;
      minDate = `${currentMonthPrefix}-01`;
      maxDate = `${currentMonthPrefix}-31`;
    }
  }

  if (body.minDate) {
    minDate = body.minDate;
  }
  if (body.maxDate) {
    maxDate = body.maxDate;
  }

  const isLegacyIke = !isFtthMode && !isNonIkeMode && targetYear < currentYear;
  const computedStartOffset = isFtthMode || isNonIkeMode ? 0 : getEstimatedOffset(targetYear, targetMonth);
  const startOffset = typeof body.startOffset === "number" ? body.startOffset : computedStartOffset;

  const isStream = body.stream !== false; // Default to streaming
  const pageSize = 50;

  const supabase = getServiceSupabase();

  // If streaming is requested, use ReadableStream for real-time live terminal updates
  if (isStream) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const emit = (eventData: any) => {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(eventData)}\n\n`));
          } catch (e) {
            // Stream might be closed
          }
        };

        try {
          const monthLabel = targetMonth ? `Μήνας: ${targetMonth}` : `Έτος ${targetYear} (${minDate} έως ${maxDate})`;

          emit({
            type: "init",
            message: isFtthMode
              ? `⚡ Σύνδεση με OpenData API Γ.Ε.ΜΗ. [ΚΑΔ 43210006/43211006 - Εγκατάσταση Καλωδιώσεων & Τηλεπικοινωνιών | Όλες οι Μορφές (ΑΕ, ΕΕ, ΟΕ, ΙΚΕ, Ατομικές) | 📅 ${monthLabel}]...`
              : isNonIkeMode
              ? `⚡ Σύνδεση με OpenData API Γ.Ε.ΜΗ. [Νέες Επιχειρήσεις ΕΚΤΟΣ Ι.Κ.Ε. (${nonIkeLabel}) | 📅 ${monthLabel}]...`
              : isLegacyIke
              ? `⚡ Σύνδεση με OpenData API Γ.Ε.ΜΗ. [Παλαιές Ι.Κ.Ε. (${targetYear}) χωρίς site | 📅 ${monthLabel} | Offset ~${startOffset}]...`
              : `⚡ Σύνδεση με OpenData API Γ.Ε.ΜΗ. [Μόνο Νέες Ι.Κ.Ε. | 📅 ${monthLabel}]...`,
            minDate,
            maxDate,
            maxResults,
            targetCategory,
            targetLegalForm,
            nonIkeLegalType,
            targetMonth,
            targetYear,
            startOffset
          });

          // 1. Fetch ALL existing emails, AFMs, and GEMI numbers from Supabase (paginated to bypass 1000 limit)
          const existingEmailSet = new Set<string>();
          const existingAfmSet = new Set<string>();
          const existingGemiSet = new Set<string>();

          let fetchFrom = 0;
          const fetchChunkSize = 1000;
          let hasMoreExisting = true;

          while (hasMoreExisting) {
            const { data: existingRecords, error: existingErr } = await supabase
              .from("sgk_mails")
              .select("email, afm, gemi_number")
              .range(fetchFrom, fetchFrom + fetchChunkSize - 1);

            if (existingErr) {
              console.error("Notice querying Supabase existing records:", existingErr);
              emit({
                type: "warning",
                message: `⚠️ Σφάλμα ανάκτησης υπαρχόντων records από βάση: ${existingErr.message}`
              });
              break;
            }

            if (existingRecords && existingRecords.length > 0) {
              for (const r of existingRecords) {
                if (r.email) existingEmailSet.add(r.email.toLowerCase().trim());
                if (r.afm) existingAfmSet.add(String(r.afm).trim());
                if (r.gemi_number) existingGemiSet.add(String(r.gemi_number).trim());
              }
              if (existingRecords.length < fetchChunkSize) {
                hasMoreExisting = false;
              } else {
                fetchFrom += fetchChunkSize;
              }
            } else {
              hasMoreExisting = false;
            }
          }

          emit({
            type: "info",
            message: `🔍 Ελέγχθηκαν ${existingEmailSet.size} υπάρχοντα emails και ${existingAfmSet.size} ΑΦΜ στη βάση δεδομένων για 100% αποφυγή διπλοτύπων.`,
          });

          const newLeadsToInsert: any[] = [];
          const seenInBatch = new Set<string>();
          const seenAfmInBatch = new Set<string>();
          let totalExamined = 0;
          let totalDuplicates = 0;
          let totalHasWebsite = 0;
          let totalCustomDomain = 0;
          let totalNoEmail = 0;
          let totalOldDate = 0;
          let offset = startOffset;

          const maxOffset = offset + (isFtthMode ? 20000 : 15000);
          while (newLeadsToInsert.length < maxResults && offset < maxOffset) {
            const pageNum = Math.floor((offset - startOffset) / pageSize) + 1;
            emit({
              type: "page",
              message: isFtthMode
                ? `📡 Λήψη παρτίδας #${pageNum} από ΓΕΜΗ (έλεγχος ΚΑΔ 43210006 σε όλες τις μορφές ${offset + 1} έως ${offset + pageSize})...`
                : isNonIkeMode
                ? `📡 Λήψη παρτίδας #${pageNum} από ΓΕΜΗ (νέες επιχειρήσεις [${nonIkeLabel}] ${offset + 1} έως ${offset + pageSize})...`
                : isLegacyIke
                ? `📡 Λήψη παρτίδας #${pageNum} από ΓΕΜΗ (παλαιές Ι.Κ.Ε. ${targetYear} ${offset + 1} έως ${offset + pageSize})...`
                : `📡 Λήψη παρτίδας #${pageNum} από ΓΕΜΗ (νέες Ι.Κ.Ε. ${offset + 1} έως ${offset + pageSize})...`,
              offset,
              page: pageNum
            });

            // Legal types configuration:
            // - FTTH: all legal forms
            // - Non-IKE: targeted forms based on nonIkeLegalType (companies_only: 1=AE, 2=OE, 4=EE | all: 1,2,4,16 | sole_only: 16)
            // - Default: only IKEs (19)
            let legalTypeParam = "";
            if (isFtthMode) {
              legalTypeParam = "";
            } else if (isNonIkeMode) {
              if (nonIkeLegalType === "sole_only") {
                legalTypeParam = "&legalTypes=16";
              } else if (nonIkeLegalType === "all") {
                legalTypeParam = "&legalTypes=1,2,4,16";
              } else {
                // "companies_only" (default: Ο.Ε., Ε.Ε., Α.Ε.)
                legalTypeParam = "&legalTypes=1,2,4";
              }
            } else {
              legalTypeParam = "&legalTypes=19";
            }
            const url = `${GEMI_API_BASE}/companies?isActive=true&resultsSize=${pageSize}&resultsOffset=${offset}${legalTypeParam}&resultsSortBy=-arGemi`;

            let results: any[] = [];
            try {
              let res = await fetchGemiWithTimeout(url, GEMI_API_KEY);
              let retryCount = 0;

              // Handle GEMI API Rate Limit (HTTP 429) with backoff
              while (res.status === 429 && retryCount < 3) {
                retryCount++;
                emit({
                  type: "warning",
                  message: `⏳ Όριο ρυθμού OpenData ΓΕΜΗ (rate limit). Αναμονή ${retryCount * 8} δευτερολέπτων πριν από νέα προσπάθεια...`
                });
                await new Promise((r) => setTimeout(r, retryCount * 8000));
                res = await fetchGemiWithTimeout(url, GEMI_API_KEY);
              }

              if (!res.ok) {
                const errorText = await res.text();
                emit({
                  type: "warning",
                  message: `⚠️ Προσωρινή απόκριση ΓΕΜΗ (${res.status}): ${errorText.slice(0, 100)}`
                });
                break;
              }
              const data = await res.json();
              results = data.searchResults || [];
            } catch (fetchErr: any) {
              emit({
                type: "warning",
                message: `⚠️ Σφάλμα σύνδεσης στο offset ${offset}: ${fetchErr.message}`
              });
              break;
            }

            if (results.length === 0) {
              emit({ type: "info", message: "Δεν βρέθηκαν άλλα αποτελέσματα στο ΓΕΜΗ." });
              break;
            }

            let olderCountInPage = 0;

            for (const co of results) {
              totalExamined++;
              const legalForm = co.legalType?.descr || (isFtthMode ? "Τηλεπικοινωνίες" : isNonIkeMode ? "Επιχείρηση" : "Ι.Κ.Ε.");
              const companyTitle = co.coNameEl || (co.coTitlesEl && co.coTitlesEl[0]) || `Νέα ${legalForm}`;
              const incDate = co.incorporationDate ? String(co.incorporationDate).split("T")[0].trim() : "";
              const email = (co.email || "").toLowerCase().trim();
              const urlClean = co.url || "";
              const phone = co.phone ? String(co.phone).trim() : null;
              const afm = co.afm ? String(co.afm).trim() : null;
              const arGemi = co.arGemi ? String(co.arGemi).trim() : null;

              // Filter: In Non-IKE mode, strictly exclude any I.K.E. companies
              const legalDescrUpper = (co.legalType?.descr || "").toUpperCase();
              const isIke = (co.legalType?.id === 19) ||
                legalDescrUpper.includes("ΙΚΕ") ||
                legalDescrUpper.includes("Ι.Κ.Ε.") ||
                legalDescrUpper.includes("ΙΔΙΩΤΙΚΗ ΚΕΦΑΛΑΙΟΥΧΙΚΗ") ||
                companyTitle.toUpperCase().includes(" ΙΚΕ") ||
                companyTitle.toUpperCase().includes(" Ι.Κ.Ε.") ||
                companyTitle.toUpperCase().endsWith("ΙΚΕ") ||
                companyTitle.toUpperCase().endsWith("Ι.Κ.Ε.");

              if (isNonIkeMode && isIke) {
                continue;
              }

              // Filter: If record is newer than maxDate (due to cushion offset), skip it
              if (maxDate && incDate && incDate > maxDate) {
                continue;
              }

              // Filter: Check minimum incorporation date
              if (minDate && incDate && incDate < minDate) {
                totalOldDate++;
                olderCountInPage++;
                emit({
                  type: "log",
                  category: "old_date",
                  company: companyTitle,
                  afm,
                  date: incDate,
                  reason: `Σύσταση (${incDate}) πριν τις ${minDate} (παραλείφθηκε)`,
                  stats: { totalExamined, added: newLeadsToInsert.length, totalDuplicates, totalHasWebsite, totalNoEmail, totalOldDate, totalCustomDomain }
                });
                continue;
              }

              // Filter: Check target month if requested (e.g. "2018-05")
              if (targetMonth && (!incDate || !incDate.startsWith(targetMonth))) {
                totalOldDate++;
                if (incDate && incDate < targetMonth) {
                  olderCountInPage++;
                }
                continue;
              }

              // Filter: Check FTTH targeting if in FTTH mode
              const ftthCheck = checkFtthTelecomTarget(co);
              if (isFtthMode && !ftthCheck.isMatch) {
                continue;
              }

              // Filter: Check official website (Only in general IKE/Non-IKE mode; FTTH contractors are targeted for autopsy software)
              if (!isFtthMode && hasOfficialWebsite(urlClean)) {
                totalHasWebsite++;
                emit({
                  type: "log",
                  category: "has_website",
                  company: companyTitle,
                  afm,
                  url: urlClean,
                  reason: `Έχει ήδη επίσημη ιστοσελίδα (${urlClean}) (παραλείφθηκε)`,
                  stats: { totalExamined, added: newLeadsToInsert.length, totalDuplicates, totalHasWebsite, totalNoEmail, totalOldDate, totalCustomDomain }
                });
                continue;
              }

              // Filter: Check email
              if (!isValidEmail(email)) {
                totalNoEmail++;
                emit({
                  type: "log",
                  category: "no_email",
                  company: companyTitle,
                  afm,
                  reason: `Δεν έχει δηλώσει email στο ΓΕΜΗ (παραλείφθηκε)`,
                  stats: { totalExamined, added: newLeadsToInsert.length, totalDuplicates, totalHasWebsite, totalNoEmail, totalOldDate, totalCustomDomain }
                });
                continue;
              }

              // Filter: Check Global Blacklist
              if (isEmailBlacklisted(email)) {
                emit({
                  type: "log",
                  category: "blacklisted",
                  company: companyTitle,
                  email,
                  afm,
                  reason: `⛔ ΜΑΥΡΗ ΛΙΣΤΑ: Το email (${email}) βρίσκεται στη μόνιμη μαύρη λίστα αποκλεισμού (απορρίφθηκε)`,
                  stats: { totalExamined, added: newLeadsToInsert.length, totalDuplicates, totalHasWebsite, totalNoEmail, totalOldDate, totalCustomDomain }
                });
                continue;
              }

              // Filter: Check Custom Corporate Domain (Only in general IKE/Non-IKE mode)
              if (!isFtthMode && isCustomDomainEmail(email)) {
                totalCustomDomain++;
                emit({
                  type: "log",
                  category: "custom_domain",
                  company: companyTitle,
                  email,
                  afm,
                  reason: `🏢 Εταιρικό Domain (${email}): Η επιχείρηση διαθέτει ήδη δικό της εταιρικό domain/email (παραλείφθηκε)`,
                  stats: { totalExamined, added: newLeadsToInsert.length, totalDuplicates, totalHasWebsite, totalNoEmail, totalOldDate, totalCustomDomain }
                });
                continue;
              }

              // Check if already in Supabase or already seen in current batch (Email, AFM, GEMI)
              const isDuplicateEmail = Boolean(email && (existingEmailSet.has(email) || seenInBatch.has(email)));
              const isDuplicateAfm = Boolean(afm && (existingAfmSet.has(afm) || seenAfmInBatch.has(afm)));
              const isDuplicateGemi = Boolean(arGemi && existingGemiSet.has(arGemi));

              if (isDuplicateEmail || isDuplicateAfm || isDuplicateGemi) {
                totalDuplicates++;
                const dupReason = isDuplicateEmail
                  ? `Το email (${email}) υπάρχει ήδη στη βάση δεδομένων (παραλείφθηκε)`
                  : isDuplicateAfm
                  ? `Το ΑΦΜ (${afm}) υπάρχει ήδη στη βάση δεδομένων (παραλείφθηκε)`
                  : `Ο αριθμός ΓΕΜΗ (${arGemi}) υπάρχει ήδη στη βάση δεδομένων (παραλείφθηκε)`;

                emit({
                  type: "log",
                  category: "duplicate",
                  company: companyTitle,
                  email,
                  afm,
                  reason: dupReason,
                  stats: { totalExamined, added: newLeadsToInsert.length, totalDuplicates, totalHasWebsite, totalNoEmail, totalOldDate, totalCustomDomain }
                });
                continue;
              }

              if (email) seenInBatch.add(email);
              if (afm) seenAfmInBatch.add(afm);

              const leadType = isFtthMode || ftthCheck.isMatch 
                ? "ftth_telecom" 
                : isNonIkeMode 
                ? "new_business_presence" 
                : isLegacyIke
                ? "legacy_ike"
                : "new_ike";

              const newLead = {
                email: email,
                company: companyTitle,
                first_name: companyTitle,
                last_name: legalForm,
                phone: phone,
                afm: afm,
                gemi_number: arGemi,
                marketing_consent: true,
                unsubscribe_token: crypto.randomUUID(),
                email_sequence_step: 0,
                unsubscribed: false,
                converted: false,
                type: leadType,
                created_at: new Date().toISOString()
              };

              newLeadsToInsert.push(newLead);

              emit({
                type: "log",
                category: "added",
                company: companyTitle,
                email,
                afm,
                phone,
                date: incDate,
                reason: isFtthMode || ftthCheck.isMatch
                  ? `🔌 ΕΤΑΙΡΕΙΑ FTTH / ΤΗΛΕΠΙΚΟΙΝΩΝΙΩΝ (${ftthCheck.reason}) [${legalForm}]! Προστέθηκε για καμπάνια Αυτοψιών!`
                  : isNonIkeMode
                  ? `🏢 ΝΕΑ ΕΠΙΧΕΙΡΗΣΗ [${legalForm}] (Εκτός Ι.Κ.Ε.)! Προστέθηκε για καμπάνια Online Παρουσίας & AI (200€)!`
                  : isLegacyIke
                  ? `🏛️ ΠΑΛΑΙΑ Ι.Κ.Ε. (${incDate || targetYear}) ΧΩΡΙΣ SITE! Προστέθηκε για τακτοποίηση ΓΕΜΗ (70€)!`
                  : `🏢 ΝΕΑ Ι.Κ.Ε. ΧΩΡΙΣ SITE! Προστέθηκε στα υποψήφια leads!`,
                stats: { totalExamined, added: newLeadsToInsert.length, totalDuplicates, totalHasWebsite, totalNoEmail, totalOldDate, totalCustomDomain }
              });

              if (newLeadsToInsert.length >= maxResults) break;
            }

            // If more than 40 companies or 80% of page are older than minDate, stop paginating
            if (minDate && results.length > 0 && olderCountInPage >= Math.min(results.length * 0.8, 40)) {
              emit({
                type: "info",
                message: `ℹ️ Εντοπίστηκαν παλαιότερες εγγραφές (πριν τις ${minDate}). Η σάρωση ολοκληρώθηκε επιτυχώς.`
              });
              break;
            }

            offset += results.length;
            if (results.length < pageSize) break;

            // Small respectful delay between pages so GEMI API never throttles
            await new Promise((r) => setTimeout(r, 1000));
          }

          // Insert new leads into Supabase safely
          let insertedCount = 0;
          let insertedRecords: any[] = [];
          if (newLeadsToInsert.length > 0) {
            emit({
              type: "info",
              message: isNonIkeMode
                ? `💾 Αποθήκευση ${newLeadsToInsert.length} νέων επιχειρήσεων (${nonIkeLabel}) στη βάση δεδομένων...`
                : isLegacyIke
                ? `💾 Αποθήκευση ${newLeadsToInsert.length} παλαιών Ι.Κ.Ε. (${targetYear}) στη βάση δεδομένων...`
                : `💾 Αποθήκευση ${newLeadsToInsert.length} νέων Ι.Κ.Ε. στη βάση δεδομένων...`
            });

            const { data: insertedData, error: insertErr } = await supabase
              .from("sgk_mails")
              .upsert(newLeadsToInsert, { onConflict: "email", ignoreDuplicates: true })
              .select();

            if (insertErr) {
              console.error("Supabase upsert error:", insertErr);
              emit({
                type: "warning",
                message: `⚠️ Σφάλμα μαζικής αποθήκευσης: ${insertErr.message}`
              });
              for (const lead of newLeadsToInsert) {
                try {
                  const { data: singleData, error: singleErr } = await supabase.from("sgk_mails").insert([lead]).select();
                  if (!singleErr && singleData && singleData.length > 0) {
                    insertedRecords.push(singleData[0]);
                    insertedCount++;
                  } else if (!singleErr) {
                    insertedRecords.push(lead);
                    insertedCount++;
                  } else {
                    console.error("Single insert error:", singleErr);
                  }
                } catch (e: any) {
                  console.error("Single insert error:", e);
                }
              }
            } else {
              insertedRecords = insertedData || newLeadsToInsert;
              insertedCount = insertedRecords.length || newLeadsToInsert.length;
            }
          }

          const doneMessage = insertedCount > 0
            ? isFtthMode
              ? `🎉 Η σάρωση ολοκληρώθηκε! Εξετάστηκαν ${totalExamined} επιχειρήσεις (όλες οι νομικές μορφές) και προστέθηκαν ${insertedCount} εταιρείες ΚΑΔ 43210006 (Καλωδιώσεις / Τηλεπικοινωνίες) στη βάση δεδομένων.`
              : isNonIkeMode
              ? `🎉 Η σάρωση ολοκληρώθηκε! Εξετάστηκαν ${totalExamined} επιχειρήσεις (${nonIkeLabel}) και προστέθηκαν ${insertedCount} νέες επιχειρήσεις στη βάση δεδομένων.`
              : isLegacyIke
              ? `🎉 Η σάρωση ολοκληρώθηκε! Εξετάστηκαν ${totalExamined} επιχειρήσεις και προστέθηκαν ${insertedCount} παλαιές Ι.Κ.Ε. (${targetYear}) χωρίς ιστοσελίδα στη βάση δεδομένων.`
              : `🎉 Η σάρωση ολοκληρώθηκε! Εξετάστηκαν ${totalExamined} επιχειρήσεις και προστέθηκαν ${insertedCount} νέες Ι.Κ.Ε. στη βάση δεδομένων.`
            : isFtthMode
              ? `ℹ️ Η σάρωση ολοκληρώθηκε! Εξετάστηκαν ${totalExamined} επιχειρήσεις όλων των νομικών μορφών και δεν βρέθηκαν νέες μη-καταχωρημένες εταιρείες με τον ΚΑΔ 43210006 για το διάστημα αυτό.`
              : isNonIkeMode
              ? `ℹ️ Η σάρωση ολοκληρώθηκε! Εξετάστηκαν ${totalExamined} επιχειρήσεις (${nonIkeLabel}) και ΔΕΝ βρέθηκαν νέες επιχειρήσεις χωρίς site για το διάστημα αυτό.`
              : isLegacyIke
              ? `ℹ️ Η σάρωση ολοκληρώθηκε! Εξετάστηκαν ${totalExamined} επιχειρήσεις και ΔΕΝ βρέθηκαν άλλες παλαιές Ι.Κ.Ε. (${targetYear}) χωρίς site (όλες υπάρχουν ήδη στη βάση ή διαθέτουν ήδη ιστοσελίδα).`
              : `ℹ️ Η σάρωση ολοκληρώθηκε! Εξετάστηκαν ${totalExamined} επιχειρήσεις σε όλες τις σελίδες και ΔΕΝ βρέθηκαν νέες Ι.Κ.Ε. (όλες οι διαθέσιμες επιχειρήσεις υπάρχουν ήδη στη βάση δεδομένων ή διαθέτουν ήδη ιστοσελίδα/εταιρικό domain).`;

          emit({
            type: "done",
            success: true,
            count: insertedCount,
            totalExamined,
            totalDuplicates,
            totalHasWebsite,
            totalCustomDomain,
            totalNoEmail,
            totalOldDate,
            leads: insertedRecords.length > 0 ? insertedRecords : [],
            message: doneMessage
          });

        } catch (err: any) {
          console.error("Stream error in scan-gemi-ikes:", err);
          emit({
            type: "error",
            error: err.message || "Σφάλμα σάρωσης ΓΕΜΗ"
          });
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  }

  // Fallback for non-streaming standard JSON requests
  return NextResponse.json({ success: true, message: "Use stream: true for live logs" });
}


