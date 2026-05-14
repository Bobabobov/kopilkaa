import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import {
  REFERRAL_CODE_COOKIE,
  REFERRAL_VISITOR_COOKIE,
  getReferralMinActiveDays,
  isReferrerActive,
} from "@/lib/referralProgram";

export const runtime = "nodejs";

function getSignupRedirectUrl(requestUrl: string): URL {
  const url = new URL(requestUrl);
  url.pathname = "/";
  url.search = "";
  url.searchParams.set("modal", "auth/signup");
  url.searchParams.set("next", "/profile");
  return url;
}

function normalizeReferralCode(raw: string): string | null {
  const code = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!code) return null;
  // Ожидаем “свой” формат кода, но делаем мягкую валидацию.
  if (!/^[a-z0-9_-]{6,64}$/.test(code)) return null;
  return code;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } },
) {
  const referralCode = normalizeReferralCode(params.code);

  const redirectUrl = getSignupRedirectUrl(request.url);

  if (!referralCode) {
    return NextResponse.redirect(redirectUrl, 302);
  }

  const referrer = await prisma.user.findUnique({
    where: { referralCode },
    select: { id: true, createdAt: true, referralCode: true },
  });

  if (!referrer) {
    return NextResponse.redirect(redirectUrl, 302);
  }

  const minActiveDays = getReferralMinActiveDays();
  const isActive = isReferrerActive(referrer.createdAt, minActiveDays);
  if (!isActive) {
    // Ссылка “перешла”, но бонус от реферера заблокирован — не ставим referral cookies и не фиксируем клик.
    return NextResponse.redirect(redirectUrl, 302);
  }

  const secure = process.env.NODE_ENV === "production";
  const existingVisitorId = request.cookies.get(REFERRAL_VISITOR_COOKIE)?.value;
  const visitorId = existingVisitorId || crypto.randomUUID();

  // Фиксируем клик по ссылке (засчитываем максимум 1 раз на “visitorId” с этого устройства).
  try {
    await prisma.referralClick.create({
      data: {
        referrerUserId: referrer.id,
        visitorId,
      },
    });
  } catch (err: any) {
    // Если клик уже учтён (уникальный индекс) — просто игнорируем.
    if (err?.code !== "P2002") {
      console.error("[referral] click create error:", err);
    }
  }

  const res = NextResponse.redirect(redirectUrl, 302);
  const maxAgeSeconds = 60 * 60 * 24 * 30; // 30 дней

  res.cookies.set(REFERRAL_VISITOR_COOKIE, visitorId, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: maxAgeSeconds,
  });
  res.cookies.set(REFERRAL_CODE_COOKIE, referrer.referralCode!, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: maxAgeSeconds,
  });

  return res;
}
