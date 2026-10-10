import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "64dbfe29358f1df34ab375dd0936db21";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "2a003628b63e17138ddef40de2dc529d";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "13b0fb7ec6026336d2743c02a78733b4d1d6838867baa6de96ed6742409c349d";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "sgk-ftth-autopsia";
const R2_ENDPOINT = process.env.R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

const s3Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    let fileName = (formData.get("fileName") as string) || (file?.name ?? "");

    if (!file) {
      return NextResponse.json({ error: "Missing file parameter" }, { status: 400 });
    }

    if (fileName.includes("/")) {
      fileName = fileName.split("/").pop() || fileName;
    }
    fileName = fileName.split("?")[0];
    fileName = decodeURIComponent(fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || (
      fileName.endsWith(".png") ? "image/png" :
      fileName.endsWith(".webp") ? "image/webp" :
      fileName.endsWith(".pdf") ? "application/pdf" :
      "image/jpeg"
    );

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    const mediaUrl = `/api/autopsia/media?file=${encodeURIComponent(fileName)}`;
    return NextResponse.json({ success: true, url: mediaUrl, fileName });
  } catch (error: any) {
    console.error("Direct R2 upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
