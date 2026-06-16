// Google Places API - Find pharmacies in Kastoria
// Uses Text Search + Nearby Search to maximize results

const GOOGLE_API_KEY = "AIzaSyCziVm_nQ5oDtySLhbzjs1m45fMJDvTINM";
const SUPABASE_URL = "https://xrmvingehhiymchoggka.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";

// Kastoria center coordinates
const KASTORIA_LAT = 40.5195;
const KASTORIA_LNG = 21.2682;

async function textSearch(query, pageToken = null) {
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&language=el`;
  if (pageToken) url += `&pagetoken=${pageToken}`;
  
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function nearbySearch(lat, lng, radius, type, keyword, pageToken = null) {
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&keyword=${encodeURIComponent(keyword)}&key=${GOOGLE_API_KEY}&language=el`;
  if (pageToken) url += `&pagetoken=${pageToken}`;
  
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function getPlaceDetails(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,email&key=${GOOGLE_API_KEY}&language=el`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result || {};
}

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getAllResults(searchFn) {
  const allResults = [];
  let data = await searchFn(null);
  
  if (data.results) allResults.push(...data.results);
  
  // Handle pagination
  while (data.next_page_token) {
    console.log("  Getting next page...");
    await delay(2000); // Google requires delay before next_page_token is active
    data = await searchFn(data.next_page_token);
    if (data.results) allResults.push(...data.results);
  }
  
  return allResults;
}

async function run() {
  console.log("🔍 Searching for pharmacies in Kastoria via Google Places API...\n");
  
  const allPlaces = new Map(); // placeId -> place
  
  // Search 1: Text search - φαρμακείο Καστοριά
  console.log("Search 1: φαρμακείο Καστοριά");
  const s1 = await getAllResults((pt) => textSearch("φαρμακείο Καστοριά", pt));
  s1.forEach(p => allPlaces.set(p.place_id, p));
  console.log(`  Found ${s1.length} results (total unique: ${allPlaces.size})`);
  
  await delay(1000);
  
  // Search 2: Text search - pharmacy Kastoria Greece
  console.log("Search 2: pharmacy Kastoria Greece");
  const s2 = await getAllResults((pt) => textSearch("pharmacy Kastoria Greece", pt));
  s2.forEach(p => allPlaces.set(p.place_id, p));
  console.log(`  Found ${s2.length} results (total unique: ${allPlaces.size})`);
  
  await delay(1000);
  
  // Search 3: Nearby search - pharmacy type around Kastoria center
  console.log("Search 3: Nearby pharmacy search (3km radius)");
  const s3 = await getAllResults((pt) => nearbySearch(KASTORIA_LAT, KASTORIA_LNG, 3000, "pharmacy", "φαρμακείο", pt));
  s3.forEach(p => allPlaces.set(p.place_id, p));
  console.log(`  Found ${s3.length} results (total unique: ${allPlaces.size})`);
  
  await delay(1000);
  
  // Search 4: Nearby search - drugstore
  console.log("Search 4: Nearby drugstore search (5km radius)");
  const s4 = await getAllResults((pt) => nearbySearch(KASTORIA_LAT, KASTORIA_LNG, 5000, "drugstore", "φαρμακείο", pt));
  s4.forEach(p => allPlaces.set(p.place_id, p));
  console.log(`  Found ${s4.length} results (total unique: ${allPlaces.size})`);

  await delay(1000);

  // Search 5: Text search with different keywords
  console.log("Search 5: φαρμακεία Καστοριάς");
  const s5 = await getAllResults((pt) => textSearch("φαρμακεία Καστοριάς", pt));
  s5.forEach(p => allPlaces.set(p.place_id, p));
  console.log(`  Found ${s5.length} results (total unique: ${allPlaces.size})`);
  
  console.log(`\n✅ Total unique pharmacies found: ${allPlaces.size}`);
  
  // Get details for each place
  const pharmacies = [];
  let i = 0;
  for (const [placeId, place] of allPlaces) {
    i++;
    console.log(`\nGetting details ${i}/${allPlaces.size}: ${place.name}`);
    
    await delay(200);
    const details = await getPlaceDetails(placeId);
    
    const pharmacy = {
      business_name: place.name,
      address: details.formatted_address || place.formatted_address || place.vicinity || "",
      phone: details.formatted_phone_number || "",
      website: details.website || "",
      email: details.email || "",
      city: "Καστοριά",
      category: "Φαρμακείο",
      source: "google_places",
      notes: `Rating: ${place.rating || "N/A"}, Place ID: ${placeId}`
    };
    
    pharmacies.push(pharmacy);
    console.log(`  Phone: ${pharmacy.phone || "none"} | Website: ${pharmacy.website || "none"}`);
  }
  
  console.log("\n\n📋 ALL PHARMACIES FOUND:");
  console.log("=".repeat(80));
  pharmacies.forEach((p, idx) => {
    console.log(`\n${idx + 1}. ${p.business_name}`);
    console.log(`   Address: ${p.address}`);
    console.log(`   Phone: ${p.phone || "N/A"}`);
    console.log(`   Website: ${p.website || "N/A"}`);
    console.log(`   Email: ${p.email || "N/A"}`);
  });
  
  // Insert into Supabase
  console.log("\n\n💾 Inserting into Supabase (upsert on business_name + city)...");
  
  const payload = pharmacies.map(p => ({
    business_name: p.business_name,
    contact_name: null,
    email: p.email || null,
    phone: p.phone || null,
    website: p.website || null,
    city: p.city,
    category: p.category,
    source: p.source,
    status: "new",
    notes: p.notes
  }));
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/sgk_prospects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Prefer": "resolution=merge-duplicates,return=representation",
      "on_conflict": "business_name,city"
    },
    body: JSON.stringify(payload)
  });
  
  const result = await response.json();
  
  if (response.ok) {
    console.log(`✅ Successfully inserted/updated ${Array.isArray(result) ? result.length : 0} records`);
  } else {
    console.error("❌ Error inserting:", JSON.stringify(result, null, 2));
    
    // Try inserting one by one to skip duplicates
    console.log("\nTrying individual inserts...");
    let successCount = 0;
    for (const item of payload) {
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
      if (r.ok || r.status === 409) {
        successCount++;
      } else {
        const err = await r.text();
        console.log(`  Skip: ${item.business_name} - ${err}`);
      }
      await delay(100);
    }
    console.log(`✅ Inserted/skipped ${successCount}/${payload.length} records`);
  }
}

run().catch(console.error);
