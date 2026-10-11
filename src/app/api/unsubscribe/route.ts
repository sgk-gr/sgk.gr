import { NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function handleUnsubscribe(token: string | null, email: string | null) {
  if (!token && !email) {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 });
  }

  try {
    const supabase = getServiceSupabase();
    const updates = { unsubscribed: true, marketing_consent: false };

    let updatedRows: any[] = [];

    if (token) {
      const { data, error } = await supabase
        .from("sgk_mails")
        .update(updates)
        .eq("unsubscribe_token", token)
        .select("id, email");
      if (error) throw error;
      updatedRows = data || [];
    }

    // Fallback by email if the token didn't match any lead
    if (updatedRows.length === 0 && email) {
      const { data, error } = await supabase
        .from("sgk_mails")
        .update(updates)
        .ilike("email", email.trim())
        .select("id, email");
      if (error) throw error;
      updatedRows = data || [];
    }

    if (updatedRows.length === 0) {
      console.warn("Unsubscribe: no lead matched", { token, email });
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    console.log("Unsubscribed:", updatedRows.map(r => r.email).join(", "));
    return NextResponse.json({ success: true, message: "Unsubscribed successfully" });
  } catch (error: any) {
    console.error("Unsubscribe API error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  return handleUnsubscribe(searchParams.get("token"), searchParams.get("email"));
}

export async function POST(request: Request) {
  let token: string | null = null;
  let email: string | null = null;
  try {
    const body = await request.json();
    token = body.token || null;
    email = body.email || null;
  } catch {
    // empty body
  }
  return handleUnsubscribe(token, email);
}
