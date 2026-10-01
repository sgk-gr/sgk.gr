import { createClient } from '@supabase/supabase-js';

export const TARGET_SUPABASE_REF = "fgyecckvlbkgclsehcgf";
export const HARDCODED_SUPABASE_URL = "https://fgyecckvlbkgclsehcgf.supabase.co";
export const HARDCODED_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZneWVjY2t2bGJrZ2Nsc2VoY2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3ODE3MjEsImV4cCI6MjEwNjM1NzcyMX0.AShhl1zgK63r-k7SI6tXpIA9HLEGn7gNuqonLUwymZA";
export const HARDCODED_SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZneWVjY2t2bGJrZ2Nsc2VoY2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc4MTcyMSwiZXhwIjoyMTA2MzU3NzIxfQ.4iZ7j4FKaXzq9CFTFZkQGaTEu8D0mTTHUaEFXG6qcDU";

function isJwtForTargetRef(jwt?: string | null): boolean {
  if (!jwt) return false;
  try {
    const parts = jwt.split('.');
    if (parts.length < 2) return false;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = typeof atob === 'function'
      ? atob(base64)
      : Buffer.from(base64, 'base64').toString('utf8');
    const payload = JSON.parse(jsonStr);
    return payload.ref === TARGET_SUPABASE_REF;
  } catch (e) {
    return false;
  }
}

export const SUPABASE_URL = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url && url.includes(TARGET_SUPABASE_REF)) {
    return url;
  }
  return HARDCODED_SUPABASE_URL;
})();

export const SUPABASE_ANON_KEY = (() => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (isJwtForTargetRef(key)) {
    return key!;
  }
  return HARDCODED_SUPABASE_ANON_KEY;
})();

export function getSupabaseServiceRoleKey(): string {
  const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (isJwtForTargetRef(envKey)) {
    return envKey!;
  }
  return HARDCODED_SUPABASE_SERVICE_ROLE_KEY;
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function getServiceSupabase() {
  return createClient(SUPABASE_URL, getSupabaseServiceRoleKey(), {
    auth: { persistSession: false },
  });
}
