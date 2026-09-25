import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";

const GEMI_API_KEY = process.env.GEMI_API_KEY || "1QV0mFBoWsaprgiphMaBKEANZL0tRCc5";
const GEMI_API_BASE = "https://opendata-api.businessportal.gr/api/opendata/v1";

interface YmsExtractedInfo {
  representativeName?: string;
  representativeFatherName?: string;
  representativeAfm?: string;
  found: boolean;
  documentUrl?: string;
}

async function extractFromYmsDocument(arGemi: string): Promise<YmsExtractedInfo | null> {
  try {
    const docsUrl = `${GEMI_API_BASE}/companies/${arGemi}/documents`;
    const res = await fetch(docsUrl, {
      headers: {
        api_key: GEMI_API_KEY,
        Accept: "application/json",
      },
    });

    if (!res.ok) return null;
    const docsData = await res.json();

    // Look in publication or decision for YMS announcement certificate
    const allDocs: any[] = [
      ...(Array.isArray(docsData.publication) ? docsData.publication : []),
      ...(Array.isArray(docsData.decision) ? docsData.decision : []),
    ];

    // Priority 1: eyms announcement certificate
    let targetDoc = allDocs.find((d: any) => 
      d.url && (d.url.includes("announcement-certificate") || d.url.includes("eyms.businessportal.gr"))
    );

    // Priority 2: any announcement or publication
    if (!targetDoc) {
      targetDoc = allDocs.find((d: any) => d.url && d.url.includes("announcement"));
    }

    // Priority 3: any available print document
    if (!targetDoc && allDocs.length > 0 && allDocs[0]?.url) {
      targetDoc = allDocs[0];
    }

    if (!targetDoc || !targetDoc.url) return null;

    const pdfUrl = targetDoc.url;
    const pdfRes = await fetch(pdfUrl);
    if (!pdfRes.ok) return null;

    const arrayBuffer = await pdfRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    const fullText = parsed.text || "";

    if (!fullText) return null;

    let repName = "";
    let repFather = "";
    let repAfm = "";

    // 1. Check in 'Άρθρο 7' (Τρόπος διαχείρισης – ορισμός διαχειριστών) or management clause
    const art7Match = fullText.match(/Άρθρο\s+7[\s\S]*?(?:Άρθρο\s+8|$)/i);
    const searchScope = art7Match ? art7Match[0] : fullText;

    // Pattern in YMS: "ο/η ΒΑΣΙΛΕΙΟΣ ΛΥΡΟΥΔΗΣ, όνομα πατρός ΧΡΗΣΤΟΣ και Α.Φ.Μ. 050480299, εκπροσωπεί και δεσμεύει..."
    const managerPattern = /(?:ο\/η|Ο\/Η)\s+([Α-ΩΆΈΉΊΌΎΏa-zA-Z\s]+?),\s*όνομα\s+πατρός\s+([Α-ΩΆΈΉΊΌΎΏa-zA-Z]+)(?:\s+και)?\s+Α\.?Φ\.?Μ\.?:?\s*(\d{9})/i;
    const mMatch = searchScope.match(managerPattern) || fullText.match(managerPattern);

    if (mMatch) {
      repName = mMatch[1].trim();
      repFather = mMatch[2].trim();
      repAfm = mMatch[3].trim();
    } else {
      // Fallback A: Father's Name pattern: "όνομα πατρός ΧΡΗΣΤΟΣ"
      const fMatch = fullText.match(/όνομα\s+πατρός\s+([Α-ΩΆΈΉΊΌΎΏa-zA-Z]+)/i);
      if (fMatch) repFather = fMatch[1].trim();

      // Fallback B: Manager's AFM pattern
      const afmMatch = fullText.match(/(?:όνομα\s+πατρός\s+[^\n,]+?|εκπροσώπου\s+σύστασης\s+[^\(]+\()Α\.?Φ\.?Μ\.?:?\s*(\d{9})/i) ||
                       fullText.match(/(?:διαχειριστ[^\n]+?|εκπροσώπ[^\n]+?)Α\.?Φ\.?Μ\.?:?\s*(\d{9})/i);
      if (afmMatch) repAfm = afmMatch[1].trim();

      // Fallback C: Representative Name pattern
      const nameMatch = fullText.match(/(?:ο\/η|Ο\/Η)\s+([Α-ΩΆΈΉΊΌΎΏ\s]{3,35}),\s*όνομα\s+πατρός/i) ||
                        fullText.match(/εκπροσώπου\s+σύστασης\s+([Α-ΩΆΈΉΊΌΎΏ\s]{3,35})\s*\(/i);
      if (nameMatch) repName = nameMatch[1].trim();
    }

    if (repAfm || repFather || repName) {
      return {
        representativeName: repName || undefined,
        representativeFatherName: repFather || undefined,
        representativeAfm: repAfm || undefined,
        found: true,
        documentUrl: pdfUrl,
      };
    }

    return null;
  } catch (err) {
    console.error("Error reading YMS PDF document from GEMI:", err);
    return null;
  }
}

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

  const street = co.street || co.address || co.road || "";
  const streetNo = co.streetNumber || co.streetNo || co.num || "";
  const tk = co.postalCode || co.zipCode || co.tk || "";
  const city = co.city || co.municipality || "Αθήνα";

  let fullAddress = "";
  if (street) {
    fullAddress += street;
    if (streetNo) fullAddress += ` ${streetNo}`;
    if (city) fullAddress += ` - ${city}`;
    if (tk) fullAddress += ` ${tk}`;
  } else if (city) {
    fullAddress = tk ? `${city} ${tk}` : city;
  }

  return {
    companyName: co.coNameEl || co.coNamesEn?.[0] || "",
    tradeName: (co.coTitlesEl && co.coTitlesEl[0]) || (co.coTitlesEn && co.coTitlesEn[0]) || co.coNameEl || "",
    gemiNo: co.arGemi || "",
    clientAfm: co.afm || "",
    representativeAfm: "",
    city: city,
    address: fullAddress || city,
    fullAddress: fullAddress || city,
    representativeName: repName,
    representativeFatherName: repFather,
    representativeTitle: repTitle,
    ymsFound: false,
    ymsDocumentUrl: ""
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

    // Automatically inspect GEMI documents for YMS announcement certificate
    if (company.gemiNo) {
      try {
        const ymsData = await extractFromYmsDocument(company.gemiNo);
        if (ymsData) {
          if (ymsData.representativeFatherName) {
            company.representativeFatherName = ymsData.representativeFatherName;
          }
          if (ymsData.representativeAfm) {
            company.representativeAfm = ymsData.representativeAfm;
          }
          if (ymsData.representativeName) {
            company.representativeName = ymsData.representativeName;
          }
          company.ymsFound = true;
          company.ymsDocumentUrl = ymsData.documentUrl || "";
        }
      } catch (err) {
        console.error("YMS document lookup error:", err);
      }
    }

    return NextResponse.json({ success: true, company });

  } catch (error: any) {
    console.error("GEMI API Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Σφάλμα κατά την επικοινωνία με το API του Γ.Ε.ΜΗ." 
    }, { status: 500 });
  }
}
