import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xrmvingehhiymchoggka.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const EXCLUDED_DOMAINS = [
  'gemi.gr', 'gov.gr', 'businessportal.gr', 'sentry.io',
  'example.com', 'support', 'noreply', 'no-reply', 'kee.gr', 'uhc.gr'
];

// Helper για τυχαία ανθρωπογενή καθυστέρηση (Human Jitter)
function getRandomDelay(minMs = 1500, maxMs = 3500) {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

async function run() {
  console.log("=======================================================");
  console.log("🛡️ SGK GEMI AUTO SCRAPER (Human-like Stealth Version)");
  console.log("=======================================================\n");

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome' // Χρήση του κανονικού Chrome του υπολογιστή σου
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'el-GR',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  
  console.log("📍 Μετάβαση στο ΓΕΜΗ (publicity.businessportal.gr)...");
  await page.goto("https://publicity.businessportal.gr/", { waitUntil: "networkidle" });

  console.log("\n=======================================================");
  console.log("👉 Κάνε την αναζήτησή σου στο παράθυρο Chrome που άνοιξε.");
  console.log("👉 Μόλις εμφανιστεί η λίστα αποτελεσμάτων (Σελίδα 1), πάτα ENTER στο τερματικό εδώ!");
  console.log("=======================================================\n");

  await new Promise(resolve => process.stdin.once('data', resolve));

  let pageNum = 1;
  let totalSaved = 0;
  let totalDuplicates = 0;
  let totalHasWebsite = 0;
  let totalNoEmail = 0;

  while (true) {
    console.log(`\n📄 --- ΣΑΡΩΣΗ ΣΕΛΙΔΑΣ ${pageNum} ---`);

    // Συλλογή συνδέσμων
    const companyLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return [...new Set(
        links
          .map(a => a.href)
          .filter(href => href && (href.includes('/show/') || href.includes('/company/') || href.includes('/μερίδα/')))
      )];
    });

    console.log(`📋 Βρέθηκαν ${companyLinks.length} επιχειρήσεις στη σελίδα ${pageNum}.`);

    if (companyLinks.length === 0) {
      console.log("⚠️ Δεν βρέθηκαν σύνδεσμοι στη σελίδα. Τερματισμός.");
      break;
    }

    for (let i = 0; i < companyLinks.length; i++) {
      const companyUrl = companyLinks[i];
      console.log(`🔍 [${i + 1}/${companyLinks.length}] Εξέταση: ${companyUrl}`);

      const companyPage = await context.newPage();
      try {
        await companyPage.goto(companyUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
        
        // Τυχαία ανθρωπογενής παύση 1.5 - 3.5 δευτερόλεπτα
        await companyPage.waitForTimeout(getRandomDelay(1500, 3000));

        const details = await companyPage.evaluate((EXCLUDED) => {
          const titleEl = document.querySelector("h1, h2, .company-name, .title");
          let companyName = titleEl ? titleEl.textContent.trim() : "";
          if (!companyName || companyName.length < 3) {
            companyName = document.title.split(/[-|]/)[0].trim();
          }

          const pageHtml = document.body.innerHTML;
          const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
          const matches = pageHtml.match(emailRegex) || [];
          const email = matches.find(e => {
            const lower = e.toLowerCase();
            return !EXCLUDED.some(d => lower.includes(d));
          }) || null;

          let hasWebsite = false;
          const allDivs = document.querySelectorAll('div, tr, p, li');
          for (const div of allDivs) {
            const text = div.innerText || "";
            if (text.includes("Ιστοσελίδα") || text.includes("ιστοσελίδα")) {
              if (text.includes("Δεν βρέθηκε") || text.includes("δεν βρέθηκε")) {
                hasWebsite = false;
              } else {
                const hasLink = div.querySelector('a[href*="http"]');
                if (hasLink || text.includes("http") || text.includes("www.")) {
                  hasWebsite = true;
                }
              }
              break;
            }
          }

          return { companyName, email, hasWebsite };
        }, EXCLUDED_DOMAINS);

        const { companyName, email, hasWebsite } = details;

        if (hasWebsite) {
          console.log(`   ⏩ Παράλειψη: "${companyName}" -> Έχει ήδη ιστοσελίδα.`);
          totalHasWebsite++;
        } else if (!email) {
          console.log(`   ⏩ Παράλειψη: "${companyName}" -> Δεν βρέθηκε email.`);
          totalNoEmail++;
        } else {
          const cleanEmail = email.toLowerCase().trim();
          
          const { data: existing } = await supabase
            .from('sgk_mails')
            .select('id')
            .eq('email', cleanEmail);

          if (existing && existing.length > 0) {
            console.log(`   ⏩ Παράλειψη: "${cleanEmail}" -> Υπάρχει ήδη στη Supabase.`);
            totalDuplicates++;
          } else {
            const nameParts = companyName
              .replace(/ΜΟΝΟΠΡΟΣΩΠΗ|Ι\.Κ\.Ε\.|Ι\.Κ\.Ε|I\.K\.E\.|IKE/gi, "")
              .trim()
              .split(" ");

            const { error } = await supabase.from('sgk_mails').insert({
              email: cleanEmail,
              first_name: nameParts[0] || "",
              last_name: nameParts.slice(1).join(" ") || "",
              company: companyName,
              marketing_consent: true,
              unsubscribe_token: crypto.randomUUID(),
              email_sequence_step: 0,
              unsubscribed: false,
              converted: false
            });

            if (!error) {
              console.log(`   ✅ ΑΠΟΘΗΚΕΥΤΗΚΕ: ${cleanEmail} (${companyName})`);
              totalSaved++;
            } else {
              console.log(`   ❌ Σφάλμα Supabase:`, error.message);
            }
          }
        }

      } catch (err) {
        console.log(`   ⚠️ Σφάλμα φόρτωσης:`, err.message);
      } finally {
        await companyPage.close();
      }
    }

    // Αλλαγή σελίδας
    console.log(`\n➡️ Αναζήτηση κουμπιού Επόμενης Σελίδας (${pageNum} -> ${pageNum + 1})...`);

    let nextClicked = false;

    const locatorCandidates = [
      page.locator('.p-paginator-next'),
      page.locator('.ui-paginator-next'),
      page.locator('[class*="paginator-next"]'),
      page.locator('button:has-text(">")'),
      page.locator('a:has-text(">")'),
      page.locator('li:has-text(">")'),
      page.locator('span:has-text(">")'),
      page.locator('button:has-text("›")'),
      page.locator('a:has-text("›")'),
      page.locator('.pi-chevron-right'),
      page.locator('.pi-angle-right'),
      page.locator('.fa-chevron-right')
    ];

    for (const loc of locatorCandidates) {
      try {
        const count = await loc.count();
        if (count > 0) {
          const first = loc.first();
          if (await first.isVisible()) {
            const isDisabled = await first.evaluate(el => 
              el.disabled || el.hasAttribute('disabled') || el.classList.contains('p-disabled') || el.classList.contains('ui-state-disabled')
            );
            if (!isDisabled) {
              await first.click();
              nextClicked = true;
              console.log(`   ✅ Πατήθηκε το κουμπί επόμενης σελίδας!`);
              break;
            }
          }
        }
      } catch (e) {
        // Ignore
      }
    }

    if (!nextClicked) {
      const nextNum = (pageNum + 1).toString();
      console.log(`   🔍 Δοκιμή κλικ στον αριθμό σελίδας "${nextNum}"...`);
      try {
        const numLoc = page.locator('button, a, span, li').filter({ hasText: new RegExp(`^\\s*${nextNum}\\s*$`) });
        if (await numLoc.count() > 0 && await numLoc.first().isVisible()) {
          await numLoc.first().click();
          nextClicked = true;
          console.log(`   ✅ Πατήθηκε ο αριθμός σελίδας ${nextNum}!`);
        }
      } catch (e) {
        // Ignore
      }
    }

    if (!nextClicked) {
      console.log("░░ Δεν βρέθηκε επόμενη σελίδα. Η σάρωση ολοκληρώθηκε!");
      break;
    }

    pageNum++;
    const delay = getRandomDelay(3500, 6000);
    console.log(`⏳ Ανθρωπογενής αναμονή ${(delay / 1000).toFixed(1)} δευτερολέπτων για τη Σελίδα ${pageNum}...`);
    await page.waitForTimeout(delay);
  }

  console.log("\n=======================================================");
  console.log(`🎉 ΟΛΟΚΛΗΡΩΘΗΚΕ Η ΣΑΡΩΣΗ!`);
  console.log(`💾 Αποθηκεύτηκαν στη Supabase: ${totalSaved}`);
  console.log(`🔁 Παραλείφθηκαν (Διπλότυπα): ${totalDuplicates}`);
  console.log(`🌐 Παραλείφθηκαν (Έχουν Site): ${totalHasWebsite}`);
  console.log(`✉️ Παραλείφθηκαν (Χωρίς Email): ${totalNoEmail}`);
  console.log("=======================================================\n");

  await browser.close();
}

run().catch(err => {
  console.error("❌ Κρίσιμο σφάλμα scraper:", err);
});
