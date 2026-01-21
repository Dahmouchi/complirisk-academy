import { NextRequest, NextResponse } from "next/server";
import { WebhookReceiver } from "livekit-server-sdk";
import prisma from "@/lib/prisma";

/**
 * LiveKit Webhook Receiver
 * Requires:
 * - LIVEKIT_API_KEY
 * - LIVEKIT_API_SECRET
 */
const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
);

/**
 * Extract ONLY the S3 object key from a full S3 URL
 * Example:
 * https://bucket.s3.amazonaws.com/folder/video.mp4
 * → folder/video.mp4
 */
function extractS3KeyFromUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return decodeURIComponent(parsedUrl.pathname.replace(/^\/+/, ""));
  } catch (error) {
    console.error("Invalid S3 URL received:", url);
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Read RAW body (required for LiveKit signature validation)
    const body = await req.text();

    // 2️⃣ Read authorization header
    const authHeader =
      req.headers.get("Authorization") ||
      req.headers.get("livekit-webhook-authorization");

    if (!authHeader) {
      console.error("LiveKit Webhook: Missing authorization header");
      return NextResponse.json(
        { error: "Missing authorization header" },
        { status: 401 },
      );
    }

    // 3️⃣ Validate signature & parse event
    const event = await receiver.receive(body, authHeader);

    console.log("LiveKit event received:", event.event);

    // 4️⃣ Handle recording end
    if (event.event === "egress_ended" && event.egressInfo) {
      const info = event.egressInfo;

      const roomName = info.roomName;
      const egressId = info.egressId;

      // LiveKit sometimes exposes file location in different fields
      const videoUrl =
        info.fileResults?.[0]?.location || (info as any).file?.location;

      if (!videoUrl) {
        console.warn("Egress ended but no video URL found in payload");
        return NextResponse.json({ received: true });
      }

      const fullVideoUrl = videoUrl;

      if (!fullVideoUrl.startsWith("http")) {
        console.warn("Invalid video URL:", fullVideoUrl);
        return NextResponse.json({ received: true });
      }

      console.log(
        `Recording completed for room=${roomName}, key=${fullVideoUrl}`,
      );

      // 5️⃣ Update database
      const updateResult = await prisma.liveRoom.updateMany({
        where: {
          OR: [{ livekitRoom: roomName }, { egressId }],
        },
        data: {
          recordingUrl: fullVideoUrl, // ✅ ONLY S3 KEY
          recordingStatus: "COMPLETED",
          status: "ENDED",
          endedAt: new Date(),
        },
      });

      if (updateResult.count === 0) {
        console.warn(
          `No LiveRoom found for room=${roomName} or egressId=${egressId}`,
        );
      } else {
        console.log(`Updated ${updateResult.count} live session(s)`);
      }
    }

    // 6️⃣ Always acknowledge LiveKit
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("LiveKit Webhook error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
