// Insert 29 pharmacies from Google Places into Supabase sgk_prospects
// Schema: id, business_name, email (NOT NULL UNIQUE), phone, city, industry, status, sent_at, created_at
// Using placeholder emails for entries without real emails

const SUPABASE_URL = "https://xrmvingehhiymchoggka.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Normalize name to generate a unique placeholder email
function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[αά]/g, "a").replace(/[εέ]/g, "e").replace(/[ηή]/g, "i")
    .replace(/[ιίϊΐ]/g, "i").replace(/[οό]/g, "o").replace(/[υύϋΰ]/g, "y")
    .replace(/[ωώ]/g, "o").replace(/[θ]/g, "th").replace(/[φ]/g, "f")
    .replace(/[χ]/g, "ch").replace(/[ψ]/g, "ps").replace(/[ξ]/g, "x")
    .replace(/[κ]/g, "k").replace(/[λ]/g, "l").replace(/[μ]/g, "m")
    .replace(/[ν]/g, "n").replace(/[π]/g, "p").replace(/[ρ]/g, "r")
    .replace(/[σς]/g, "s").replace(/[τ]/g, "t").replace(/[β]/g, "v")
    .replace(/[γ]/g, "g").replace(/[δ]/g, "d").replace(/[ζ]/g, "z")
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .substring(0, 40);
}

const pharmacies = [
  "ΚΑΛΕΝΤΕΡΙΔΟΥ ΠΟΛΥΞΕΝΗ",
  "Φαρμακείο Ρούλα Πασχάλη",
  "ΦΑΡΜΑΚΕΙΑ ΓΡΗΓΟΡΙΑΔΗ ΟΕ",
  "ΚΩΝΣΤΑΝΤΙΝΟΣ ΜΠΑΙΡΑΚΤΑΡΗΣ ΟΕ",
  "ΣΚΛΑΒΑΚΗ ΕΛΙΣΣΑΒΕΤ",
  "ΦΑΡΜΑΚΕΙΟ ΕΥΑΓΓΕΛΟΥ ΜΙΡΚΟΠΟΥΛΟΥ Ο.Ε.",
  "Φαρμακείο Όλγα Καλύβα",
  "ΦΑΡΜΑΚΕΙΟ ΗΡΓΗ ΕΥΓΕΝΙΑ",
  "ΤΖΩΤΖΑ Θ.-ΤΑΛΙΔΟΥ ΟΕ",
  "Φαρμακείο Κοσμά Πασχάλη",
  "ΤΟΜΤΖΙΔΟΥ ΣΟΦΙΑ ΠΑΣΧΑΛΗΣ",
  "ΔΕΛΗΠΟΡΑΝΙΔΟΥ ΣΟΦΙΑ",
  "ΣΑΒΒΟΠΟΥΛΟΣ ΙΩΑΝΝΗΣ",
  "Φαρμακείο ΛΕΒΑΝΤΗΣ ΚΩΝΣΤΑΝΤΙΝΟΣ",
  "Γεώργιος Ακριτοβ ΕΕ - Φαρμακείο Καστοριά",
  "ΓΙΟΒΑΝΟΠΟΥΛΟΥ ΕΙΡΗΝΗ ΛΕΩΝΙΔΑΣ",
  "Αλεξάνδρα Παρλαπάνη - Φαρμακείο",
  "ΓΕΩΡΓΙΟΣ ΜΙΝΤΖΙΑΣ ΤΟΥ ΧΡΗΣΤΟΥ",
  "Τσαροβίνα Θωμαΐς Χ",
  "ΦΑΡΜΑΚΕΙΟ ΜΑΡΙΑ ΠΑΠΑΔΟΠΟΥΛΟΥ",
  "ΦΑΡΜΑΚΕΙΟ ΚΑΤΣΑΝΟΥ ΒΑΣΙΛΙΚΗ",
  "Σαμαράς Ι. Γεώργιος",
  "Φαρμακείο Ζιώγου Γεώργιος",
  "ΕΥΑΓΓΕΛΟΣ ΜΠΑΖΙΝΑΣ",
  "ΦΑΡΜΑΚΕΙΟ Ζέζος Πέτρος",
  "ΠΡΩΤΟΓΕΡΟΣ ΠΕΤΡΟΣ",
  "Φαρμακείο Δούλης Δημήτριος Π.",
];

async function run() {
  console.log(`Inserting ${pharmacies.length} pharmacies into Supabase...`);
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const name of pharmacies) {
    const slug = toSlug(name);
    const placeholderEmail = `noemail_${slug}@kastoria.pharmacy`;
    
    const payload = {
      business_name: name,
      email: placeholderEmail,
      phone: null,
      city: "Καστοριά",
      industry: "φαρμακείο",
      status: "pending"
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
      console.log(`  ✅ Inserted: ${name}`);
    } else if (r.status === 409) {
      skipCount++;
      console.log(`  ⏭️  Skip (duplicate): ${name}`);
    } else {
      errorCount++;
      const err = await r.text();
      console.log(`  ❌ Error: ${name} - ${err}`);
    }
    await delay(100);
  }

  console.log(`\n✅ Done! Inserted: ${successCount}, Skipped (dup): ${skipCount}, Errors: ${errorCount}`);
  console.log(`\nNote: Pharmacies without emails have placeholder emails (noemail_...@kastoria.pharmacy)`);
  console.log(`You can update their real emails later from the Admin panel.`);
}

run().catch(console.error);
