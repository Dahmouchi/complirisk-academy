import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/nextAuth";

// GET teacher's news
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get("authorId");

    // Verify the user is authorized
    if (authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 },
      );
    }

    const news = await prisma.news.findMany({
      where: {
        authorId: authorId,
      },
      include: {
        grades: {
          include: {
            grade: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [{ published: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching teacher news:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des actualités" },
      { status: 500 },
    );
  }
}
