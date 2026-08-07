/**
 * ΓΕΜΗ Official API Scraper - SGK Digital
 * =========================================
 * Χρησιμοποιεί το επίσημο ΓΕΜΗ Open Data API (api_key εγκεκριμένο)
 * Rate limit: 8 requests/min -> κάθε request παίρνει ~8.5 δευτερόλεπτα
 * 
 * Χρήση:
 *   node scripts/gemi_api_scraper.js
 *   node scripts/gemi_api_scraper.js --prefecture 5      (μόνο Αττική)
 *   node scripts/gemi_api_scraper.js --name "φαρμα"      (αναζήτηση ονόματος)
 *   node scripts/gemi_api_scraper.js --limit 500         (μέγιστο 500 leads)
 */

import { createClient } from '@supabase/supabase-js';

// ========================
// ΡΥΘΜΙΣΕΙΣ
// ========================
const GEMI_API_KEY = '1QV0mFBoWsaprgiphMaBKEANZL0tRCc5';
const GEMI_API_BASE = 'https://opendata-api.businessportal.gr/api/opendata/v1';
const SUPABASE_URL = 'https://xrmvingehhiymchoggka.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q';

// Rate limit: 8 req/min -> 7500ms μεταξύ requests (ασφαλές περιθώριο)
const DELAY_MS = 7500;
const PAGE_SIZE = 200; // max επιτρεπτό από το API

// Φίλτρα που θέλουμε να αγνοούμε (κρατικές, επιμελητήρια κλπ)
const IGNORED_DOMAINS = [
  'uhc.gr', 'kee.gr', 'mindev.gov.gr', 'businessportal.gr',
  'gov.gr', 'gsis.gr', 'minfin.gr', 'facebook.com', 'twitter.com',
  'linkedin.com', 'youtube.com', 'instagram.com', 'gmail.com', 'hotmail.com',
  'yahoo.gr', 'yahoo.com', 'outlook.com', 'live.com', 'windowslive.com'
];

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ========================
// ΒΟΗΘΗΤΙΚΕΣ ΣΥΝΑΡΤΗΣΕΙΣ
// ========================

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function isPersonalEmail(email) {
  if (!email) return true;
  const domain = email.split('@')[1]?.toLowerCase() || '';
  return IGNORED_DOMAINS.some(d => domain.includes(d));
}

function hasOfficialWebsite(url) {
  if (!url) return false;
  const domain = url.toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
  return !IGNORED_DOMAINS.some(d => domain.includes(d)) && domain.length > 3;
}

async function apiGet(endpoint, params = {}) {
  const url = new URL(`${GEMI_API_BASE}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.forEach(item => url.searchParams.append(k, item));
    } else {
      url.searchParams.set(k, v);
    }
  });

  const res = await fetch(url.toString(), {
    headers: {
      'api_key': GEMI_API_KEY,
      'Accept': 'application/json'
    }
  });

  if (res.status === 429) {
    console.log('  ⚠️  Rate limit! Περιμένω 60 δευτερόλεπτα...');
    await sleep(60000);
    return apiGet(endpoint, params);
  }

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

async function getExistingEmails() {
  const { data, error } = await supabase
    .from('sgk_mails')
    .select('email');
  
  if (error) throw error;
  const set = new Set();
  (data || []).forEach(r => r.email && set.add(r.email.toLowerCase().trim()));
  return set;
}

async function saveToSupabase(company, existingEmails) {
  const email = (company.email || '').toLowerCase().trim();
  
  // Αγνοούμε αν δεν έχει email
  if (!email) return { result: 'no_email' };
  
  // Αγνοούμε personal emails (gmail, yahoo, κλπ)
  if (isPersonalEmail(email)) return { result: 'personal_email' };
  
  // Αγνοούμε αν έχει ήδη website (δεν χρειάζεται SGK)
  if (hasOfficialWebsite(company.url)) return { result: 'has_website' };
  
  // Αγνοούμε duplicates
  if (existingEmails.has(email)) return { result: 'duplicate' };
  
  // Εισαγωγή στη Supabase
  const { error } = await supabase.from('sgk_mails').insert({
    email: email,
    first_name: company.coNameEl || company.coTitlesEl?.[0] || 'Επιχείρηση',
    last_name: '',
    company: company.coNameEl || '',
    marketing_consent: true,
    unsubscribe_token: crypto.randomUUID(),
    email_sequence_step: 0,
    unsubscribed: false,
    converted: false
  });

  if (error) {
    if (error.code === '23505') return { result: 'duplicate' };
    throw error;
  }

  existingEmails.add(email);
  return { result: 'saved', email };
}

// ========================
// ΚΥΡΙΑ ΣΥΝΑΡΤΗΣΗ
// ========================

async function runScraper() {
  console.log('\n🚀 ΓΕΜΗ API Scraper - SGK Digital');
  console.log('=====================================');
  
  // Ανάγνωση command-line arguments
  const args = process.argv.slice(2);
  const getArg = (name) => {
    const idx = args.indexOf(`--${name}`);
    return idx !== -1 ? args[idx + 1] : null;
  };
  
  const prefectureFilter = getArg('prefecture');
  const nameFilter = getArg('name');
  const limitArg = getArg('limit');
  const maxLeads = limitArg ? parseInt(limitArg) : Infinity;

  console.log('📋 Ρυθμίσεις αναζήτησης:');
  if (prefectureFilter) console.log(`   Νομός ID: ${prefectureFilter}`);
  if (nameFilter) console.log(`   Αναζήτηση ονόματος: "${nameFilter}"`);
  if (maxLeads !== Infinity) console.log(`   Μέγιστο leads: ${maxLeads}`);
  console.log('');

  // Φόρτωσε existing emails
  console.log('📥 Φορτώνω υπάρχοντα emails από Supabase...');
  const existingEmails = await getExistingEmails();
  console.log(`   Υπάρχουν ήδη ${existingEmails.size} emails στη βάση.\n`);

  let totalProcessed = 0;
  let totalSaved = 0;
  let totalDuplicate = 0;
  let totalNoEmail = 0;
  let totalHasWebsite = 0;
  let totalPersonalEmail = 0;
  let offset = 0;
  let grandTotal = null;

  console.log('🔍 Ξεκινώ αναζήτηση επιχειρήσεων...\n');

  while (true) {
    // Έλεγχος αν φτάσαμε στο όριο
    if (totalSaved >= maxLeads) {
      console.log(`\n✅ Έφτασα στο όριο ${maxLeads} leads! Σταματώ.`);
      break;
    }

    // Δημιουργία query params
    const params = {
      isActive: 'true',
      resultsSize: PAGE_SIZE,
      resultsOffset: offset,
      resultsSortBy: '+arGemi'
    };

    if (prefectureFilter) params.prefectures = [prefectureFilter];
    if (nameFilter) params.name = nameFilter;

    try {
      console.log(`📄 Σελίδα offset=${offset} | Αποθηκεύτηκαν: ${totalSaved} | Ολικά: ${grandTotal !== null ? grandTotal : '?'}`);

      const data = await apiGet('/companies', params);
      
      if (!data.searchResults || data.searchResults.length === 0) {
        console.log('\n✅ Δεν υπάρχουν άλλες εγγραφές. Ολοκληρώθηκε!');
        break;
      }

      grandTotal = data.searchMetadata?.totalCount || '?';
      const companies = data.searchResults;

      for (const company of companies) {
        const { result, email } = await saveToSupabase(company, existingEmails);
        totalProcessed++;

        switch (result) {
          case 'saved':
            totalSaved++;
            console.log(`   ✅ ΑΠΟΘΗΚΕΥΤΗΚΕ: ${email} (${company.coNameEl})`);
            break;
          case 'duplicate':
            totalDuplicate++;
            break;
          case 'no_email':
            totalNoEmail++;
            break;
          case 'has_website':
            totalHasWebsite++;
            break;
          case 'personal_email':
            totalPersonalEmail++;
            break;
        }

        if (totalSaved >= maxLeads) break;
      }

      offset += companies.length;

      // Αν επέστρεψε λιγότερες εγγραφές από το PAGE_SIZE, τελειώσαμε
      if (companies.length < PAGE_SIZE) {
        console.log('\n✅ Τελευταία σελίδα ολοκληρώθηκε!');
        break;
      }

      // Rate limit delay
      console.log(`   ⏳ Rate limit delay (${DELAY_MS/1000}s)...`);
      await sleep(DELAY_MS);

    } catch (err) {
      console.error('\n❌ Σφάλμα API:', err.message);
      console.log('   Επαναπροσπάθεια σε 30 δευτερόλεπτα...');
      await sleep(30000);
    }
  }

  // Τελική αναφορά
  console.log('\n========================================');
  console.log('📊 ΤΕΛΙΚΗ ΑΝΑΦΟΡΑ ΑΠΟΤΕΛΕΣΜΑΤΩΝ');
  console.log('========================================');
  console.log(`   Συνολικά επιχειρήσεις που εξετάστηκαν: ${totalProcessed}`);
  console.log(`   ✅ Νέα leads αποθηκεύτηκαν:            ${totalSaved}`);
  console.log(`   🔁 Duplicates (ήδη υπήρχαν):           ${totalDuplicate}`);
  console.log(`   📧 Χωρίς email:                        ${totalNoEmail}`);
  console.log(`   🌐 Έχουν ήδη website:                  ${totalHasWebsite}`);
  console.log(`   📮 Personal emails (gmail/yahoo):       ${totalPersonalEmail}`);
  console.log('========================================\n');
}

runScraper().catch(err => {
  console.error('FATAL ERROR:', err);
  process.exit(1);
});
