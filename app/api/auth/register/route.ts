// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { attachSessionToResponse } from "@/lib/auth";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

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

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body?.password ?? "");
    const name = String(body?.name ?? body?.username ?? "").trim();
    const usernameRaw = String(body?.username ?? "").trim().toLowerCase();
    const usernamePattern = /^[\p{L}\p{N}._-]{3,20}$/u;

    const phoneRaw = String(body?.phone ?? "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      return bad("Некорректный email");
    if (password.length < 8 || password.length > 30)
      return bad("Пароль должен быть 8–30 символов");
    if (!usernameRaw)
      return bad("Придумайте логин");
    if (!usernamePattern.test(usernameRaw))
      return bad(
        "Логин может содержать 3-20 символов: буквы, цифры, ._-",
      );

    // Телефон опционален
    let normalizedPhone: string | null = null;
    if (phoneRaw) {
      normalizedPhone = normalizePhone(phoneRaw);
      if (!normalizedPhone) {
        return bad("Введите корректный номер телефона");
      }
    }

    const exists = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (exists) return bad("Этот email уже зарегистрирован", 409);

    const usernameExists = await prisma.user.findUnique({
      where: { username: usernameRaw },
      select: { id: true },
    });
    if (usernameExists) return bad("Этот логин уже занят", 409);

    // Проверяем телефон только если он указан
    if (normalizedPhone) {
      const phoneExists = await prisma.user.findFirst({
        where: { phone: normalizedPhone },
        select: { id: true },
      });
      if (phoneExists) return bad("Этот телефон уже используется", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username: usernameRaw,
        phone: normalizedPhone || null,
        phoneVerified: false,
        passwordHash,
        name: name || null,
        role: "USER",
      },
      select: { id: true, role: true, email: true },
    });

    // Генерируем код подтверждения телефона только если телефон указан
    if (normalizedPhone) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.phoneLoginCode.create({
        data: {
          userId: user.id,
          code,
          expiresAt,
        },
      });

      // В продакшене код отправляется через SMS, здесь не логируем
    }

    // Сразу логиним (httpOnly-cookie через твой lib/auth.ts)
    // Система достижений отключена

    const res = NextResponse.json(
      {
        ok: true,
        user: { id: user.id, email: user.email },
        phone: normalizedPhone || null,
      },
      { status: 201 },
    );
    attachSessionToResponse(res, { uid: user.id, role: user.role as "USER" | "ADMIN" }, req);
    return res;
  } catch (err: any) {
    if (err?.code === "P2002")
      return bad("Этот email уже зарегистрирован", 409);
    console.error("register error:", err);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
