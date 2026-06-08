import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Λίστα με δωρεάν παρόχους email για φιλτράρισμα
const FREE_EMAIL_DOMAINS = ["gmail.com", "yahoo.gr", "yahoo.com", "hotmail.com", "outlook.com", "otenet.gr", "mail.com", "yandex.com"];

function cleanBusinessName(title: string): string {
  let name = title;
  const suffixes = [
    / - Facebook/gi,
    / \| Facebook/gi,
    / - Αρχική σελίδα/gi,
    / - Home/gi,
    / - Καστοριά/gi,
    / - Kastoria/gi,
    / - Google Maps/gi,
    / - xo\.gr/gi,
    / - vrisko\.gr/gi,
    / \| xo\.gr/gi,
    / \| vrisko\.gr/gi,
    / | Facebook/gi,
    / | xo\.gr/gi,
    / | vrisko\.gr/gi,
    / | Google Maps/gi,
    / \d{10}/g, // Αφαίρεση τηλεφώνων από τον τίτλο
  ];
  for (const suffix of suffixes) {
    name = name.replace(suffix, "");
  }
  return name.trim();
}

function extractEmails(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const found = text.match(emailRegex);
  return found ? Array.from(new Set(found.map(email => email.toLowerCase()))) : [];
}

function extractPhone(text: string): string | null {
  // Ελληνικά τηλέφωνα (σταθερά από 2..., κινητά από 69...)
  const phoneRegex = /(?:69\d{8}|2\d{9})/g;
  const found = text.match(phoneRegex);
  return found ? found[0] : null;
}

// 1. Scraping μέσω Google Custom Search JSON API (Αν υπάρχουν Credentials)
async function searchViaGoogleApi(query: string, apiKey: string, cx: string) {
  const url = `https://customsearch.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&hl=el`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Google API Error");
    const data = await res.json();
    if (!data.items) return [];

    return data.items.map((item: any) => ({
      title: item.title,
      snippet: item.snippet,
      link: item.link
    }));
  } catch (err) {
    console.error("Google API search failed, falling back...", err);
    return null;
  }
}

// 2. Scraping μέσω Bing Search HTML (Πολύ σταθερό, χωρίς captcha blocks)
async function searchViaBingScrape(query: string) {
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "el-GR,el;q=0.9,en;q=0.8"
      }
    });
    if (!res.ok) return [];
    const html = await res.text();
    
    // Απλός regex-based parser για Bing HTML
    const results: any[] = [];
    const blockRegex = /<li class="b_algo">([\s\S]*?)<\/li>/g;
    let match;
    
    while ((match = blockRegex.exec(html)) !== null) {
      const block = match[1];
      
      // Extract Title
      const titleMatch = block.match(/<h2><a href="([^"]+)"[^>]*>([\s\S]*?)<\/a><\/h2>/);
      const link = titleMatch ? titleMatch[1] : "";
      let title = titleMatch ? titleMatch[2] : "";
      title = title.replace(/<[^>]*>/g, ""); // strip html tags
      
      // Extract Snippet
      const snippetMatch = block.match(/<p>([\s\S]*?)<\/p>/);
      let snippet = snippetMatch ? snippetMatch[1] : "";
      snippet = snippet.replace(/<[^>]*>/g, ""); // strip html tags
      
      if (title || snippet) {
        results.push({ title, snippet, link });
      }
    }
    return results;
  } catch (err) {
    console.error("Bing scrape failed", err);
    return [];
  }
}

// 3. Fallback Google Search HTML Scrape
async function searchViaGoogleScrape(query: string) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=el`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "el-GR,el;q=0.9,en;q=0.8"
      }
    });
    if (!res.ok) return [];
    const html = await res.text();
    
    // Απλός regex-based parser για Google HTML
    const results: any[] = [];
    const blockRegex = /<div class="MjjYud">([\s\S]*?)<\/div><\/div><\/div>/g;
    let match;
    
    while ((match = blockRegex.exec(html)) !== null) {
      const block = match[1];
      const linkMatch = block.match(/href="([^"]+)"/);
      const titleMatch = block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
      const snippetMatch = block.match(/style="-webkit-line-clamp:\d+">([\s\S]*?)<\/div>/) || block.match(/class="VwiC3b[^"]*">([\s\S]*?)<\/div>/);
      
      const link = linkMatch ? linkMatch[1] : "";
      let title = titleMatch ? titleMatch[1] : "";
      title = title.replace(/<[^>]*>/g, "");
      
      let snippet = snippetMatch ? snippetMatch[1] : "";
      snippet = snippet.replace(/<[^>]*>/g, "");
      
      if (title || snippet) {
        results.push({ title, snippet, link });
      }
    }
    return results;
  } catch (err) {
    console.error("Google HTML scrape failed", err);
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const { city, industry } = await req.json();

    if (!city || !industry) {
      return NextResponse.json({ error: "City and industry are required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_CX;

    // Κατασκευάζουμε queries αναζήτησης
    const queries = [
      `"${industry}" "${city}" "gmail.com"`,
      `"${industry}" "${city}" "yahoo.gr"`
    ];

    const allSearchResults: any[] = [];

    for (const query of queries) {
      let results = null;

      // 1. Δοκιμή με επίσημο Google API αν υπάρχει
      if (apiKey && cx) {
        results = await searchViaGoogleApi(query, apiKey, cx);
      }

      // 2. Fallback σε Bing HTML Scrape αν δεν έχουμε κλειδιά ή αν αποτύχει η Google
      if (!results || results.length === 0) {
        results = await searchViaBingScrape(query);
      }

      // 3. Fallback σε Google HTML Scrape αν όλα τα άλλα αποτύχουν
      if ((!results || results.length === 0)) {
        results = await searchViaGoogleScrape(query);
      }

      if (results && results.length > 0) {
        allSearchResults.push(...results);
      }
    }

    // Φιλτράρισμα και εξαγωγή στοιχείων
    const prospectsMap = new Map<string, any>();

    for (const res of allSearchResults) {
      const combinedText = `${res.title} ${res.snippet}`;
      const emails = extractEmails(combinedText);
      const phone = extractPhone(combinedText);

      // Κρατάμε μόνο όσα έχουν email
      for (const email of emails) {
        // Ελέγχουμε αν είναι δωρεάν πάροχος (Gmail/Yahoo κλπ) για να είμαστε σίγουροι ότι δεν έχουν website
        const domain = email.split("@")[1];
        if (!FREE_EMAIL_DOMAINS.includes(domain)) continue;

        // Έλεγχος αν ο σύνδεσμος του αποτελέσματος δείχνει ότι έχουν ήδη δικό τους site
        // Αν το link είναι facebook, instagram, xo, vrisko, goldenpages, κλπ., είναι σωστός prospect
        const linkLower = res.link.toLowerCase();
        const isDirectoryOrSocial = 
          linkLower.includes("facebook.com") || 
          linkLower.includes("instagram.com") || 
          linkLower.includes("xo.gr") || 
          linkLower.includes("vrisko.gr") || 
          linkLower.includes("goldenpages.gr") || 
          linkLower.includes("google.com/maps") || 
          linkLower.includes("youtube.com") ||
          linkLower.includes("tiktok.com");

        // Αν το link δείχνει κάποιο άλλο custom site (π.χ. www.papadopoulos.gr), τότε μάλλον έχουν site
        if (!isDirectoryOrSocial && res.link !== "") {
          // Εξαίρεση: Μερικές φορές είναι απλά άλλη πηγή (π.χ. blog post), αλλά αν έχει custom domain μάλλον έχουν site.
          // Συνεχίζουμε για ασφάλεια
          continue;
        }

        const rawName = cleanBusinessName(res.title);
        // Αν το όνομα είναι πολύ μικρό ή άσχετο, βάζουμε έναν συνδυασμό
        const finalName = rawName.length > 2 ? rawName : `${industry} - ${city}`;

        prospectsMap.set(email, {
          business_name: finalName,
          email: email,
          phone: phone,
          city: city,
          industry: industry,
          status: "pending"
        });
      }
    }

    const prospectsToSave = Array.from(prospectsMap.values());
    let savedCount = 0;

    // Αποθήκευση στη βάση δεδομένων (παρακάμπτοντας τα διπλότυπα)
    for (const prospect of prospectsToSave) {
      const { data, error } = await supabase
        .from("sgk_prospects")
        .upsert(
          [prospect],
          { onConflict: "email" } // Αν υπάρχει ήδη το email, κάνε update ή αγνόησε
        )
        .select();

      if (!error && data && data.length > 0) {
        savedCount++;
      } else if (error) {
        console.error("Error saving prospect:", error);
      }
    }

    return NextResponse.json({
      success: true,
      query_results_scanned: allSearchResults.length,
      prospects_extracted: prospectsToSave.length,
      prospects_saved_to_db: savedCount,
      leads: prospectsToSave
    });

  } catch (error: any) {
    console.error("Scraper Handler Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
