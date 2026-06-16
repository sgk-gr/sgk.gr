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
    // Ignore
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
    // Ignore
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

async function scrapeDentists() {
  const cities = [
    "Θεσσαλονίκη", "Κοζάνη", "Καστοριά", "Φλώρινα", "Λάρισα", 
    "Ιωάννινα", "Πάτρα", "Βέροια", "Κατερίνη", "Γρεβενά", 
    "Πτολεμαΐδα", "Βόλος", "Τρίκαλα", "Καρδίτσα", "Σέρρες", 
    "Καβάλα", "Ξάνθη", "Χανιά", "Ηράκλειο", "Ρόδος"
  ];
  
  console.log(`\n==================================================`);
  console.log(`Starting Dentists (Οδοντιατρεία) Scraper Loop`);
  console.log(`==================================================`);
  
  const allProspectsMap = new Map();
  const industry = "Οδοντιατρείο";
  
  // Create variations of searches for dentists
  const searchTerms = ["οδοντιατρείο", "οδοντίατρος"];
  const domains = ["gmail.com", "yahoo.gr", "hotmail.com"];
  
  // We will run random city and term combinations
  const totalSteps = 20;
  for (let i = 0; i < totalSteps; i++) {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const query = `"${randomDomain}" ${randomTerm} ${randomCity}`;
    
    console.log(`\n[Query ${i + 1}/${totalSteps}] Searching: ${query}...`);
    try {
      const results = await searchViaBingScrape(query);
      console.log(`-> Found ${results.length} raw results`);
      
      let countInStep = 0;
      for (const res of results) {
        const combinedText = `${res.title} ${res.snippet}`;
        const emails = extractEmails(combinedText);
        const phone = extractPhone(combinedText);
        
        for (const email of emails) {
          const domain = email.split("@")[1];
          const isFree = FREE_EMAIL_DOMAINS.includes(domain);
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

          if (!isDirectoryOrSocial && res.link !== "") {
            continue;
          }

          const rawName = cleanBusinessName(res.title, randomCity, res.link);
          const finalName = rawName.length > 2 ? rawName : `${industry} - ${randomCity}`;

          allProspectsMap.set(email, {
            business_name: finalName,
            email: email,
            phone: phone,
            city: randomCity,
            industry: industry,
            status: "pending"
          });
          countInStep++;
        }
      }
      console.log(`Added ${countInStep} prospects from this search.`);
      console.log(`Total unique leads collected so far: ${allProspectsMap.size}`);
    } catch (err) {
      console.error(`Error in search step:`, err);
    }
    
    // Sleep 1.5 seconds to avoid rate limits
    await new Promise(r => setTimeout(r, 1500));
  }
  
  const finalLeads = Array.from(allProspectsMap.values());
  console.log(`\n==================================================`);
  console.log(`Dentists Scrape completed. Total unique leads: ${finalLeads.length}`);
  console.log(`==================================================`);
  
  if (finalLeads.length === 0) {
    console.log("No leads found.");
    return;
  }
  
  console.log("Saving new leads to Supabase...");
  let savedCount = 0;
  for (const prospect of finalLeads) {
    const { data, error } = await supabase
      .from("sgk_prospects")
      .upsert([prospect], { onConflict: "email" })
      .select();
      
    if (!error && data && data.length > 0) {
      savedCount++;
    }
  }
  
  console.log(`Saved ${savedCount} new dentists to database.`);
}

scrapeDentists();
