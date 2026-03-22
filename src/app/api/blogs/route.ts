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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = validateApiKey(request);
    const getAll = isAdmin && searchParams.get("all") === "true";

    const blogs = await prisma.blog.findMany({
      where: getAll ? {} : { published: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(blogs, { headers: getCorsHeaders(request) });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des blogs" },
      { status: 500, headers: getCorsHeaders(request) },
    );
  }
}

export async function POST(request: Request) {
  const corsHeaders = getCorsHeaders(request);
  try {
    const body = await request.json();
    const { title, content, imageUrl, published, slug, excerpt } = body;

    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: "Le titre, le contenu et le slug sont requis" },
        { status: 400, headers: corsHeaders },
      );
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        imageUrl,
        slug,
        excerpt,
        published: published || false,
      },
    });

    return NextResponse.json(blog, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du blog" },
      { status: 500, headers: corsHeaders },
    );
  }
}
