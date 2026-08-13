import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xrmvingehhiymchoggka.supabase.co";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXZpbmdlaGhpeW1jaG9nZ2thIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjkzMTEsImV4cCI6MjA5MDk0NTMxMX0.UDvGORYRXdo1IKTrduIJYJEfgNuli0LSpAC9njm7I9Q";

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
