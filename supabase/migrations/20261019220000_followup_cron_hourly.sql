-- Follow-Up Ι.Κ.Ε. (Βήματα 2 & 3): εκτέλεση κάθε ώρα 10:00-17:00 ώρα Ελλάδας (07-14 UTC)
-- σε μικρά batches των 25 για ασφαλή παράδοση και χωρίς timeouts.
SELECT cron.unschedule('auto-followup-ike')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'auto-followup-ike');

SELECT cron.schedule(
  'auto-followup-ike',
  '0 7-14 * * *',
  $$
    SELECT net.http_get(
      url := 'https://fgyecckvlbkgclsehcgf.supabase.co/functions/v1/cron-followup-ike?days=3&limit=25'
    );
  $$
);
