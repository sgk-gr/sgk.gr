import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  // Forward query params to Supabase Edge Function
  const supabaseUrl = `https://xrmvingehhiymchoggka.supabase.co/functions/v1/voice?${searchParams.toString()}`;
  
  try {
    const response = await fetch(supabaseUrl, {
      method: "GET",
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml,text/plain,*/*"
      }
    });
    
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "text/xml; charset=utf-8",
      }
    });
  } catch (error: any) {
    return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response><Say language="el-GR">Σφάλμα σύνδεσης με τη βάση δεδομένων.</Say></Response>`, {
      status: 500,
      headers: { "Content-Type": "text/xml" }
    });
  }
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const reqBody = await request.text();
  
  const supabaseUrl = `https://xrmvingehhiymchoggka.supabase.co/functions/v1/voice?${searchParams.toString()}`;
  
  try {
    const response = await fetch(supabaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": request.headers.get("content-type") || "application/x-www-form-urlencoded"
      },
      body: reqBody
    });
    
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "text/xml; charset=utf-8",
      }
    });
  } catch (error: any) {
    return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response><Say language="el-GR">Σφάλμα σύνδεσης.</Say></Response>`, {
      status: 500,
      headers: { "Content-Type": "text/xml" }
    });
  }
}
