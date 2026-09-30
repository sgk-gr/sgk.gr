-- ==========================================================
-- SGK DIGITAL: COMPLETE SUPABASE DATABASE SCHEMA MIGRATION
-- Project: https://fgyecckvlbkgclsehcgf.supabase.co
-- ==========================================================

-- Enable pgcrypto / uuid extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. sgk_mails
CREATE TABLE IF NOT EXISTS public.sgk_mails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  phone TEXT,
  source TEXT DEFAULT 'manual',
  marketing_consent BOOLEAN DEFAULT true,
  unsubscribed BOOLEAN DEFAULT false,
  unsubscribe_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  converted BOOLEAN DEFAULT false,
  email_sequence_step INTEGER DEFAULT 0,
  last_email_sent_at TIMESTAMPTZ,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  first_email_subject TEXT,
  first_email_body TEXT,
  type TEXT,
  afm TEXT,
  gemi_number TEXT
);
ALTER TABLE public.sgk_mails ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon and auth on sgk_mails" ON public.sgk_mails;
CREATE POLICY "Allow anon and auth on sgk_mails" ON public.sgk_mails FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 2. tracking_sessions
CREATE TABLE IF NOT EXISTS public.tracking_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL,
  session_id UUID NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  duration_seconds INTEGER DEFAULT 0 NOT NULL,
  clicks JSONB DEFAULT '[]'::jsonb NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  max_scroll_percentage INTEGER DEFAULT 0 NOT NULL,
  form_inputs JSONB DEFAULT '[]'::jsonb NOT NULL
);
ALTER TABLE public.tracking_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon and auth on tracking_sessions" ON public.tracking_sessions;
CREATE POLICY "Allow anon and auth on tracking_sessions" ON public.tracking_sessions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 3. ledger_transactions
CREATE TABLE IF NOT EXISTS public.ledger_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT,
  gross_amount NUMERIC,
  net_amount NUMERIC,
  vat_amount NUMERIC,
  date DATE,
  description TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ledger_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon and auth on ledger_transactions" ON public.ledger_transactions;
CREATE POLICY "Allow anon and auth on ledger_transactions" ON public.ledger_transactions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 4. newsletter_subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon and auth on newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Allow anon and auth on newsletter_subscribers" ON public.newsletter_subscribers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 5. special_offers
CREATE TABLE IF NOT EXISTS public.special_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT,
  title TEXT,
  subtitle TEXT,
  date_range TEXT,
  image_url TEXT,
  style TEXT,
  cta_text TEXT,
  cta_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  excursion_ids JSONB
);
ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon and auth on special_offers" ON public.special_offers;
CREATE POLICY "Allow anon and auth on special_offers" ON public.special_offers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 6. excursions
CREATE TABLE IF NOT EXISTS public.excursions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  price NUMERIC,
  duration TEXT,
  start_date DATE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  deposit NUMERIC DEFAULT 0,
  gallery TEXT[],
  location_type TEXT,
  transport_type TEXT,
  summary TEXT,
  itinerary_details TEXT,
  itinerary_program TEXT,
  included TEXT,
  excluded TEXT,
  useful_info TEXT,
  tags TEXT
);
ALTER TABLE public.excursions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon and auth on excursions" ON public.excursions;
CREATE POLICY "Allow anon and auth on excursions" ON public.excursions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 7. bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  excursion_id UUID,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  number_of_people INTEGER,
  total_price NUMERIC,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  booking_date DATE,
  notes TEXT,
  adults INTEGER,
  children INTEGER
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon and auth on bookings" ON public.bookings;
CREATE POLICY "Allow anon and auth on bookings" ON public.bookings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 8. spiros_foods
CREATE TABLE IF NOT EXISTS public.spiros_foods (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT,
  status TEXT,
  description TEXT,
  benefits_or_harms TEXT,
  anti_inflammatory_score INTEGER,
  spine_benefit TEXT,
  glycemic_index TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.spiros_foods ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon and auth on spiros_foods" ON public.spiros_foods;
CREATE POLICY "Allow anon and auth on spiros_foods" ON public.spiros_foods FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 9. spiros_meals
CREATE TABLE IF NOT EXISTS public.spiros_meals (
  id TEXT PRIMARY KEY,
  day TEXT,
  meal_type TEXT,
  time TEXT,
  title TEXT,
  description TEXT,
  ingredients JSONB,
  instructions JSONB,
  calories INTEGER,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  is_anti_inflammatory BOOLEAN,
  spine_benefit TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.spiros_meals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon and auth on spiros_meals" ON public.spiros_meals;
CREATE POLICY "Allow anon and auth on spiros_meals" ON public.spiros_meals FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 10. spiros_weight_logs
CREATE TABLE IF NOT EXISTS public.spiros_weight_logs (
  id TEXT PRIMARY KEY,
  date DATE,
  weight NUMERIC,
  pain_level INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.spiros_weight_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon and auth on spiros_weight_logs" ON public.spiros_weight_logs;
CREATE POLICY "Allow anon and auth on spiros_weight_logs" ON public.spiros_weight_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 11. spiros_daily_logs
CREATE TABLE IF NOT EXISTS public.spiros_daily_logs (
  id TEXT PRIMARY KEY,
  date DATE,
  water_ml INTEGER,
  fasting_hours NUMERIC,
  exercise_minutes INTEGER,
  exercise_type TEXT,
  lumbar_feeling TEXT,
  completed_habits JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.spiros_daily_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon and auth on spiros_daily_logs" ON public.spiros_daily_logs;
CREATE POLICY "Allow anon and auth on spiros_daily_logs" ON public.spiros_daily_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 12. spiros_settings
CREATE TABLE IF NOT EXISTS public.spiros_settings (
  id TEXT PRIMARY KEY,
  name TEXT,
  start_weight NUMERIC,
  current_weight NUMERIC,
  target_weight NUMERIC,
  height_cm INTEGER,
  age INTEGER,
  eating_window_start TEXT,
  eating_window_end TEXT,
  water_goal_ml INTEGER,
  daily_steps_goal INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.spiros_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon and auth on spiros_settings" ON public.spiros_settings;
CREATE POLICY "Allow anon and auth on spiros_settings" ON public.spiros_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
