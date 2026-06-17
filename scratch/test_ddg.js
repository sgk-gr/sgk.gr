const q = encodeURIComponent('"Cafe Gallery" Καστοριά email facebook');
fetch('https://html.duckduckgo.com/html/?q=' + q, {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
})
.then(r => r.text())
.then(html => {
  const emails = html.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  console.log(emails ? [...new Set(emails)] : 'None');
});
