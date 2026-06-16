// Insert the 29 pharmacies found by Google Places API into Supabase
// Fixed: removed 'category' column that doesn't exist in schema

const SUPABASE_URL = "https://xrmvingehhiymchoggka.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

const pharmacies = [
  { business_name: "ΚΑΛΕΝΤΕΡΙΔΟΥ ΠΟΛΥΞΕΝΗ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "Φαρμακείο Ρούλα Πασχάλη", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "ΦΑΡΜΑΚΕΙΑ ΓΡΗΓΟΡΙΑΔΗ ΟΕ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "ΚΩΝΣΤΑΝΤΙΝΟΣ ΜΠΑΙΡΑΚΤΑΡΗΣ ΟΕ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "ΣΚΛΑΒΑΚΗ ΕΛΙΣΣΑΒΕΤ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "ΦΑΡΜΑΚΕΙΟ ΕΥΑΓΓΕΛΟΥ ΜΙΡΚΟΠΟΥΛΟΥ Ο.Ε.", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "Φαρμακείο Όλγα Καλύβα", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "ΦΑΡΜΑΚΕΙΟ ΗΡΓΗ ΕΥΓΕΝΙΑ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "ΤΖΩΤΖΑ Θ.-ΤΑΛΙΔΟΥ ΟΕ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "Φαρμακείο Κοσμά Πασχάλη", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "ΕΝΩΣΗ ΑΓΡΟΤ. ΣΥΝΕΤ. ΝΟΜΟΥ ΚΑΣΤΟΡΙΑΣ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "ΤΟΜΤΖΙΔΟΥ ΣΟΦΙΑ ΠΑΣΧΑΛΗΣ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "ΔΕΛΗΠΟΡΑΝΙΔΟΥ ΣΟΦΙΑ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "ΣΑΒΒΟΠΟΥΛΟΣ ΙΩΑΝΝΗΣ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "Φαρμακείο ΛΕΒΑΝΤΗΣ ΚΩΝΣΤΑΝΤΙΝΟΣ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "Γεώργιος Ακριτοβ ΕΕ - Φαρμακείο Καστοριά", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "ΓΙΟΒΑΝΟΠΟΥΛΟΥ ΕΙΡΗΝΗ ΛΕΩΝΙΔΑΣ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "Αλεξάνδρα Παρλαπάνη - Φαρμακείο", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "ΓΕΩΡΓΙΟΣ ΜΙΝΤΖΙΑΣ ΤΟΥ ΧΡΗΣΤΟΥ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "Τσαροβίνα Θωμαΐς Χ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places (Μανιάκοι)" },
  { business_name: "ΦΑΡΜΑΚΕΙΟ ΜΑΡΙΑ ΠΑΠΑΔΟΠΟΥΛΟΥ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "ΦΑΡΜΑΚΕΙΟ ΚΑΤΣΑΝΟΥ ΒΑΣΙΛΙΚΗ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "Σαμαράς Ι. Γεώργιος", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "Φαρμακείο Ζιώγου Γεώργιος", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "ΕΥΑΓΓΕΛΟΣ ΜΠΑΖΙΝΑΣ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places (Μανιάκοι)" },
  { business_name: "ΦΑΡΜΑΚΕΙΟ Ζέζος Πέτρος", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places (Νέα Λεύκη)" },
  { business_name: "Φαρμακείο ΠΑΝΑΓΙΩΤΙΔΟΥ Δ ΜΑΡΙΑ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places (Χλόη)" },
  { business_name: "ΠΡΩΤΟΓΕΡΟΣ ΠΕΤΡΟΣ", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places" },
  { business_name: "Φαρμακείο Δούλης Δημήτριος Π.", city: "Καστοριά", phone: null, website: null, email: null, notes: "Φαρμακείο - Google Places (Δισπηλιό)" },
];

async function run() {
  console.log(`Inserting ${pharmacies.length} pharmacies into Supabase...`);
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const item of pharmacies) {
    const payload = {
      business_name: item.business_name,
      contact_name: null,
      email: item.email,
      phone: item.phone,
      website: item.website,
      city: item.city,
      source: "google_places",
      status: "new",
      notes: item.notes
    };

    const r = await fetch(`${SUPABASE_URL}/rest/v1/sgk_prospects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(payload)
    });

    if (r.ok) {
      successCount++;
      console.log(`  ✅ Inserted: ${item.business_name}`);
    } else if (r.status === 409) {
      skipCount++;
      console.log(`  ⏭️  Skip (duplicate): ${item.business_name}`);
    } else {
      errorCount++;
      const err = await r.text();
      console.log(`  ❌ Error: ${item.business_name} - ${err}`);
    }
    await delay(100);
  }

  console.log(`\n✅ Done! Inserted: ${successCount}, Skipped (dup): ${skipCount}, Errors: ${errorCount}`);
}

run().catch(console.error);
