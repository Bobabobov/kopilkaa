// lib/auth.ts
import crypto from "crypto";
import { cookies } from "next/headers";

type Role = "USER" | "ADMIN";
export type SessionPayload = { uid: string; role: Role; exp: number };

const enc = (obj: any) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const dec = (s: string) => JSON.parse(Buffer.from(s, "base64url").toString());
const hmac = (data: string, secret: string) => crypto.createHmac("sha256", secret).update(data).digest("base64url");

const COOKIE_NAME = "kopilka_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 дней

export function signSession(payload: Omit<SessionPayload, "exp">, secret = process.env.AUTH_SECRET || "dev-secret") {
  const header = { alg: "HS256", typ: "JWT" };
  const body: SessionPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + MAX_AGE };
  const p1 = enc(header);
  const p2 = enc(body);
  const sig = hmac(p1 + "." + p2, secret);
  return [p1, p2, sig].join(".");
}

export function verifySession(token?: string | null, secret = process.env.AUTH_SECRET || "dev-secret"): SessionPayload | null {
  if (!token) return null;
  const [p1, p2, sig] = token.split(".");
  if (!p1 || !p2 || !sig) return null;
  const expect = hmac(p1 + "." + p2, secret);
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return null;
  const payload: SessionPayload = dec(p2);
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

export function getSession(): SessionPayload | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySession(token);
}

export function setSession(payload: Omit<SessionPayload, "exp">) {
  const token = signSession(payload);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearSession() {
  cookies().set(COOKIE_NAME, "", { httpOnly: true, expires: new Date(0), path: "/" });
}
