import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { deliverEmailVerification } from "@/lib/emailVerification";
import { isSmtpConfigured } from "@/lib/mailer";

export const runtime = "nodejs";

/**
 * Повторная отправка письма подтверждения.
 * Ответ одинаковый при отсутствии пользователя — без перечисления зарегистрированных адресов.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email ?? "")
      .trim()
      .toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Некорректный email" },
        { status: 400 },
      );
    }

    if (process.env.NODE_ENV === "production" && !isSmtpConfigured()) {
      console.error(
        "[API Error] /api/auth/resend-verification: SMTP не настроен в production",
      );
      return NextResponse.json(
        { ok: false, error: "Отправка писем временно недоступна." },
        { status: 503 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, emailVerified: true },
    });

    if (!user || user.emailVerified) {
      return NextResponse.json({
        ok: true,
        message:
          "Если этот адрес зарегистрирован и не подтверждён, мы отправили письмо.",
      });
    }

    const delivery = await deliverEmailVerification(user.id, email, req);

    return NextResponse.json({
      ok: true,
      message:
        "Если этот адрес зарегистрирован и не подтверждён, мы отправили письмо.",
      emailDispatchFailed: delivery.mode === "failed",
      ...(delivery.mode === "dev_console"
        ? { devInlineVerificationLink: delivery.link }
        : {}),
    });
  } catch (err) {
    console.error("[API Error] /api/auth/resend-verification:", err);
    return NextResponse.json(
      { ok: false, error: "Не удалось отправить письмо. Попробуйте позже." },
      { status: 500 },
    );
  }
}
