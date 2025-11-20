// app/api/auth/phone/request-code/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]+/g, "");
  if (!digits) return null;

  // Простейшая нормализация под формат РФ: 10 или 11 цифр
  if (digits.length === 10) {
    return `7${digits}`; // без начальной 8/7
  }
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return `7${digits.slice(1)}`;
  }
  // Для других стран просто возвращаем как есть, если длина адекватная
  if (digits.length >= 7 && digits.length <= 15) {
    return digits;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const phoneRaw = typeof body.phone === "string" ? body.phone : "";

    const normalized = normalizePhone(phoneRaw);
    if (!normalized) {
      return NextResponse.json(
        { success: false, error: "Введите корректный номер телефона" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: { phone: normalized },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Пользователь с таким телефоном не найден",
        },
        { status: 404 },
      );
    }

    // Генерируем 6-значный код
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 минут

    await prisma.phoneLoginCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    // В бою тут нужно отправить SMS, а код не возвращать
    console.log("[DEBUG] Phone login code for", normalized, ":", code);

    return NextResponse.json({
      success: true,
      // для теста показываем код прямо в ответе
      code,
      message:
        "Код отправлен (в тестовом режиме он возвращается в ответе, в реальном проекте придёт по SMS).",
    });
  } catch (error) {
    console.error("Error in /api/auth/phone/request-code:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка отправки кода входа" },
      { status: 500 },
    );
  }
}


