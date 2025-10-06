// lib/auth.ts
import crypto from "crypto";
import { cookies } from "next/headers";

type Role = "USER" | "ADMIN";
export type SessionPayload = { uid: string; role: Role; exp: number };

const enc = (obj: any) => {
  if (typeof window !== "undefined") {
    // В браузере используем btoa
    return btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  }
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
};

const dec = (s: string) => {
  if (typeof window !== "undefined") {
    // В браузере используем atob
    const base64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded));
  }
  return JSON.parse(Buffer.from(s, "base64url").toString());
};
const hmac = (data: string, secret: string) => {
  if (typeof window !== "undefined") {
    // В браузере используем Web Crypto API
    throw new Error("HMAC not available in browser context");
  }
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
};

const COOKIE_NAME = "kopilka_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 дней

export function signSession(
  payload: Omit<SessionPayload, "exp">,
  secret = process.env.AUTH_SECRET || "dev-secret",
) {
  const header = { alg: "HS256", typ: "JWT" };
  const body: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE,
  };
  const p1 = enc(header);
  const p2 = enc(body);
  const sig = hmac(p1 + "." + p2, secret);
  return [p1, p2, sig].join(".");
}

export function verifySession(
  token?: string | null,
  secret = process.env.AUTH_SECRET || "dev-secret",
): SessionPayload | null {
  try {
    if (!token) return null;

    // В браузере не можем проверить подпись, поэтому просто декодируем
    if (typeof window !== "undefined") {
      const [p1, p2, sig] = token.split(".");
      if (!p1 || !p2 || !sig) return null;

      const payload: SessionPayload = dec(p2);
      if (payload.exp < Math.floor(Date.now() / 1000)) return null;

      return payload;
    }

    const [p1, p2, sig] = token.split(".");
    if (!p1 || !p2 || !sig) return null;

    const expect = hmac(p1 + "." + p2, secret);
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect)))
      return null;

    const payload: SessionPayload = dec(p2);
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch (error) {
    console.error("Error verifying session:", error);
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const session = verifySession(token);
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export async function setSession(payload: Omit<SessionPayload, "exp">) {
  try {
    const token = signSession(payload);
    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: MAX_AGE,
    });
  } catch (error) {
    console.error("Error setting session:", error);
  }
}

export async function clearSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });
  } catch (error) {
    console.error("Error clearing session:", error);
  }
}
