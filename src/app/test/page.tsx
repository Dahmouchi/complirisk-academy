"use client";
import { useState } from "react";
import { RoleSelector } from "@/components/RoleSelector";
import { RoomSetup } from "@/components/RoomSetup";
import { Classroom } from "@/components/Classroom";
import { RoomCredentials, UserRole } from "@/lib/livekit copy";

type AppState = "role-select" | "room-setup" | "classroom";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("role-select");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [roomCredentials, setRoomCredentials] =
    useState<RoomCredentials | null>(null);

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setAppState("room-setup");
  };

  const handleJoinRoom = (credentials: RoomCredentials) => {
    setRoomCredentials(credentials);
    setAppState("classroom");
  };

  const handleLeaveRoom = () => {
    setRoomCredentials(null);
    setSelectedRole(null);
    setAppState("role-select");
  };

  const handleBack = () => {
    setSelectedRole(null);
    setAppState("role-select");
  };

  if (appState === "classroom" && roomCredentials) {
    return (
      <Classroom credentials={roomCredentials} onLeave={handleLeaveRoom} />
    );
  }

  if (appState === "room-setup" && selectedRole) {
    return (
      <RoomSetup
        role={selectedRole}
        onBack={handleBack}
        onJoin={handleJoinRoom}
      />
    );
  }

  return <RoleSelector onSelectRole={handleSelectRole} />;
};

export default Index;
