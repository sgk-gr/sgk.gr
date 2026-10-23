-- Unschedule all email crons permanently
SELECT cron.unschedule('auto-followup-ike') 
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'auto-followup-ike');

SELECT cron.unschedule('email-nurture-sequence') 
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'email-nurture-sequence');

SELECT cron.unschedule('auto-followup-ike-v2') 
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'auto-followup-ike-v2');

SELECT cron.unschedule('sgk_daily_results') 
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'sgk_daily_results');
