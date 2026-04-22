import { NextResponse } from "next/server";
import { verifyPassword, signSession, SESSION_COOKIE } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request): Promise<Response> {
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "local";

  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let password: unknown;
  try {
    const body = await req.json() as { password?: unknown };
    password = body.password;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const valid = await verifyPassword(password);
  if (!valid) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = await signSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
