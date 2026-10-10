import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dxsdmumciinpqtewpipx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4c2RtdW1jaWlucHF0ZXdwaXB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjI1OTYsImV4cCI6MjA5MTAzODU5Nn0.K3l11yzoiBaHe_YKbtULGhgEGTtDrdlBvCChy4J9w4o";

export const supabaseAutopsia = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
