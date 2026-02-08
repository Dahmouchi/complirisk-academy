import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/nextAuth";
import sendEmail from "@/lib/sendemail";

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
      select: { role: true, grades: true },
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
        grades: user.grades
          ? {
              some: { gradeId: user.grades[0].id },
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

    // Send email notifications to students if the news is published
    if (published && gradeIds && gradeIds.length > 0) {
      const students = await prisma.user.findMany({
        where: {
          grades: {
            some: {
              id: {
                in: gradeIds,
              },
            },
          },
          role: "USER", // Only students
          NOT: { registerCode: null },
        },
        select: {
          email: true,
          name: true,
          prenom: true,
        },
      });

      // Get author full name
      const author = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, prenom: true },
      });

      const authorFullName = `${author?.prenom || ""} ${
        author?.name || ""
      }`.trim();

      // Priority badge styling
      const priorityStyles = {
        HIGH: {
          background: "#fee2e2",
          color: "#991b1b",
          border: "#ef4444",
          text: "🔴 URGENT",
        },
        MEDIUM: {
          background: "#fef3c7",
          color: "#92400e",
          border: "#f59e0b",
          text: "📌 IMPORTANT",
        },
        LOW: {
          background: "#dbeafe",
          color: "#1e40af",
          border: "#3b82f6",
          text: "ℹ️ INFO",
        },
      };

      const priorityStyle =
        priorityStyles[priority as keyof typeof priorityStyles] ||
        priorityStyles.MEDIUM;

      // Filter students with valid emails and send email to each student
      for (const student of students.filter((s) => s.email)) {
        const studentName =
          `${student.prenom || ""} ${student.name || ""}`.trim() || "Étudiant";

        const emailHtml = `
        <!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Nouvelle Annonce</title>
</head>
<body style="margin: 0; padding: 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; background-color: #f5f7fa;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
        
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 20px 10px; text-align: center; color: #ffffff;">
            <div style="margin-bottom: 20px; background-color: #ffffff; padding: 10px; border-radius: 10px;">
                <img src="https://happytrip-test-cinq.puunoo.easypanel.host/logoH.jpg" alt="Logo" style="max-width: 180px; height: auto;">
            </div>
            <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.5px; color: #ffffff;">📢 Nouvelle Annonce</h1>
            <p style="font-size: 16px; opacity: 0.95; font-weight: 400; margin: 0; color: #ffffff;">Une nouvelle actualité vient d'être publiée</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 20px 10px;">
            <p style="font-size: 18px; color: #2d3748; margin: 0 0 20px 0; font-weight: 500;">Bonjour ${studentName},</p>
            
            <p style="font-size: 16px; color: #4a5568; margin: 0 0 30px 0; line-height: 1.7;">
                Une nouvelle annonce a été publiée sur la plateforme et mérite votre attention.
            </p>
            
            <!-- Priority Badge -->
            <div style="background: ${priorityStyle.background}; border-left: 4px solid ${priorityStyle.border}; padding: 12px 15px; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: ${priorityStyle.color}; font-weight: 600;">
                    ${priorityStyle.text}
                </p>
            </div>
            
            <!-- News Card -->
            <div style="background: #f8fafc; border: 2px solid #8b5cf6; border-radius: 10px; padding: 25px; margin: 25px 0;">
                <h2 style="font-size: 22px; color: #1a202c; font-weight: 700; margin: 0 0 15px 0;">📰 ${title}</h2>
                
                ${excerpt ? `<p style="font-size: 15px; color: #4a5568; margin: 0 0 20px 0; line-height: 1.6; font-style: italic;">${excerpt}</p>` : ""}
                
                <div style="height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent); margin: 20px 0;"></div>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 6px 0; font-size: 15px;">
                            <span style="font-size: 18px; margin-right: 12px;">👤</span>
                            <span style="font-weight: 600; color: #2d3748;">Publié par :</span>
                            <span style="color: #4a5568;"> ${authorFullName}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; font-size: 15px;">
                            <span style="font-size: 18px; margin-right: 12px;">📅</span>
                            <span style="font-weight: 600; color: #2d3748;">Date :</span>
                            <span style="color: #4a5568;"> ${new Date().toLocaleString(
                              "fr-FR",
                              {
                                dateStyle: "long",
                                timeStyle: "short",
                              },
                            )}</span>
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Call to Action -->
            <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.NEXTAUTH_URL || "https://cinqcinq.ma"}/dashboard/news" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                    Lire l'Annonce Complète →
                </a>  
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 13px; color: #718096; line-height: 1.6; margin: 0 0 15px 0;">
                Cet email a été envoyé automatiquement par votre plateforme d'apprentissage.<br>
                Merci de ne pas répondre directement à ce message.
            </p>
            
            <div style="margin-top: 15px;">
                <a href="${process.env.NEXTAUTH_URL || "https://cinqcinq.ma"}/dashboard" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 10px;">Tableau de bord</a>
                <span style="color: #cbd5e0;">•</span>
                <a href="${process.env.NEXTAUTH_URL || "https://cinqcinq.ma"}/support" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 10px;">Support</a>
                <span style="color: #cbd5e0;">•</span>
                <a href="${process.env.NEXTAUTH_URL || "https://cinqcinq.ma"}/settings" style="color: #3b82f6; text-decoration: none; font-size: 13px; margin: 0 10px;">Préférences</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #718096;">
                © ${new Date().getFullYear()} CINQCINQ. Tous droits réservés.
            </p>
        </div>
    </div>
</body>
</html>
        `;

        try {
          await sendEmail(
            student.email,
            `📢 Nouvelle Annonce: ${title}`,
            emailHtml,
          );
        } catch (emailError) {
          console.error(`Error sending email to ${student.email}:`, emailError);
          // Continue sending to other students even if one fails
        }
      }
    }

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'actualité" },
      { status: 500 },
    );
  }
}
