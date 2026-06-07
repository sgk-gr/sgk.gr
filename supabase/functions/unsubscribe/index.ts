import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const url = new URL(req.url);
        const token = url.searchParams.get("token");

        if (!token) {
            return new Response(
                JSON.stringify({ error: "Missing token" }),
                {
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                    status: 400,
                }
            );
        }

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // Find and update the user with this token
        const { error: updateError } = await supabase
            .from("sgk_mails")
            .update({ unsubscribed: true })
            .eq("unsubscribe_token", token);

        if (updateError) {
            throw updateError;
        }

        return new Response(
            JSON.stringify({ success: true, message: "Unsubscribed successfully" }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            }
        );

    } catch (error: any) {
        console.error("Error processing request:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 500,
            }
        );
    }
});
