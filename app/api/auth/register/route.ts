// app/api/auth/register/route.ts
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const em = (email ?? "").toString().trim().toLowerCase();
    const nm = (name ?? "").toString().trim();
    const pw = (password ?? "").toString();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) {
      return Response.json({ error: "Некорректный email" }, { status: 400 });
    }
    if (pw.length < 8) {
      return Response.json({ error: "Пароль должен быть не короче 8 символов" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email: em }, select: { id: true } });
    if (exists) {
      return Response.json({ error: "Пользователь с таким email уже есть" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(pw, 10);

    await prisma.user.create({
      data: {
        email: em,
        name: nm || null,
        role: "USER",
        passwordHash, // ВАЖНО: пишем хеш, не password
      },
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
