import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xrmvingehhiymchoggka.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FREE_EMAIL_DOMAINS = ["gmail.com", "yahoo.gr", "yahoo.com", "hotmail.com", "outlook.com", "otenet.gr", "mail.com", "yandex.com"];

const GREEK_CITIES_KEYWORDS = {
  "αθήνα": ["athens", "αθηνα", "αθηνων", "marousi", "peiraias", "glyfada", "kallithea", "peristeri"],
  "θεσσαλονίκη": ["thessaloniki", "salonika", "θεσσαλονικη", "θεσσαλονικης"],
  "πάτρα": ["patra", "πατρα"],
  "λάρισα": ["larisa", "larissa", "λαρισα"],
  "ηράκλειο": ["heraklion", "iraklio", "ηρακλειο"],
  "καστοριά": ["kastoria", "καστορια", "καστοριας"],
  "κοζάνη": ["kozani", "κοζανη", "κοζανης"],
  "φλώρινα": ["florina", "φλωρινα", "φλωρινας"],
  "γρεβενά": ["grevena", "γρεβενα", "γρεβενων"],
  "πτολεμαΐδα": ["ptolemaida", "πτολεμαιδα", "πτολεμαϊδα"],
  "βέροια": ["veroia", "veria", "βεροια", "βεροιας"],
  "έδεσσα": ["edessa", "εδεσσα"],
  "νάουσα": ["naousa", "naoussa", "ναουσα"],
  "κατερίνη": ["katerini", "κατερινη"]
};

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
  
  name = name.replace(/https?:\/\/[^\s]+/gi, "");
  name = name.replace(/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?/g, "");
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
  
  name = name.replace(/\s+/g, " ").trim();
  name = name.replace(/^[-\s|•]+|[—\s|•]+$/g, "").trim();
  
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

function isJunkName(name) {
  if (!name) return true;
  const trimmed = name.trim();
  if (trimmed.length <= 2) return true;
  
  // If it contains a domain suffix (e.g. .gr, .com, .net, .org, .info)
  if (/\.[a-z]{2,4}$/i.test(trimmed)) return true;
  
  // If it contains weird random base64/hash characters (e.g. no vowels, or too many uppercase/lowercase mixes in a single word of length > 8)
  const words = trimmed.split(/\s+/);
  for (const word of words) {
    if (word.length > 7) {
      // Check if it's alphanumeric with mixed case and no vowels, or contains weird characters
      const hasVowels = /[aeiouyαεηιοωυάέήίόώύϊϋ]/i.test(word);
      const isRandom = /^[a-zA-Z0-9]+$/.test(word) && !hasVowels;
      // Check for base64-like strings (e.g. mix of uppercase, lowercase and numbers with length > 8)
      const hasUpper = /[A-Z]/.test(word);
      const hasLower = /[a-z]/.test(word);
      const hasDigit = /[0-9]/.test(word);
      const isBase64Like = word.length > 10 && hasUpper && hasLower && (hasDigit || !hasVowels);
      if (isRandom || isBase64Like) return true;
    }
  }
  
  // If it is a generic word like 'Reel', 'Reels', 'Video', 'Post', 'Posts', 'Photo', 'Cover'
  const generics = ["reel", "reels", "video", "post", "posts", "photo", "photos", "cover", "image", "profile", "timeline", "story", "stories"];
  if (generics.includes(trimmed.toLowerCase())) return true;
  
  return false;
}

function isResultRelevant(title, snippet, industry) {
  const text = `${title} ${snippet}`.toLowerCase();
  const ind = industry.toLowerCase();
  
  // Define keyword maps for common Greek industries
  const industryKeywords = {
    "οδοντιατρείο": ["οδοντ", "δοντ", "dent", "smile", "tooth", "teeth"],
    "οδοντιατρος": ["οδοντ", "δοντ", "dent", "smile", "tooth", "teeth"],
    "κομμωτήριο": ["κομμωτ", "hair", "salon", "barber", "κουρε", "beauty", "haircut", "νυχια", "nails", "spa", "αισθητικ"],
    "κομμωτηριο": ["κομμωτ", "hair", "salon", "barber", "κουρε", "beauty", "haircut", "νυχια", "nails", "spa", "αισθητικ"],
    "εστιατόριο": ["εστιατ", "ταβερν", "ψητοπ", "φαγητ", "food", "restau", "pizza", "burger", "delivery", "ψησταρ", "οβελιστ", "snack", "ψητο", "μαγειρ"],
    "εστιατοριο": ["εστιατ", "ταβερν", "ψητοπ", "φαγητ", "food", "restau", "pizza", "burger", "delivery", "ψησταρ", "οβελιστ", "snack", "ψητο", "μαγειρ"],
    "καφετέρια": ["καφε", "cafe", "coffee", "bar", "snack", "delivery", "ροφημα", "brunch"],
    "καφετερια": ["καφε", "cafe", "coffee", "bar", "snack", "delivery", "ροφημα", "brunch"],
    "ξενοδοχειο": ["ξενοδ", "hotel", "room", "apart", "villa", "studios", "stay", "διαμον", "ξενων", "resort", "booking"],
    "ξενοδοχείο": ["ξενοδ", "hotel", "room", "apart", "villa", "studios", "stay", "διαμον", "ξενων", "resort", "booking"],
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
  
  // Find matching keywords list
  let keywords = [];
  for (const [key, list] of Object.entries(industryKeywords)) {
    if (ind.includes(key) || key.includes(ind)) {
      keywords = list;
      break;
    }
  }
  
  // If we don't have defined keywords for this industry, fallback to basic check (contains industry name stem)
  if (keywords.length === 0) {
    const stem = ind.substring(0, Math.max(4, Math.floor(ind.length * 0.7)));
    keywords = [stem];
  }
  
  return keywords.some(kw => text.includes(kw));
}

function extractEmails(text) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const found = text.match(emailRegex);
  return found ? Array.from(new Set(found.map(email => email.toLowerCase()))) : [];
}

function extractPhone(text) {
  const phoneRegex = /(?:69\d{8}|2\d{9})/g;
  const found = text.match(phoneRegex);
  return found ? found[0] : null;
}

function extractTargetUrl(url) {
  if (!url) return "";
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
        base64Part = base64Part.replace(/-/g, "+").replace(/_/g, "/");
        while (base64Part.length % 4 !== 0) {
          base64Part += "=";
        }
        return Buffer.from(base64Part, "base64").toString("utf-8");
      }
    }
  } catch (e) {
    // ignore
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
                           block.match(/<div[^>]+class="[^"]*caption[^"]*[^>]*>([\s\S]*?)<\/div>/);
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

// Check if a prospect belongs to another city than the target
function isWrongCity(title, link, snippet, targetCity) {
  const targetCityLower = targetCity.toLowerCase();
  const titleLower = title.toLowerCase();
  const linkLower = link.toLowerCase();
  const snippetLower = snippet.toLowerCase();
  
  // Find other cities in the map
  const otherCities = Object.keys(GREEK_CITIES_KEYWORDS).filter(c => c !== targetCityLower);
  
  for (const otherCity of otherCities) {
    const keywords = GREEK_CITIES_KEYWORDS[otherCity];
    // If an other city is mentioned in the link (very strong indicator) or title/snippet,
    // and the target city is NOT mentioned in the link or title, it's likely the wrong city.
    const otherCityInLink = keywords.some(kw => linkLower.includes(kw));
    const targetCityInLink = GREEK_CITIES_KEYWORDS[targetCityLower] ? GREEK_CITIES_KEYWORDS[targetCityLower].some(kw => linkLower.includes(kw)) : false;
    
    if (otherCityInLink && !targetCityInLink) {
      return true;
    }
    
    // Also, if the title explicitly states another city (e.g. "Oxonouathens" or "Lola Maroneia")
    const otherCityInTitle = keywords.some(kw => titleLower.includes(kw));
    const targetCityInTitle = GREEK_CITIES_KEYWORDS[targetCityLower] ? GREEK_CITIES_KEYWORDS[targetCityLower].some(kw => titleLower.includes(kw)) : false;
    
    if (otherCityInTitle && !targetCityInTitle) {
      return true;
    }
  }
  
  return false;
}

async function scrapeSingle(industry, city) {
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

  const cities = Array.from(new Set([cleanCity, normalizedCity, correctedCity]));
  const industries = Array.from(new Set([cleanIndustry, normalizedIndustry, correctedIndustry]));

  const industryVariations = [...industries];
  for (const ind of industries) {
    if (ind.endsWith("ια")) {
      industryVariations.push(ind.slice(0, -2) + "ειο");
    } else if (ind.endsWith("ειο")) {
      industryVariations.push(ind.slice(0, -3) + "εια");
    } else if (ind.endsWith("ες")) {
      industryVariations.push(ind.slice(0, -2) + "α");
    } else if (ind.endsWith("α") && !ind.endsWith("ια")) {
      industryVariations.push(ind.slice(0, -1) + "ες");
    }
  }

  const uniqueIndustries = Array.from(new Set(industryVariations));

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

  const queries = Array.from(new Set(queriesList)).slice(0, 4); // limit queries per run to avoid spamming
  const allResults = [];
  
  for (const q of queries) {
    const results = await searchViaBingScrape(q);
    allResults.push(...results);
  }
  
  const prospects = [];
  for (const res of allResults) {
    // Check if the result matches the requested category/industry
    if (!isResultRelevant(res.title, res.snippet, industry)) {
      continue;
    }

    // Check city filter
    if (isWrongCity(res.title, res.link, res.snippet, city)) {
      continue;
    }

    const combinedText = `${res.title} ${res.snippet}`;
    const emails = extractEmails(combinedText);
    const phone = extractPhone(combinedText);
    
    for (const email of emails) {
      // Comment out free email domains check
      // const domain = email.split("@")[1];
      // const isFree = FREE_EMAIL_DOMAINS.includes(domain);
      // if (!isFree) continue;
      
      // Comment out the website filter
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

      // Skip if the business name is garbage/junk
      if (isJunkName(rawName)) {
        continue;
      }

      const finalName = rawName.length > 2 ? rawName : `${industry} - ${city}`;

      prospects.push({
        business_name: finalName,
        email: email,
        phone: phone,
        city: city,
        industry: industry,
        status: "pending"
      });
    }
  }
  
  return prospects;
}

async function runBulk() {
  const cities = ["Καστοριά", "Κοζάνη", "Φλώρινα", "Γρεβενά", "Πτολεμαΐδα", "Βέροια", "Έδεσσα", "Νάουσα", "Κατερίνη", "Ιωάννινα"];
  const industries = ["ταβέρνα", "κομμωτήριο", "καφετέρια", "έπιπλα", "ζαχαροπλαστείο", "γυμναστήριο", "συνεργείο αυτοκινήτων", "ανθοπωλείο"];
  
  console.log(`\n==================================================`);
  console.log(`Starting BULK B2B Scraper Loop for 50+ Leads Goal`);
  console.log(`==================================================`);
  
  const allProspectsMap = new Map();
  
  // We will run random city/industry combinations until we get a good amount of leads
  // or until we run out of iterations to avoid infinite loops.
  let targetLeadsCount = 60;
  let iterations = 0;
  let maxIterations = 15;
  
  while (allProspectsMap.size < targetLeadsCount && iterations < maxIterations) {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomIndustry = industries[Math.floor(Math.random() * industries.length)];
    
    console.log(`\n[Iteration ${iterations + 1}] Scanning for '${randomIndustry}' in '${randomCity}'...`);
    
    try {
      const results = await scrapeSingle(randomIndustry, randomCity);
      console.log(`Found ${results.length} valid prospects in this iteration.`);
      
      for (const p of results) {
        allProspectsMap.set(p.email, p);
      }
      
      console.log(`Current unique leads collected so far: ${allProspectsMap.size}`);
    } catch (err) {
      console.error(`Error in iteration:`, err);
    }
    
    iterations++;
    // Sleep 1 second to avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }
  
  const finalLeads = Array.from(allProspectsMap.values());
  console.log(`\n==================================================`);
  console.log(`Bulk Scan completed. Total unique leads collected: ${finalLeads.length}`);
  console.log(`==================================================`);
  
  if (finalLeads.length === 0) {
    console.log("No leads found.");
    return;
  }
  
  console.log("Saving new leads to Supabase...");
  let savedCount = 0;
  for (const prospect of finalLeads) {
    // Upsert into Supabase
    const { data, error } = await supabase
      .from("sgk_prospects")
      .upsert([prospect], { onConflict: "email" })
      .select();
      
    if (!error && data && data.length > 0) {
      savedCount++;
    }
  }
  
  console.log(`Saved ${savedCount} new prospects to database.`);
}

runBulk();
