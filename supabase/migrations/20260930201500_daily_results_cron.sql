-- Ενεργοποιούμε το pg_net για να μπορεί η βάση να κάνει HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Διαγράφουμε το παλιό cron αν υπάρχει
SELECT cron.unschedule('sgk_daily_results');

-- Φτιάχνουμε το νέο cron να τρέχει κάθε μέρα στις 23:55 (Server Time)
SELECT cron.schedule(
  'sgk_daily_results',
  '55 23 * * *',
  $$
    SELECT net.http_post(
        url := 'https://fgyecckvlbkgclsehcgf.supabase.co/functions/v1/send-agent-email',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ΒΑΛΕ_ΤΟ_ANON_KEY_ΣΟΥ_ΕΔΩ"}'::jsonb,
        body := '{"title": "SGK Daily Report", "results_text": "Το Cron έτρεξε επιτυχώς από τη νέα βάση (fgyecckvlbkgclsehcgf)! Ο υπολογιστής σου είναι κλειστός."}'::jsonb
    );
  $$
);
