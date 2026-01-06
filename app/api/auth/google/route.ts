// app/api/auth/google/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, attachSessionToResponse } from "@/lib/auth";
import { checkUserBan } from "@/lib/ban-check";
import { OAuth2Client } from "google-auth-library";
import { saveRemoteImageAsAvatar } from "@/lib/uploads/saveRemoteImage";

const googleClientId = process.env.GOOGLE_CLIENT_ID;

interface GoogleAuthData {
  credential: string; // Google ID token
  email: string;
  name: string;
  picture?: string;
  sub: string; // Google user ID
}

export const runtime = "nodejs";

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

    if (!googleClientId) {
      return NextResponse.json(
        { success: false, error: "Google OAuth не настроен (GOOGLE_CLIENT_ID)" },
        // 503 = сервис не готов (а не “внутренняя ошибка кода”)
        { status: 503 },
      );
    }

    const googleClient = new OAuth2Client(googleClientId);

    // ВАЖНО: токен Google нужно именно ВЕРИФИЦИРОВАТЬ (подпись/issuer/audience),
    // а не просто "декодировать".
    const ticket = await googleClient.verifyIdToken({
      idToken: googleData.credential,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();

    const googleId = payload?.sub || "";
    const googleEmail = (payload?.email || "").toLowerCase().trim();
    const googleName = payload?.name || null;
    const googlePicture = payload?.picture || null;

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
      // Проверяем блокировку перед привязкой
      const banStatus = await checkUserBan(sessionUser.id);
      if (banStatus.isBanned) {
        return NextResponse.json(
          {
            success: false,
            error: "Ваш аккаунт заблокирован",
            banInfo: {
              reason: banStatus.bannedReason,
              until: banStatus.bannedUntil?.toISOString() || null,
              isPermanent: banStatus.isPermanent,
            },
          },
          { status: 403 }
        );
      }

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

      // Если Google прислал аватар — пробуем сохранить локально
      // Сохраняем, если аватар пустой или это внешний googleusercontent (нестабильный)
      if (googlePicture && existingUser) {
        const needAvatar =
          !existingUser.avatar ||
          existingUser.avatar.includes("googleusercontent.com");
        if (needAvatar) {
          const saved = await saveRemoteImageAsAvatar(googlePicture, googleId);
          updateData.avatar = saved || googlePicture;
        }
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
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        name: true,
        avatar: true,
        googleId: true,
        googleEmail: true,
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
        const saved = await saveRemoteImageAsAvatar(googlePicture, googleId);
        createData.avatar = saved || googlePicture;
      }

      user = await prisma.user.create({
        data: createData,
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          name: true,
          avatar: true,
          googleId: true,
          googleEmail: true,
        },
      });
    } else {
      // Пользователь с таким email уже есть — обновляем Google данные
      const updateData: any = {};

      if (!user.googleId) {
        updateData.googleId = googleId;
        updateData.googleEmail = googleEmail;
      }

      // Обновляем основной email, если его нет или он отличается от Google email
      if (!user.email || user.email.toLowerCase() !== googleEmail.toLowerCase()) {
        updateData.email = googleEmail;
      }

      if (googlePicture) {
        const needAvatar =
          !user.avatar || user.avatar.includes("googleusercontent.com");
        if (needAvatar) {
          const saved = await saveRemoteImageAsAvatar(googlePicture, googleId);
          updateData.avatar = saved || googlePicture;
        }
      }

      if (googleName && !user.name) {
        updateData.name = googleName;
      }

      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData,
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
            name: true,
            avatar: true,
            googleId: true,
            googleEmail: true,
          },
        });
      }
    }

    // Проверяем блокировку перед входом
    const banStatus = await checkUserBan(user.id);
    if (banStatus.isBanned) {
      return NextResponse.json(
        {
          success: false,
          error: "Ваш аккаунт заблокирован",
          banInfo: {
            reason: banStatus.bannedReason,
            until: banStatus.bannedUntil?.toISOString() || null,
            isPermanent: banStatus.isPermanent,
          },
        },
        { status: 403 }
      );
    }

    const res = NextResponse.json({
      success: true,
      mode: "login",
      user: {
        id: user.id,
        email: user.email,
        googleEmail: user.googleEmail,
      },
    });
    attachSessionToResponse(res, { uid: user.id, role: (user.role as any) || "USER" }, req);
    return res;
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

