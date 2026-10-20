-- 1. Enable pg_cron and pg_net extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Delete old daily campaigns cron job if exists
SELECT cron.unschedule('daily-auto-campaigns-300')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-auto-campaigns-300');

-- 3. Schedule daily automated campaigns: 300 emails (100 New IKE, 100 Legacy IKE, 99 FTTH) + Report to info@sgk.gr
-- Runs every day at 06:30 UTC (09:30 Greek Time)
SELECT cron.schedule(
  'daily-auto-campaigns-300',
  '30 6 * * *',
  $$
    SELECT net.http_post(
        url := 'https://www.sgk.gr/api/admin/cron-daily-campaigns',
        headers := '{"Content-Type": "application/json"}'::jsonb,
        body := '{"source": "supabase_cron"}'::jsonb
    );
  $$
);
