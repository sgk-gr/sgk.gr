const fetch = require('node-fetch');

async function test() {
  const url = 'https://xrmvingehhiymchoggka.supabase.co/functions/v1/chat';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'DEBUG_MODELS' }] })
  });

  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

test();
