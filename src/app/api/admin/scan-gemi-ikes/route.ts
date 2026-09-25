import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
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

const TOURISM_TEXT_REGEX = /(?:\b(TOUR|TOURS|TOURISM|TOURIST|TOURISTIC|TRAVEL|RENT A CAR|CAR RENTAL|YACHT|CHARTER|BOAT RENTAL|HOTEL|HOTELS|VILLA|VILLAS|RESORT|RESORTS|CRUISE|HOLIDAY|HOLIDAYS|HOSPITALITY)\b|ΤΟΥΡΙΣΤ|ΞΕΝΟΔΟΧ|ΒΙΛΑ|ΒΙΛΕΣ|ΒΙΛΛΑ|ΒΙΛΛΕΣ|ΚΡΟΥΑΖΙΕΡ|ΕΚΔΡΟΜ|ΕΝΟΙΚΙΑΖΟΜΕΝ[Α-Ω\s]+ΔΩΜΑΤΙ|ΤΟΥΡΙΣΤΙΚ[Α-Ω\s]+ΚΑΤΑΛΥΜ|ΚΑΤΑΛΥΜΑΤΑ ΔΙΑΚΟΠΩΝ|ΦΙΛΟΞΕΝΙ)/;

const OPS_TEXT_REGEX = /(?:\b(LOGISTICS|SECURITY|FIBER|FIBER OPTIC)\b|ΤΗΛΕΠΙΚΟΙΝΩΝ|ΟΠΤΙΚΕΣ ΙΝΕΣ|ΟΠΤΙΚΗ ΙΝΑ|ΟΠΤΙΚΩΝ ΙΝΩΝ|ΤΕΧΝΙΚΗ ΕΤΑΙΡΕΙΑ|ΤΕΧΝΙΚΕΣ ΕΡΓΑΣΙΕΣ|ΤΕΧΝΙΚΟ ΓΡΑΦΕΙΟ|ΤΕΧΝΙΚΩΝ ΕΡΓΩΝ|ΤΕΧΝΙΚΕΣ ΥΠΗΡΕΣΙΕΣ|ΤΕΧΝΙΚΟΣ ΕΛΕΓΧΟΣ|ΤΕΧΝΙΚΩΝ ΕΓΚΑΤΑΣΤΑΣΕΩΝ|ΕΡΓΟΛΑΒ|ΜΕΤΑΦΟΡΙΚΗ|ΜΕΤΑΦΟΡΕΣ ΕΜΠΟΡΕΥΜΑΤΩΝ|ΔΙΑΜΕΤΑΦΟΡ|ΣΥΝΤΗΡΗΣΗ ΚΤΙΡΙΩΝ|ΣΥΝΤΗΡΗΣΕΙΣ|ΣΥΝΤΗΡΗΣΗ ΕΓΚΑΤΑΣΤΑΣΕΩΝ|ΗΛΕΚΤΡΟΛΟΓΙΚ|ΥΔΡΑΥΛΙΚΕΣ ΕΓΚΑΤΑΣΤΑΣΕΙΣ|ΥΔΡΑΥΛΙΚΑ ΕΡΓΑ|ΥΔΡΑΥΛΙΚΟΣ|ΥΔΡΑΥΛΙΚΟΙ|ΨΥΚΤΙΚΕΣ ΕΓΚΑΤΑΣΤΑΣΕΙΣ|ΨΥΚΤΙΚΟΣ|ΨΥΚΤΙΚΟΙ|ΧΩΜΑΤΟΥΡΓ|ΦΥΛΑΞΗ|ΣΥΣΤΗΜΑΤΑ ΑΣΦΑΛΕΙΑΣ|ΙΔΙΩΤΙΚΗ ΑΣΦΑΛΕΙΑ|ΚΑΤΑΣΚΕΥΑΣΤΙΚΗ|ΚΑΤΑΣΚΕΥΕΣ ΚΤΙΡΙΩΝ|ΟΙΚΟΔΟΜΙΚΕΣ ΕΠΙΧΕΙΡΗΣΕΙΣ|ΑΝΕΛΚΥΣΤ|ΜΟΝΩΣΕΙΣ)/;

function detectLeadIndustry(co: any): { type: string; label: string; icon: string; legalForm: string } {
  const legalForm = co.legalType?.descr || "Επιχείρηση";

  // 1. Extract KAD digits cleanly without any text concatenation
  const kadCodes: string[] = [];
  if (Array.isArray(co.activities)) {
    for (const a of co.activities) {
      const rawId = a?.activity?.id || a?.id;
      if (rawId) {
        kadCodes.push(String(rawId).replace(/[^0-9]/g, ""));
      }
    }
  }
  if (co.objective) {
    const matches = co.objective.match(/\b\d{4,8}\b/g);
    if (matches) {
      for (const m of matches) kadCodes.push(m);
    }
  }

  // 2. Strict KAD prefix matching (prevents substrings like '7920' inside '47920000')
  const hasTourismKad = kadCodes.some(k => isTourismKad(k));
  const hasOpsKad = kadCodes.some(k => isOperationsKad(k));

  // 3. Searchable text with all numbers stripped out so KAD digits don't match keywords
  const rawTextParts = [
    co.coNameEl || "",
    ...(co.coTitlesEl || []),
    ...(co.coTitlesEn || []),
    ...(co.activities || []).map((a: any) => a.activity?.descr || ""),
    co.objective ? co.objective.replace(/[0-9]/g, " ") : ""
  ];
  const normalizedText = normalizeGreek(rawTextParts.join(" "));

  const hasTourismText = TOURISM_TEXT_REGEX.test(normalizedText);
  const hasOpsText = OPS_TEXT_REGEX.test(normalizedText);

  // Tourism takes priority if matched
  if (hasTourismKad || hasTourismText) {
    return { type: "tourism", label: `Τουρισμός (${legalForm})`, icon: "✈️", legalForm };
  }

  // Operations & Tech
  if (hasOpsKad || hasOpsText) {
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

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    body = {};
  }

  const maxResults = body.limit || 50;
  const targetCategory = body.targetCategory || body.industry || "all"; // "all" | "tourism" | "operations_tech"
  const targetLegalForm = body.targetLegalForm || body.legalForm || (body.targetCategory === "ike" ? "ike" : "all"); // "all" | "ike" | "ae" | "oe_ee"
  
  // Dynamic Month Handling: automatically follows current month (e.g. 2026-09 in September, 2026-10 in October)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthNum = String(now.getMonth() + 1).padStart(2, "0");
  const currentMonthPrefix = `${currentYear}-${currentMonthNum}`; // e.g. "2026-09"

  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthNum = String(prevDate.getMonth() + 1).padStart(2, "0");
  const prevMonthPrefix = `${prevDate.getFullYear()}-${prevMonthNum}`; // e.g. "2026-08"

  let targetMonth: string | null = null;
  let minDate: string = `${currentMonthPrefix}-01`;

  if (body.month === "previous") {
    targetMonth = prevMonthPrefix;
    minDate = `${prevMonthPrefix}-01`;
  } else if (body.month === "all_year") {
    targetMonth = null;
    minDate = `${currentYear}-01-01`;
  } else if (body.month && typeof body.month === "string" && body.month.match(/^\d{4}-\d{2}$/)) {
    targetMonth = body.month;
    minDate = `${body.month}-01`;
  } else {
    // Default: current month!
    targetMonth = currentMonthPrefix;
    minDate = `${currentMonthPrefix}-01`;
  }

  if (body.minDate) {
    minDate = body.minDate;
  }

  const isStream = body.stream !== false; // Default to streaming
  const pageSize = 50;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

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
          const industryLabels: Record<string, string> = {
            all: "Όλοι οι Κλάδοι",
            tourism: "✈️ Τουρισμός / Travel",
            operations_tech: "⚡ Operations & Τεχνικές",
          };
          const legalLabels: Record<string, string> = {
            all: "Όλες οι Μορφές",
            ike: "Μόνο Ι.Κ.Ε.",
            ae: "Μόνο Α.Ε.",
            oe_ee: "Ο.Ε. & Ε.Ε.",
          };

          const monthLabel = targetMonth ? `Μήνας: ${targetMonth}` : `Από ${minDate}`;

          emit({
            type: "init",
            message: `⚡ Σύνδεση με OpenData API Γ.Ε.ΜΗ. [Κλάδος: ${industryLabels[targetCategory] || targetCategory} | Μορφή: ${legalLabels[targetLegalForm] || targetLegalForm} | 📅 ${monthLabel}]...`,
            minDate,
            maxResults,
            targetCategory,
            targetLegalForm,
            targetMonth
          });

          // 1. Fetch existing emails from Supabase
          const { data: existingRecords, error: existingErr } = await supabase
            .from("sgk_mails")
            .select("email");

          if (existingErr) {
            console.warn("Notice querying Supabase existing emails:", existingErr);
          }

          const existingEmailSet = new Set<string>();
          (existingRecords || []).forEach((r: any) => {
            if (r.email) existingEmailSet.add(r.email.toLowerCase().trim());
          });

          emit({
            type: "info",
            message: `🔍 Ελέγχθηκαν ${existingEmailSet.size} υπάρχοντα emails στη βάση δεδομένων για αποφυγή διπλοτύπων.`,
          });

          const newLeadsToInsert: any[] = [];
          const seenInBatch = new Set<string>();
          let totalExamined = 0;
          let totalDuplicates = 0;
          let totalHasWebsite = 0;
          let totalCustomDomain = 0;
          let totalNoEmail = 0;
          let totalOldDate = 0;
          let offset = 0;

          const maxOffset = (targetCategory === "tourism" || targetCategory === "operations_tech") ? 2500 : 800;
          while (newLeadsToInsert.length < maxResults && offset < maxOffset) {
            const pageNum = Math.floor(offset / pageSize) + 1;
            emit({
              type: "page",
              message: `📡 Λήψη παρτίδας #${pageNum} από ΓΕΜΗ (εταιρείες ${offset + 1} έως ${offset + pageSize})...`,
              offset,
              page: pageNum
            });

            // Handle legal types filtering
            let legalTypeParam = "";
            if (targetLegalForm === "ike") {
              legalTypeParam = "&legalTypes=19";
            } else if (targetLegalForm === "ae") {
              legalTypeParam = "&legalTypes=1";
            } else if (targetLegalForm === "oe_ee") {
              legalTypeParam = "&legalTypes=2,4";
            }

            const url = `${GEMI_API_BASE}/companies?isActive=true&resultsSize=${pageSize}&resultsOffset=${offset}${legalTypeParam}&resultsSortBy=-arGemi`;

            let results: any[] = [];
            try {
              const res = await fetchGemiWithTimeout(url, GEMI_API_KEY);
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
              const legalForm = co.legalType?.descr || "Επιχείρηση";
              const companyTitle = co.coNameEl || (co.coTitlesEl && co.coTitlesEl[0]) || `Νέα ${legalForm}`;
              const incDate = co.incorporationDate ? String(co.incorporationDate).split("T")[0].trim() : "";
              const email = (co.email || "").toLowerCase().trim();
              const urlClean = co.url || "";
              const phone = co.phone ? String(co.phone).trim() : null;
              const afm = co.afm ? String(co.afm).trim() : null;
              const arGemi = co.arGemi ? String(co.arGemi).trim() : null;

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

              // Filter: Check target month if requested (e.g. "2026-09")
              if (targetMonth && (!incDate || !incDate.startsWith(targetMonth))) {
                totalOldDate++;
                if (incDate && incDate < targetMonth) {
                  olderCountInPage++;
                }
                continue;
              }

              // Filter: Check official website
              if (hasOfficialWebsite(urlClean)) {
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

              // Filter: Check Custom Corporate Domain (e.g. @domain.gr, @company.com)
              if (isCustomDomainEmail(email)) {
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

              // Check if already in Supabase or already seen in current batch
              if (existingEmailSet.has(email) || seenInBatch.has(email)) {
                totalDuplicates++;
                emit({
                  type: "log",
                  category: "duplicate",
                  company: companyTitle,
                  email,
                  afm,
                  reason: `Το email (${email}) υπάρχει ήδη στη βάση δεδομένων (παραλείφθηκε)`,
                  stats: { totalExamined, added: newLeadsToInsert.length, totalDuplicates, totalHasWebsite, totalNoEmail, totalOldDate, totalCustomDomain }
                });
                continue;
              }

              seenInBatch.add(email);

              const industry = detectLeadIndustry(co);

              // Filter by target category if specified
              if (targetCategory === "tourism" && industry.type !== "tourism") {
                continue;
              }
              if (targetCategory === "operations_tech" && industry.type !== "operations_tech") {
                continue;
              }

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
                type: industry.type,
                created_at: new Date().toISOString()
              };

              newLeadsToInsert.push(newLead);

              const formBadge = co.legalType?.descr ? `[${co.legalType.descr}] ` : "";
              emit({
                type: "log",
                category: "added",
                company: companyTitle,
                email,
                afm,
                phone,
                date: incDate,
                reason: `${industry.icon} ΝΕΑ ΕΠΙΧΕΙΡΗΣΗ ${formBadge}${industry.label} ΧΩΡΙΣ SITE! Προστέθηκε στα υποψήφια leads!`,
                stats: { totalExamined, added: newLeadsToInsert.length, totalDuplicates, totalHasWebsite, totalNoEmail, totalOldDate, totalCustomDomain }
              });

              if (newLeadsToInsert.length >= maxResults) break;
            }

            // If more than 45 companies in this batch are older than minDate, stop paginating
            if (minDate && olderCountInPage >= 45) {
              emit({
                type: "info",
                message: `ℹ️ Εντοπίστηκαν παλαιότερες εγγραφές (πριν τις ${minDate}). Η σάρωση ολοκληρώθηκε επιτυχώς.`
              });
              break;
            }

            offset += results.length;
            if (results.length < pageSize) break;
          }

          // Insert new leads into Supabase safely
          let insertedCount = 0;
          if (newLeadsToInsert.length > 0) {
            emit({
              type: "info",
              message: `💾 Αποθήκευση ${newLeadsToInsert.length} νέων επιχειρήσεων στη βάση δεδομένων...`
            });

            const { data: insertedData, error: insertErr } = await supabase
              .from("sgk_mails")
              .upsert(newLeadsToInsert, { onConflict: "email", ignoreDuplicates: true })
              .select();

            if (insertErr) {
              console.error("Supabase upsert error:", insertErr);
              for (const lead of newLeadsToInsert) {
                try {
                  await supabase.from("sgk_mails").insert([lead]);
                  insertedCount++;
                } catch (e) {
                  // Ignore single error
                }
              }
            } else {
              insertedCount = insertedData?.length || newLeadsToInsert.length;
            }
          }

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
            leads: newLeadsToInsert,
            message: `🎉 Η σάρωση ολοκληρώθηκε! Εξετάστηκαν ${totalExamined} επιχειρήσεις και προστέθηκαν ${insertedCount} νέα leads (${industryLabels[targetCategory] || "Κλάδος"} • ${legalLabels[targetLegalForm] || "Μορφή"}).`
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


