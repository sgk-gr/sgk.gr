import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const body = await req.json();
        const { p_event_type, p_page_url } = body;

        // GLOBAL SHIELD: Never track anyone at /live or admin paths
        if (p_page_url === "/live" || p_page_url?.includes("admin")) {
            return new Response(JSON.stringify({ success: true, message: "Protected" }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            });
        }

        let p_metadata = body.p_metadata || {};
        const sessionId = p_metadata.session_id;

        // SERVER-SIDE LOCATION (High Performance via Edge Headers)
        if (!p_metadata.city) {
            // Supabase/Cloudflare provide high-accuracy geo headers automatically
            const city = req.headers.get("x-city") || req.headers.get("cf-ipcity") || "Άγνωστη πόλη";
            const country = req.headers.get("x-country") || req.headers.get("cf-ipcountry") || "Ελλάδα";
            const region = req.headers.get("x-region") || req.headers.get("cf-region");
            
            p_metadata = {
                ...p_metadata,
                city: decodeURIComponent(city), 
                country: country,
                region: region
            };
        }

        // HEARTBEAT LOGIC: Update duration/last_seen
        if (p_event_type === "heartbeat" && sessionId) {
            const { data: latestEvent } = await supabase
                .from("analytics_events")
                .select("id, metadata")
                .eq("page_url", p_page_url)
                .contains("metadata", { session_id: sessionId })
                .order("created_at", { ascending: false })
                .limit(1);

            if (latestEvent && latestEvent.length > 0) {
                const { error: updateError } = await supabase
                    .from("analytics_events")
                    .update({ 
                        metadata: { ...latestEvent[0].metadata, ...p_metadata },
                        created_at: new Date().toISOString()
                    })
                    .eq("id", latestEvent[0].id);
                if (updateError) throw updateError;
            } else {
                await supabase.from("analytics_events").insert([{
                    event_type: "page_view",
                    page_url: p_page_url,
                    metadata: p_metadata
                }]);
            }
        } else {
            // NORMAL INSERT (click, page_view)
            const { error: insertError } = await supabase
                .from("analytics_events")
                .insert([{
                    event_type: p_event_type,
                    page_url: p_page_url,
                    metadata: p_metadata
                }]);
            if (insertError) throw insertError;
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
        });
    }
});
