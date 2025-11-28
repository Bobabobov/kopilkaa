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
    const telegramPhoto = tgData.photo_url || null;

    const session = await getSession();

    // Проверяем, существует ли пользователь из сессии (после очистки БД сессия может остаться, а пользователя уже нет)
    const sessionUser = session
      ? await prisma.user.findUnique({
          where: { id: session.uid },
          select: { id: true },
        })
      : null;

    if (session && sessionUser) {
      // Пользователь уже залогинен — привязываем Telegram к его аккаунту
      const updateData: any = {
        telegramId,
        telegramUsername,
      };

      // Если Телеграм прислал аватар — сохраняем его как аватар профиля
      if (telegramPhoto) {
        updateData.avatar = telegramPhoto;
      }

      // Автоматически добавляем публичную ссылку на Telegram-профиль
      if (telegramUsername) {
        updateData.telegramLink = `https://t.me/${telegramUsername}`;
      }

      const updated = await prisma.user.update({
        where: { id: sessionUser.id },
        data: updateData,
        select: {
          id: true,
          email: true,
          telegramId: true,
          telegramUsername: true,
          avatar: true,
          telegramLink: true,
        },
      });

      return NextResponse.json({
        success: true,
        mode: "linked",
        user: updated,
      });
    }

    // Полноценный вход через Telegram
    // 1) Пытаемся найти по telegramId
    // 2) Если не нашли и есть username, ищем по username/telegramLink —
    //    это позволяет "склеить" аккаунт, к которому ты заранее привязал ссылку на Telegram
    let user = await prisma.user.findFirst({
      where: telegramUsername
        ? {
            OR: [
              { telegramId },
              { telegramUsername },
              { telegramLink: { contains: `t.me/${telegramUsername}` } },
            ],
          }
        : { telegramId },
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

      const createData: any = {
        email: pseudoEmail,
        username,
        // создаём случайный пароль, т.к. вход по нему не предполагается
        passwordHash: "telegram-auto-user",
        name:
          [tgData.first_name, tgData.last_name].filter(Boolean).join(" ") || null,
        telegramId,
        telegramUsername,
        role: "USER",
      };

      // Сохраняем аватар из Telegram, если есть
      if (telegramPhoto) {
        createData.avatar = telegramPhoto;
      }

      // Автоматически выставляем публичную ссылку на Telegram
      if (telegramUsername) {
        createData.telegramLink = `https://t.me/${telegramUsername}`;
      }

      user = await prisma.user.create({
        data: createData,
      });
    } else {
      // Пользователь с таким Telegram уже есть — обновляем при необходимости
      const updateData: any = {};

      if (telegramUsername && user.telegramUsername !== telegramUsername) {
        updateData.telegramUsername = telegramUsername;
        updateData.telegramLink = `https://t.me/${telegramUsername}`;
      }

      if (telegramPhoto && !user.avatar) {
        updateData.avatar = telegramPhoto;
      }

      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
      }
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
  } catch (error: any) {
    console.error("Error in /api/auth/telegram:", error);
    const message =
      error?.message ||
      (typeof error === "string" ? error : "Неизвестная ошибка сервера");
    return NextResponse.json(
      {
        success: false,
        error: `Ошибка авторизации через Telegram: ${message}`,
      },
      { status: 500 },
    );
  }
}


