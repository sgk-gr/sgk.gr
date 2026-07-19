-- Add first_email_subject and first_email_body columns to sgk_mails table
ALTER TABLE sgk_mails ADD COLUMN IF NOT EXISTS first_email_subject TEXT;
ALTER TABLE sgk_mails ADD COLUMN IF NOT EXISTS first_email_body TEXT;
