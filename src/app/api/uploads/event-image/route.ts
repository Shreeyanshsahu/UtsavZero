
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type AllowedImageType = keyof typeof ALLOWED_TYPES;

function getR2Client() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials are not configured.");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be logged in to upload images." },
        { status: 401 }
      );
    }

    // 2. Verify organizer role
    const { data: role, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "private_organizer")
      .maybeSingle();

    if (roleError || !role) {
      return NextResponse.json(
        { error: "Only private organizers can upload event images." },
        { status: 403 }
      );
    }

    // 3. Validate upload request
    const body = await request.json();

    const contentType = body.contentType as string;
    const fileSize = Number(body.fileSize);

    if (
      !Object.prototype.hasOwnProperty.call(ALLOWED_TYPES, contentType)
    ) {
      return NextResponse.json(
        { error: "Only JPG, PNG and WebP images are supported." },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(fileSize) ||
      fileSize <= 0 ||
      fileSize > MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        { error: "Image size must be between 1 byte and 5 MB." },
        { status: 400 }
      );
    }

    // 4. Generate a unique object key
    const extension = ALLOWED_TYPES[contentType as AllowedImageType];
    const objectKey = `event-covers/${user.id}/${randomUUID()}.${extension}`;

    const bucketName = process.env.R2_BUCKET_NAME;

    if (!bucketName) {
      throw new Error("R2 bucket name is not configured.");
    }

    // 5. Generate temporary upload permission
    const r2 = getR2Client();

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2, command, {
      expiresIn: 300,
    });

    // 6. Return upload information
    const publicBaseUrl = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "");

    const publicUrl = publicBaseUrl
      ? `${publicBaseUrl}/${objectKey}`
      : null;

    return NextResponse.json({
      uploadUrl,
      objectKey,
      publicUrl,
      expiresIn: 300,
    });
  } catch (error) {
    console.error("Event image upload URL error:", error);

    return NextResponse.json(
      { error: "Unable to prepare image upload." },
      { status: 500 }
    );
  }
}
