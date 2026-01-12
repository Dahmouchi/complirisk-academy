import { redirect } from "next/navigation";
import { getTeacherLiveRooms } from "@/actions/live-room";
import { Video, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { CreateLiveDialog } from "../../_components/CreateLiveDialog";
import { LiveCard } from "../../_components/LiveRoomCard";

export default async function TeacherLivesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "TEACHER") {
    redirect("/dashboard");
  }

  const [liveRooms, subjects] = await Promise.all([
    getTeacherLiveRooms(session.user.id),
    prisma.teacherSubject.findMany({
      where: { teacherId: session.user.id },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    }),
  ]);

  const teacherSubjects = subjects.map((ts) => ts.subject);

  const activeLives = liveRooms.filter((room) => room.status === "LIVE");
  const scheduledLives = liveRooms.filter(
    (room) => room.status === "SCHEDULED"
  );
  const pastLives = liveRooms.filter((room) => room.status === "ENDED");

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Video className="h-8 w-8 text-primary" />
            Mes Sessions Live
          </h1>
          <p className="text-muted-foreground mt-1">
            Créez et gérez vos sessions de cours en direct
          </p>
        </div>
        <CreateLiveDialog
          teacherId={session.user.id}
          subjects={teacherSubjects}
        />
      </div>

      {/* Active Lives */}
      {activeLives.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-xl font-semibold">En Direct Maintenant</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeLives.map((room) => (
              <div key={room.id}>
                <LiveCard room={room} isTeacher userId={session.user.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Lives */}
      {scheduledLives.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Sessions Programmées</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledLives.map((room) => (
              <div key={room.id}>
                <LiveCard room={room} isTeacher userId={session.user.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Lives */}
      {pastLives.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Sessions Terminées</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastLives.map((room) => (
              <div key={room.id}>
                <LiveCard room={room} isTeacher userId={session.user.id} />
              </div>
            ))}
          </div>
        </div>
      )}
      {liveRooms.length === 0 && (
        <div className="text-center py-12">
          <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Aucune session live pour le moment
          </h3>
          <p className="text-muted-foreground mb-6">
            Créez votre première session pour commencer à enseigner en direct
          </p>
          <CreateLiveDialog
            teacherId={session.user.id}
            subjects={teacherSubjects}
            trigger={
              <Button size="lg" className="gap-2">
                <Video className="h-5 w-5" />
                Créer ma Première Session
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
