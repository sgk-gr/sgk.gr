const SUPABASE_URL = "https://xrmvingehhiymchoggka.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";

const headers = {
  "apikey": KEY,
  "Authorization": "Bearer " + KEY,
  "Prefer": "return=representation"
};

async function deleteWhere(filter, label) {
  const url = SUPABASE_URL + "/rest/v1/sgk_prospects?" + filter;
  const r = await fetch(url, { method: "DELETE", headers });
  const d = await r.json();
  const count = Array.isArray(d) ? d.length : 0;
  console.log(`  ${label}: ${count} deleted`);
  return count;
}

async function run() {
  console.log("🗑️  Deleting ALL placeholder/fake email records...\n");

  let total = 0;
  total += await deleteWhere("email=like.*%40kastoria.pharmacy", "@kastoria.pharmacy");
  total += await deleteWhere("email=like.*%40noemail.gr", "@noemail.gr");
  total += await deleteWhere("email=like.noemail_*", "noemail_ prefix");
  total += await deleteWhere("email=like.lead_*%40noemail.gr", "lead_*@noemail.gr");

  console.log(`\n✅ Total deleted: ${total}`);

  // Count remaining
  const r2 = await fetch(SUPABASE_URL + "/rest/v1/sgk_prospects?select=email&limit=1000", {
    headers: { "apikey": KEY, "Authorization": "Bearer " + KEY }
  });
  const remaining = await r2.json();
  console.log(`📊 Records remaining in database: ${Array.isArray(remaining) ? remaining.length : "?"}`);

  if (Array.isArray(remaining)) {
    const fakes = remaining.filter(r => 
      r.email && (
        r.email.includes("@kastoria.pharmacy") ||
        r.email.includes("@noemail.gr") ||
        r.email.startsWith("noemail_") ||
        r.email.startsWith("lead_")
      )
    );
    if (fakes.length > 0) {
      console.log(`\n⚠️  Still found ${fakes.length} fake emails! Deleting individually...`);
      for (const rec of fakes) {
        const url = SUPABASE_URL + "/rest/v1/sgk_prospects?email=eq." + encodeURIComponent(rec.email);
        await fetch(url, { method: "DELETE", headers });
        console.log(`  Deleted: ${rec.email}`);
      }
    } else {
      console.log("✅ No fake emails remaining!");
    }
  }
}

run().catch(console.error);
