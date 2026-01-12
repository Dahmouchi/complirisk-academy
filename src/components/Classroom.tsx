"use client";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import { RoomCredentials } from "@/lib/livekit copy";
import { ClassroomView } from "./classroom/ClassroomView";

interface ClassroomProps {
  credentials: RoomCredentials;
  onLeave?: () => void;
}

export const Classroom = ({ credentials, onLeave }: ClassroomProps) => {
  const handleDisconnect = () => {
    console.log("Disconnected from room");
    if (onLeave) {
      onLeave();
    }
  };

  return (
    <LiveKitRoom
      token={credentials.token}
      serverUrl={credentials.url}
      connect={true}
      audio={true}
      video={credentials.isTeacher}
      onDisconnected={handleDisconnect}
      data-lk-theme="default"
      style={{ height: "100vh" }}
    >
      <RoomAudioRenderer />
      <ClassroomView
        isTeacher={credentials.isTeacher}
        roomCode={credentials.roomName}
        participantName={credentials.participantName}
        onLeave={handleDisconnect}
      />
    </LiveKitRoom>
  );
};
