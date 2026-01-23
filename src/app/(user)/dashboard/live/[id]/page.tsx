// app/student/live/[id]/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { getLiveToken } from "@/actions/live-room";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Video,
  AlertCircle,
  ArrowLeft,
  Headphones,
  BookOpen,
} from "lucide-react";
import { toast } from "react-toastify";
import QuizDisplay from "@/app/(user)/_components/quizSection";
import { useSession } from "next-auth/react";

// Main Student Page Component
export default function StudentLiveRoomPage() {
  const params = useParams();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [status, setStatus] = useState<any>("LOADING");
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<any>([]);
  const { data: session } = useSession();
  const hasFetched = useRef(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch token and room status
  const fetchRoomStatus = useCallback(async () => {
    if (!params.id) return;

    try {
      const res = await getLiveToken(params.id as string);
      console.log(res);
      if (res.success) {
        setStatus(res.status);
        setRecordingUrl(res.recordingUrl || null);
        setQuiz(res.quizzes || []);
        if (!token && res.token) {
          setToken(res.token);
          setRoomName(res.roomName);
        }
      } else {
        setStatus("ERROR");
        toast.error(res.error || "Erreur d'accès");
      }
    } catch (error) {
      console.error("Failed to fetch status:", error);
      setStatus("ERROR");
    }
  }, [params.id, token]);

  // Initial fetch - only once
  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    fetchRoomStatus();
  }, [fetchRoomStatus]);

  // Set up polling ONLY for SCHEDULED status
  useEffect(() => {
    if (status === "SCHEDULED") {
      pollingRef.current = setInterval(() => {
        fetchRoomStatus();
      }, 5000);
    } else {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [status, fetchRoomStatus]);

  // 1. Initial Loading
  if (status === "LOADING") {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-muted-foreground">Chargement de la session...</p>
      </div>
    );
  }

  // 2. Error State
  if (status === "ERROR") {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 px-4 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mb-2" />
        <h2 className="text-2xl font-bold">
          Impossible d&apos;accéder à cette session
        </h2>
        <p className="text-muted-foreground max-w-md">
          Soit la session a été annulée, soit vous n&apos;avez pas les droits
          d&apos;accès.
        </p>
        <Button onClick={() => router.push("/dashboard")} className="mt-4">
          Retour au Tableau de bord
        </Button>
      </div>
    );
  }

  // 3. Waiting State
  if (status === "SCHEDULED") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 px-4">
        <div className="relative">
          <Loader2 className="h-20 w-20 animate-spin text-blue-600" />
          <Headphones className="h-10 w-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400" />
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-3xl font-bold text-slate-800">
            En attente du professeur...
          </h2>
          <p className="text-lg text-slate-600">
            Cette session n&apos;a pas encore commencé. Veuillez patienter.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="mt-8"
        >
          Annuler
        </Button>
      </div>
    );
  }

  // 4. Live State - RESPONSIVE FIX APPLIED HERE
  if (status === "LIVE" && token && roomName) {
    return (
      // Changed: Use flex-col and h-screen to manage layout without main page scroll
      <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
        {/* Header - Fixed Height */}
        <div className="h-14 shrink-0 border-b border-slate-700 flex items-center justify-between px-4 bg-slate-800 text-white z-10">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="text-slate-400 hover:text-white hover:bg-slate-700 p-0 sm:px-3" // Adjusted padding for mobile
            >
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            <div className="flex flex-col">
              <span className="font-semibold text-sm sm:text-base">
                Session en cours
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Classe en direct
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-sm text-red-400 font-medium">EN DIRECT</span>
          </div>
        </div>

        {/* Content Area - Flex Container (Column on Mobile, Row on Desktop) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* LiveKit Room - Top on Mobile (50%), Left on Desktop (Flex-1) */}
          <div className="w-full h-[50vh] lg:h-full lg:flex-1 bg-white relative">
            <LiveKitRoom
              className="h-full w-full"
              token={token}
              serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
              connect={true}
              audio={true}
              screen={false}
              video={false}
              onDisconnected={() => {
                console.log("Student disconnected");
                router.push("/dashboard");
              }}
              // Ensure video conference fits the container
              data-lk-theme="default"
            >
              <VideoConference />
              <RoomAudioRenderer />
            </LiveKitRoom>
          </div>

          {/* Quiz/Sidebar - Bottom on Mobile (Rest of height), Right on Desktop (Fixed Width) */}
          <div className="w-full lg:w-[400px] overflow-y-scroll max-h-[50vh] lg:max-h-full h-full flex flex-col bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200">
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              {quiz.length > 0 ? (
                <QuizDisplay quizzes={quiz} userId={session?.user.id || ""} />
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm mt-4">
                  <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-800 mb-1">Quiz</h3>
                  <p className="text-slate-500 text-sm">
                    Aucun quiz actif pour le moment. Concentrez-vous sur le
                    cours !
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. Ended State with Recording
  if (status === "ENDED" && recordingUrl) {
    router.push("/dashboard");
  }

  // 6. Ended State without Recording
  if (status === "ENDED" && !recordingUrl) {
    router.push("/dashboard");
  }

  // 7. Fallback
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">État inconnu</p>
    </div>
  );
}
