-- Διόρθωση πολιτικών ασφαλείας (RLS) για τον πίνακα sgk_prospects
-- Επιτρέπει στον scraper (που τρέχει με το anon key) να αποθηκεύει και να ενημερώνει prospects

DROP POLICY IF EXISTS "Allow read access to anon" ON sgk_prospects;
DROP POLICY IF EXISTS "Allow all access to anon" ON sgk_prospects;

CREATE POLICY "Allow all access to anon" 
ON sgk_prospects 
FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

-- Αφαίρεση του UNIQUE περιορισμού από το business_name για να επιτρέπονται διπλά ονόματα με διαφορετικά emails
ALTER TABLE sgk_prospects DROP CONSTRAINT IF EXISTS sgk_prospects_business_name_key;
