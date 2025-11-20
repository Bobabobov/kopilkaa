// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/auth";
// import { checkAndGrantAchievements } from "@/lib/achievements"; // Удалено - система достижений отключена

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      return bad("Некорректный email");
    if (password.length < 8 || password.length > 72)
      return bad("Пароль должен быть 8–72 символа");
    if (!usernameRaw)
      return bad("Придумайте логин");
    if (!usernamePattern.test(usernameRaw))
      return bad(
        "Логин может содержать 3-20 символов: буквы, цифры, ._-",
      );

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

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username: usernameRaw,
        passwordHash,
        name: name || null,
        role: "USER",
      },
      select: { id: true, role: true, email: true },
    });

    // Сразу логиним (httpOnly-cookie через твой lib/auth.ts)
    await setSession({ uid: user.id, role: user.role as "USER" | "ADMIN" });

    // Система достижений отключена

    return NextResponse.json(
      { ok: true, user: { id: user.id, email: user.email } },
      { status: 201 },
    );
  } catch (err: any) {
    if (err?.code === "P2002")
      return bad("Этот email уже зарегистрирован", 409);
    console.error("register error:", err);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
