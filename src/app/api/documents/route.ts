import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, id, data, leadEmail } = body;

    if (!type || !data) {
      return NextResponse.json({ error: "Missing type or document data" }, { status: 400 });
    }

    const docId = id || `${type}_${Date.now()}`;
    const docType = type === "invoice" ? "invoice" : "contract";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const filePayload = JSON.stringify({
      id: docId,
      type: docType,
      leadEmail: leadEmail || "",
      updatedAt: new Date().toISOString(),
      data,
    });

    const filePath = `documents/${docType}_${docId}.json`;
    const buffer = Buffer.from(filePayload, "utf-8");

    // Upload / update in attachments bucket
    const { error: uploadError } = await supabase.storage
      .from("attachments")
      .upload(filePath, buffer, {
        contentType: "application/json",
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.warn("Storage upload notice:", uploadError.message);
    }

    const publicUrl = `https://sgk.gr/doc/${docType}?id=${docId}`;

    return NextResponse.json({
      success: true,
      id: docId,
      type: docType,
      publicUrl,
      viewUrl: `/doc/${docType}?id=${docId}`,
    });
  } catch (err: any) {
    console.error("Documents API POST error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "contract";
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing document id" }, { status: 400 });
    }

    const docType = type === "invoice" ? "invoice" : "contract";
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });

    const filePath = `documents/${docType}_${id}.json`;
    const { data, error } = await supabase.storage
      .from("attachments")
      .download(filePath);

    if (error || !data) {
      return NextResponse.json({ error: "Document not found in cloud storage" }, { status: 404 });
    }

    const text = await data.text();
    const parsed = JSON.parse(text);

    return NextResponse.json({
      success: true,
      document: parsed,
    });
  } catch (err: any) {
    console.error("Documents API GET error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
