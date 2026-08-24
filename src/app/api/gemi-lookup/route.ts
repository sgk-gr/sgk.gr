import { NextRequest, NextResponse } from "next/server";

const GEMI_API_KEY = process.env.GEMI_API_KEY || "1QV0mFBoWsaprgiphMaBKEANZL0tRCc5";
const GEMI_API_BASE = "https://opendata-api.businessportal.gr/api/opendata/v1";

function parseGemiCompany(co: any) {
  let repName = "";
  let repFather = "";
  let repTitle = "τον μοναδικό εταίρο και διαχειριστή αυτής";

  if (co.persons && co.persons.length > 0) {
    const manager = co.persons.find((p: any) => 
      p.role && (p.role.includes("Διαχειριστ") || p.role.includes("Εκπρόσωπ") || p.role.includes("Εταίρ"))
    ) || co.persons[0];

    if (manager.role) {
      const lower = manager.role.toLowerCase();
      repTitle = lower.startsWith("τον") || lower.startsWith("την") 
        ? manager.role 
        : `τον ${lower} αυτής`;
    }

    if (manager.personName) {
      const raw = manager.personName.trim().replace(/\s+/g, " ");
      const parts = raw.split(" ");
      if (parts.length >= 3) {
        // Last word is father's name (e.g. ΛΥΡΟΥΔΗΣ ΒΑΣΙΛΕΙΟΣ ΧΡΗΣΤΟΣ -> father ΧΡΗΣΤΟΣ, name ΒΑΣΙΛΕΙΟΣ ΛΥΡΟΥΔΗΣ)
        repFather = parts[parts.length - 1];
        const nameParts = parts.slice(0, parts.length - 1);
        repName = nameParts.join(" ");
      } else if (parts.length === 2) {
        repName = parts.join(" ");
      } else {
        repName = raw;
      }
    }
  }

  return {
    companyName: co.coNameEl || co.coNamesEn?.[0] || "",
    tradeName: (co.coTitlesEl && co.coTitlesEl[0]) || (co.coTitlesEn && co.coTitlesEn[0]) || co.coNameEl || "",
    gemiNo: co.arGemi || "",
    clientAfm: co.afm || "",
    city: co.city || "Αθήνα",
    representativeName: repName,
    representativeFatherName: repFather,
    representativeTitle: repTitle
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("query") || searchParams.get("q") || "").trim();

  if (!query) {
    return NextResponse.json({ error: "Παρακαλώ εισάγετε ΑΦΜ ή Αριθμό Γ.Ε.ΜΗ." }, { status: 400 });
  }

  const cleanDigits = query.replace(/[^0-9]/g, "");

  try {
    let url = "";

    // 1. If 9 digits -> likely AFM
    if (cleanDigits.length === 9) {
      url = `${GEMI_API_BASE}/companies?afm=${cleanDigits}`;
    } else if (cleanDigits.length >= 10) {
      // 2. If 10+ digits -> likely GEMI number
      url = `${GEMI_API_BASE}/companies?arGemi=${cleanDigits}`;
    } else {
      // 3. Otherwise try searching by GEMI or Name
      url = `${GEMI_API_BASE}/companies?arGemi=${encodeURIComponent(query)}`;
    }

    let res = await fetch(url, {
      headers: {
        api_key: GEMI_API_KEY,
        Accept: "application/json",
      },
    });

    let data: any = null;
    if (res.ok) {
      data = await res.json();
    }

    // Fallback: If no results found, try the other parameter
    if (!data || !data.searchResults || data.searchResults.length === 0) {
      if (cleanDigits.length === 9) {
        // Try GEMI with same digits
        const fallbackUrl = `${GEMI_API_BASE}/companies?arGemi=${cleanDigits}`;
        const fallbackRes = await fetch(fallbackUrl, {
          headers: { api_key: GEMI_API_KEY, Accept: "application/json" },
        });
        if (fallbackRes.ok) {
          data = await fallbackRes.json();
        }
      } else {
        // Try AFM with same digits
        const fallbackUrl = `${GEMI_API_BASE}/companies?afm=${cleanDigits}`;
        const fallbackRes = await fetch(fallbackUrl, {
          headers: { api_key: GEMI_API_KEY, Accept: "application/json" },
        });
        if (fallbackRes.ok) {
          data = await fallbackRes.json();
        }
      }
    }

    if (!data || !data.searchResults || data.searchResults.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: "Δεν βρέθηκε επιχείρηση στο Γ.Ε.ΜΗ. με αυτά τα στοιχεία." 
      }, { status: 404 });
    }

    const company = parseGemiCompany(data.searchResults[0]);
    return NextResponse.json({ success: true, company });

  } catch (error: any) {
    console.error("GEMI API Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Σφάλμα κατά την επικοινωνία με το API του Γ.Ε.ΜΗ." 
    }, { status: 500 });
  }
}
