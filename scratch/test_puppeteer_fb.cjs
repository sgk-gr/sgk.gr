const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const testUrl = "https://m.facebook.com/%CE%93%CF%81%CE%B1%CE%BC%CE%BC%CF%8C%CF%86%CF%89%CE%BD%CE%BF-961279713926291/about";
  console.log(`Άνοιγμα: ${testUrl}`);
  
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
  
  try {
    await page.goto(testUrl, { waitUntil: 'networkidle2', timeout: 20000 });
    
    const html = await page.content();
    fs.writeFileSync('scratch/fb_test.html', html);
    await page.screenshot({ path: 'scratch/fb_screenshot.png', fullPage: true });
    console.log("Έβγαλε screenshot: scratch/fb_screenshot.png");
    
    // Εξαγωγή emails
    const text = await page.evaluate(() => document.body.innerText);
    const regex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,6}/g;
    const found = text.match(regex) || [];
    console.log("Βρήκε: ", [...new Set(found)]);
    
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
})();
