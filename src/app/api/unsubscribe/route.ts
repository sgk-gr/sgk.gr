import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fgyecckvlbkgclsehcgf.supabase.co";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZneWVjY2t2bGJrZ2Nsc2VoY2dmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc4MTcyMSwiZXhwIjoyMTA2MzU3NzIxfQ.4iZ7j4FKaXzq9CFTFZkQGaTEu8D0mTTHUaEFXG6qcDU";

    if (token && supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      await supabase
        .from("sgk_mails")
        .update({ unsubscribed: true })
        .eq("unsubscribe_token", token);
    }

    return NextResponse.json({ success: true, message: "Unsubscribed successfully" });
  } catch (error: any) {
    console.error("Unsubscribe API error:", error);
    return NextResponse.json({ success: true, message: "Unsubscribed" });
  }
}
