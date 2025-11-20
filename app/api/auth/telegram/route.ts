// app/api/auth/telegram/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, setSession } from "@/lib/auth";
import { verifyTelegramAuth, TelegramAuthData } from "@/lib/telegramAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const tgData = body?.telegram as TelegramAuthData | undefined;

    if (!tgData || typeof tgData.id !== "number" || !tgData.hash) {
      return NextResponse.json(
        { success: false, error: "Некорректные данные Telegram" },
        { status: 400 },
      );
    }

    const verify = verifyTelegramAuth(tgData);
    if (!verify.ok) {
      return NextResponse.json(
        { success: false, error: verify.error || "Ошибка проверки Telegram" },
        { status: 400 },
      );
    }

    const telegramId = String(tgData.id);
    const telegramUsername = tgData.username || null;

    const session = await getSession();

    if (session) {
      // Пользователь уже залогинен — привязываем Telegram к его аккаунту
      const updated = await prisma.user.update({
        where: { id: session.uid },
        data: {
          telegramId,
          telegramUsername,
        },
        select: {
          id: true,
          email: true,
          telegramId: true,
          telegramUsername: true,
        },
      });

      return NextResponse.json({
        success: true,
        mode: "linked",
        user: updated,
      });
    }

    // Полноценный вход через Telegram
    let user = await prisma.user.findFirst({
      where: { telegramId },
    });

    // Если пользователя ещё нет — автоматически регистрируем его
    if (!user) {
      const pseudoEmail = `tg_${telegramId}@telegram.local`;
      const baseUsername = telegramUsername || `tg${telegramId}`;
      let username = baseUsername.toLowerCase();

      // гарантируем уникальность логина
      let suffix = 1;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const exists = await prisma.user.findUnique({
          where: { username },
          select: { id: true },
        });
        if (!exists) break;
        username = `${baseUsername.toLowerCase()}_${suffix++}`;
      }

      user = await prisma.user.create({
        data: {
          email: pseudoEmail,
          username,
          // создаём случайный пароль, т.к. вход по нему не предполагается
          passwordHash: "telegram-auto-user",
          name: [tgData.first_name, tgData.last_name].filter(Boolean).join(" ") || null,
          telegramId,
          telegramUsername,
          role: "USER",
        },
      });
    }

    await setSession({ uid: user.id, role: (user.role as any) || "USER" });

    return NextResponse.json({
      success: true,
      mode: "login",
      user: {
        id: user.id,
        email: user.email,
        telegramUsername: user.telegramUsername,
      },
    });
  } catch (error) {
    console.error("Error in /api/auth/telegram:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка авторизации через Telegram" },
      { status: 500 },
    );
  }
}


