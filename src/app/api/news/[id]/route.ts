import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/nextAuth";

// GET single news by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    const id = (await params).id;

    const news = await prisma.news.findUnique({
      where: { id: id },
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

    if (!news) {
      return NextResponse.json(
        { error: "Actualité non trouvée" },
        { status: 404 },
      );
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'actualité" },
      { status: 500 },
    );
  }
}

// PATCH - Update news (admin/teacher only, must be author or admin)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const id = (await params).id;
    const existingNews = await prisma.news.findUnique({
      where: { id: id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: "Actualité non trouvée" },
        { status: 404 },
      );
    }

    // Only admin or the author can edit
    if (user.role !== "ADMIN" && existingNews.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez modifier que vos propres actualités" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { title, content, excerpt, imageUrl, priority, published, gradeIds } =
      body;

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (priority !== undefined) updateData.priority = priority;
    if (published !== undefined) {
      updateData.published = published;
      // Set publishedAt if publishing for first time
      if (published && !existingNews.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    // Handle grade changes
    if (gradeIds) {
      // Delete existing grade associations
      await prisma.newsGrade.deleteMany({
        where: { newsId: id },
      });
      // Create new associations
      updateData.grades = {
        create: gradeIds.map((gradeId: string) => ({
          gradeId,
        })),
      };
    }

    const news = await prisma.news.update({
      where: { id: id },
      data: updateData,
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

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'actualité" },
      { status: 500 },
    );
  }
}

// DELETE - Delete news (admin/teacher only, must be author or admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const id = (await params).id;
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

    const existingNews = await prisma.news.findUnique({
      where: { id: id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: "Actualité non trouvée" },
        { status: 404 },
      );
    }

    // Only admin or the author can delete
    if (user.role !== "ADMIN" && existingNews.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez supprimer que vos propres actualités" },
        { status: 403 },
      );
    }

    await prisma.news.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Actualité supprimée avec succès" });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'actualité" },
      { status: 500 },
    );
  }
}
