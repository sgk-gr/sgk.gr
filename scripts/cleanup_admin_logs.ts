import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Uses service role for bypass RLS
);

async function cleanAdminLogs() {
  console.log("Cleaning old admin logs from DB...");
  const { error } = await supabase
    .from("analytics_events")
    .delete()
    .or("page_url.eq./live,page_url.ilike.%admin%");

  if (error) {
    console.error("Cleanup error:", error);
  } else {
    console.log("SUCCESS: All /live and admin logs removed.");
  }
}

cleanAdminLogs();
