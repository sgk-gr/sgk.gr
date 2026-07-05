-- Add scroll and form input tracking columns to tracking_sessions
ALTER TABLE tracking_sessions 
ADD COLUMN IF NOT EXISTS max_scroll_percentage INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS form_inputs JSONB DEFAULT '[]'::jsonb NOT NULL;
