import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/nextAuth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Get user's grades
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        grades: {
          select: { id: true },
        },
      },
    });

    if (!user?.grades || user.grades.length === 0) {
      return NextResponse.json([]);
    }

    const gradeIds = user.grades.map((g) => g.id);

    // Fetch upcoming and live sessions filtered by user's grades
    const liveRooms = await prisma.liveRoom.findMany({
      where: {
        gradeId: {
          in: gradeIds,
        },
        OR: [
          { status: "LIVE" },
          {
            status: "SCHEDULED",
            startsAt: {
              gte: new Date(), // Only future scheduled lives
            },
          },
        ],
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            prenom: true,
            image: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: [
        { status: "asc" }, // LIVE first
        { startsAt: "asc" }, // Then by start time
      ],
      take: 10, // Limit to 10 upcoming lives
    });

    return NextResponse.json(liveRooms);
  } catch (error) {
    console.error("Error fetching upcoming live rooms:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des lives" },
      { status: 500 },
    );
  }
}
