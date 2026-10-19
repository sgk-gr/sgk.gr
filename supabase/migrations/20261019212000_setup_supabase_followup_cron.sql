-- ==============================================================================
-- SGK Digital: Αυτόματο Cron Job στο Supabase για Follow-Up Ι.Κ.Ε. (Βήμα 2 - 80€)
-- Εκτελείται αυτόματα κάθε πρωί στις 11:00 π.μ. ώρα Ελλάδας (08:00 UTC)
-- ==============================================================================

-- 1. Ενεργοποίηση απαραίτητων επεκτάσεων (pg_cron & pg_net)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Διαγραφή παλιών / διπλότυπων cron jobs εάν υπάρχουν
SELECT cron.unschedule('email-nurture-sequence') 
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'email-nurture-sequence');

SELECT cron.unschedule('auto-followup-ike') 
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'auto-followup-ike');

SELECT cron.unschedule('auto-followup-ike-v2') 
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'auto-followup-ike-v2');

-- 3. Δημιουργία του επίσημου Cron Job στο Supabase
-- Τρέχει κάθε πρωί στις 08:00 UTC (11:00 π.μ. ώρα Ελλάδας)
SELECT cron.schedule(
  'auto-followup-ike',
  '0 8 * * *',
  $$
    SELECT net.http_get(
      url := 'https://fgyecckvlbkgclsehcgf.supabase.co/functions/v1/cron-followup-ike?days=3&limit=100'
    );
  $$
);
