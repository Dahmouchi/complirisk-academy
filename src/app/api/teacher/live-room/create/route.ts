// app/api/teacher/rooms/create/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // Only teachers can create rooms
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, subjectId, gradeId, startsAt, duration } = body;

  try {
    // Generate a unique room name for LiveKit
    // You can use cuid, or combine slug(name) + timestamp
    const roomName = `live-${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}`;

    const newRoom = await prisma.liveRoom.create({
      data: {
        name,
        description,
        subjectId,
        gradeId,
        startsAt: new Date(startsAt),
        duration,
        teacherId: session.user.id, // Link to logged in teacher
        status: "SCHEDULED", // or LIVE if starting immediately
        livekitRoom: roomName, // Store the LiveKit room name here!
        recordingEnabled: true,
      },
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
