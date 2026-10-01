import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fgyecckvlbkgclsehcgf.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZneWVjY2t2bGJrZ2Nsc2VoY2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3ODE3MjEsImV4cCI6MjEwNjM1NzcyMX0.AShhl1zgK63r-k7SI6tXpIA9HLEGn7gNuqonLUwymZA";

export function getSupabaseServiceRoleKey(): string {
  const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (envKey && !envKey.includes("xrmvingehhiymchoggka")) {
    return envKey;
  }
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZneWVjY2t2bGJrZ2Nsc2VoY2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc4MTcyMSwiZXhwIjoyMTA2MzU3NzIxfQ.4iZ7j4FKaXzq9CFTFZkQGaTEu8D0mTTHUaEFXG6qcDU";
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function getServiceSupabase() {
  return createClient(SUPABASE_URL, getSupabaseServiceRoleKey(), {
    auth: { persistSession: false },
  });
}
