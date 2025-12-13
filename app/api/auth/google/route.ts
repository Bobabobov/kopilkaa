// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, setSession } from "@/lib/auth";

interface GoogleAuthData {
  credential: string; // Google ID token
  email: string;
  name: string;
  picture?: string;
  sub: string; // Google user ID
}

// Функция для декодирования JWT токена с поддержкой UTF-8
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, "base64")
        .toString("binary")
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Ошибка декодирования JWT:", error);
    throw new Error("Не удалось декодировать JWT токен");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const googleData = body?.google as { credential: string } | GoogleAuthData | undefined;

    if (!googleData || !googleData.credential) {
      return NextResponse.json(
        { success: false, error: "Некорректные данные Google" },
        { status: 400 },
      );
    }

    // Декодируем JWT токен на сервере для правильной обработки UTF-8
    let payload: any;
    try {
      payload = decodeJWT(googleData.credential);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Ошибка декодирования токена Google" },
        { status: 400 },
      );
    }

    // Используем данные из токена или из переданных данных (для обратной совместимости)
    const googleId = payload.sub || (googleData as any).sub;
    const googleEmail = (payload.email || (googleData as any).email || "").toLowerCase().trim();
    const googleName = payload.name || (googleData as any).name || null;
    const googlePicture = payload.picture || (googleData as any).picture || null;

    if (!googleId || !googleEmail) {
      return NextResponse.json(
        { success: false, error: "Некорректные данные Google" },
        { status: 400 },
      );
    }

    const session = await getSession();

    // Проверяем, существует ли пользователь из сессии
    const sessionUser = session
      ? await prisma.user.findUnique({
          where: { id: session.uid },
          select: { id: true },
        })
      : null;

    if (session && sessionUser) {
      // Пользователь уже залогинен — привязываем Google к его аккаунту
      const updateData: any = {
        googleId,
        googleEmail,
      };

      // Получаем текущие данные пользователя
      const existingUser = await prisma.user.findUnique({
        where: { id: sessionUser.id },
        select: { name: true, avatar: true },
      });

      // Если Google прислал аватар — сохраняем его как аватар профиля
      if (googlePicture && existingUser && !existingUser.avatar) {
        updateData.avatar = googlePicture;
      }

      // Обновляем имя, если его нет
      if (googleName && existingUser && !existingUser.name) {
        updateData.name = googleName;
      }

      const updated = await prisma.user.update({
        where: { id: sessionUser.id },
        data: updateData,
        select: {
          id: true,
          email: true,
          googleId: true,
          googleEmail: true,
          avatar: true,
        },
      });

      return NextResponse.json({
        success: true,
        mode: "linked",
        user: updated,
      });
    }

    // Полноценный вход через Google
    // 1) Пытаемся найти по googleId
    // 2) Если не нашли, ищем по email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId },
          { email: googleEmail },
        ],
      },
    });

    // Если пользователя ещё нет — автоматически регистрируем его
    if (!user) {
      // Генерируем username из email или имени
      const baseUsername = googleEmail.split("@")[0].toLowerCase().replace(/[^\p{L}\p{N}._-]/gu, "").substring(0, 20) || `google${googleId.substring(0, 10)}`;
      let username = baseUsername;

      // Гарантируем уникальность логина
      let suffix = 1;
      while (true) {
        const exists = await prisma.user.findUnique({
          where: { username },
          select: { id: true },
        });
        if (!exists) break;
        username = `${baseUsername}_${suffix++}`;
      }

      const createData: any = {
        email: googleEmail,
        username,
        // Создаём случайный пароль, т.к. вход по нему не предполагается
        passwordHash: "google-auto-user",
        name: googleName,
        googleId,
        googleEmail,
        role: "USER",
      };

      // Сохраняем аватар из Google, если есть
      if (googlePicture) {
        createData.avatar = googlePicture;
      }

      user = await prisma.user.create({
        data: createData,
      });
    } else {
      // Пользователь с таким email уже есть — обновляем Google данные
      const updateData: any = {};

      if (!user.googleId) {
        updateData.googleId = googleId;
        updateData.googleEmail = googleEmail;
      }

      if (googlePicture && !user.avatar) {
        updateData.avatar = googlePicture;
      }

      if (googleName && !user.name) {
        updateData.name = googleName;
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
        googleEmail: user.googleEmail,
      },
    });
  } catch (error: any) {
    console.error("Error in /api/auth/google:", error);
    const message =
      error?.message ||
      (typeof error === "string" ? error : "Неизвестная ошибка сервера");
    return NextResponse.json(
      {
        success: false,
        error: `Ошибка авторизации через Google: ${message}`,
      },
      { status: 500 },
    );
  }
}

