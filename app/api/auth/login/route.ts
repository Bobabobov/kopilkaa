// app/api/auth/login/route.ts
import { prisma } from "@/lib/db";
import { setSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return Response.json({ error: "Введите email и пароль" }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return Response.json({ error: "Неверные email или пароль" }, { status: 401 });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return Response.json({ error: "Неверные email или пароль" }, { status: 401 });

    setSession({ uid: user.id, role: user.role });
    return Response.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch {
    return Response.json({ error: "Ошибка входа" }, { status: 500 });
  }
}
