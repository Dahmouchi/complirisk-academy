export type UserRole = "teacher" | "student";

export interface RoomCredentials {
  token: string;
  url: string;
  roomName: string;
  participantName: string;
  isTeacher: boolean;
}

export const generateRoomCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const getLiveKitToken = async (
  roomName: string,
  participantName: string,
  isTeacher: boolean
): Promise<RoomCredentials> => {
  // Construct absolute URL for server-side fetching
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";
  const url = `${baseUrl}/api/livekit/token`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomName,
      participantName,
      isTeacher,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to get room access");
  }

  const data = await res.json();

  if (!data.token || !data.url) {
    throw new Error("Invalid response from server");
  }

  return data as RoomCredentials;
};
