// app/api/livekit/replay/route.ts
import { NextRequest } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/nextAuth";
import { verifyVideoToken } from "@/lib/video-token"; // Import the function from Step 1

const s3 = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_KEY_ID!,
    secretAccessKey: process.env.S3_KEY_SECRET!,
  },
});

export async function GET(req: NextRequest) {
  // 1. 🛡️ REFERER CHECK (Stops "New Tab" access)
  const referer = req.headers.get("referer");
  const host = req.headers.get("host"); // e.g., mydomain.com

  // If there is no referer, or the referer doesn't match your domain, block it.
  if (!referer || !referer.includes(host!)) {
    return new Response("Access Denied: Direct access not allowed", {
      status: 403,
    });
  }

  // 2. 🔐 AUTH SESSION
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const liveId = searchParams.get("id");
  const token = searchParams.get("token");

  if (!liveId || !token) {
    return new Response("Missing parameters", { status: 400 });
  }

  // 3. 🎫 TOKEN VERIFICATION
  const isValid = verifyVideoToken(token, liveId, session.user.id);
  if (!isValid) {
    return new Response("Invalid or expired token", { status: 403 });
  }

  // 📦 FETCH LIVE & STREAM (Your existing logic)
  const live = await prisma.liveRoom.findUnique({
    where: { id: liveId },
  });

  if (!live || !live.recordingUrl) {
    return new Response("Not found", { status: 404 });
  }

  const range = req.headers.get("range") || undefined;
  const key = live.recordingUrl;

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Range: range,
    });

    const data = await s3.send(command);

    const headers = new Headers();
    headers.set("Content-Type", "video/mp4");
    headers.set("Accept-Ranges", "bytes");

    // Add Cache-Control to prevent caching the video file on disk too easily
    headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );

    if (data.ContentRange) {
      headers.set("Content-Range", data.ContentRange);
    }
    if (data.ContentLength) {
      headers.set("Content-Length", data.ContentLength.toString());
    }

    return new Response(data.Body as any, {
      status: range ? 206 : 200,
      headers,
    });
  } catch (error: any) {
    if (error.name === "NoSuchKey") {
      return new Response("Video file not found", { status: 404 });
    }
    return new Response("Error streaming video", { status: 500 });
  }
}
