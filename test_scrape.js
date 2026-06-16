import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xrmvingehhiymchoggka.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FREE_EMAIL_DOMAINS = ["gmail.com", "yahoo.gr", "yahoo.com", "hotmail.com", "outlook.com", "otenet.gr", "mail.com", "yandex.com"];

function extractBusinessNameFromUrl(link) {
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

function cleanBusinessName(title, city, link) {
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
    /\s*\d{10}/g,
  ];
  if (city) {
    const cleanCity = city.trim();
    suffixes.push(new RegExp(`\\s*[-|]\\s*${cleanCity}`, "gi"));
    const normalizedCity = cleanCity.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (normalizedCity !== cleanCity) {
      suffixes.push(new RegExp(`\\s*[-|]\\s*${normalizedCity}`, "gi"));
    }
  }
  for (const suffix of suffixes) {
    name = name.replace(suffix, "");
  }
  
  // Clean double spaces and trailing punctuation
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

function extractEmails(text) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const found = text.match(emailRegex);
  return found ? Array.from(new Set(found.map(email => email.toLowerCase()))) : [];
}

function extractTargetUrl(url) {
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

async function searchViaBingScrape(query) {
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
    
    const results = [];
    const blockRegex = /<li[^>]+class="[^"]*b_algo[^"]*"[^>]*>([\s\S]*?)<\/li>/g;
    let match;
    
    while ((match = blockRegex.exec(html)) !== null) {
      const block = match[1];
      
      const titleMatch = block.match(/<h2><a href="([^"]+)"[^>]*>([\s\S]*?)<\/a><\/h2>/) ||
                         block.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
      const rawLink = titleMatch ? titleMatch[1] : "";
      const link = extractTargetUrl(rawLink);
      let title = titleMatch ? titleMatch[2] : "";
      title = title.replace(/<[^>]*>/g, "");
      
      const snippetMatch = block.match(/<p>([\s\S]*?)<\/p>/) || 
                           block.match(/<div class="[^"]*b_caption[^"]*">([\s\S]*?)<\/div>/) ||
                           block.match(/<div class="[^"]*b_text[^"]*">([\s\S]*?)<\/div>/) ||
                           block.match(/<div[^>]+class="[^"]*caption[^>]*"[^>]*>([\s\S]*?)<\/div>/);
      let snippet = snippetMatch ? snippetMatch[1] : "";
      snippet = snippet.replace(/<[^>]*>/g, "");
      
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

async function run() {
  const city = "Καστοριά";
  const industry = "κομμωτήριο";
  
  // Normalize and clean inputs for search engine tolerance
  const cleanCity = city.trim().replace(/\s+/g, " ");
  const cleanIndustry = industry.trim().replace(/\s+/g, " ");

  const stripAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const fixDoubleLetters = (str) => {
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
  const queriesList = [];
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
  
  console.log(`Running test scrape for ${industry} in ${city}...`);
  console.log(`Generated queries:`, queries);
  const allResults = [];
  
  for (const q of queries) {
    console.log(`Searching query: ${q}`);
    const results = await searchViaBingScrape(q);
    console.log(`Found ${results.length} raw results`);
    allResults.push(...results);
  }
  
  console.log(`\n--- Processing ${allResults.length} raw results ---`);
  const prospectsMap = new Map();
  for (const res of allResults) {
    const combinedText = `${res.title} ${res.snippet}`;
    const emails = extractEmails(combinedText);
    if (emails.length > 0) {
      console.log(`\nResult Link: ${res.link}`);
      console.log(`Result Title: ${res.title}`);
      console.log(`Result Snippet: ${res.snippet}`);
      console.log(`Extracted Emails: ${JSON.stringify(emails)}`);
    }
    
    for (const email of emails) {
      const domain = email.split("@")[1];
      const isFree = FREE_EMAIL_DOMAINS.includes(domain);
      console.log(`- Email: ${email}, Domain: ${domain}, Is Free Domain: ${isFree}`);
      if (!isFree) continue;
      
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
      
      console.log(`- Is Directory/Social: ${isDirectoryOrSocial} (Link: ${res.link})`);

      if (!isDirectoryOrSocial && res.link !== "") {
        console.log(`- Skipping: Link is not a directory or social profile and is not empty`);
        continue;
      }

      const rawName = cleanBusinessName(res.title, city, res.link);
      const finalName = rawName.length > 2 ? rawName : `${industry} - ${city}`;

      prospectsMap.set(email, {
        business_name: finalName,
        email: email,
        city: city,
        industry: industry
      });
      console.log(`- ADDED PROSPECT: ${finalName} (${email})`);
    }
  }
  
  console.log("\n--- Final Extracted Prospects ---");
  console.log(Array.from(prospectsMap.values()));
}

run();
