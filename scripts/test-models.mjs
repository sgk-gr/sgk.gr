async function test(modelName) {
  const url = 'https://xrmvingehhiymchoggka.supabase.co/functions/v1/chat';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'TEST_MODEL:' + modelName }] })
  });

  if (!res.ok) {
    console.error("HTTP ERROR", modelName, res.status);
    return;
  }
  
  const text = await res.text();
  console.log("RESPONSE OK:", modelName, text.slice(0, 50));
}

async function run() {
  await test('gemini-2.0-flash');
  await test('gemma-4-26b-a4b-it');
  await test('gemini-3.5-flash');
}

run();
