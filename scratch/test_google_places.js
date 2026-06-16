import fs from "fs";

// Manually parse .env
const envContent = fs.readFileSync(".env", "utf-8");
const match = envContent.match(/GOOGLE_MAPS_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : null;

console.log("Using API Key:", apiKey ? `${apiKey.substring(0, 8)}...` : "NONE");

async function test() {
  if (!apiKey) {
    console.error("No GOOGLE_MAPS_API_KEY found in .env");
    return;
  }
  
  const query = "οδοντιατρείο Ιωάννινα";
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
    
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response data keys:", Object.keys(data));
    if (data.places) {
      console.log(`Found ${data.places.length} places!`);
      console.log("First place:", JSON.stringify(data.places[0], null, 2));
    } else {
      console.log("No places found. Full response:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Error during Places API call:", err);
  }
}

test();
