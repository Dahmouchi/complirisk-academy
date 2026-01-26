import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Fetch all upcoming and live sessions
    const liveRooms = await prisma.liveRoom.findMany({
      where: {
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
