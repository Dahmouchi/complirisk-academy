import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const getCorsHeaders = (request: Request) => {
  const origin = request.headers.get("origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
};

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: any }> },
) {
  const corsHeaders = getCorsHeaders(request);
  try {
    const slug = (await params).slug;
    const blog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog non trouvé" },
        { status: 404, headers: corsHeaders },
      );
    }

    if (!blog.published) {
      return NextResponse.json(
        { error: "Blog non publié" },
        { status: 403, headers: corsHeaders },
      );
    }

    return NextResponse.json(blog, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du blog" },
      { status: 500, headers: corsHeaders },
    );
  }
}
