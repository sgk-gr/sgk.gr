import fs from "fs";
import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials from .env
const envContent = fs.readFileSync(".env", "utf-8");
const supabaseUrlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const supabaseUrl = supabaseUrlMatch ? supabaseUrlMatch[1].trim() : null;
const supabaseKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const supabaseAnonKey = supabaseKeyMatch ? supabaseKeyMatch[1].trim() : null;

const mapsKeyMatch = envContent.match(/GOOGLE_MAPS_API_KEY=(.+)/);
const mapsApiKey = mapsKeyMatch ? mapsKeyMatch[1].trim() : null;

if (!supabaseUrl || !supabaseAnonKey || !mapsApiKey) {
  console.error("Missing credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function extractEmails(text) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const found = text.match(emailRegex);
  return found ? Array.from(new Set(found.map(email => email.toLowerCase()))) : [];
}

async function searchViaGooglePlaces(city, industry, apiKey) {
  const query = `${industry} ${city}`;
  const url = `https://places.googleapis.com/v1/places:searchText?key=${apiKey}`;
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.types"
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "el"
      })
    });
    
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Places API returned ${res.status}: ${errText}`);
    }
    
    const data = await res.json();
    if (!data.places) return [];
    
    return data.places.map((p) => ({
      name: p.displayName?.text || "",
      phone: p.nationalPhoneNumber || null,
      website: p.websiteUri || null,
      types: p.types || []
    }));
  } catch (err) {
    console.error("Google Places search failed:", err);
    return [];
  }
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
      let title = titleMatch ? titleMatch[2] : "";
      title = title.replace(/<[^>]*>/g, "");
      
      const snippetMatch = block.match(/<p>([\s\S]*?)<\/p>/) || 
                           block.match(/<div class="[^"]*b_caption[^"]*">([\s\S]*?)<\/div>/) ||
                           block.match(/<div class="[^"]*b_text[^"]*">([\s\S]*?)<\/div>/);
      let snippet = snippetMatch ? snippetMatch[1] : "";
      snippet = snippet.replace(/<[^>]*>/g, "");
      
      if (title || snippet) {
        results.push({ title, snippet, link: rawLink });
      }
    }
    return results;
  } catch (err) {
    console.error("Bing scrape failed", err);
    return [];
  }
}

async function findEmailForPlace(name, website, city) {
  if (website) {
    try {
      console.log(`- Fetching website for email: ${website}...`);
      const res = await fetch(website, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
        },
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        const html = await res.text();
        const emails = extractEmails(html);
        if (emails.length > 0) {
          console.log(`  Found email on website: ${emails[0]}`);
          return emails[0];
        }
      }
    } catch (e) {
      console.log(`  Failed to scrape website directly.`);
    }
  }
  
  // Try fallback search
  const searchQuery = `"${name}" "${city}" email`;
  try {
    console.log(`- Searching Bing for email: ${searchQuery}...`);
    const searchResults = await searchViaBingScrape(searchQuery);
    for (const r of searchResults) {
      const combinedText = `${r.title} ${r.snippet}`;
      const emails = extractEmails(combinedText);
      if (emails.length > 0) {
        console.log(`  Found email on search fallback: ${emails[0]}`);
        return emails[0];
      }
    }
  } catch (err) {
    console.error(`  Failed search email fallback:`, err.message);
  }
  
  return null;
}

async function run() {
  const city = "Καστοριά";
  const industry = "φαρμακείο";
  
  console.log(`Searching for ${industry} in ${city} via Google Places...`);
  const places = await searchViaGooglePlaces(city, industry, mapsApiKey);
  console.log(`Found ${places.length} places. Extracting emails...`);
  
  const prospects = [];
  
  for (const place of places) {
    console.log(`\nProcessing: ${place.name}`);
    const email = await findEmailForPlace(place.name, place.website, city);
    if (email) {
      prospects.push({
        business_name: place.name,
        email: email,
        phone: place.phone,
        city: city,
        industry: industry,
        status: "pending"
      });
    } else {
      console.log(`  No email found.`);
    }
    
    // Tiny delay between scraping/queries to be polite
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log(`\nSaving ${prospects.length} prospects with emails to database...`);
  let saved = 0;
  for (const p of prospects) {
    const { data, error } = await supabase
      .from("sgk_prospects")
      .upsert([p], { onConflict: "email" })
      .select();
      
    if (error) {
      console.error(`Error saving ${p.email}:`, error.message);
    } else {
      console.log(`Saved: ${p.business_name} (${p.email})`);
      saved++;
    }
  }
  console.log(`\nAll done! Saved ${saved} pharmacies in Kastoria.`);
}

run();
