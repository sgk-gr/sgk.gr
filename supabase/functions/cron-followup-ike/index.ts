import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  try {
    console.log("🚀 [Supabase Cron] Triggering Follow-Up IKE from Supabase Edge Function...");
    const targetUrl = "https://www.sgk.gr/api/admin/cron-followup-ike?days=3&limit=100";
    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Supabase-Cron-Agent/1.0",
      },
    });

    const data = await res.json();
    console.log("✅ [Supabase Cron] Execution result:", JSON.stringify(data));

    return new Response(JSON.stringify({ success: true, triggeredBy: "supabase-edge-function", data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err: any) {
    console.error("❌ [Supabase Cron] Execution error:", err.message);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
