import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }

    const maxResults = body.limit || 50;
    const targetMonth = body.month || null; // e.g. "2026-09" or "2026-08"
    const pageSize = 50;

    // 1. Fetch existing emails from Supabase to prevent duplicates
    const { data: existingRecords, error: existingErr } = await supabase
      .from("sgk_mails")
      .select("email");

    if (existingErr) {
      console.error("Error querying Supabase existing emails:", existingErr);
    }

    const existingEmailSet = new Set<string>();
    (existingRecords || []).forEach((r: any) => {
      if (r.email) existingEmailSet.add(r.email.toLowerCase().trim());
    });

    const newLeadsToInsert: any[] = [];
    const seenInBatch = new Set<string>();
    let totalExamined = 0;
    let totalDuplicates = 0;
    let totalHasWebsite = 0;
    let totalNoEmail = 0;
    let offset = 0;

    while (newLeadsToInsert.length < maxResults && offset < 500) {
      const url = `${GEMI_API_BASE}/companies?isActive=true&resultsSize=${pageSize}&resultsOffset=${offset}&legalTypes=19&resultsSortBy=-arGemi`;

      const res = await fetch(url, {
        headers: {
          api_key: GEMI_API_KEY,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("GEMI API Error:", res.status, errorText);
        break;
      }

      const data = await res.json();
      const results: any[] = data.searchResults || [];

      if (results.length === 0) break;

      for (const co of results) {
        totalExamined++;

        // Filter: Check target month if requested (e.g. "2026-09")
        if (targetMonth && co.incorporationDate && !co.incorporationDate.startsWith(targetMonth)) {
          continue;
        }

        // Filter: Check official website
        if (hasOfficialWebsite(co.url)) {
          totalHasWebsite++;
          continue;
        }

        // Filter: Check email
        const email = (co.email || "").toLowerCase().trim();
        if (!isValidEmail(email)) {
          totalNoEmail++;
          continue;
        }

        // Check if already in Supabase or already seen in current batch
        if (existingEmailSet.has(email) || seenInBatch.has(email)) {
          totalDuplicates++;
          continue;
        }

        seenInBatch.add(email);

        const companyTitle = co.coNameEl || (co.coTitlesEl && co.coTitlesEl[0]) || "Νέα Ι.Κ.Ε.";
        const phone = co.phone ? String(co.phone).trim() : null;
        const afm = co.afm ? String(co.afm).trim() : null;
        const arGemi = co.arGemi ? String(co.arGemi).trim() : null;

        newLeadsToInsert.push({
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
        });

        if (newLeadsToInsert.length >= maxResults) break;
      }

      offset += results.length;
      if (results.length < pageSize) break;
    }

    // Insert new leads into Supabase in batch
    let insertedCount = 0;
    if (newLeadsToInsert.length > 0) {
      const { data: insertedData, error: insertErr } = await supabase
        .from("sgk_mails")
        .insert(newLeadsToInsert)
        .select();

      if (insertErr) {
        console.error("Supabase insert error:", insertErr);
        throw insertErr;
      }

      insertedCount = insertedData?.length || newLeadsToInsert.length;
    }

    return NextResponse.json({
      success: true,
      count: insertedCount,
      totalExamined,
      totalDuplicates,
      totalHasWebsite,
      totalNoEmail,
      leads: newLeadsToInsert
    });

  } catch (error: any) {
    console.error("Error in scan-gemi-ikes route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Αποτυχία σάρωσης Γ.Ε.ΜΗ." },
      { status: 500 }
    );
  }
}
