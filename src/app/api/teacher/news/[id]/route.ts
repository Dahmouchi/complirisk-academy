import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/nextAuth";

// PATCH - Update news (publish/unpublish or edit)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const newsId = (await params).id;
    const body = await request.json();

    // Verify the user owns this news
    const existingNews = await prisma.news.findUnique({
      where: { id: newsId },
      select: { authorId: true },
    });

    if (!existingNews || existingNews.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 },
      );
    }

    const updatedNews = await prisma.news.update({
      where: { id: newsId },
      data: body,
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
    });

    return NextResponse.json(updatedNews);
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'actualité" },
      { status: 500 },
    );
  }
}

// DELETE - Delete news
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const newsId = (await params).id;

    // Verify the user owns this news
    const existingNews = await prisma.news.findUnique({
      where: { id: newsId },
      select: { authorId: true },
    });

    if (!existingNews || existingNews.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 },
      );
    }

    await prisma.news.delete({
      where: { id: newsId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'actualité" },
      { status: 500 },
    );
  }
}
