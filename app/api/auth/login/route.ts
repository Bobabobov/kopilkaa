// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { attachSessionToResponse } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { AchievementService } from "@/lib/achievements/service";
import { checkUserBan } from "@/lib/ban-check";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();
    const rawIdentifier = String(identifier ?? "").trim();

    if (!rawIdentifier || !password) {
      return NextResponse.json(
        { error: "Введите логин/email и пароль" },
        { status: 400 },
      );
    }

    const lookupField = rawIdentifier.includes("@") ? "email" : "username";
    const lookupValue = rawIdentifier
      .toLowerCase()
      .replace(/\s+/g, "");

    const user = await prisma.user.findUnique({
      where: lookupField === "email"
        ? { email: lookupValue }
        : { username: lookupValue },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Такого пользователя не существует" },
        { status: 404 },
      );
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
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
          }
        },
        { status: 403 }
      );
    }

    // Проверяем и выдаём достижения при входе (в фоне)
    AchievementService.checkAndGrantAutomaticAchievements(user.id)
      .then((granted) => {
        if (granted.length > 0) {
          console.log(`User ${user.id} received ${granted.length} achievements on login`);
        }
      })
      .catch((error) => {
        console.error("Error checking achievements on login:", error);
      });

    const res = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
    attachSessionToResponse(res, { uid: user.id, role: user.role as any }, req);
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Ошибка входа" }, { status: 500 });
  }
}
