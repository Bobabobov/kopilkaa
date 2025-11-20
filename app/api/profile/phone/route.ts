// app/api/profile/phone/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]+/g, "");
  if (!digits) return null;

  if (digits.length === 10) {
    return `7${digits}`;
  }
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return `7${digits.slice(1)}`;
  }
  if (digits.length >= 7 && digits.length <= 15) {
    return digits;
  }
  return null;
}

// Привязка/обновление телефона у текущего пользователя и отправка кода подтверждения
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Необходимо войти в аккаунт" },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const phoneRaw = typeof body.phone === "string" ? body.phone : "";

    const normalized = normalizePhone(phoneRaw);
    if (!normalized) {
      return NextResponse.json(
        { success: false, error: "Введите корректный номер телефона" },
        { status: 400 },
      );
    }

    // Проверяем, что телефон не занят другим пользователем
    const existing = await prisma.user.findFirst({
      where: { phone: normalized, id: { not: session.uid } },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Этот номер уже привязан к другому аккаунту" },
        { status: 400 },
      );
    }

    // Обновляем телефон у текущего пользователя и сбрасываем флаг подтверждения
    const user = await prisma.user.update({
      where: { id: session.uid },
      data: {
        phone: normalized,
        phoneVerified: false,
      },
    });

    // Генерируем код подтверждения (можно использовать тот же PhoneLoginCode)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.phoneLoginCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    console.log("[DEBUG] Phone verify code for", normalized, ":", code);

    return NextResponse.json({
      success: true,
      code,
      message:
        "Код подтверждения отправлен (в тестовом режиме он возвращается в ответе, в реальном проекте придёт по SMS).",
    });
  } catch (error) {
    console.error("Error in /api/profile/phone:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка сохранения телефона" },
      { status: 500 },
    );
  }
}


