// 1. Delete placeholder emails
// 2. Search all business categories in Kastoria via Google Places
// 3. Insert only those with real phone or email

const GOOGLE_API_KEY = "AIzaSyCziVm_nQ5oDtySLhbzjs1m45fMJDvTINM";
const SUPABASE_URL = "https://xrmvingehhiymchoggka.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";

const KASTORIA_LAT = 40.5195;
const KASTORIA_LNG = 21.2682;

async function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ──────────────────────────────────────────────
// STEP 1: Delete placeholder emails
// ──────────────────────────────────────────────
async function deletePlaceholders() {
  console.log("🗑️  Deleting placeholder email records...");
  const r = await fetch(`${SUPABASE_URL}/rest/v1/sgk_prospects?email=like.noemail_%40kastoria.pharmacy`, {
    method: "DELETE",
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Prefer": "return=representation"
    }
  });
  const result = await r.json();
  const count = Array.isArray(result) ? result.length : 0;
  console.log(`  ✅ Deleted ${count} placeholder records.\n`);
}

// ──────────────────────────────────────────────
// STEP 2: Google Places helpers
// ──────────────────────────────────────────────
async function textSearch(query, pageToken = null) {
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&language=el`;
  if (pageToken) url += `&pagetoken=${pageToken}`;
  const res = await fetch(url);
  return res.json();
}

async function nearbySearch(lat, lng, radius, type, keyword, pageToken = null) {
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&keyword=${encodeURIComponent(keyword)}&key=${GOOGLE_API_KEY}&language=el`;
  if (pageToken) url += `&pagetoken=${pageToken}`;
  const res = await fetch(url);
  return res.json();
}

async function getPlaceDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,website,international_phone_number&key=${GOOGLE_API_KEY}&language=el`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result || {};
}

async function collectAll(searchPromise) {
  const all = new Map();
  let data = await searchPromise(null);
  if (data.results) data.results.forEach(p => all.set(p.place_id, p));
  while (data.next_page_token) {
    await delay(2000);
    data = await searchPromise(data.next_page_token);
    if (data.results) data.results.forEach(p => all.set(p.place_id, p));
  }
  return all;
}

// ──────────────────────────────────────────────
// STEP 3: Categories to search
// ──────────────────────────────────────────────
const SEARCHES = [
  { industry: "φαρμακείο",        queries: ["φαρμακείο Καστοριά", "pharmacy Kastoria Greece"], nearby: { type: "pharmacy", kw: "φαρμακείο" } },
  { industry: "airbnb",           queries: ["airbnb Καστοριά", "ενοικιαζόμενα δωμάτια Καστοριά", "κατάλυμα Καστοριά"] },
  { industry: "εστίαση",          queries: ["γυράδικο Καστοριά", "σουβλατζίδικο Καστοριά", "fast food Καστοριά", "ταβέρνα Καστοριά", "εστιατόριο Καστοριά"], nearby: { type: "restaurant", kw: "εστίαση" } },
  { industry: "καφετέρια",        queries: ["καφετέρια Καστοριά take away", "καφές Καστοριά", "coffee Kastoria"], nearby: { type: "cafe", kw: "καφέ" } },
  { industry: "ξενοδοχείο",       queries: ["ξενοδοχείο Καστοριά", "hotel Kastoria Greece"], nearby: { type: "lodging", kw: "ξενοδοχείο" } },
  { industry: "οδοντιατρείο",     queries: ["οδοντίατρος Καστοριά", "οδοντιατρείο Καστοριά"] },
  { industry: "κομμωτήριο",       queries: ["κομμωτήριο Καστοριά", "κέντρο αισθητικής Καστοριά"], nearby: { type: "beauty_salon", kw: "κομμωτήριο" } },
  { industry: "φυσιοθεραπευτής",  queries: ["φυσιοθεραπεία Καστοριά", "φυσιοθεραπευτής Καστοριά"] },
  { industry: "λογιστής",         queries: ["λογιστικό γραφείο Καστοριά", "λογιστής Καστοριά"] },
  { industry: "δικηγόρος",        queries: ["δικηγόρος Καστοριά", "δικηγορικό γραφείο Καστοριά"] },
];

async function searchCategory(cat) {
  const all = new Map();
  
  for (const q of cat.queries) {
    await delay(500);
    const data = await collectAll((pt) => textSearch(q, pt));
    data.forEach((v, k) => all.set(k, v));
  }
  
  if (cat.nearby) {
    await delay(500);
    const data = await collectAll((pt) => nearbySearch(KASTORIA_LAT, KASTORIA_LNG, 5000, cat.nearby.type, cat.nearby.kw, pt));
    data.forEach((v, k) => all.set(k, v));
  }
  
  return all;
}

// ──────────────────────────────────────────────
// STEP 4: Insert into Supabase
// ──────────────────────────────────────────────
async function insertProspect(item) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/sgk_prospects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(item)
  });
  return r.status;
}

// ──────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────
async function run() {
  // Step 1: Delete placeholders
  await deletePlaceholders();

  let totalInserted = 0;
  let totalSkipped = 0;

  for (const cat of SEARCHES) {
    console.log(`\n🔍 Searching: ${cat.industry.toUpperCase()}`);
    const places = await searchCategory(cat);
    console.log(`  Found ${places.size} unique places`);

    let catInserted = 0;
    let idx = 0;
    
    for (const [placeId, place] of places) {
      idx++;
      await delay(150);
      const details = await getPlaceDetails(placeId);
      
      const phone = details.formatted_phone_number || details.international_phone_number || null;
      const website = details.website || null;
      
      // Only insert if we have phone OR website (skip if nothing useful)
      if (!phone && !website) continue;
      
      // Create a deterministic fake email based on name (required field NOT NULL)
      const slug = place.name.toLowerCase()
        .replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "").substring(0, 30);
      const fakeEmail = `lead_${slug}_${placeId.substring(0, 6)}@noemail.gr`;

      const status = await insertProspect({
        business_name: place.name,
        email: fakeEmail,
        phone: phone,
        city: "Καστοριά",
        industry: cat.industry,
        status: "pending"
      });

      if (status === 201) {
        catInserted++;
        totalInserted++;
        console.log(`  ✅ [${idx}] ${place.name} | ☎️ ${phone || "-"} | 🌐 ${website ? "yes" : "-"}`);
      } else if (status === 409) {
        totalSkipped++;
      }
    }
    console.log(`  → Inserted ${catInserted} for ${cat.industry}`);
    await delay(1000);
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`✅ TOTAL: Inserted ${totalInserted} prospects | Skipped ${totalSkipped} duplicates`);
  console.log(`Note: Entries without phone/website were skipped.`);
  console.log(`Entries have placeholder emails — update with real ones via Admin.`);
}

run().catch(console.error);
