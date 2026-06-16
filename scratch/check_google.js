import fs from "fs";

async function run() {
  const query = "ξενοδοχεία Καστοριά \"gmail.com\"";
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=el`;
  try {
    console.log("Fetching: " + url);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "el-GR,el;q=0.9,en;q=0.8"
      }
    });
    console.log("Response status:", res.status);
    const html = await res.text();
    fs.writeFileSync("google_result.html", html);
    console.log("Saved google_result.html. Length:", html.length);
    
    // Find all links to see if we got results
    const hrefs = [];
    const hrefRegex = /href="([^"]+)"/g;
    let match;
    while ((match = hrefRegex.exec(html)) !== null) {
      const h = match[1];
      if (h.includes("http") && !h.includes("google")) {
        hrefs.push(h);
      }
    }
    console.log("Found links (non-google):", hrefs.slice(0, 15));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
