"use server";

import { generateLiveKitToken, generateRoomName } from "@/lib/livekit";
import { revalidatePath } from "next/cache";
import { RoomServiceClient, S3Upload } from "livekit-server-sdk";
import prisma from "@/lib/prisma";
import {
  generateRoomCode,
  getLiveKitToken,
  RoomCredentials,
} from "@/lib/livekit copy";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { uploadImage } from "./cours";
import sendEmail from "@/lib/sendemail";

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
);

interface CreateLiveRoomInput {
  name: string;
  description?: string;
  subjectId: string;
  teacherId: string;
  startsAt?: Date;
  duration?: number;
  maxParticipants?: number;
  recordingEnabled?: boolean;
  chatEnabled?: boolean;
  image?: File | null;
  quizzes?: any;
}

export async function createLiveRoom(data: CreateLiveRoomInput) {
  try {
    const [teacher, subject] = await Promise.all([
      prisma.user.findUnique({
        where: { id: data.teacherId },
        select: { id: true, name: true, prenom: true, role: true },
      }),
      prisma.subject.findUnique({
        where: { id: data.subjectId },
        select: { id: true, name: true, gradeId: true },
      }),
    ]);

    if (!teacher || teacher.role !== "TEACHER") {
      return { success: false, error: "Enseignant non trouvé" };
    }

    if (!subject) {
      return { success: false, error: "Matière non trouvée" };
    }

    const teacherFullName = `${teacher.prenom || ""} ${
      teacher.name || ""
    }`.trim();
    const livekitRoom = generateRoomName(subject.name, teacherFullName);

    let coverImageUrl: string | null = null;
    if (data.image) {
      coverImageUrl = await uploadImage(data.image);
    }
    // Créer le live room dans la base de données
    const liveRoom = await prisma.liveRoom.create({
      data: {
        name: data.name,
        description: data.description,
        type: "LIVEKIT",
        status: data.startsAt ? "SCHEDULED" : "DRAFT",
        teacherId: data.teacherId,
        subjectId: data.subjectId,
        gradeId: subject.gradeId,
        livekitRoom,
        startsAt: data.startsAt,
        image: coverImageUrl,
        duration: data.duration,
        maxParticipants: data.maxParticipants || 100,
        recordingEnabled: data.recordingEnabled ?? true,
        chatEnabled: data.chatEnabled ?? true,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            prenom: true,
            email: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });
    if (data.quizzes?.length) {
      for (const quizData of data.quizzes) {
        const quiz = await prisma.quiz.create({
          data: { title: quizData.title, liveRoomId: liveRoom.id },
        });

        if (quizData.questions?.length) {
          for (const questionData of quizData.questions) {
            const question = await prisma.question.create({
              data: {
                content: questionData.content,
                quizId: quiz.id,
                answer:
                  questionData.options.find((opt: any) => opt.isCorrect)
                    ?.text || "",
              },
            });

            // Créer les options sans transaction (plus rapide)
            if (questionData.options?.length) {
              await prisma.option.createMany({
                data: questionData.options.map((opt: any) => ({
                  text: opt.text,
                  isCorrect: opt.isCorrect,
                  questionId: question.id,
                })),
              });
            }
          }
        }
      }
    }

    // Send email notifications to students in the grade
    if (subject.gradeId) {
      const students = await prisma.user.findMany({
        where: {
          gradeId: subject.gradeId,
          role: "USER", // Only students
          NOT: { registerCode: null },
        },
        select: {
          email: true,
          name: true,
          prenom: true,
        },
      });

      // Filter students with valid emails and send email to each student
      for (const student of students.filter((s) => s.email)) {
        const studentName =
          `${student.prenom || ""} ${student.name || ""}`.trim() || "Étudiant";
        const liveStartDate = data.startsAt
          ? new Date(data.startsAt).toLocaleString("fr-FR", {
              dateStyle: "long",
              timeStyle: "short",
            })
          : "À déterminer";

        const emailHtml = `
        <!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Nouvelle Session Live</title>
</head>
<body style="margin: 0; padding: 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; background-color: #f5f7fa;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
        
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; color: #ffffff;">
            <div style="margin-bottom: 20px; background-color: #ffffff; padding: 10px; border-radius: 10px;">
                <img src="https://happytrip-test-cinq.puunoo.easypanel.host/logoH.jpg" alt="Logo" style="max-width: 180px; height: auto;">
            </div>
            <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.5px; color: #ffffff;">Nouvelle Session Live !</h1>
            <p style="font-size: 16px; opacity: 0.95; font-weight: 400; margin: 0; color: #ffffff;">Une nouvelle opportunité d'apprentissage vous attend</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 20px 10px;">
            <p style="font-size: 18px; color: #2d3748; margin: 0 0 20px 0; font-weight: 500;">Bonjour ${studentName},</p>
            
            <p style="font-size: 16px; color: #4a5568; margin: 0 0 30px 0; line-height: 1.7;">
                Nous avons le plaisir de vous informer qu'une nouvelle session live vient d'être programmée. 
                Préparez-vous à enrichir vos connaissances !
            </p>
            
            <!-- Live Session Card -->
            <div style="background: #fef3c7; border: 2px solid #3b82f6; border-radius: 10px; padding: 25px; margin: 25px 0;">
                <h2 style="font-size: 22px; color: #1a202c; font-weight: 700; margin: 0 0 15px 0;">📚 ${data.name}</h2>
                
                ${data.description ? `<p style="font-size: 15px; color: #4a5568; margin: 0 0 20px 0; line-height: 1.6;">${data.description}</p>` : ""}
                
                <div style="height: 1px; background: linear-gradient(90deg, transparent, #e2e8f0, transparent); margin: 20px 0;"></div>
                
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 6px 0; font-size: 15px;">
                            <span style="font-size: 18px; margin-right: 12px;">👨‍🏫</span>
                            <span style="font-weight: 600; color: #2d3748;">Enseignant :</span>
                            <span style="color: #4a5568;"> ${teacherFullName}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; font-size: 15px;">
                            <span style="font-size: 18px; margin-right: 12px;">📖</span>
                            <span style="font-weight: 600; color: #2d3748;">Matière :</span>
                            <span style="color: #4a5568;"> ${subject.name}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 6px 0; font-size: 15px;">
                            <span style="font-size: 18px; margin-right: 12px;">📅</span>
                            <span style="font-weight: 600; color: #2d3748;">Date :</span>
                            <span style="color: #4a5568;"> ${liveStartDate}</span>
                        </td>
                    </tr>
                    ${
                      data.duration
                        ? `
                    <tr>
                        <td style="padding: 6px 0; font-size: 15px;">
                            <span style="font-size: 18px; margin-right: 12px;">⏱️</span>
                            <span style="font-weight: 600; color: #2d3748;">Durée :</span>
                            <span style="color: #4a5568;"> ${data.duration} minutes</span>
                        </td>
                    </tr>
                    `
                        : ""
                    }
                </table>
            </div>
            
            <!-- Call to Action -->
            <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.NEXTAUTH_URL || "https://cinqcinq.ma"}/dashboard/live" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                    Accéder à mes Lives →
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
            `📚 Nouveau Live: ${data.name}`,
            emailHtml,
          );
        } catch (emailError) {
          console.error(`Error sending email to ${student.email}:`, emailError);
          // Continue sending to other students even if one fails
        }
      }
    }

    revalidatePath("/dashboard/teacher/lives");

    return { success: true, liveRoom };
  } catch (error) {
    console.error("Error creating live room:", error);
    return {
      success: false,
      error: "Erreur lors de la création du live",
    };
  }
}

export async function startLiveRoom(liveRoomId: string, teacherId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: "Utilisateur non trouvé" };
    }
    const liveRoom = await prisma.liveRoom.findUnique({
      where: { id: liveRoomId },
      include: {
        teacher: true,
        subject: true,
      },
    });

    if (!liveRoom || liveRoom.teacherId !== teacherId) {
      return { success: false, error: "Live non trouvé" };
    }

    if (liveRoom.status === "LIVE") {
      return { success: false, error: "Le live est déjà en cours" };
    }
    const credentials = await getLiveKitToken(
      liveRoom.name.trim(),
      session.user.username || "",
      session.user.role === "TEACHER" ? true : false,
    );
    await prisma.liveCredentials.create({
      data: {
        liveRoomId: liveRoomId,
        token: credentials.token,
        url: credentials.url,
        roomName: credentials.roomName,
      },
    });

    // Créer la room dans LiveKit
    await roomService.createRoom({
      name: liveRoom.livekitRoom!,
      emptyTimeout: 300, // 5 minutes
      maxParticipants: liveRoom.maxParticipants || 100,
    });

    // Mettre à jour le statut
    const updatedRoom = await prisma.liveRoom.update({
      where: { id: liveRoomId },
      data: {
        status: "LIVE",
        startsAt: new Date(),
      },
    });

    revalidatePath("/dashboard/teacher/lives");

    return { success: true, liveRoom: updatedRoom };
  } catch (error) {
    console.error("Error starting live room:", error);
    return {
      success: false,
      error: "Erreur lors du démarrage du live",
    };
  }
}

export async function endLiveRoomm(liveRoomId: string, teacherId: string) {
  try {
    const liveRoom = await prisma.liveRoom.findUnique({
      where: { id: liveRoomId },
    });

    if (!liveRoom || liveRoom.teacherId !== teacherId) {
      return { success: false, error: "Live non trouvé" };
    }

    // Supprimer la room de LiveKit
    try {
      await roomService.deleteRoom(liveRoom.livekitRoom!);
    } catch (error) {
      console.log("Room already deleted or doesn't exist");
    }

    // Mettre à jour le statut
    await prisma.liveRoom.update({
      where: { id: liveRoomId },
      data: {
        status: "ENDED",
        endedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/teacher/lives");

    return { success: true };
  } catch (error) {
    console.error("Error ending live room:", error);
    return {
      success: false,
      error: "Erreur lors de la fin du live",
    };
  }
}
export async function endLiveRoom(liveRoomId: string, teacherId: string) {
  try {
    const liveRoom = await prisma.liveRoom.findUnique({
      where: { id: liveRoomId },
    });

    if (!liveRoom || liveRoom.teacherId !== teacherId) {
      return { success: false, error: "Unauthorized" };
    }

    // Optional: Delete the room on LiveKit server to save resources
    // Note: This also triggers the recording to stop cleanly
    if (process.env.LIVEKIT_URL) {
      const { RoomServiceClient } = await import("livekit-server-sdk");
      const roomService = new RoomServiceClient(
        process.env.LIVEKIT_URL,
        process.env.LIVEKIT_API_KEY!,
        process.env.LIVEKIT_API_SECRET!,
      );

      await roomService.deleteRoom(liveRoom.livekitRoom!);
    }

    // Update status in DB
    await prisma.liveRoom.update({
      where: { id: liveRoomId },
      data: {
        status: "ENDED",
        endedAt: new Date(),
        duration: liveRoom.startsAt
          ? new Date().getTime() - liveRoom.startsAt.getTime()
          : 0,
        recordingStatus: "PROCESSING", // We set this to PROCESSING. Webhook will set to COMPLETED.
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error ending live room:", error);
    return { success: false, error: "Error ending session" };
  }
}
export async function getLiveTokens(liveRoomId: string, userId: string) {
  try {
    const [liveRoom, user] = await Promise.all([
      prisma.liveRoom.findUnique({
        where: { id: liveRoomId },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, prenom: true, role: true },
      }),
    ]);

    if (!liveRoom || !user) {
      return { success: false, error: "Live ou utilisateur non trouvé" };
    }

    if (liveRoom.status !== "LIVE") {
      return { success: false, error: "Le live n'est pas en cours" };
    }

    const isTeacher = user.role === "TEACHER" && liveRoom.teacherId === userId;
    const participantName = `${user.prenom || ""} ${user.name || ""}`.trim();

    const token = await generateLiveKitToken(
      liveRoom.livekitRoom!,
      participantName,
      userId,
      isTeacher,
    );

    // Enregistrer la participation
    if (!isTeacher) {
      await prisma.liveRoomParticipant.upsert({
        where: {
          liveRoomId_userId: {
            liveRoomId: liveRoomId,
            userId: userId,
          },
        },
        create: {
          liveRoomId: liveRoomId,
          userId: userId,
        },
        update: {},
      });
    }

    return { success: true, token };
  } catch (error) {
    console.error("Error generating token:", error);
    return {
      success: false,
      error: "Erreur lors de la génération du token",
    };
  }
}

export async function getTeacherLiveRooms(teacherId: string) {
  try {
    const liveRooms = await prisma.liveRoom.findMany({
      where: {
        teacherId,
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        grade: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return liveRooms;
  } catch (error) {
    console.error("Error fetching live rooms:", error);
    return [];
  }
}

export async function getAvailableLiveRooms(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { gradeId: true },
    });

    if (!user?.gradeId) {
      return [];
    }

    const liveRooms = await prisma.liveRoom.findMany({
      where: {
        status: "LIVE",
        gradeId: user.gradeId,
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
      orderBy: {
        startsAt: "asc",
      },
    });

    return liveRooms;
  } catch (error) {
    console.error("Error fetching available live rooms:", error);
    return [];
  }
}

// Ajouter à la fin du fichier actions/live-room.ts existant

export async function getStudentLiveRooms(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { gradeId: true },
    });

    if (!user?.gradeId) {
      return { live: [], scheduled: [], past: [] };
    }

    const now = new Date();

    const [live, scheduled, past] = await Promise.all([
      // Lives en cours
      prisma.liveRoom.findMany({
        where: {
          gradeId: user.gradeId,
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
        orderBy: {
          startsAt: "asc",
        },
      }),
      // Lives programmés
      prisma.liveRoom.findMany({
        where: {
          status: "SCHEDULED",
          gradeId: user.gradeId,
          startsAt: {
            gte: now,
          },
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
        orderBy: {
          startsAt: "asc",
        },
        take: 10,
      }),
      // Lives passés
      prisma.liveRoom.findMany({
        where: {
          status: "ENDED",
          gradeId: user.gradeId,
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
        orderBy: {
          endedAt: "desc",
        },
        take: 10,
      }),
    ]);

    return { live, scheduled, past };
  } catch (error) {
    console.error("Error fetching student live rooms:", error);
    return { live: [], scheduled: [], past: [] };
  }
}

export async function getCalendarLiveRooms(
  userId: string,
  month: number,
  year: number,
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { gradeId: true },
    });

    if (!user?.gradeId) {
      return [];
    }

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    const liveRooms = await prisma.liveRoom.findMany({
      where: {
        gradeId: user.gradeId,
        status: {
          in: ["SCHEDULED", "LIVE"],
        },
        startsAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            prenom: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
      orderBy: {
        startsAt: "asc",
      },
    });

    return liveRooms;
  } catch (error) {
    console.error("Error fetching calendar live rooms:", error);
    return [];
  }
}

export async function registerForLive(liveRoomId: string, userId: string) {
  try {
    const liveRoom = await prisma.liveRoom.findUnique({
      where: { id: liveRoomId },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    if (!liveRoom) {
      return { success: false, error: "Live non trouvé" };
    }

    if (liveRoom._count.participants >= (liveRoom.maxParticipants || 100)) {
      return { success: false, error: "Le live est complet" };
    }

    await prisma.liveRoomParticipant.create({
      data: {
        liveRoomId,
        userId,
      },
    });

    revalidatePath("/dashboard/student/lives");

    return { success: true };
  } catch (error) {
    console.error("Error registering for live:", error);
    return {
      success: false,
      error: "Erreur lors de l'inscription",
    };
  }
}

export async function unregisterFromLive(liveRoomId: string, userId: string) {
  try {
    await prisma.liveRoomParticipant.delete({
      where: {
        liveRoomId_userId: {
          liveRoomId,
          userId,
        },
      },
    });

    revalidatePath("/dashboard/student/lives");

    return { success: true };
  } catch (error) {
    console.error("Error unregistering from live:", error);
    return {
      success: false,
      error: "Erreur lors de la désinscription",
    };
  }
}

export async function isUserRegistered(liveRoomId: string, userId: string) {
  try {
    const participant = await prisma.liveRoomParticipant.findUnique({
      where: {
        liveRoomId_userId: {
          liveRoomId,
          userId,
        },
      },
    });

    return !!participant;
  } catch (error) {
    return false;
  }
}

import {
  EgressClient,
  EncodedFileType,
  EncodedFileOutput,
} from "livekit-server-sdk";
import { NextResponse } from "next/server";
import { getSignedVideoUrl } from "@/lib/aws/s3";
import { generateVideoToken } from "@/lib/video-token";
// ... (keep your existing createLiveRoom action)

export async function startLiveSession(liveRoomId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { success: false, error: "Unauthorized" };
  }

  // Check ownership
  const room = await prisma.liveRoom.findUnique({
    where: { id: liveRoomId },
  });

  if (!room || room.teacherId !== session.user.id) {
    return { success: false, error: "Forbidden" };
  }

  try {
    // 2. Initialize Clients
    const livekitUrl = process.env.LIVEKIT_URL!;
    const apiKey = process.env.LIVEKIT_API_KEY!;
    const apiSecret = process.env.LIVEKIT_API_SECRET!;

    const roomServiceClient = new RoomServiceClient(
      livekitUrl,
      apiKey,
      apiSecret,
    ); // <--- Create this client

    // 3. CRITICAL FIX: Create the Room on the LiveKit Server first
    // We wrap this in a try/catch because if the room already exists,
    // we don't want to stop the whole process.
    try {
      await roomServiceClient.createRoom({
        name: room.livekitRoom!,
        emptyTimeout: 10 * 60, // Close room if empty for 10 minutes
        maxParticipants: room.maxParticipants || 100,
      });
      console.log(`Room ${room.livekitRoom} created/verified.`);
    } catch (err: any) {
      // If the error is "already exists", ignore it. Otherwise, throw it.
      // LiveKit often throws 400 or 500 errors here depending on version if exists.
      console.log("Room creation log (might exist already):", err.message);
      // Do not return here, proceed to recording
    }

    // 4. Define the File Output
    // Note: Ensure you have S3/GCS configured in LiveKit config for this filepath to work
    const {
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET,
      LIVEKIT_URL,
      S3_KEY_ID,
      S3_KEY_SECRET,
      S3_BUCKET,
      S3_ENDPOINT,
      S3_REGION,
    } = process.env;

    const hostURL = new URL(LIVEKIT_URL!);
    hostURL.protocol = "https:";

    const egressClient = new EgressClient(
      hostURL.origin,
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET,
    );
    const roomName = room.livekitRoom!;
    const existingEgresses = await egressClient.listEgress({ roomName });
    if (
      existingEgresses.length > 0 &&
      existingEgresses.some((e) => e.status < 2)
    ) {
      return {
        success: false,
        error: "Meeting is already being recorded",
      };
    }

    const fileOutput = new EncodedFileOutput({
      filepath: `${new Date(Date.now()).toISOString()}-${roomName}.mp4`,
      output: {
        case: "s3",
        value: new S3Upload({
          endpoint: S3_ENDPOINT,
          accessKey: S3_KEY_ID,
          secret: S3_KEY_SECRET,
          region: S3_REGION,
          bucket: S3_BUCKET,
        }),
      },
    });

    const egressInfo = await egressClient.startRoomCompositeEgress(
      roomName,
      {
        file: fileOutput,
      },
      {
        layout: "speaker",
      },
    );

    // 6. Update DB Status
    const updatedRoom = await prisma.liveRoom.update({
      where: { id: liveRoomId },
      data: {
        status: "LIVE",
        recordingStatus: "RECORDING",
        egressId: egressInfo.egressId,
        startsAt: new Date(),
      },
    });

    return { success: true, data: updatedRoom };
  } catch (error) {
    console.error("Start Live Error:", error);
    return { success: false, error: "Failed to start recording" };
  }
}
// 1. Action to Start the Live (Teacher Only)
export async function startLiveSessionm(liveRoomId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { success: false, error: "Unauthorized" };
  }

  // Check ownership
  const room = await prisma.liveRoom.findUnique({
    where: { id: liveRoomId },
  });

  if (!room || room.teacherId !== session.user.id) {
    return { success: false, error: "Forbidden" };
  }

  // Start Recording via LiveKit Egress
  try {
    const egressClient = new EgressClient(
      process.env.LIVEKIT_URL!,
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
    );
    const fileOutput = new EncodedFileOutput({
      fileType: EncodedFileType.MP4,
      filepath: `/recordings/${room.id}-${Date.now()}.mp4`,
    });

    const egressInfo = await egressClient.startRoomCompositeEgress(
      room.livekitRoom!, // The LiveKit room name
      fileOutput,
      "speaker-light", // Layout preset as a direct string parameter
    );

    // Start recording the composite (speaker view)

    // Update DB Status
    const updatedRoom = await prisma.liveRoom.update({
      where: { id: liveRoomId },
      data: {
        status: "LIVE",
        recordingStatus: "RECORDING",
        egressId: egressInfo.egressId,
      },
    });

    return { success: true, data: updatedRoom };
  } catch (error) {
    console.error("Egress Error:", error);
    return { success: false, error: "Failed to start recording" };
  }
}

// 2. Action to get the JWT Token (Client calls this to connect)
export async function getLiveToken(liveRoomId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { success: false, error: "Unauthorized" };
  }

  // This mimics the API logic we wrote previously, but as a Server Action
  try {
    const liveRoom = await prisma.liveRoom.findUnique({
      where: { id: liveRoomId },
      include: {
        teacher: true,
        quizzes: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!liveRoom) {
      return { success: false, error: "Room not found" };
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) return { success: false, error: "User not found" };

    // Determine Role
    const isTeacher = liveRoom.teacherId === user.id;
    const isStudent = !isTeacher;

    // Import AccessToken locally to avoid circular dependencies or top-level import issues if not careful
    const { AccessToken } = await import("livekit-server-sdk");

    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
      {
        identity: user.id,
        name: user.name || user.username || "Guest",
        ttl: 60 * 60,
      },
    );

    // Permissions
    token.addGrant({
      room: liveRoom.livekitRoom!,
      roomJoin: true,
      canPublish: isTeacher || liveRoom.chatEnabled, // Students can publish if chat/video is enabled
      canSubscribe: true,
      canPublishData: true,
      roomAdmin: isTeacher,
    });

    // Record student join (Optional)
    if (isStudent) {
      await prisma.liveRoomParticipant.upsert({
        where: {
          liveRoomId_userId: { liveRoomId: liveRoom.id, userId: user.id },
        },
        create: { liveRoomId: liveRoom.id, userId: user.id },
        update: {},
      });
    }

    const jwtToken = await token.toJwt();

    return {
      success: true,
      token: jwtToken,
      url: process.env.LIVEKIT_URL,
      roomName: liveRoom.livekitRoom,
      isTeacher,
      status: liveRoom.status,
      recordingUrl: liveRoom.recordingUrl, // Pass this if we need to show recording
      quizzes: liveRoom.quizzes,
    };
  } catch (error) {
    console.error("Token Error:", error);
    return { success: false, error: "Server Error" };
  }
}

export async function getLivesRegistred() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, error: "Utilisateur non trouvé" };
    }
    const userGrad = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { gradeId: true },
    });
    const lives = await prisma.liveRoom.findMany({
      where: {
        gradeId: userGrad?.gradeId,
        recordingStatus: "COMPLETED",
      },
      include: {
        teacher: true,
        subject: true,
      },
    });
    return { success: true, lives };
  } catch (error) {
    console.error("Error getting lives:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération des lives",
    };
  }
}
function extractS3Key(url: string) {
  return url.split(".amazonaws.com/")[1];
}
export async function getVideoToken(liveId: string) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  return generateVideoToken(liveId, session.user.id);
}
export async function getLiveReplay(id: string) {
  try {
    const live = await prisma.liveRoom.findUnique({
      where: { id },
      include: {
        teacher: true,
        subject: true,
        quizzes: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!live) {
      return { success: false, error: "Live introuvable" };
    }

    let finalUrl: string | null = null;
    if (live.recordingUrl) {
      finalUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${live.recordingUrl}`;
    }

    return {
      success: true,
      live: {
        ...live,
        signedRecordingUrl: finalUrl,
      },
    };
  } catch (error) {
    console.error("Error getting live replay:", error);
    return {
      success: false,
      error: "Erreur lors de la récupération du replay",
    };
  }
}
