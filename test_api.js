fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] })
}).then(async res => {
  console.log('Status:', res.status);
  console.log('Body:', await res.text());
}).catch(console.error);
