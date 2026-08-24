CREATE TABLE IF NOT EXISTS public.sgk_mails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  company text,
  phone text,
  source text DEFAULT 'manual',
  marketing_consent boolean DEFAULT true,
  unsubscribed boolean DEFAULT false,
  unsubscribe_token text UNIQUE DEFAULT gen_random_uuid()::text,
  converted boolean DEFAULT false,
  email_sequence_step integer DEFAULT 0,
  last_email_sent_at timestamptz,
  emails_opened integer DEFAULT 0,
  emails_clicked integer DEFAULT 0,
  first_email_subject text,
  first_email_body text
);

ALTER TABLE public.sgk_mails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon read and write on sgk_mails" ON public.sgk_mails;
CREATE POLICY "Allow anon read and write on sgk_mails" ON public.sgk_mails
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO public.sgk_mails (email, company, first_name, phone, converted, email_sequence_step, unsubscribed)
VALUES 
  ('kapoulitsas.ziogas@gmail.com', 'ERGATIKAT (ΦΛΩΡΙΝΑ)', 'ΟΡΕΣΤΗΣ ΚΑΠΟΥΛΙΤΣΑΣ', '6974405345', true, 0, false),
  ('lyroudi@hotmail.com', 'LYROUDIS CONSULTING SERVICES', 'ΒΑΣΙΛΕΙΟΣ ΛΥΡΟΥΔΗΣ', '', true, 0, false),
  ('kostas.mallios@gmail.com', 'MALLIOS CONSULTING', 'ΚΩΣΤΑΣ ΜΑΛΛΙΟΣ', '', true, 4, false),
  ('ioannis_routis@yahoo.gr', 'ROUTIS SERVICES', 'ΙΩΑΝΝΗΣ ΡΟΥΤΗΣ', '', true, 0, false)
ON CONFLICT (email) DO UPDATE 
SET company = EXCLUDED.company,
    first_name = EXCLUDED.first_name,
    phone = EXCLUDED.phone,
    converted = EXCLUDED.converted;

NOTIFY pgrst, 'reload schema';
