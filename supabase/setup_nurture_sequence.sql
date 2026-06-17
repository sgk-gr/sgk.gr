-- 1. Προσθήκη νέων στηλών στον πίνακα sgk_mails
ALTER TABLE sgk_mails ADD COLUMN IF NOT EXISTS email_sequence_step integer DEFAULT 1;
ALTER TABLE sgk_mails ADD COLUMN IF NOT EXISTS unsubscribed boolean DEFAULT false;
ALTER TABLE sgk_mails ADD COLUMN IF NOT EXISTS unsubscribe_token text UNIQUE;
ALTER TABLE sgk_mails ALTER COLUMN unsubscribe_token SET DEFAULT gen_random_uuid()::text;
UPDATE sgk_mails SET unsubscribe_token = gen_random_uuid()::text WHERE unsubscribe_token IS NULL;
ALTER TABLE sgk_mails ADD COLUMN IF NOT EXISTS converted boolean DEFAULT false;
ALTER TABLE sgk_mails ADD COLUMN IF NOT EXISTS last_email_sent_at timestamptz DEFAULT now();
ALTER TABLE sgk_mails ADD COLUMN IF NOT EXISTS emails_opened integer DEFAULT 0;
ALTER TABLE sgk_mails ADD COLUMN IF NOT EXISTS emails_clicked integer DEFAULT 0;

-- 2. Δημιουργία Cron Job (απαιτεί pg_cron)
-- Τρέχει κάθε μέρα στις 10:00 πμ
SELECT cron.schedule(
  'email-nurture-sequence',
  '0 10 * * *',
  $$
  SELECT net.http_post(
    url := 'https://www.sgk.gr/api/admin/emails/dynamic-followup',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'email', email,
      'step', email_sequence_step + 1,
      'unsubscribe_token', unsubscribe_token
    )
  )
  FROM (
    SELECT email, email_sequence_step, unsubscribe_token
    FROM sgk_mails
    WHERE
      marketing_consent = true
      AND unsubscribed = false
      AND converted = false
      AND email_sequence_step < 4
      AND (
        (email_sequence_step = 1 AND created_at <= now() - interval '3 days')
        OR (email_sequence_step = 2 AND last_email_sent_at <= now() - interval '4 days')
        OR (email_sequence_step = 3 AND last_email_sent_at <= now() - interval '7 days')
      )
  ) t;
  $$
);
