import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Λίστα με δωρεάν παρόχους email για φιλτράρισμα
const FREE_EMAIL_DOMAINS = ["gmail.com", "yahoo.gr", "yahoo.com", "hotmail.com", "outlook.com", "otenet.gr", "mail.com", "yandex.com"];

const GREEK_CITIES_KEYWORDS: Record<string, string[]> = {
  "αθήνα": ["athens", "αθηνα", "αθηνων", "marousi", "peiraias", "glyfada", "kallithea", "peristeri", "maroussi", "kifisia", "kifissia", "chalandri", "halandri"],
  "θεσσαλονίκη": ["thessaloniki", "salonika", "θεσσαλονικη", "θεσσαλονικης"],
  "πάτρα": ["patra", "πατρα", "πατρων"],
  "λάρισα": ["larisa", "larissa", "λαρισα", "λαρισας"],
  "ηράκλειο": ["heraklion", "iraklio", "ηρακλειο", "ηρακλειου"],
  "χανιά": ["chania", "xania", "χανια", "χανιων"],
  "ιωάννινα": ["ioannina", "ιωαννινα", "ιωαννινων"],
  "χαλκίδα": ["chalkida", "xalkida", "χαλκιδα", "χαλκιδας"],
  "τρίκαλα": ["trikala", "τρικαλα", "τρικαλων"],
  "καρδίτσα": ["karditsa", "καρδιτσα", "καρδιτσας"],
  "βέροια": ["veroia", "veria", "βεροια", "βεροιας"],
  "δράμα": ["drama", "δραμα", "δραμας"],
  "καβάλα": ["kavala", "καβαλα", "καβαλας"],
  "ροδος": ["rodos", "rhodes", "ροδος", "ροδου"],
  "κέρκυρα": ["kerkyra", "corfu", "κερκυρα", "κερκυρας"],
  "καλαμάτα": ["kalamata", "καλαματα", "καλαματας"],
  "κατερίνη": ["katerini", "κατερινη", "κατερινης"],
  "καστοριά": ["kastoria", "καστορια", "καστοριας"],
  "κοζάνη": ["kozani", "κοζανη", "κοζανης"],
  "φλώρινα": ["florina", "φλωρινα", "φλωρινας"],
  "γρεβενά": ["grevena", "γρεβενα", "γρεβενων"],
  "πτολεμαΐδα": ["ptolemaida", "πτολεμαιδα", "πτολεμαϊδα"],
  "έδεσσα": ["edessa", "εδεσσα"],
  "νάουσα": ["naousa", "naoussa", "ναουσα"]
};

function isWrongCity(title: string, link: string, snippet: string, targetCity: string): boolean {
  const stripAccentsLocal = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const targetCityNorm = stripAccentsLocal(targetCity);
  const titleLower = title.toLowerCase();
  const linkLower = link.toLowerCase();
  
  for (const [otherCity, keywords] of Object.entries(GREEK_CITIES_KEYWORDS)) {
    const otherCityNorm = stripAccentsLocal(otherCity);
    if (otherCityNorm === targetCityNorm) continue;
    
    const otherCityInLink = keywords.some(kw => linkLower.includes(kw));
    const targetKey = Object.keys(GREEK_CITIES_KEYWORDS).find(k => stripAccentsLocal(k) === targetCityNorm) || targetCity.toLowerCase();
    const targetKeywords = GREEK_CITIES_KEYWORDS[targetKey] || [targetCityNorm];
    const targetCityInLink = targetKeywords.some(kw => linkLower.includes(kw));
    
    if (otherCityInLink && !targetCityInLink) {
      return true;
    }
    
    const otherCityInTitle = keywords.some(kw => titleLower.includes(kw));
    const targetCityInTitle = targetKeywords.some(kw => titleLower.includes(kw));
    
    if (otherCityInTitle && !targetCityInTitle) {
      return true;
    }
  }
  
  return false;
}

function isJunkName(name: string | null): boolean {
  if (!name) return true;
  const trimmed = name.trim();
  if (trimmed.length <= 2) return true;
  
  if (/\.[a-z]{2,4}$/i.test(trimmed)) return true;
  
  const words = trimmed.split(/\s+/);
  for (const word of words) {
    if (word.length > 7) {
      const hasVowels = /[aeiouyαεηιοωυάέήίόώύϊϋ]/i.test(word);
      const isRandom = /^[a-zA-Z0-9]+$/.test(word) && !hasVowels;
      const hasUpper = /[A-Z]/.test(word);
      const hasLower = /[a-z]/.test(word);
      const hasDigit = /[0-9]/.test(word);
      const isBase64Like = word.length > 10 && hasUpper && hasLower && (hasDigit || !hasVowels);
      if (isRandom || isBase64Like) return true;
    }
  }
  
  const generics = ["reel", "reels", "video", "post", "posts", "photo", "photos", "cover", "image", "profile", "timeline", "story", "stories"];
  if (generics.includes(trimmed.toLowerCase())) return true;
  
  return false;
}

function isResultRelevant(title: string, snippet: string, industry: string): boolean {
  const text = `${title} ${snippet}`.toLowerCase();
  const ind = industry.toLowerCase();
  
  const industryKeywords: Record<string, string[]> = {
    "οδοντιατρείο": ["οδοντ", "δοντ", "dent", "smile", "tooth", "teeth"],
    "οδοντιατρος": ["οδοντ", "δοντ", "dent", "smile", "tooth", "teeth"],
    "κομμωτήριο": ["κομμωτ", "hair", "salon", "barber", "κουρε", "beauty", "haircut", "νυχια", "nails", "spa", "αισθητικ"],
    "κομμωτηριο": ["κομμωτ", "hair", "salon", "barber", "κουρε", "beauty", "haircut", "νυχια", "nails", "spa", "αισθητικ"],
    "εστιατόριο": ["εστιατ", "ταβερν", "ψητοπ", "φαγητ", "food", "restau", "pizza", "burger", "delivery", "ψησταρ", "οβελιστ", "snack", "ψητο", "μαγειρ"],
    "εστιατοριο": ["εστιατ", "ταβερν", "ψητοπ", "φαγητ", "food", "restau", "pizza", "burger", "delivery", "ψησταρ", "οβελιστ", "snack", "ψητο", "μαγειρ"],
    "καφετέρια": ["καφε", "cafe", "coffee", "bar", "snack", "delivery", "ροφημα", "brunch"],
    "καφετερια": ["καφε", "cafe", "coffee", "bar", "snack", "delivery", "ροφημα", "brunch"],
    "ξενοδοχείο": ["ξενοδ", "hotel", "room", "apart", "villa", "studios", "stay", "διαμον", "ξενων", "resort", "booking"],
    "ξενοδοχειο": ["ξενοδ", "hotel", "room", "apart", "villa", "studios", "stay", "διαμον", "ξενων", "resort", "booking"],
    "rent a car": ["rent", "car", "moto", "αυτοκιν", "ενοικιαζ", "vehicle", "hire", "σκαφ"],
    "ενοικίαση αυτοκινήτων": ["rent", "car", "moto", "αυτοκιν", "ενοικιαζ", "vehicle", "hire", "σκαφ"],
    "έπιπλα": ["επιπλ", "furniture", "στρωμα", "κρεβατ", "καναπ", "wood", "επιπλο", "κουζιν"],
    "επιπλα": ["επιπλ", "furniture", "στρωμα", "κρεβατ", "καναπ", "wood", "επιπλο", "κουζιν"],
    "ζαχαροπλαστείο": ["ζαχαρ", "sweet", "cake", "γλυκ", "pastry", "ice cream", "παγωτ"],
    "ζαχαροπλαστειο": ["ζαχαρ", "sweet", "cake", "γλυκ", "pastry", "ice cream", "παγωτ"],
    "γυμναστήριο": ["γυμνασ", "gym", "fit", "crossfit", "workout", "sports", "pilates", "yoga"],
    "γυμναστηριο": ["γυμνασ", "gym", "fit", "crossfit", "workout", "sports", "pilates", "yoga"],
    "συνεργείο αυτοκινήτων": ["συνεργ", "service", "car", "moto", "μηχανικ", "ελαστικ", "tyre", "repair", "φανοποι"],
    "συνεργειο αυτοκινητων": ["συνεργ", "service", "car", "moto", "μηχανικ", "ελαστικ", "tyre", "repair", "φανοποι"],
    "ανθοπωλείο": ["ανθοπ", "flower", "florist", "φυτ", "plant", "λουλουδ"],
    "ανθοπωλειο": ["ανθοπ", "flower", "florist", "φυτ", "plant", "λουλουδ"]
  };
  
  let keywords: string[] = [];
  for (const [key, list] of Object.entries(industryKeywords)) {
    if (ind.includes(key) || key.includes(ind)) {
      keywords = list;
      break;
    }
  }
  
  if (keywords.length === 0) {
    const stem = ind.substring(0, Math.max(4, Math.floor(ind.length * 0.7)));
    keywords = [stem];
  }
  
  return keywords.some(kw => text.includes(kw));
}

function extractBusinessNameFromUrl(link: string): string | null {
  if (!link) return null;
  try {
    const urlObj = new URL(link);
    const host = urlObj.hostname.toLowerCase();
    
    if (host.includes("facebook.com") || host.includes("instagram.com") || host.includes("tiktok.com")) {
      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      if (pathParts.length > 0) {
        let segment = pathParts[0];
        if (segment === "people" || segment === "pages" || segment === "p" || segment === "groups") {
          segment = pathParts[1] || segment;
        }
        segment = segment.split("-").filter(x => isNaN(Number(x))).join(" ");
        segment = segment.replace(/_+/g, " ");
        return decodeURIComponent(segment)
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
          .trim();
      }
    } else if (host.includes("vrisko.gr") || host.includes("xo.gr") || host.includes("goldenpages.gr")) {
      const pathParts = urlObj.pathname.split("/").filter(Boolean);
      if (pathParts.length > 0) {
        let segment = pathParts[pathParts.length - 1];
        if (pathParts[0] === "details" || pathParts[0] === "ypiresies") {
          segment = pathParts[1] || segment;
        }
        segment = segment.split("-").filter(x => isNaN(Number(x))).join(" ");
        segment = segment.replace(/_+/g, " ");
        return decodeURIComponent(segment)
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
          .trim();
      }
    }
  } catch (e) {
    // Ignore URL parsing errors
  }
  return null;
}

function cleanBusinessName(title: string, city?: string, link?: string): string {
  let name = title;

  // 1. Remove URLs and domain-like snippets
  name = name.replace(/https?:\/\/[^\s]+/gi, "");
  name = name.replace(/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?/g, "");

  // 2. Remove breadcrumbs and trailing search meta
  name = name.replace(/\s*[›»|•-].*$/g, "");

  const suffixes = [
    /\s*[-|]\s*Facebook/gi,
    /\s*[-|]\s*Αρχική σελίδα/gi,
    /\s*[-|]\s*Home/gi,
    /\s*[-|]\s*Google Maps/gi,
    /\s*[-|]\s*xo\.gr/gi,
    /\s*[-|]\s*vrisko\.gr/gi,
    /\s*[-|]\s*goldenpages\.gr/gi,
    /Google Support/gi,
    /Google Accounts/gi,
    /Facebook/gi,
    /Instagram/gi,
    /Pinterest/gi,
    /YouTube/gi,
    /LinkedIn/gi,
    /Twitter/gi,
    /TikTok/gi,
    /Vrisko/gi,
    /Xo\.gr/gi,
    /\s*\d{10}/g, // Αφαίρεση τηλεφώνων από τον τίτλο
  ];

  if (city) {
    const cleanCity = city.trim();
    suffixes.push(new RegExp(`\\s*[-|]\\s*${cleanCity}`, "gi"));
    // strip accents/tonos for extra match
    const normalizedCity = cleanCity.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (normalizedCity !== cleanCity) {
      suffixes.push(new RegExp(`\\s*[-|]\\s*${normalizedCity}`, "gi"));
    }
  }

  for (const suffix of suffixes) {
    name = name.replace(suffix, "");
  }

  // Clean double spaces and punctuation at the end
  name = name.replace(/\s+/g, " ").trim();
  name = name.replace(/^[-\s|•]+|[—\s|•]+$/g, "").trim();

  // Generic / Junk checks
  const genericTitles = [
    "google workspace", "gmail", "google accounts", "google support", "google docs",
    "facebook", "instagram", "pinterest", "youtube", "linkedin", "twitter", "tiktok",
    "vrisko", "xo.gr", "goldenpages", "κοινωνικός τουρισμός", "κοινωνικος τουρισμος", "google", "support"
  ];
  const isGeneric = genericTitles.some(term => name.toLowerCase().includes(term)) || name.length <= 2;
  
  if (isGeneric && link) {
    const urlName = extractBusinessNameFromUrl(link);
    if (urlName && urlName.length > 2) {
      return urlName;
    }
  }

  return name;
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

function extractTargetUrl(url: string): string {
  if (!url) return "";
  // Decode HTML entities like &amp;
  const cleanUrl = url.replace(/&amp;/g, "&");
  try {
    if (cleanUrl.includes("bing.com/ck/a")) {
      const urlObj = new URL(cleanUrl);
      const uParam = urlObj.searchParams.get("u");
      if (uParam) {
        let base64Part = uParam;
        if (base64Part.startsWith("a1")) {
          base64Part = base64Part.substring(2);
        }
        // Replace base64url characters
        base64Part = base64Part.replace(/-/g, "+").replace(/_/g, "/");
        while (base64Part.length % 4 !== 0) {
          base64Part += "=";
        }
        return Buffer.from(base64Part, "base64").toString("utf-8");
      }
    }
  } catch (e) {
    console.error("Failed to decode Bing URL:", cleanUrl, e);
  }
  return cleanUrl;
}

// 2. Scraping μέσω Bing Search HTML (Πολύ σταθερό, χωρίς captcha blocks)
async function searchViaBingScrape(query: string) {
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Accept-Language": "el-GR,el;q=0.9,en;q=0.8",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    if (!res.ok) return [];
    const html = await res.text();
    
    // Απλός regex-based parser για Bing HTML
    const results: any[] = [];
    const blockRegex = /<li[^>]+class="[^"]*b_algo[^"]*"[^>]*>([\s\S]*?)<\/li>/g;
    let match;
    
    while ((match = blockRegex.exec(html)) !== null) {
      const block = match[1];
      
      // Extract Title
      const titleMatch = block.match(/<h2><a href="([^"]+)"[^>]*>([\s\S]*?)<\/a><\/h2>/) ||
                         block.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
      const rawLink = titleMatch ? titleMatch[1] : "";
      const link = extractTargetUrl(rawLink);
      let title = titleMatch ? titleMatch[2] : "";
      title = title.replace(/<[^>]*>/g, ""); // strip html tags
      
      // Extract Snippet
      const snippetMatch = block.match(/<p>([\s\S]*?)<\/p>/) || 
                           block.match(/<div class="[^"]*b_caption[^"]*">([\s\S]*?)<\/div>/) ||
                           block.match(/<div class="[^"]*b_text[^"]*">([\s\S]*?)<\/div>/) ||
                           block.match(/<div[^>]+class="[^"]*caption[^"]*[^>]*>([\s\S]*?)<\/div>/);
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

    // Normalize and clean inputs for search engine tolerance
    const cleanCity = city.trim().replace(/\s+/g, " ");
    const cleanIndustry = industry.trim().replace(/\s+/g, " ");

    const stripAccents = (str: string) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const fixDoubleLetters = (str: string) => {
      return str.replace(/([α-ωa-z])\1+/gi, "$1");
    };

    const normalizedCity = stripAccents(cleanCity);
    const normalizedIndustry = stripAccents(cleanIndustry);
    const correctedCity = fixDoubleLetters(normalizedCity);
    const correctedIndustry = fixDoubleLetters(normalizedIndustry);

    // Build unique variations
    const cities = Array.from(new Set([cleanCity, normalizedCity, correctedCity]));
    const industries = Array.from(new Set([cleanIndustry, normalizedIndustry, correctedIndustry]));

    // Singular/plural variations for common Greek suffixes
    const industryVariations = [...industries];
    for (const ind of industries) {
      if (ind.endsWith("ια")) { // e.g. ξενοδοχεία -> ξενοδοχείο
        industryVariations.push(ind.slice(0, -2) + "ειο");
      } else if (ind.endsWith("ειο")) { // e.g. ξενοδοχείο -> ξενοδοχεία
        industryVariations.push(ind.slice(0, -3) + "εια");
      } else if (ind.endsWith("ες")) { // e.g. καφετέριες -> καφετέρια
        industryVariations.push(ind.slice(0, -2) + "α");
      } else if (ind.endsWith("α") && !ind.endsWith("ια")) { // e.g. καφετέρια -> καφετέριες
        industryVariations.push(ind.slice(0, -1) + "ες");
      }
    }

    const uniqueIndustries = Array.from(new Set(industryVariations));

    // Construct queries using forced email domain + loose keywords to allow search engines to handle typos/synonyms
    const queriesList: string[] = [];
    const domains = ["gmail.com", "yahoo.gr", "otenet.gr", "hotmail.com"];

    const bestCity = cities[0];
    const bestCityCorrected = correctedCity;
    const bestIndustry = uniqueIndustries[0];
    const bestIndustryAlt = uniqueIndustries.find(x => x !== bestIndustry) || bestIndustry;

    for (const domain of domains) {
      queriesList.push(`"${domain}" ${bestIndustry} ${bestCity}`);
      if (bestCityCorrected !== bestCity) {
        queriesList.push(`"${domain}" ${bestIndustry} ${bestCityCorrected}`);
      }
      if (bestIndustryAlt !== bestIndustry) {
        queriesList.push(`"${domain}" ${bestIndustryAlt} ${bestCity}`);
      }
    }

    const queries = Array.from(new Set(queriesList)).slice(0, 6);

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

      // Check if the result matches the requested category/industry
      if (!isResultRelevant(res.title, res.snippet, industry)) {
        continue;
      }

      // Check if the result belongs to another city
      if (isWrongCity(res.title, res.link, res.snippet, city)) {
        continue;
      }

      const emails = extractEmails(combinedText);
      const phone = extractPhone(combinedText);

      // Keep all found emails
      for (const email of emails) {
        // Comment out free email domains check as requested (do not filter out based on custom domain eshop/website)
        // const domain = email.split("@")[1];
        // if (!FREE_EMAIL_DOMAINS.includes(domain)) continue;

        // Comment out the website filter as requested: we want to find the business even if they have an eshop or website
        /*
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

        if (!isDirectoryOrSocial && res.link !== "") {
          continue;
        }
        */

        const rawName = cleanBusinessName(res.title, city, res.link);
        
        // Filter out junk/garbage business names
        if (isJunkName(rawName)) {
          continue;
        }

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
