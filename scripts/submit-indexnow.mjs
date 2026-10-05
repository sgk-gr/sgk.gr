/**
 * Direct IndexNow Submission Script
 * Submits URLs directly to IndexNow (Bing, Perplexity, Copilot, Seznam, Naver)
 * 
 * Usage:
 *   node scripts/submit-indexnow.mjs <url1> <url2> ...
 *   node scripts/submit-indexnow.mjs --all
 */

const INDEXNOW_KEY = 'a20be9a36f2b8a1d99b77e6695107894';
const INDEXNOW_HOST = 'www.sgk.gr';
const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

const DEFAULT_URLS = [
  'https://www.sgk.gr',
  'https://www.sgk.gr/blog',
  'https://www.sgk.gr/blog/pos-i-sgk-aftomatopoiise-tilepikoinonies-optikes-ines-ai-aftopsies',
  'https://www.sgk.gr/ai-agents',
  'https://www.sgk.gr/order-ai-agent',
  'https://www.sgk.gr/case-studies',
  'https://www.sgk.gr/roi-calculator',
  'https://www.sgk.gr/contact',
  'https://www.sgk.gr/pricing',
];

async function main() {
  const args = process.argv.slice(2);
  let targetUrls = [];

  if (args.length > 0 && !args.includes('--default') && !args.includes('--all')) {
    targetUrls = args.map(arg => {
      if (arg.startsWith('http://') || arg.startsWith('https://')) return arg;
      return `https://${INDEXNOW_HOST}${arg.startsWith('/') ? '' : '/'}${arg}`;
    });
  } else {
    targetUrls = DEFAULT_URLS;
  }

  console.log(`🚀 Preparing IndexNow submission for ${targetUrls.length} URLs on ${INDEXNOW_HOST}...`);
  console.log(`🔑 Key: ${INDEXNOW_KEY}`);
  console.log(`📄 Key Location: ${INDEXNOW_KEY_LOCATION}`);

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: targetUrls,
  };

  // Submit to both api.indexnow.org and bing.com/indexnow
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\n📡 Pinging ${endpoint}...`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      console.log(`Status: ${response.status} ${response.statusText}`);
      if (response.status === 200 || response.status === 202) {
        console.log(`✅ SUCCESS: ${targetUrls.length} URLs accepted by ${endpoint}!`);
      } else {
        const text = await response.text();
        console.warn(`⚠️ Response: ${text || response.statusText}`);
      }
    } catch (err) {
      console.error(`❌ Failed connecting to ${endpoint}:`, err.message);
    }
  }

  console.log('\n📋 Submitted URLs:');
  targetUrls.forEach(url => console.log(` - ${url}`));
  console.log('\n🎉 Finished IndexNow submission.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
