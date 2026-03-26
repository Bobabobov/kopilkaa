// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { attachSessionToResponse, signAccessToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { checkUserBan } from "@/lib/ban-check";

export async function POST(req: Request) {
  try {
    const contentType = (req.headers.get("content-type") || "").toLowerCase();
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Ожидается JSON (Content-Type: application/json)" },
        { status: 415 },
      );
    }

    let body: { identifier?: unknown; password?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
    }

    const { identifier, password } = body;
    const rawIdentifier = String(identifier ?? "").trim();
    const rawPassword = typeof password === "string" ? password : "";

    if (!rawIdentifier || !rawPassword) {
      return NextResponse.json(
        { error: "Введите логин/email и пароль" },
        { status: 400 },
      );
    }

    const lookupField = rawIdentifier.includes("@") ? "email" : "username";
    const lookupValue = rawIdentifier.toLowerCase().replace(/\s+/g, "");

    const user = await prisma.user.findUnique({
      where:
        lookupField === "email"
          ? { email: lookupValue }
          : { username: lookupValue },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
        role: true,
        name: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Такого пользователя не существует" },
        { status: 404 },
      );
    }

    const ok = await bcrypt.compare(rawPassword, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
    }

    // Проверяем блокировку пользователя
    const banStatus = await checkUserBan(user.id);
    if (banStatus.isBanned) {
      const reason = banStatus.bannedReason || "Нарушение правил";
      const until = banStatus.bannedUntil
        ? ` до ${banStatus.bannedUntil.toLocaleDateString("ru-RU")}`
        : " навсегда";

      return NextResponse.json(
        {
          error: "Ваш аккаунт заблокирован",
          banInfo: {
            reason,
            until: banStatus.bannedUntil?.toISOString() || null,
            isPermanent: banStatus.isPermanent,
          },
        },
        { status: 403 },
      );
    }

    const res = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      accessToken: signAccessToken(
        { uid: user.id, role: user.role as any },
        process.env.ACCESS_TOKEN_SECRET || process.env.AUTH_SECRET || "dev-secret",
      ),
    });
    attachSessionToResponse(res, { uid: user.id, role: user.role as any }, req);
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Ошибка входа" }, { status: 500 });
  }
}
