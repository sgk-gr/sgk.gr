-- Δημιουργία πίνακα sgk_prospects για την αποθήκευση B2B prospects
CREATE TABLE IF NOT EXISTS sgk_prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  city TEXT,
  industry TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'emailed', 'ignored'
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ενεργοποίηση RLS (προαιρετικά, για ασφάλεια)
ALTER TABLE sgk_prospects ENABLE ROW LEVEL SECURITY;

-- Πολιτική πρόσβασης για όλους τους ρόλους (authenticated/anon/service)
CREATE POLICY "Allow all access to authenticated users" 
ON sgk_prospects 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow read access to anon" 
ON sgk_prospects 
FOR SELECT 
TO anon 
USING (true);
