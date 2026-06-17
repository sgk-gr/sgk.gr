// Enhanced scraper: Google Places + Website + Facebook About section
// Extracts emails from Facebook pages too!

const GOOGLE_API_KEY = "AIzaSyCziVm_nQ5oDtySLhbzjs1m45fMJDvTINM";
const SUPABASE_URL = "https://xrmvingehhiymchoggka.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";
const LAT = 40.5195, LNG = 21.2682;

const CATEGORIES = [
  { industry: "φαρμακείο",    queries: ["φαρμακείο Καστοριά"], type: "pharmacy" },
  { industry: "ξενοδοχείο",   queries: ["ξενοδοχείο Καστοριά", "hotel Kastoria", "κατάλυμα Καστοριά"], type: "lodging" },
  { industry: "εστίαση",      queries: ["εστιατόριο Καστοριά", "ταβέρνα Καστοριά", "γυράδικο Καστοριά", "pizzeria Καστοριά"], type: "restaurant" },
  { industry: "καφετέρια",    queries: ["καφετέρια Καστοριά", "coffee Καστοριά"], type: "cafe" },
  { industry: "οδοντιατρείο", queries: ["οδοντιατρείο Καστοριά", "οδοντίατρος Καστοριά"], type: "dentist" },
  { industry: "κομμωτήριο",   queries: ["κομμωτήριο Καστοριά", "barber Καστοριά"], type: "beauty_salon" },
  { industry: "φυσιοθεραπεία",queries: ["φυσιοθεραπεία Καστοριά"], type: null },
  { industry: "λογιστής",     queries: ["λογιστής Καστοριά", "λογιστικό γραφείο Καστοριά"], type: null },
  { industry: "δικηγόρος",    queries: ["δικηγόρος Καστοριά", "δικηγορικό γραφείο Καστοριά"], type: "lawyer" },
];

const FAKE_EMAIL_PATTERNS = [
  "noemail", "@kastoria.pharmacy", "@noemail.gr", "example.com",
  "sentry.io", "wixpress.com", "noreply", "no-reply",
  "gpapadopoulos@company.gr", // known bad from xo.gr
];

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function isFakeEmail(email) {
  const e = email.toLowerCase();
  return FAKE_EMAIL_PATTERNS.some(p => e.includes(p));
}

function extractEmails(html) {
  if (!html) return [];
  // Decode obfuscations
  html = html
    .replace(/&#64;/g, "@").replace(/&#46;/g, ".")
    .replace(/\[at\]/gi, "@").replace(/\(at\)/gi, "@")
    .replace(/\[dot\]/gi, ".").replace(/\(dot\)/gi, ".")
    .replace(/&amp;/g, "&").replace(/\\u0040/g, "@");
  
  // Remove scripts/styles
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "")
             .replace(/<style[\s\S]*?<\/style>/gi, "");

  const regex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,6}/g;
  const found = html.match(regex) || [];
  return Array.from(new Set(
    found.map(e => e.toLowerCase()).filter(e => !isFakeEmail(e))
  ));
}

async function fetchPage(url, timeout = 9000) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout);
    const r = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "el-GR,el;q=0.9,en;q=0.8",
      }
    });
    clearTimeout(t);
    if (!r.ok) return "";
    return await r.text();
  } catch { return ""; }
}

const puppeteer = require('puppeteer');

let browserInstance = null;
async function getBrowser() {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({ headless: "new" });
  }
  return browserInstance;
}

// Scrape Facebook page for email using Puppeteer
async function scrapeFromFacebook(fbUrl) {
  if (!fbUrl || !fbUrl.includes("facebook.com")) return [];
  
  // Clean URL and append /about
  let aboutUrl = fbUrl.split('?')[0].replace(/\/$/, "") + '/about';
  
  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
  
  try {
    await page.goto(aboutUrl, { waitUntil: 'networkidle2', timeout: 15000 });
    const text = await page.evaluate(() => document.body.innerText);
    const emails = extractEmails(text);
    await page.close();
    return emails;
  } catch (err) {
    await page.close();
    return [];
  }
}

// Scrape regular website for email
async function scrapeFromWebsite(website) {
  if (!website) return [];
  const emails = new Set();
  
  const main = await fetchPage(website);
  extractEmails(main).forEach(e => emails.add(e));
  if (emails.size > 0) return Array.from(emails);
  
  await delay(400);
  const base = website.replace(/\/$/, "");
  for (const path of ["/contact", "/epikoinonia", "/contact-us", "/επικοινωνια", "/about"]) {
    const page = await fetchPage(base + path);
    if (page) extractEmails(page).forEach(e => emails.add(e));
    if (emails.size > 0) break;
    await delay(200);
  }
  
  return Array.from(emails);
}

async function scrapeEmailFromUrl(url) {
  if (!url) return [];
  if (url.includes("facebook.com")) return await scrapeFromFacebook(url);
  if (url.includes("instagram.com") || url.includes("tiktok.com")) return []; // can't scrape
  if (url.includes("vrisko.gr") || url.includes("xo.gr") || url.includes("goldenpages")) return []; // directories
  return await scrapeFromWebsite(url);
}

async function placesTextSearch(query, pageToken = null) {
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&language=el`;
  if (pageToken) url += `&pagetoken=${pageToken}`;
  const r = await fetch(url);
  return r.json();
}

async function placesNearby(type, keyword, pageToken = null) {
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${LAT},${LNG}&radius=5000&key=${GOOGLE_API_KEY}&language=el&keyword=${encodeURIComponent(keyword)}`;
  if (type) url += `&type=${type}`;
  if (pageToken) url += `&pagetoken=${pageToken}`;
  const r = await fetch(url);
  return r.json();
}

async function getDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,website,international_phone_number&key=${GOOGLE_API_KEY}`;
  const r = await fetch(url);
  const d = await r.json();
  return d.result || {};
}

async function collectPlaces(cat) {
  const all = new Map();
  for (const q of cat.queries) {
    await delay(400);
    let data = await placesTextSearch(q);
    if (data.results) data.results.forEach(p => all.set(p.place_id, p));
    while (data.next_page_token) {
      await delay(2200);
      data = await placesTextSearch(q, data.next_page_token);
      if (data.results) data.results.forEach(p => all.set(p.place_id, p));
    }
  }
  if (cat.type) {
    await delay(400);
    let data = await placesNearby(cat.type, cat.queries[0]);
    if (data.results) data.results.forEach(p => all.set(p.place_id, p));
    while (data.next_page_token) {
      await delay(2200);
      data = await placesNearby(cat.type, cat.queries[0], data.next_page_token);
      if (data.results) data.results.forEach(p => all.set(p.place_id, p));
    }
  }
  return all;
}

async function checkAlreadyExists(email) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/sgk_prospects?email=eq.${encodeURIComponent(email)}&select=id`, {
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
  });
  const d = await r.json();
  return Array.isArray(d) && d.length > 0;
}

async function upsert(prospect) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/sgk_prospects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "resolution=merge-duplicates,return=minimal",
      "on_conflict": "email"
    },
    body: JSON.stringify(prospect)
  });
  return r.status;
}

async function run() {
  console.log("🚀 Enhanced Email Scraper — Google Places + Website + Facebook\n");
  console.log("📌 Τώρα ψάχνει και μέσα σε Facebook pages!\n");
  let totalNew = 0, totalSkipped = 0;

  for (const cat of CATEGORIES) {
    console.log(`\n${"═".repeat(58)}`);
    console.log(`📍 ${cat.industry.toUpperCase()}`);
    console.log(`${"═".repeat(58)}`);

    const places = await collectPlaces(cat);
    console.log(`  Βρέθηκαν ${places.size} unique places`);

    let catNew = 0;
    let idx = 0;

    for (const [placeId, place] of places) {
      idx++;
      await delay(200);
      
      const details = await getDetails(placeId);
      const website = details.website || null;
      const phone = details.formatted_phone_number || details.international_phone_number || null;
      
      if (!website) {
        // No website at all → skip
        continue;
      }
      
      const isFacebook = website.includes("facebook.com");
      const isInstagram = website.includes("instagram.com");
      const isTiktok = website.includes("tiktok.com");
      const isDirectory = website.includes("vrisko.gr") || website.includes("xo.gr") || website.includes("goldenpages") || website.includes("setmore.com");
      
      if (isInstagram || isTiktok) continue; // Can't scrape

      console.log(`\n  [${idx}/${places.size}] ${place.name}`);
      if (isFacebook) {
        console.log(`    📘 Facebook: ${website}`);
      } else {
        console.log(`    🌐 ${website}`);
      }
      
      await delay(400);
      const emails = await scrapeEmailFromUrl(website);
      
      if (emails.length === 0) {
        console.log(`    ✗ Δεν βρέθηκε email`);
        continue;
      }
      
      const email = emails[0];
      
      // Check if already in DB
      const exists = await checkAlreadyExists(email);
      if (exists) {
        console.log(`    ↩️  Υπάρχει ήδη: ${email}`);
        totalSkipped++;
        continue;
      }
      
      console.log(`    ✅ ${email} | ☎️ ${phone || "-"}`);
      
      await upsert({
        business_name: place.name,
        email,
        phone,
        city: "Καστοριά",
        industry: cat.industry,
        status: "pending"
      });
      catNew++;
      totalNew++;
      
      await delay(100);
    }
    
    console.log(`\n  → Νέα: ${catNew}`);
  }

  console.log(`\n${"═".repeat(58)}`);
  console.log(`🎉 ΤΕΛΟΣ!`);
  console.log(`   ✅ Νέα prospects: ${totalNew}`);
  console.log(`   ↩️  Υπήρχαν ήδη: ${totalSkipped}`);
  console.log(`${"═".repeat(58)}`);

  if (browserInstance) {
    await browserInstance.close();
  }
}

run().catch(async (e) => {
  console.error(e);
  if (browserInstance) {
    await browserInstance.close();
  }
});
