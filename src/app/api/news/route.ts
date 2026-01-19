import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/nextAuth";

// GET all news (filtered by user's grade if student)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gradeId = searchParams.get("gradeId");
    const published = searchParams.get("published") !== "false";

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, gradeId: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 },
      );
    }

    // Build query based on role
    let whereClause: any = {};

    if (user.role === "USER") {
      // Students only see published news for their grade
      whereClause = {
        published: true,
        grades: user.gradeId
          ? {
              some: { gradeId: user.gradeId },
            }
          : undefined,
      };
    } else if (user.role === "TEACHER" || user.role === "ADMIN") {
      // Teachers/admins can see all news or filter
      if (published) {
        whereClause.published = true;
      }
      if (gradeId) {
        whereClause.grades = {
          some: { gradeId },
        };
      }
    }

    const news = await prisma.news.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            prenom: true,
            role: true,
          },
        },
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
      orderBy: [{ createdAt: "desc" }],
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des actualités" },
      { status: 500 },
    );
  }
}

// POST - Create new news (admin/teacher only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { title, content, excerpt, imageUrl, priority, published, gradeIds } =
      body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Le titre et le contenu sont requis" },
        { status: 400 },
      );
    }

    if (!gradeIds || gradeIds.length === 0) {
      return NextResponse.json(
        { error: "Au moins une classe doit être sélectionnée" },
        { status: 400 },
      );
    }

    const news = await prisma.news.create({
      data: {
        title,
        content,
        excerpt,
        imageUrl,
        priority: priority || "MEDIUM",
        published: published || false,
        publishedAt: published ? new Date() : null,
        authorId: session.user.id,
        grades: {
          create: gradeIds.map((gradeId: string) => ({
            gradeId,
          })),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            prenom: true,
            role: true,
          },
        },
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
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'actualité" },
      { status: 500 },
    );
  }
}
