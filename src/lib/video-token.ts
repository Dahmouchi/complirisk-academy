// lib/video-token.ts
import { createHmac } from "crypto";

const SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret";

export function generateVideoToken(liveId: string, userId: string) {
  // Token valid for 1 hour (allows seeking/buffering)
  const expires = Date.now() + 1000 * 60 * 60;
  const data = `${liveId}:${userId}:${expires}`;

  // Create a signature
  const signature = createHmac("sha256", SECRET).update(data).digest("hex");

  return `${data}:${signature}`; // Return payload:signature
}

export function verifyVideoToken(
  token: string,
  liveId: string,
  userId: string,
) {
  const [id, uid, exp, sig] = token.split(":");

  // 1. Check integrity
  if (id !== liveId || uid !== userId) return false;

  // 2. Check expiration
  if (Date.now() > parseInt(exp)) return false;

  // 3. Verify signature
  const data = `${id}:${uid}:${exp}`;
  const expectedSig = createHmac("sha256", SECRET).update(data).digest("hex");

  return sig === expectedSig;
}
