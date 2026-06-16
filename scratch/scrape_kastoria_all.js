import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xrmvingehhiymchoggka.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FREE_EMAIL_DOMAINS = [
  "gmail.com","yahoo.gr","yahoo.com","hotmail.com","hotmail.gr",
  "outlook.com","outlook.gr","live.com","otenet.gr","hol.gr",
  "forthnet.gr","ath.forthnet.gr","mail.com","icloud.com","me.com"
];

// ─── CATEGORIES TO SEARCH ───────────────────────────────────────────────────
const CATEGORIES = [
  {
    industry: "φαρμακείο",
    terms: ["φαρμακείο", "φαρμακεία"],
  },
  {
    industry: "airbnb",
    terms: ["airbnb", "ενοικιαζόμενα δωμάτια", "κατάλυμα", "διαμέρισμα ενοικίαση"],
  },
  {
    industry: "εστίαση",
    terms: ["γυράδικο", "σουβλατζίδικο", "ταβέρνα", "εστιατόριο", "pizzeria", "pizza", "delivery φαγητό"],
  },
  {
    industry: "καφετέρια",
    terms: ["καφετέρια", "καφέ", "coffee shop", "take away καφές", "μπουγατσάδικο"],
  },
  {
    industry: "ξενοδοχείο",
    terms: ["ξενοδοχείο", "hotel"],
  },
  {
    industry: "οδοντιατρείο",
    terms: ["οδοντιατρείο", "οδοντίατρος"],
  },
  {
    industry: "κομμωτήριο",
    terms: ["κομμωτήριο", "κομμωτής", "barber", "κέντρο αισθητικής", "nail bar"],
  },
  {
    industry: "φυσιοθεραπεία",
    terms: ["φυσιοθεραπεία", "φυσιοθεραπευτής"],
  },
  {
    industry: "λογιστής",
    terms: ["λογιστής", "λογιστικό γραφείο", "φοροτεχνικός"],
  },
  {
    industry: "δικηγόρος",
    terms: ["δικηγόρος", "δικηγορικό γραφείο"],
  },
];

const EMAIL_DOMAINS_TO_SEARCH = ["gmail.com", "yahoo.gr", "hotmail.com", "outlook.com"];
const CITY = "Καστοριά";

// ─── HELPERS ────────────────────────────────────────────────────────────────
function extractEmails(text) {
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  const found = text.match(emailRegex) || [];
  return Array.from(new Set(found.map(e => e.toLowerCase())));
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
        let base64Part = uParam.startsWith("a1") ? uParam.substring(2) : uParam;
        base64Part = base64Part.replace(/-/g, "+").replace(/_/g, "/");
        while (base64Part.length % 4 !== 0) base64Part += "=";
        return Buffer.from(base64Part, "base64").toString("utf-8");
      }
    }
  } catch {}
  return cleanUrl;
}

function cleanTitle(title) {
  return title
    .replace(/<[^>]*>/g, "")
    .replace(/\s*[-|›»•]\s*.*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function bingSearch(query) {
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=20`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "el-GR,el;q=0.9,en;q=0.8",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Referer": "https://www.bing.com/",
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
      const title = cleanTitle(titleMatch ? titleMatch[2] : "");

      const snippetMatch = block.match(/<p>([\s\S]*?)<\/p>/) ||
                           block.match(/<div class="[^"]*b_caption[^"]*">([\s\S]*?)<\/div>/) ||
                           block.match(/<div[^>]+class="[^"]*caption[^>]*>([\s\S]*?)<\/div>/);
      const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, "") : "";

      if (title || snippet) results.push({ title, snippet, link });
    }
    return results;
  } catch (err) {
    console.error("  Bing error:", err.message);
    return [];
  }
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function run() {
  const allProspectsMap = new Map(); // email -> prospect

  for (const cat of CATEGORIES) {
    console.log(`\n${"═".repeat(60)}`);
    console.log(`🔍 ΚΑΤΗΓΟΡΙΑ: ${cat.industry.toUpperCase()} | Πόλη: ${CITY}`);
    console.log(`${"═".repeat(60)}`);

    for (const term of cat.terms) {
      for (const emailDomain of EMAIL_DOMAINS_TO_SEARCH) {
        const query = `"${emailDomain}" "${term}" "${CITY}"`;
        console.log(`\n  → Bing: ${query}`);
        
        const results = await bingSearch(query);
        console.log(`    Αποτελέσματα: ${results.length}`);

        for (const r of results) {
          const combined = `${r.title} ${r.snippet}`;
          const emails = extractEmails(combined);
          const phone = extractPhone(combined);

          for (const email of emails) {
            const domain = email.split("@")[1];
            if (!FREE_EMAIL_DOMAINS.includes(domain)) continue;
            if (allProspectsMap.has(email)) continue; // already found

            // Clean business name
            let bizName = r.title || `${cat.industry} ${CITY}`;
            bizName = bizName.substring(0, 120).trim();
            if (!bizName || bizName.length < 3) bizName = `${cat.industry} ${CITY}`;

            allProspectsMap.set(email, {
              business_name: bizName,
              email: email,
              phone: phone || null,
              city: CITY,
              industry: cat.industry,
              status: "pending"
            });

            console.log(`    ✅ ${bizName} | ${email} | ☎️ ${phone || "-"}`);
          }
        }

        await delay(1200); // Rate limit
      }
    }

    console.log(`\n  → Σύνολο leads μέχρι τώρα: ${allProspectsMap.size}`);
  }

  // ─── SAVE TO SUPABASE ──────────────────────────────────────────────────────
  const finalLeads = Array.from(allProspectsMap.values());
  console.log(`\n${"═".repeat(60)}`);
  console.log(`✅ Scraping ολοκληρώθηκε! Βρέθηκαν ${finalLeads.length} unique leads`);
  console.log(`${"═".repeat(60)}`);

  if (finalLeads.length === 0) {
    console.log("Δεν βρέθηκαν leads.");
    return;
  }

  console.log(`\n💾 Αποθήκευση στη Supabase...`);
  let saved = 0;
  let skipped = 0;

  for (const prospect of finalLeads) {
    const { data, error } = await supabase
      .from("sgk_prospects")
      .upsert([prospect], { onConflict: "email" })
      .select();

    if (error) {
      console.log(`  ⚠️  ${prospect.email}: ${error.message}`);
    } else if (data && data.length > 0) {
      saved++;
    } else {
      skipped++;
    }
    await delay(80);
  }

  console.log(`\n🎉 ΤΕΛΟΣ! Αποθηκεύτηκαν: ${saved} | Υπήρχαν ήδη: ${skipped}`);
  console.log(`📊 Σύνολο prospects στο ${CITY}: ${finalLeads.length}`);
}

run().catch(console.error);
