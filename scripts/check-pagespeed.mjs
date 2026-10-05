/**
 * PageSpeed Insights API Checker
 */

const API_KEY = process.env.PAGESPEED_API_KEY || 'AIzaSyAjRSB4yJBNlMUhvLHQ1fV3qskpBoQkLJs';

async function checkPageSpeed(targetUrl, strategy = 'mobile') {
  console.log(`\n🔍 Checking PageSpeed Insights for [${strategy.toUpperCase()}]: ${targetUrl}`);
  
  const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  endpoint.searchParams.set('url', targetUrl);
  endpoint.searchParams.set('key', API_KEY);
  endpoint.searchParams.set('strategy', strategy);
  endpoint.searchParams.append('category', 'performance');
  endpoint.searchParams.append('category', 'seo');
  endpoint.searchParams.append('category', 'accessibility');
  endpoint.searchParams.append('category', 'best-practices');

  try {
    const res = await fetch(endpoint.toString());
    const data = await res.json();

    if (data.error) {
      console.error(`❌ API Error (${data.error.code}):`, data.error.message);
      return null;
    }

    const lh = data.lighthouseResult;
    const cats = lh.categories;
    const audits = lh.audits;

    const scores = {
      performance: Math.round(cats.performance.score * 100),
      seo: Math.round(cats.seo.score * 100),
      accessibility: Math.round(cats.accessibility.score * 100),
      bestPractices: Math.round(cats['best-practices'].score * 100),
      fcp: audits['first-contentful-paint']?.displayValue,
      lcp: audits['largest-contentful-paint']?.displayValue,
      cls: audits['cumulative-layout-shift']?.displayValue,
      speedIndex: audits['speed-index']?.displayValue,
      tbt: audits['total-blocking-time']?.displayValue,
    };

    console.log(`📊 Results for ${strategy.toUpperCase()}:`);
    console.log(`   - Performance:    ${scores.performance}/100`);
    console.log(`   - SEO:            ${scores.seo}/100`);
    console.log(`   - Accessibility:  ${scores.accessibility}/100`);
    console.log(`   - Best Practices: ${scores.bestPractices}/100`);
    console.log(`⚡ Core Web Vitals:`);
    console.log(`   - FCP: ${scores.fcp}`);
    console.log(`   - LCP: ${scores.lcp}`);
    console.log(`   - TBT: ${scores.tbt}`);
    console.log(`   - CLS: ${scores.cls}`);

    return scores;
  } catch (err) {
    console.error('Fetch error:', err.message);
    return null;
  }
}

async function main() {
  const url = process.argv[2] || 'https://www.sgk.gr';
  console.log(`🚀 Connecting to Google PageSpeed Insights API with provided Key...`);
  
  await checkPageSpeed(url, 'mobile');
  await checkPageSpeed(url, 'desktop');
}

main().catch(console.error);
