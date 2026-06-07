-- Add coupon_code column to sgk_mails table
ALTER TABLE sgk_mails ADD COLUMN IF NOT EXISTS coupon_code text;
