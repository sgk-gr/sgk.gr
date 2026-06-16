// Google Places API → Website Scraping → Real Email extraction
// Searches all business categories in Kastoria, finds websites, scrapes emails

const GOOGLE_API_KEY = "AIzaSyCziVm_nQ5oDtySLhbzjs1m45fMJDvTINM";
const SUPABASE_URL = "https://xrmvingehhiymchoggka.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";

const LAT = 40.5195, LNG = 21.2682;

const CATEGORIES = [
  { industry: "φαρμακείο",   queries: ["φαρμακείο Καστοριά"], type: "pharmacy" },
  { industry: "ξενοδοχείο",  queries: ["ξενοδοχείο Καστοριά", "hotel Kastoria", "κατάλυμα Καστοριά"], type: "lodging" },
  { industry: "εστίαση",     queries: ["εστιατόριο Καστοριά", "ταβέρνα Καστοριά", "γυράδικο Καστοριά", "pizzeria Καστοριά"], type: "restaurant" },
  { industry: "καφετέρια",   queries: ["καφετέρια Καστοριά", "coffee Καστοριά"], type: "cafe" },
  { industry: "οδοντιατρείο",queries: ["οδοντιατρείο Καστοριά", "οδοντίατρος Καστοριά"], type: "dentist" },
  { industry: "κομμωτήριο",  queries: ["κομμωτήριο Καστοριά", "barber Καστοριά"], type: "beauty_salon" },
  { industry: "φυσιοθεραπεία",queries: ["φυσιοθεραπεία Καστοριά"], type: "physiotherapist" },
  { industry: "λογιστής",    queries: ["λογιστής Καστοριά", "λογιστικό γραφείο Καστοριά"], type: null },
  { industry: "δικηγόρος",   queries: ["δικηγόρος Καστοριά", "δικηγορικό γραφείο Καστοριά"], type: "lawyer" },
];

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function extractEmails(html) {
  // Remove scripts/styles first
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "")
             .replace(/<style[\s\S]*?<\/style>/gi, "");
  // Decode HTML entities
  html = html.replace(/&#64;/g, "@").replace(/&amp;/g, "&").replace(/\[at\]/gi, "@").replace(/\[dot\]/gi, ".");
  const regex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,6}/g;
  const found = html.match(regex) || [];
  const IGNORE = ["sentry.io","wixpress.com","example.com","placeholder","noreply","no-reply","support@","info@wix","test@"];
  return Array.from(new Set(
    found.map(e => e.toLowerCase())
         .filter(e => !IGNORE.some(ig => e.includes(ig)))
  ));
}

async function fetchPage(url, timeout = 8000) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const r = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; EmailBot/1.0)" }
    });
    clearTimeout(timer);
    if (!r.ok) return "";
    return await r.text();
  } catch { return ""; }
}

async function scrapeEmailsFromWebsite(website) {
  if (!website) return [];
  const emails = new Set();
  
  // Try main page
  const main = await fetchPage(website);
  extractEmails(main).forEach(e => emails.add(e));
  if (emails.size > 0) return Array.from(emails);
  
  await delay(300);
  
  // Try /contact, /epikoinonia, /contact-us
  const base = website.replace(/\/$/, "");
  for (const path of ["/contact", "/epikoinonia", "/contact-us", "/επικοινωνια"]) {
    const page = await fetchPage(base + path);
    if (page) extractEmails(page).forEach(e => emails.add(e));
    if (emails.size > 0) break;
    await delay(200);
  }
  
  return Array.from(emails);
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

async function upsert(prospect) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/sgk_prospects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Prefer": "resolution=merge-duplicates,return=minimal",
      "on_conflict": "email"
    },
    body: JSON.stringify(prospect)
  });
  return r.status; // 200=updated, 201=inserted, 409=duplicate
}

async function run() {
  console.log("🚀 Google Places + Website Email Scraper για Καστοριά\n");
  let totalInserted = 0;

  for (const cat of CATEGORIES) {
    console.log(`\n${"═".repeat(55)}`);
    console.log(`📍 ${cat.industry.toUpperCase()}`);
    console.log(`${"═".repeat(55)}`);

    const places = await collectPlaces(cat);
    console.log(`  Βρέθηκαν ${places.size} unique places`);

    let catInserted = 0;
    let idx = 0;

    for (const [placeId, place] of places) {
      idx++;
      await delay(150);
      
      const details = await getDetails(placeId);
      const website = details.website || null;
      const phone = details.formatted_phone_number || details.international_phone_number || null;
      
      if (!website) continue; // No website = skip (no way to find email)
      
      console.log(`\n  [${idx}/${places.size}] ${place.name}`);
      console.log(`    🌐 ${website}`);
      
      await delay(300);
      const emails = await scrapeEmailsFromWebsite(website);
      
      if (emails.length === 0) {
        console.log(`    ✗ Δεν βρέθηκε email`);
        continue;
      }
      
      // Use first valid email
      const email = emails[0];
      console.log(`    ✅ Email: ${email} | ☎️ ${phone || "-"}`);
      
      const status = await upsert({
        business_name: place.name,
        email: email,
        phone: phone,
        city: "Καστοριά",
        industry: cat.industry,
        status: "pending"
      });
      
      if (status === 201 || status === 200) {
        catInserted++;
        totalInserted++;
      }
    }
    
    console.log(`\n  → Αποθηκεύτηκαν ${catInserted} για ${cat.industry}`);
  }

  console.log(`\n${"═".repeat(55)}`);
  console.log(`🎉 ΤΕΛΟΣ! Συνολικά: ${totalInserted} νέα prospects με πραγματικό email`);
  console.log(`${"═".repeat(55)}`);
}

run().catch(console.error);
