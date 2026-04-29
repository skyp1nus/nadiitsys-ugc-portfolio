import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "nd_session";

let cachedSecret: Uint8Array | null = null;
function getSecret(): Uint8Array {
  if (cachedSecret) return cachedSecret;
  const raw = process.env.AUTH_SECRET;
  if (!raw) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  cachedSecret = new TextEncoder().encode(raw);
  return cachedSecret;
}

export async function verifyPassword(input: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  return bcrypt.compare(input, hash);
}

export async function signSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload["role"] === "admin";
  } catch {
    return false;
  }
}

export async function getSessionFromRequest(
  req: Request
): Promise<boolean> {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  if (!match?.[1]) return false;
  return verifySession(match[1]);
}

export async function getSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySession(token);
}

/** Throws a 401 Response if session is invalid. Call at the top of route handlers. */
export async function requireAdmin(req: Request): Promise<void> {
  const ok = await getSessionFromRequest(req);
  if (!ok) throw new Response(JSON.stringify({ ok: false }), { status: 401 });
}
