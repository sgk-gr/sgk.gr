import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_ENDPOINT = process.env.R2_ENDPOINT || (R2_ACCOUNT_ID ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined);

function getR2Client() {
  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT) {
    return null;
  }
  return new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

export async function POST(req: Request) {
  try {
    const { fileName, contentType } = await req.json();

    if (!fileName) {
      return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
    }

    const client = getR2Client();
    if (!client || !R2_BUCKET_NAME) {
      return NextResponse.json(
        {
          error: "Cloudflare R2 credentials not configured yet in environment variables",
          isMock: true,
        },
        { status: 503 }
      );
    }

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      ContentType: contentType || "image/jpeg",
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
    return NextResponse.json({ uploadUrl });
  } catch (error: any) {
    console.error("R2 sign upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");

    if (!fileName) {
      return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
    }

    const client = getR2Client();
    if (!client || !R2_BUCKET_NAME) {
      return NextResponse.json({ success: true, message: "Mock deletion (R2 not configured)" });
    }

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
    });

    await client.send(command);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("R2 delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
