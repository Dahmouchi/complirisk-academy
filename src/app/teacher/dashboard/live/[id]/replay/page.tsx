import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { getLiveReplay } from "@/actions/live-room";
import { ReplayPlayer } from "./ReplayPlayer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Video,
  Calendar,
  Clock,
  Users,
  Download,
  Play,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function LiveReplayPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "TEACHER") {
    redirect("/dashboard");
  }

  const result = await getLiveReplay(params.id);

  if (!result.success || !result.live) {
    redirect("/teacher/dashboard/live");
  }

  const live = result.live;

  // Check if user is the teacher who created this live
  if (live.teacherId !== session.user.id) {
    redirect("/teacher/dashboard/live");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/teacher/dashboard/live">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Retour aux sessions
            </Button>
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{ backgroundColor: live.subject?.color || "#6366f1" }}
                />
                <h1 className="text-3xl font-bold text-gray-900 truncate">
                  {live.name}
                </h1>
              </div>
              <p className="text-gray-600 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {live.subject?.name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <Video className="h-3 w-3 mr-1" />
                Replay disponible
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Player - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Card */}
            <Card className="overflow-hidden shadow-xl py-0 border-0 bg-white/80 backdrop-blur">
              <CardContent className="p-0">
                {live.signedRecordingUrl ? (
                  <ReplayPlayer videoUrl={live.signedRecordingUrl} />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">
                        Enregistrement en cours de traitement
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Le replay sera disponible sous peu
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description Card */}
            {live.description && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {live.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quizzes Section */}
            {live.quizzes && live.quizzes.length > 0 && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Play className="h-5 w-5 text-blue-600" />
                    Quiz associés
                  </CardTitle>
                  <CardDescription>
                    {live.quizzes.length} quiz
                    {live.quizzes.length > 1 ? "s" : ""} disponible
                    {live.quizzes.length > 1 ? "s" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {live.quizzes.map((quiz: any, index: number) => (
                      <div
                        key={quiz.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {quiz.title}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Voir les résultats
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Information Panel */}
          <div className="space-y-6">
            {/* Session Info Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subject */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${live.subject?.color}20`,
                    }}
                  >
                    <BookOpen
                      className="h-5 w-5"
                      style={{ color: live.subject?.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Matière
                    </p>
                    <p className="font-medium text-gray-900 truncate">
                      {live.subject?.name}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Date */}
                {live.startsAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Date
                      </p>
                      <p className="font-medium text-gray-900">
                        {format(new Date(live.startsAt), "PPPP", {
                          locale: fr,
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(live.startsAt), "HH:mm")}
                      </p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Teacher */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Enseignant
                    </p>
                    <p className="font-medium text-gray-900 truncate">
                      {live.teacher?.prenom} {live.teacher?.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span className="text-sm">Participants</span>
                  </div>
                  <span className="font-bold text-xl"></span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur">
                  <div className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    <span className="text-sm">Quiz</span>
                  </div>
                  <span className="font-bold text-xl">
                    {live.quizzes?.length || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg backdrop-blur">
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    <span className="text-sm">Statut</span>
                  </div>
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                    {live.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
