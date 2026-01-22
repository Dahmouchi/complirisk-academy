import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/nextAuth";

// GET teacher's live rooms
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId");

    // Verify the user is authorized
    if (teacherId !== session.user.id) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 },
      );
    }

    const lives = await prisma.liveRoom.findMany({
      where: {
        teacherId: teacherId,
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        grade: {
          select: {
            id: true,
            name: true,
          },
        },
        participants: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
      orderBy: [
        { status: "asc" }, // LIVE first, then SCHEDULED, then others
        { startsAt: "desc" },
      ],
    });

    return NextResponse.json(lives);
  } catch (error) {
    console.error("Error fetching teacher lives:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des sessions" },
      { status: 500 },
    );
  }
}
