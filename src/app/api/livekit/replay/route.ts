import { NextRequest } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/nextAuth";

const s3 = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_KEY_ID!,
    secretAccessKey: process.env.S3_KEY_SECRET!,
  },
});
function extractS3Key(url: string) {
  const parsed = new URL(url);
  return decodeURIComponent(parsed.pathname.slice(1));
}

export async function GET(req: NextRequest) {
  // 🔐 AUTH
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const liveId = searchParams.get("id");

  if (!liveId) {
    return new Response("Missing id", { status: 400 });
  }

  // 📦 FETCH LIVE
  const live = await prisma.liveRoom.findUnique({
    where: { id: liveId },
    include: {
      participants: true,
    },
  });

  if (!live || !live.recordingUrl) {
    return new Response("Not found", { status: 404 });
  }

  // 🎥 RANGE SUPPORT
  const range = req.headers.get("range") || undefined;
  const key = extractS3Key(live.recordingUrl);

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key, // MUST BE "recordings/xxx.mp4"
    Range: range,
  });

  const data = await s3.send(command);

  const headers = new Headers();
  headers.set("Content-Type", "video/mp4");
  headers.set("Accept-Ranges", "bytes");

  if (data.ContentRange) {
    headers.set("Content-Range", data.ContentRange);
  }

  return new Response(data.Body as any, {
    status: range ? 206 : 200,
    headers,
  });
}
