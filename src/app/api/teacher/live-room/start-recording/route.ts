// app/api/teacher/rooms/[id]/start-recording/route.ts
import { NextResponse } from "next/server";
import {
  EgressClient,
  EncodedFileType,
  EncodedFileOutput,
} from "livekit-server-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import prisma from "@/lib/prisma";

const egressClient = new EgressClient(
  process.env.LIVEKIT_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const liveRoomId = (await params).id;

  // 1. Verify ownership
  const room = await prisma.liveRoom.findUnique({
    where: { id: liveRoomId },
  });

  if (!room || room.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // 2. Start Recording (Room Composite)
  // This records the audio/video of all participants into one file
  const fileOutput = new EncodedFileOutput({
    fileType: EncodedFileType.MP4,
    filepath: `recordings/${room.id}-{time}.mp4`,
  });

  const egressInfo = await egressClient.startRoomCompositeEgress(
    room.livekitRoom!, // The LiveKit room name
    fileOutput,
    "speaker-light" // Layout preset as a direct string parameter
  );

  // 3. Update Database with Egress Info
  const updatedRoom = await prisma.liveRoom.update({
    where: { id: liveRoomId },
    data: {
      status: "LIVE",
      recordingStatus: "RECORDING",
      egressId: egressInfo.egressId,
    },
  });

  return NextResponse.json(updatedRoom);
}
