"use client";

import React, { useState, useEffect } from "react";
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from "@livekit/components-react";
import {
  Room,
  Track,
  RemoteParticipant,
  RoomEvent,
  ConnectionState,
} from "livekit-client";
import "@livekit/components-styles";
import { toast } from "react-toastify";

interface TeacherStreamProps {
  teacherName: string;
  className?: string;
}

const TeacherStream: React.FC<TeacherStreamProps> = ({
  teacherName,
  className = "",
}) => {
  const [token, setToken] = useState("");
  const [wsUrl, setWsUrl] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);

  // Générer un nom de salle unique
  const generateRoomName = () => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    return `class-${teacherName
      .toLowerCase()
      .replace(/\s+/g, "-")}-${timestamp}-${randomId}`;
  };

  // Démarrer le streaming
  const startStream = async () => {
    setLoading(true);
    setError("");

    try {
      const newRoomName = generateRoomName();

      const response = await fetch("/api/livekit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName: newRoomName,
          participantName: teacherName,
          role: "teacher",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get access token");
      }

      const data = await response.json();

      setToken(data.token);
      setWsUrl(data.wsUrl);
      setRoomName(data.roomName);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start stream");
    } finally {
      setLoading(false);
    }
  };

  // Arrêter le streaming
  const stopStream = () => {
    setIsConnected(false);
    setToken("");
    setWsUrl("");
    setRoomName("");
    setParticipants([]);
  };

  // Copier le lien de la salle
  const copyRoomLink = () => {
    const roomLink = `${window.location.origin}/student/join?room=${roomName}`;
    navigator.clipboard.writeText(roomLink);
    alert("Lien de la salle copié dans le presse-papiers!");
  };

  // Gestionnaire d'événements de la salle
  const handleRoomEvent = (room: Room) => {
    room.on(RoomEvent.ParticipantConnected, (participant) => {
      console.log("Participant connected:", participant.identity);
      setParticipants((prev) => [...prev, participant]);
    });

    room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      console.log("Participant disconnected:", participant.identity);
      setParticipants((prev) =>
        prev.filter((p) => p.identity !== participant.identity),
      );
    });

    room.on(RoomEvent.ConnectionStateChanged, (state) => {
      console.log("Connection state changed:", state);
      if (state === ConnectionState.Disconnected) {
        setIsConnected(false);
      }
    });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-[6px] shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Streaming en Direct
            </h1>
            <p className="text-gray-600">
              Bonjour {teacherName}, prêt à démarrer votre cours ?
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <svg
                  className="w-5 h-5 text-red-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={startStream}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Démarrage...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4V8a3 3 0 016 0v2M5 18h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Démarrer le cours
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Une fois le cours démarré, vous pourrez partager le lien avec vos
              étudiants
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header de contrôle */}
      <div className="bg-white shadow-lg border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-900">
                EN DIRECT
              </span>
            </div>
            <div className="text-sm text-gray-600">Salle: {roomName}</div>
            <div className="text-sm text-gray-600">
              Participants: {participants.length + 1}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={copyRoomLink}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              📋 Copier le lien
            </button>
            <button
              onClick={stopStream}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              🛑 Arrêter
            </button>
          </div>
        </div>
      </div>

      {/* Interface de streaming LiveKit */}
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={wsUrl}
        data-lk-theme="default"
        style={{ height: "calc(100vh - 80px)" }}
        onConnected={() => toast.info("Connected to LiveKit")}
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
};

export default TeacherStream;
