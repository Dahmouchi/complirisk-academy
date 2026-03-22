import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const getCorsHeaders = (request: Request) => {
  const origin = request.headers.get("origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
  };
};

const validateApiKey = (request: Request) => {
  const apiKey = request.headers.get("x-api-key");
  const validKey = process.env.BLOG_API_KEY;
  return apiKey === validKey;
};

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: any }> },
) {
  const corsHeaders = getCorsHeaders(request);
  try {
    const id = (await params).id;
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog non trouvé" },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(blog, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du blog" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: any }> },
) {
  const corsHeaders = getCorsHeaders(request);
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: "Non autorisé - Clé API manquante ou invalide" },
        { status: 401, headers: corsHeaders },
      );
    }

    const id = (await params).id;
    try {
      const body = await request.json();
      const { title, content, imageUrl, published, slug, excerpt } = body;

      const existingBlog = await prisma.blog.findUnique({
        where: { id },
      });

      if (!existingBlog) {
        return NextResponse.json(
          { error: "Blog non trouvé" },
          { status: 404, headers: corsHeaders },
        );
      }

      const updatedBlog = await prisma.blog.update({
        where: { id },
        data: {
          title: title !== undefined ? title : existingBlog.title,
          content: content !== undefined ? content : existingBlog.content,
          imageUrl: imageUrl !== undefined ? imageUrl : existingBlog.imageUrl,
          published:
            published !== undefined ? published : existingBlog.published,
          slug: slug !== undefined ? slug : existingBlog.slug,
          excerpt: excerpt !== undefined ? excerpt : existingBlog.excerpt,
        },
      });

      return NextResponse.json(updatedBlog, { headers: corsHeaders });
    } catch (parseError) {
      return NextResponse.json(
        { error: "JSON invalide" },
        { status: 400, headers: corsHeaders },
      );
    }
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du blog" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: any }> },
) {
  const corsHeaders = getCorsHeaders(request);
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: "Non autorisé - Clé API manquante ou invalide" },
        { status: 401, headers: corsHeaders },
      );
    }
    const id = (await params).id;

    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog non trouvé" },
        { status: 404, headers: corsHeaders },
      );
    }

    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Blog supprimé avec succès" },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du blog" },
      { status: 500, headers: corsHeaders },
    );
  }
}
