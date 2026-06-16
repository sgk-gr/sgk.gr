import fs from "fs";

async function searchViaBingScrape(query) {
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Accept-Language": "el-GR,el;q=0.9,en;q=0.8",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
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
      let title = titleMatch ? titleMatch[2] : "";
      title = title.replace(/<[^>]*>/g, "");
      
      const snippetMatch = block.match(/<p>([\s\S]*?)<\/p>/) || 
                           block.match(/<div class="[^"]*b_caption[^"]*">([\s\S]*?)<\/div>/) ||
                           block.match(/<div class="[^"]*b_text[^"]*">([\s\S]*?)<\/div>/);
      let snippet = snippetMatch ? snippetMatch[1] : "";
      snippet = snippet.replace(/<[^>]*>/g, "");
      
      if (title || snippet) {
        results.push({ title, snippet, link: rawLink });
      }
    }
    return results;
  } catch (err) {
    console.error("Bing scrape failed", err);
    return [];
  }
}

function extractEmails(text) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const found = text.match(emailRegex);
  return found ? Array.from(new Set(found.map(email => email.toLowerCase()))) : [];
}

async function run() {
  const queries = [
    `"φαρμακείο" Καστοριά "gmail.com"`,
    `"φαρμακείο" Καστοριά "yahoo.gr"`,
    `φαρμακείο Καστοριάς email`,
    `φαρμακεία Καστοριά email`
  ];
  
  for (const query of queries) {
    console.log(`Searching: ${query}`);
    const results = await searchViaBingScrape(query);
    console.log(`Found ${results.length} results.`);
    for (const r of results) {
      const combined = `${r.title} ${r.snippet}`;
      const emails = extractEmails(combined);
      if (emails.length > 0) {
        console.log(`  Link: ${r.link}`);
        console.log(`  Title: ${r.title}`);
        console.log(`  Emails:`, emails);
      }
    }
  }
}

run();
