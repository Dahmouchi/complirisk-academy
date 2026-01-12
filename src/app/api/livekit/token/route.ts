// app/api/livekit/token/route.ts
import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";

export async function POST(req: Request) {
  try {
    // 4. DETERMINE ROLE SECURELY
    // Check if the logged-in user is the owner of the room
    const isTeacher = true;
    const isStudent = !isTeacher;

    // 5. Create Token
    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
      {
        identity: "tes125t", // Use unique User ID as identity
        name: "test",
        ttl: 60 * 60, // 1 hour
      }
    );

    // 6. Define Permissions based on Role
    if (isTeacher) {
      // TEACHER PERMISSIONS
      token.addGrant({
        room: "test", // The unique room name in LiveKit
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
        roomAdmin: true, // Can kick others, change metadata
      });
    } else {
      // STUDENT PERMISSIONS
      token.addGrant({
        room: "test",
        roomJoin: true,
        canPublish: true, // Set to false if you want students to only listen/watch
        canSubscribe: true,
        canPublishData: true, // Allows chat reactions
      });
    }

    const jwtToken = await token.toJwt();

    return NextResponse.json({
      token: jwtToken,
      url: process.env.LIVEKIT_URL,
      roomName: "test",
      isTeacher, // Send this back so the frontend knows which UI to show
    });
  } catch (error) {
    console.error("Token Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
