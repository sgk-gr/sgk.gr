const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xrmvingehhiymchoggka.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const testEmail = `duplicate_test_${Date.now()}@example.com`;
  console.log('Inserting first lead with email:', testEmail);
  const { data: data1, error: error1 } = await supabase
    .from('sgk_mails')
    .insert([{ email: testEmail, first_name: 'Test 1' }])
    .select();
  
  if (error1) {
    console.error('Error 1:', error1);
    return;
  }
  console.log('Success 1:', data1);

  console.log('Inserting second lead with same email:', testEmail);
  const { data: data2, error: error2 } = await supabase
    .from('sgk_mails')
    .insert([{ email: testEmail, first_name: 'Test 2' }])
    .select();

  if (error2) {
    console.error('Error 2:', error2);
  } else {
    console.log('Success 2 (Duplicate allowed):', data2);
  }

  // Clean up
  await supabase.from('sgk_mails').delete().eq('email', testEmail);
}

run();

