// app/api/auth/telegram/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession, attachSessionToResponse } from "@/lib/auth";
import { verifyTelegramAuth, TelegramAuthData } from "@/lib/telegramAuth";
import { checkUserBan } from "@/lib/ban-check";
import { saveRemoteImageAsAvatar } from "@/lib/uploads/saveRemoteImage";
import {
  REFERRAL_CODE_COOKIE,
  REFERRAL_VISITOR_COOKIE,
  readReferralCookies,
  tryAwardReferralBonusForNewUser,
} from "@/lib/referralProgram";

export const runtime = "nodejs";

function getSafeNext(raw: string | null): string {
  if (!raw) return "/profile";
  const v = raw.trim();
  if (!v.startsWith("/")) return "/profile";
  if (v.startsWith("//")) return "/profile";
  if (v.includes("://")) return "/profile";
  if (v.includes("\n") || v.includes("\r")) return "/profile";
  return v;
}

function getPublicOrigin(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) {
    try {
      return new URL(env).origin;
    } catch {
      // fallback ниже
    }
  }
  const proto =
    req.headers.get("x-forwarded-proto") ||
    req.nextUrl.protocol.replace(":", "");
  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    req.nextUrl.host;
  // Защита от внутренних/невалидных хостов из reverse proxy.
  if (!host || host === "0.0.0.0:3000" || host.startsWith("0.0.0.0")) {
    return "https://kopilka-online.ru";
  }
  return `${proto}://${host}`;
}

async function authenticateTelegram(
  req: NextRequest,
  tgData: TelegramAuthData | undefined,
): Promise<{
  ok: boolean;
  status?: number;
  error?: string;
  user?: { id: string; email: string | null; telegramUsername: string | null };
  res?: NextResponse;
  mode?: "linked" | "login";
}> {
  try {
    let createdNewUserId: string | null = null;

    if (!tgData || typeof tgData.id !== "number" || !tgData.hash) {
      return {
        ok: false,
        status: 400,
        error: "Некорректные данные Telegram",
      };
    }

    const verify = verifyTelegramAuth(tgData);
    if (!verify.ok) {
      return {
        ok: false,
        status: 400,
        error: verify.error || "Ошибка проверки Telegram",
      };
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
      // Проверяем блокировку перед привязкой
      const banStatus = await checkUserBan(sessionUser.id);
      if (banStatus.isBanned) {
        return {
          ok: false,
          status: 403,
          error: "Ваш аккаунт заблокирован",
        };
      }

      // Пользователь уже залогинен — привязываем Telegram к его аккаунту
      const updateData: any = {
        telegramId,
        telegramUsername,
      };

      // Если Телеграм прислал аватар — сохраняем его как аватар профиля
      if (telegramPhoto) {
        const saved = await saveRemoteImageAsAvatar(telegramPhoto, telegramId);
        if (saved) {
          updateData.avatar = saved;
        }
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

      return {
        ok: true,
        mode: "linked",
        user: {
          id: updated.id,
          email: updated.email,
          telegramUsername: updated.telegramUsername,
        },
      };
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
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        name: true,
        avatar: true,
        telegramId: true,
        telegramUsername: true,
      },
    });

    // Если пользователя ещё нет — автоматически регистрируем его
    if (!user) {
      const baseUsername = telegramUsername || `tg${telegramId}`;
      let username = baseUsername.toLowerCase();

      // гарантируем уникальность логина
      let suffix = 1;
      while (true) {
        const exists = await prisma.user.findUnique({
          where: { username },
          select: { id: true },
        });
        if (!exists) break;
        username = `${baseUsername.toLowerCase()}_${suffix++}`;
      }

      const createData: any = {
        username,
        // создаём случайный пароль, т.к. вход по нему не предполагается
        passwordHash: "telegram-auto-user",
        name:
          [tgData.first_name, tgData.last_name].filter(Boolean).join(" ") ||
          null,
        telegramId,
        telegramUsername,
        role: "USER",
        // Устанавливаем email только если он не требуется (для совместимости со старыми схемами)
        // Если в БД email обязателен, используем временный email на основе telegramId
        email: `telegram-${telegramId}@telegram.local`,
      };

      // Сохраняем аватар из Telegram, если есть
      if (telegramPhoto) {
        const saved = await saveRemoteImageAsAvatar(telegramPhoto, telegramId);
        if (saved) {
          createData.avatar = saved;
        }
      }

      // Автоматически выставляем публичную ссылку на Telegram
      if (telegramUsername) {
        createData.telegramLink = `https://t.me/${telegramUsername}`;
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
          telegramId: true,
          telegramUsername: true,
        },
      });
      createdNewUserId = user.id;
    } else {
      // Пользователь с таким Telegram уже есть — обновляем при необходимости
      const updateData: any = {};

      if (telegramUsername && user.telegramUsername !== telegramUsername) {
        updateData.telegramUsername = telegramUsername;
        updateData.telegramLink = `https://t.me/${telegramUsername}`;
      }

      if (telegramPhoto && !user.avatar) {
        const saved = await saveRemoteImageAsAvatar(telegramPhoto, telegramId);
        if (saved) {
          updateData.avatar = saved;
        }
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
            telegramId: true,
            telegramUsername: true,
          },
        });
      }
    }

    // Проверяем блокировку перед входом
    const banStatus = await checkUserBan(user.id);
    if (banStatus.isBanned) {
      return {
        ok: false,
        status: 403,
        error: "Ваш аккаунт заблокирован",
      };
    }

    if (createdNewUserId) {
      const referralCookies = await readReferralCookies().catch(() => ({
        referralCode: null,
        visitorId: null,
      }));

      if (referralCookies.referralCode && referralCookies.visitorId) {
        await tryAwardReferralBonusForNewUser({
          newUserId: createdNewUserId,
          referralCode: referralCookies.referralCode,
          visitorId: referralCookies.visitorId,
        });
      }
    }

    const res = NextResponse.json({
      success: true,
      mode: "login",
      user: {
        id: user.id,
        email: user.email,
        telegramUsername: user.telegramUsername,
      },
    });

    if (createdNewUserId) {
      const referralCookies = await readReferralCookies().catch(() => ({
        referralCode: null,
        visitorId: null,
      }));

      if (referralCookies.referralCode && referralCookies.visitorId) {
        res.cookies.set(REFERRAL_CODE_COOKIE, "", {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          expires: new Date(0),
        });
        res.cookies.set(REFERRAL_VISITOR_COOKIE, "", {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          expires: new Date(0),
        });
      }
    }
    attachSessionToResponse(
      res,
      { uid: user.id, role: (user.role as any) || "USER" },
      req,
    );
    return {
      ok: true,
      mode: "login",
      user: {
        id: user.id,
        email: user.email,
        telegramUsername: user.telegramUsername,
      },
      res,
    };
  } catch (error: any) {
    console.error("Error in /api/auth/telegram:", error);
    const message =
      error?.message ||
      (typeof error === "string" ? error : "Неизвестная ошибка сервера");
    return {
      ok: false,
      status: 500,
      error: `Ошибка авторизации через Telegram: ${message}`,
    };
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const tgData = body?.telegram as TelegramAuthData | undefined;
  const result = await authenticateTelegram(req, tgData);

  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: result.error || "Ошибка входа через Telegram" },
      { status: result.status || 400 },
    );
  }

  if (result.mode === "login" && result.res) {
    return result.res;
  }

  return NextResponse.json({
    success: true,
    mode: result.mode || "linked",
    user: result.user,
  });
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const tgData: TelegramAuthData = {
    id: Number(sp.get("id")),
    first_name: sp.get("first_name") || undefined,
    last_name: sp.get("last_name") || undefined,
    username: sp.get("username") || undefined,
    photo_url: sp.get("photo_url") || undefined,
    auth_date: Number(sp.get("auth_date")),
    hash: sp.get("hash") || "",
  };

  const next = getSafeNext(sp.get("next"));
  const publicOrigin = getPublicOrigin(req);
  const result = await authenticateTelegram(req, tgData);

  if (!result.ok) {
    const failUrl = new URL("/", publicOrigin);
    failUrl.searchParams.set("modal", "auth");
    failUrl.searchParams.set(
      "error",
      result.error || "Ошибка входа через Telegram",
    );
    return NextResponse.redirect(failUrl, 302);
  }

  if (result.mode === "login" && result.res) {
    const redirectUrl = new URL(next, publicOrigin);
    result.res.headers.set("Location", redirectUrl.toString());
    result.res = new NextResponse(null, {
      status: 302,
      headers: result.res.headers,
    });
    return result.res;
  }

  return NextResponse.redirect(new URL(next, publicOrigin), 302);
}
