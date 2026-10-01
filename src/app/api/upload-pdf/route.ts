import { NextResponse } from "next/server";
import { getServiceSupabase, SUPABASE_URL } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Δεν παρέχεται αρχείο" }, { status: 400 });
    }

    const supabaseUrl = SUPABASE_URL;
    const supabase = getServiceSupabase();

    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from("attachments")
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/attachments/${data.path}`;

    return NextResponse.json({ publicUrl });
  } catch (err: any) {
    console.error("Upload API error:", err);
    return NextResponse.json({ error: err.message || "Σφάλμα διακομιστή" }, { status: 500 });
  }
}
