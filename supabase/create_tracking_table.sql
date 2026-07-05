-- Migration to create tracking_sessions table for real-time traffic and AI analytics
CREATE TABLE IF NOT EXISTS tracking_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL,
  session_id UUID NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  duration_seconds INTEGER DEFAULT 0 NOT NULL,
  clicks JSONB DEFAULT '[]'::jsonb NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE tracking_sessions ENABLE ROW LEVEL SECURITY;

-- Enable anon policy for insertions and updates
DROP POLICY IF EXISTS "Allow all access to anon" ON tracking_sessions;
CREATE POLICY "Allow all access to anon" 
ON tracking_sessions 
FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);
