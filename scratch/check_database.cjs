const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xrmvingehhiymchoggka.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase
    .from('sgk_mails')
    .select('*')
    .eq('email_sequence_step', 2);
  
  if (error) {
    console.error('Error fetching:', error);
    return;
  }
  
  console.log('Total step 2 leads found:', data.length);
  data.forEach((l, i) => {
    console.log(`${i+1}. Email: ${l.email}`);
    console.log(`   Step: ${l.email_sequence_step}`);
    console.log(`   Last sent: ${l.last_email_sent_at}`);
    console.log(`   Created at: ${l.created_at}`);
    console.log(`   Unsubscribed: ${l.unsubscribed}, Converted: ${l.converted}, Consent: ${l.marketing_consent}`);
  });
}

check();
