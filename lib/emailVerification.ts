import crypto from "crypto";
import { prisma } from "@/lib/db";
import { sendTransactionalMail, isSmtpConfigured } from "@/lib/mailer";
import { getPublicOriginFromRequest } from "@/lib/siteUrl";

const TOKEN_TTL_HOURS = 24;

export function hashEmailVerificationToken(raw: string): string {
  return crypto.createHash("sha256").update(raw.trim(), "utf8").digest("hex");
}

/** Создаёт новый токен, инвалидируя предыдущие для этого пользователя. Возвращает открытый токен для ссылки в письме. */
export async function createEmailVerificationTokenForUser(
  userId: string,
): Promise<string> {
  const raw = crypto.randomBytes(32).toString("base64url");
  const tokenHash = hashEmailVerificationToken(raw);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 3600 * 1000);

  await prisma.$transaction([
    prisma.emailVerificationToken.deleteMany({ where: { userId } }),
    prisma.emailVerificationToken.create({
      data: { userId, tokenHash, expiresAt },
    }),
  ]);

  return raw;
}

/**
 * Проверяет токен, помечает email подтверждённым, удаляет токены пользователя.
 * @returns userId при успехе
 */
export async function verifyEmailVerificationToken(
  raw: string,
): Promise<{ userId: string } | null> {
  const trimmed = raw.trim();
  if (trimmed.length < 24) return null;

  const tokenHash = hashEmailVerificationToken(trimmed);
  const row = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
    select: { userId: true, expiresAt: true },
  });

  if (!row) return null;

  if (row.expiresAt < new Date()) {
    await prisma.emailVerificationToken.deleteMany({ where: { tokenHash } });
    return null;
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: row.userId },
      data: { emailVerified: true },
    }),
    prisma.emailVerificationToken.deleteMany({ where: { userId: row.userId } }),
  ]);

  return { userId: row.userId };
}

export function buildEmailVerificationUrl(
  origin: string,
  rawToken: string,
): string {
  const base = origin.replace(/\/$/, "");
  return `${base}/api/auth/verify-email?token=${encodeURIComponent(rawToken)}`;
}

export async function deliverEmailVerification(
  userId: string,
  email: string,
  req: Request,
): Promise<
  { mode: "sent" } | { mode: "dev_console"; link: string } | { mode: "failed" }
> {
  const raw = await createEmailVerificationTokenForUser(userId);
  const origin = getPublicOriginFromRequest(req);
  const link = buildEmailVerificationUrl(origin, raw);

  if (!isSmtpConfigured()) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("[emailVerification] В production нужен SMTP_HOST");
    }
    console.info(
      `[emailVerification] SMTP не настроен — ссылка подтверждения (dev): ${link}`,
    );
    return { mode: "dev_console", link };
  }

  const subject = "Подтвердите email — Копилка Online";
  const text = `Здравствуйте!\n\nПодтвердите адрес электронной почты, перейдя по ссылке (действует ${TOKEN_TTL_HOURS} ч.):\n\n${link}\n\nЕсли это были не вы — проигнорируйте письмо.`;
  const html = `<p>Здравствуйте!</p><p>Подтвердите адрес электронной почты для аккаунта на Копилка Online:</p><p><a href="${link.replace(/"/g, "&quot;")}">${link}</a></p><p>Ссылка действует ${TOKEN_TTL_HOURS} часов.</p><p>Если это были не вы — проигнорируйте письмо.</p>`;

  try {
    await sendTransactionalMail({
      to: email,
      subject,
      text,
      html,
    });
    return { mode: "sent" };
  } catch {
    // Подробности уже пишет `lib/mailer.ts` (без пароля).
    return { mode: "failed" };
  }
}
