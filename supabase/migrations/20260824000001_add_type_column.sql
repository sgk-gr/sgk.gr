-- Add type column to sgk_mails table
ALTER TABLE public.sgk_mails ADD COLUMN IF NOT EXISTS type text DEFAULT 'new_ike';

NOTIFY pgrst, 'reload schema';
