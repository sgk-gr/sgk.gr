import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let fileName = searchParams.get("file") || searchParams.get("fileName");

    if (!fileName) {
      return new NextResponse("Missing file parameter", { status: 400 });
    }

    // Clean up filename if a full URL was passed
    if (fileName.includes("/")) {
      fileName = fileName.split("/").pop() || fileName;
    }
    fileName = fileName.split("?")[0];
    fileName = decodeURIComponent(fileName);

    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      return new NextResponse("File not found in storage", { status: 404 });
    }

    const contentType = response.ContentType || (
      fileName.endsWith(".png") ? "image/png" :
      fileName.endsWith(".webp") ? "image/webp" :
      fileName.endsWith(".pdf") ? "application/pdf" :
      "image/jpeg"
    );

    // Convert stream to readable web stream
    const byteArray = await response.Body.transformToByteArray();

    return new NextResponse(byteArray, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("R2 media proxy error:", error);
    return new NextResponse(`Error retrieving media: ${error.message}`, { status: 404 });
  }
}
