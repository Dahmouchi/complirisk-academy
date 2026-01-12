import { AccessToken } from "livekit-server-sdk";

export async function generateLiveKitToken(
  roomName: string,
  participantName: string,
  participantId: string,
  isTeacher: boolean = false
) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("LiveKit credentials not configured");
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantId,
    name: participantName,
  });

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: isTeacher,
    canPublishData: true,
    canSubscribe: true,
  });

  return at.toJwt();
}

export function generateRoomName(subjectName: string, teacherName: string) {
  const timestamp = Date.now();
  const sanitizedSubject = subjectName.toLowerCase().replace(/\s+/g, "-");
  const sanitizedTeacher = teacherName.toLowerCase().replace(/\s+/g, "-");
  return `${sanitizedSubject}-${sanitizedTeacher}-${timestamp}`;
}
