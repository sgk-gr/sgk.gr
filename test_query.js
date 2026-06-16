const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xrmvingehhiymchoggka.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase
    .from('sgk_mails')
    .select('id, email, first_name, last_name, phone, company, type, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  if (error) {
    console.error('Error fetching leads:', error);
  } else {
    console.log('Latest 5 Leads:');
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
