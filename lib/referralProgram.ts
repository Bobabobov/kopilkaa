import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export const REFERRAL_VISITOR_COOKIE = "kopilka_ref_visitor";
export const REFERRAL_CODE_COOKIE = "kopilka_ref_code";

const DEFAULT_REFERRAL_MIN_ACTIVE_DAYS = 7;
const DEFAULT_REFERRAL_BONUS_AMOUNT = 50;

export function getReferralMinActiveDays(): number {
  const raw = process.env.REFERRAL_MIN_ACTIVE_DAYS;
  const n = raw ? Number(raw) : DEFAULT_REFERRAL_MIN_ACTIVE_DAYS;
  return Number.isFinite(n) && n > 0
    ? Math.floor(n)
    : DEFAULT_REFERRAL_MIN_ACTIVE_DAYS;
}

export function getReferralBonusAmount(): number {
  const raw = process.env.REFERRAL_BONUS_AMOUNT;
  const n = raw ? Number(raw) : DEFAULT_REFERRAL_BONUS_AMOUNT;
  return Number.isFinite(n) && n > 0
    ? Math.floor(n)
    : DEFAULT_REFERRAL_BONUS_AMOUNT;
}

export function isReferrerActive(
  referrerCreatedAt: Date,
  minActiveDays: number,
): boolean {
  const minMs = minActiveDays * 24 * 60 * 60 * 1000;
  return Date.now() >= referrerCreatedAt.getTime() + minMs;
}

function generateReferralCodeCandidate(): string {
  // Делаем “дружелюбный” для URL код: base64url без спецсимволов и короче.
  // Длина важна только для UX; уникальность контролируется в БД.
  return crypto.randomBytes(8).toString("base64url").slice(0, 10).toLowerCase();
}

export async function ensureReferralCodeForUser(
  userId: string,
): Promise<string> {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });

  if (existing?.referralCode) return existing.referralCode;

  const minAttempts = 1;
  const maxAttempts = 8;
  for (let i = minAttempts; i <= maxAttempts; i += 1) {
    const candidate = generateReferralCodeCandidate();
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { referralCode: candidate },
      });
      return candidate;
    } catch (err: any) {
      // P2002 = уникальность по referralCode нарушена (крайне редко).
      if (err?.code === "P2002") continue;
      throw err;
    }
  }

  throw new Error("Не удалось сгенерировать уникальный referralCode");
}

export async function tryAwardReferralBonusForNewUser(params: {
  newUserId: string;
  referralCode: string;
  visitorId: string;
}): Promise<{ awarded: boolean }> {
  const minActiveDays = getReferralMinActiveDays();

  if (!params.newUserId || !params.referralCode || !params.visitorId) {
    return { awarded: false };
  }

  const referrer = await prisma.user.findUnique({
    where: { referralCode: params.referralCode },
    select: { id: true, createdAt: true },
  });

  if (!referrer) return { awarded: false };
  if (!isReferrerActive(referrer.createdAt, minActiveDays))
    return { awarded: false };

  try {
    // Бонус НЕ выдаём здесь: выдача должна происходить только после одобрения заявки реферала.
    await prisma.referralRegistration.create({
      data: {
        referrerUserId: referrer.id,
        referredUserId: params.newUserId,
        visitorId: params.visitorId,
      },
    });

    return { awarded: true };
  } catch (err: any) {
    // Если регистрация по этой ссылке уже была учтена — уникальные ограничения дадут P2002.
    if (err?.code === "P2002") return { awarded: false };
    console.error("[referral] tryAwardReferralBonusForNewUser error:", err);
    return { awarded: false };
  }
}

export async function readReferralCookies(): Promise<{
  referralCode: string | null;
  visitorId: string | null;
}> {
  const store = await cookies();
  const referralCode = store.get(REFERRAL_CODE_COOKIE)?.value || null;
  const visitorId = store.get(REFERRAL_VISITOR_COOKIE)?.value || null;
  return { referralCode, visitorId };
}
