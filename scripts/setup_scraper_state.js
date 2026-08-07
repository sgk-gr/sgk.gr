import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xrmvingehhiymchoggka.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTM2OTMxMSwiZXhwIjoyMDkwOTQ1MzExfQ.RKYuTKNlXLTuDrNjRmqDQPNECKUmFDfNEhXiZVVEPAI'
);

async function setup() {
  // Try to insert initial state row - table may already exist
  const { error: insertErr } = await supabase
    .from('scraper_state')
    .upsert({ scraper_name: 'gemi_ike', last_offset: 0, total_saved: 0 }, { onConflict: 'scraper_name' });

  if (insertErr) {
    console.log('Table does not exist yet, need to create it via Supabase SQL editor.');
    console.log('Error:', insertErr.message);
    console.log('\nRun this SQL in Supabase Dashboard -> SQL Editor:');
    console.log(`
CREATE TABLE IF NOT EXISTS public.scraper_state (
  scraper_name TEXT PRIMARY KEY,
  last_offset INTEGER DEFAULT 0,
  last_run_at TIMESTAMPTZ,
  total_saved INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.scraper_state (scraper_name, last_offset, total_saved)
VALUES ('gemi_ike', 0, 0)
ON CONFLICT (scraper_name) DO NOTHING;
    `);
  } else {
    console.log('scraper_state table OK! State initialized for gemi_ike.');
  }
}

setup();
