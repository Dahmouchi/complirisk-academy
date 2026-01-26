import { NextRequest, NextResponse } from "next/server";
import { WebhookReceiver } from "livekit-server-sdk";
import prisma from "@/lib/prisma";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
);

/**
 * Extract ONLY the S3 object key from a full S3 URL
 */
function extractS3KeyFromUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    // Remove the leading slash to get the clean key
    return decodeURIComponent(parsedUrl.pathname.slice(1));
  } catch (error) {
    console.error("Invalid S3 URL received:", url);
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Read RAW body
    const body = await req.text();

    // 2️⃣ Read authorization header
    const authHeader =
      req.headers.get("Authorization") ||
      req.headers.get("livekit-webhook-authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing authorization header" },
        { status: 401 },
      );
    }

    // 3️⃣ Validate signature
    const event = await receiver.receive(body, authHeader);
    console.log("LiveKit event received:", event.event);

    // 4️⃣ Handle recording end
    if (event.event === "egress_ended" && event.egressInfo) {
      const info = event.egressInfo;
      const roomName = info.roomName;
      const egressId = info.egressId;

      // Get the full URL from LiveKit
      const fullVideoUrl =
        info.fileResults?.[0]?.location || (info as any).file?.location;

      if (!fullVideoUrl) {
        console.warn("Egress ended but no video URL found");
        return NextResponse.json({ received: true });
      }

      // Check if it is a URL
      if (!fullVideoUrl.startsWith("http")) {
        console.warn("Invalid video URL format:", fullVideoUrl);
        return NextResponse.json({ received: true });
      }

      // ✅ FIX: EXTRACT THE KEY HERE
      const s3Key = extractS3KeyFromUrl(fullVideoUrl);

      console.log(
        `Recording completed. Full: ${fullVideoUrl} -> Key: ${s3Key}`,
      );

      if (!s3Key) {
        console.error("Failed to extract S3 Key");
        return NextResponse.json({ received: true });
      }

      // 5️⃣ Update database with the KEY only
      const updateResult = await prisma.liveRoom.updateMany({
        where: {
          OR: [{ livekitRoom: roomName }, { egressId }],
        },
        data: {
          recordingUrl: s3Key, // ✅ Now strictly the Key (e.g., "video.mp4")
          recordingStatus: "COMPLETED",
          status: "ENDED",
          endedAt: new Date(),
        },
      });

      if (updateResult.count === 0) {
        console.warn(`No LiveRoom found for room=${roomName}`);
      } else {
        console.log(`Updated ${updateResult.count} live session(s)`);
      }
    }

    // 6️⃣ Acknowledge
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
