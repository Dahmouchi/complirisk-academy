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
} from "lucide-react";
import { toast } from "react-toastify";

// Main Student Page Component
export default function StudentLiveRoomPage() {
  const params = useParams();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [status, setStatus] = useState<any>("LOADING");
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  const hasFetched = useRef(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch token and room status
  const fetchRoomStatus = useCallback(async () => {
    if (!params.id) return;

    try {
      const res = await getLiveToken(params.id as string);

      if (res.success) {
        setStatus(res.status);
        setRecordingUrl(res.recordingUrl || null);

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
          Impossible d'accéder à cette session
        </h2>
        <p className="text-muted-foreground max-w-md">
          Soit la session a été annulée, soit vous n'avez pas les droits
          d'accès.
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
            Cette session n'a pas encore commencé. Veuillez patienter.
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

  // 4. Live State - Simple VideoConference View
  if (status === "LIVE" && token && roomName) {
    return (
      <div className="min-h-screen w-full bg-slate-900">
        {/* Header */}
        <div className="h-14 border-b border-slate-700 flex items-center justify-between px-4 bg-slate-800 text-white">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex flex-col">
              <span className="font-semibold">Session en cours</span>
              <span className="text-xs text-slate-400">Classe en direct</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-sm text-red-400 font-medium">EN DIRECT</span>
          </div>
        </div>

        {/* LiveKit Room */}
        <div className="h-[calc(100vh-3.5rem)]">
          <LiveKitRoom
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            connect={true}
            audio={true}
            video={false} // Students don't share video
            onDisconnected={() => {
              console.log("Student disconnected");
              router.push("/dashboard");
            }}
          >
            <VideoConference />
            <RoomAudioRenderer />
          </LiveKitRoom>
        </div>
      </div>
    );
  }

  // 5. Ended State with Recording
  if (status === "ENDED" && recordingUrl) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center justify-start">
        <div className="w-full flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Video className="h-8 w-8 text-blue-600" />
            Replay de la session
          </h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Retour
          </Button>
        </div>

        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700">
          <video
            controls
            className="w-full h-full"
            src={recordingUrl}
            preload="metadata"
          >
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        </div>

        <div className="mt-6 text-center text-muted-foreground">
          <p>La session est terminée.</p>
        </div>
      </div>
    );
  }

  // 6. Ended State without Recording
  if (status === "ENDED" && !recordingUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <Video className="h-12 w-12 text-slate-400 mb-4" />
        <h2 className="text-2xl font-bold">Session Terminée</h2>
        <p className="text-muted-foreground mt-2">
          L'enregistrement sera bientôt disponible.
        </p>
        <Button className="mt-6" onClick={() => router.push("/dashboard")}>
          Retour au Dashboard
        </Button>
      </div>
    );
  }

  // 7. Fallback
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">État inconnu</p>
    </div>
  );
}
