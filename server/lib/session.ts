import { SignJWT, jwtVerify } from "jose";
import type { SessionPayload } from "@shared/schema";

// Retrieve the session secret from environment variables and encode it
const secretKey = process.env.SESSION_SECRET || "your-fallback-secret-key";
const encodedKey = new TextEncoder().encode(secretKey);

// Encrypts and signs the session payload as a JWT with a 7-day expiration
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

// Verifies and decodes the JWT session token
export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | undefined> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.log("Session decrypt error:", error);
    return undefined;
  }
}

// Creates a session token (for use in cookie setting logic elsewhere)
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  // Set expiration to 7 days from now
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  // Add expiration to payload
  const sessionPayload = {
    ...payload,
    expiresAt,
  };

  // Encrypt the session payload
  return await encrypt(sessionPayload);
}

// Session validation utility
export async function validateSession(sessionToken: string | undefined): Promise<SessionPayload | null> {
  if (!sessionToken) return null;
  
  const session = await decrypt(sessionToken);
  if (!session) return null;
  
  // Check if session is expired
  if (session.expiresAt && new Date() > new Date(session.expiresAt)) {
    return null;
  }
  
  return session;
}