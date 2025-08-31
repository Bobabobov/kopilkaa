// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/auth";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    const name = String(body?.name ?? body?.username ?? "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return bad("Некорректный email");
    if (password.length < 8 || password.length > 72) return bad("Пароль должен быть 8–72 символа");

    const exists = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (exists) return bad("Этот email уже зарегистрирован", 409);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, name: name || null, role: "USER" },
      select: { id: true, role: true, email: true },
    });

    // Сразу логиним (httpOnly-cookie через твой lib/auth.ts)
    setSession({ uid: user.id, role: user.role as "USER" | "ADMIN" });

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") return bad("Этот email уже зарегистрирован", 409);
    console.error("register error:", err);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
