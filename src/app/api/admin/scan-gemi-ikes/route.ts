import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
  const targetMonth = body.month || null; // e.g. "2026-09"
  const minDate = body.minDate !== undefined ? body.minDate : "2026-08-31"; // Default: 31/08/2026 and newer only!
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
          emit({
            type: "init",
            message: "⚡ Σύνδεση με OpenData API του Γ.Ε.ΜΗ...",
            minDate,
            maxResults
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
          let totalNoEmail = 0;
          let totalOldDate = 0;
          let offset = 0;

          while (newLeadsToInsert.length < maxResults && offset < 500) {
            const pageNum = Math.floor(offset / pageSize) + 1;
            emit({
              type: "page",
              message: `📡 Λήψη παρτίδας #${pageNum} από ΓΕΜΗ (εταιρείες ${offset + 1} έως ${offset + pageSize})...`,
              offset,
              page: pageNum
            });

            const url = `${GEMI_API_BASE}/companies?isActive=true&resultsSize=${pageSize}&resultsOffset=${offset}&legalTypes=19&resultsSortBy=-arGemi`;

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
              const companyTitle = co.coNameEl || (co.coTitlesEl && co.coTitlesEl[0]) || "Νέα Ι.Κ.Ε.";
              const incDate = co.incorporationDate ? String(co.incorporationDate).split("T")[0].trim() : "";
              const email = (co.email || "").toLowerCase().trim();
              const urlClean = co.url || "";
              const phone = co.phone ? String(co.phone).trim() : null;
              const afm = co.afm ? String(co.afm).trim() : null;
              const arGemi = co.arGemi ? String(co.arGemi).trim() : null;

              // Filter: Check minimum incorporation date (only 31/08/2026 and newer)
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
                  stats: { totalExamined, added: newLeadsToInsert.length, totalDuplicates, totalHasWebsite, totalNoEmail, totalOldDate }
                });
                continue;
              }

              // Filter: Check target month if requested (e.g. "2026-09")
              if (targetMonth && co.incorporationDate && !co.incorporationDate.startsWith(targetMonth)) {
                totalOldDate++;
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
                  stats: { totalExamined, added: newLeadsToInsert.length, totalDuplicates, totalHasWebsite, totalNoEmail, totalOldDate }
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
                  stats: { totalExamined, added: newLeadsToInsert.length, totalDuplicates, totalHasWebsite, totalNoEmail, totalOldDate }
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
                  stats: { totalExamined, added: newLeadsToInsert.length, totalDuplicates, totalHasWebsite, totalNoEmail, totalOldDate }
                });
                continue;
              }

              seenInBatch.add(email);

              const newLead = {
                email: email,
                company: companyTitle,
                first_name: companyTitle,
                last_name: "",
                phone: phone,
                afm: afm,
                gemi_number: arGemi,
                marketing_consent: true,
                unsubscribe_token: crypto.randomUUID(),
                email_sequence_step: 0,
                unsubscribed: false,
                converted: false,
                type: "new_ike",
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
                reason: `🎉 ΝΕΑ Ι.Κ.Ε. ΧΩΡΙΣ SITE! Προστέθηκε στα υποψήφια leads!`,
                stats: { totalExamined, added: newLeadsToInsert.length, totalDuplicates, totalHasWebsite, totalNoEmail, totalOldDate }
              });

              if (newLeadsToInsert.length >= maxResults) break;
            }

            // If more than 80% of companies in this batch are older than minDate, stop paginating
            if (minDate && olderCountInPage > 40) {
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
              message: `💾 Αποθήκευση ${newLeadsToInsert.length} νέων Ι.Κ.Ε. στη βάση δεδομένων...`
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
            totalNoEmail,
            totalOldDate,
            leads: newLeadsToInsert,
            message: `🎉 Η σάρωση ολοκληρώθηκε! Εξετάστηκαν ${totalExamined} επιχειρήσεις και προστέθηκαν ${insertedCount} νέες Ι.Κ.Ε.`
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


