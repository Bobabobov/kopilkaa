// lib/auth.ts
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type Role = "USER" | "ADMIN";
export type SessionPayload = { uid: string; role: Role; exp: number };

const COOKIE_NAME = "kopilka_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 дней
const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 дней
const DEV_ONLY_SECRET = "dev-secret-local-only";

function resolveSecret(secret: string | undefined, label: string): string {
  if (secret && secret.trim()) return secret;
  if (process.env.NODE_ENV !== "production") return DEV_ONLY_SECRET;
  throw new Error(`[auth] Missing required secret: ${label}`);
}

function getSessionSecret(): string {
  return resolveSecret(process.env.AUTH_SECRET, "AUTH_SECRET");
}

function getAccessSecret(): string {
  return resolveSecret(
    process.env.ACCESS_TOKEN_SECRET || process.env.AUTH_SECRET,
    "ACCESS_TOKEN_SECRET or AUTH_SECRET",
  );
}

const enc = (obj: any) =>
  Buffer.from(JSON.stringify(obj)).toString("base64url");

const dec = (s: string) => JSON.parse(Buffer.from(s, "base64url").toString());

const hmac = (data: string, secret: string) =>
  crypto.createHmac("sha256", secret).update(data).digest("base64url");

function getIsHttpsFromReq(req?: Request) {
  if (process.env.NODE_ENV !== "production") return false;
  if (!req) return true; // в проде обычно https, но для надёжности лучше передавать req

  const xfProto = req.headers.get("x-forwarded-proto");
  if (xfProto) return xfProto.toLowerCase().includes("https");

  const referer = req.headers.get("referer");
  if (referer) return referer.toLowerCase().startsWith("https://");

  return true;
}

export function signSession(
  payload: Omit<SessionPayload, "exp">,
  secret = getSessionSecret(),
) {
  const header = { alg: "HS256", typ: "JWT" };
  const body: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE,
  };
  const p1 = enc(header);
  const p2 = enc(body);
  const sig = hmac(`${p1}.${p2}`, secret);
  return `${p1}.${p2}.${sig}`;
}

export function verifySession(
  token?: string | null,
  secret = getSessionSecret(),
): SessionPayload | null {
  try {
    if (!token) return null;

    const [p1, p2, sig] = token.split(".");
    if (!p1 || !p2 || !sig) return null;

    const expect = hmac(`${p1}.${p2}`, secret);
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect)))
      return null;

    const payload: SessionPayload = dec(p2);
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export function signAccessToken(
  payload: Omit<SessionPayload, "exp">,
  secret = getAccessSecret(),
) {
  const header = { alg: "HS256", typ: "JWT" };
  const body: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_MAX_AGE,
  };
  const p1 = enc(header);
  const p2 = enc(body);
  const sig = hmac(`${p1}.${p2}`, secret);
  return `${p1}.${p2}.${sig}`;
}

export function verifyAccessToken(
  token?: string | null,
  secret = getAccessSecret(),
): SessionPayload | null {
  return verifySession(token, secret);
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    if (!cookieStore) return null;
    const token = cookieStore.get(COOKIE_NAME)?.value;
    return verifySession(token);
  } catch (error) {
    // В Next.js 14 cookies() может выбросить ошибку "digest" в некоторых контекстах
    // Игнорируем и возвращаем null
    if (process.env.NODE_ENV !== "production") {
      console.warn("[getSession] Error accessing cookies:", error);
    }
    return null;
  }
}

export async function getAuthUser(
  request: Request,
): Promise<SessionPayload | null> {
  const authHeader =
    request.headers.get("Authorization") ||
    request.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim();
    if (token) return verifyAccessToken(token);
    return null;
  }

  return getSession();
}

// Правильный способ для API routes: ставим cookie на NextResponse
export function attachSessionToResponse(
  res: NextResponse,
  payload: Omit<SessionPayload, "exp">,
  req?: Request,
) {
  const token = signSession(payload);
  const secure = getIsHttpsFromReq(req);
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}

export function attachClearSessionToResponse(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return res;
}

// Legacy: оставляем для совместимости, но для API лучше использовать attachSessionToResponse.
export async function clearSession() {
  try {
    const cookieStore = await cookies();
    if (!cookieStore) return;
    cookieStore.set(COOKIE_NAME, "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });
  } catch (error) {
    // В Next.js 14 cookies() может выбросить ошибку "digest" в некоторых контекстах
    if (process.env.NODE_ENV !== "production") {
      console.warn("[clearSession] Error accessing cookies:", error);
    }
    // ignore
  }
}
