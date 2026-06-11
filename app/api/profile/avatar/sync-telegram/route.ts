import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isUsableTelegramPhotoUrl } from "@/lib/avatar";
import { persistTelegramAvatar } from "@/lib/telegramAvatarSync";
import {
  verifyTelegramAuth,
  type TelegramAuthData,
} from "@/lib/telegramAuth";

export const runtime = "nodejs";
export const maxDuration = 60;

function parseTelegramBody(raw: unknown): TelegramAuthData | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = Number(o.id);
  const auth_date = Number(o.auth_date);
  const hash = typeof o.hash === "string" ? o.hash.trim() : "";
  if (!Number.isFinite(id) || id <= 0 || !Number.isFinite(auth_date) || !hash) {
    return null;
  }
  const data: TelegramAuthData = { id, auth_date, hash };
  if (typeof o.first_name === "string" && o.first_name) {
    data.first_name = o.first_name;
  }
  if (typeof o.last_name === "string" && o.last_name) {
    data.last_name = o.last_name;
  }
  if (typeof o.username === "string" && o.username) {
    data.username = o.username;
  }
  if (typeof o.photo_url === "string" && o.photo_url) {
    data.photo_url = o.photo_url;
  }
  return data;
}

/** POST /api/profile/avatar/sync-telegram — привязать Telegram и подтянуть аватар */
export async function POST(req: NextRequest) {
  const session = await getAuthUser(req);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const tgData = parseTelegramBody(body?.telegram);

    if (!tgData) {
      return NextResponse.json(
        { error: "Некорректные данные Telegram" },
        { status: 400 },
      );
    }

    const verify = verifyTelegramAuth(tgData);
    if (!verify.ok) {
      return NextResponse.json(
        { error: verify.error || "Ошибка проверки Telegram" },
        { status: 400 },
      );
    }

    const telegramId = String(tgData.id);
    const telegramUsername = tgData.username || null;
    const widgetPhotoUrl = tgData.photo_url || null;

    const user = await prisma.user.findUnique({
      where: { id: session.uid },
      select: {
        id: true,
        telegramId: true,
        avatar: true,
        avatarUpdatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    if (user.telegramId && user.telegramId !== telegramId) {
      return NextResponse.json(
        {
          error:
            "К аккаунту привязан другой Telegram. Сначала отвяжите его в поддержке.",
        },
        { status: 400 },
      );
    }

    const conflict = await prisma.user.findFirst({
      where: { telegramId, id: { not: session.uid } },
      select: { id: true },
    });
    if (conflict) {
      return NextResponse.json(
        { error: "Этот Telegram уже привязан к другому аккаунту" },
        { status: 400 },
      );
    }

    if (widgetPhotoUrl && !isUsableTelegramPhotoUrl(widgetPhotoUrl)) {
      return NextResponse.json(
        {
          error:
            "Telegram не отдал фото профиля. Проверьте настройки приватности в Telegram.",
        },
        { status: 400 },
      );
    }

    const linkData: {
      telegramId: string;
      telegramUsername?: string;
      telegramLink?: string;
    } = { telegramId };
    if (telegramUsername) {
      linkData.telegramUsername = telegramUsername;
      linkData.telegramLink = `https://t.me/${telegramUsername}`;
    }

    const avatar = await persistTelegramAvatar({
      userId: user.id,
      telegramId,
      widgetPhotoUrl,
      currentAvatar: user.avatar,
      avatarUpdatedAt: user.avatarUpdatedAt,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...linkData,
        ...(avatar ? { avatar } : {}),
      },
    });

    if (!avatar) {
      return NextResponse.json(
        {
          ok: true,
          linked: true,
          avatar: user.avatar,
          message: telegramUsername
            ? "Telegram привязан. Фото не удалось подтянуть — проверьте приватность профиля в Telegram."
            : "Telegram привязан. Фото профиля недоступно.",
        },
      );
    }

    return NextResponse.json({
      ok: true,
      linked: true,
      avatar,
      message: "Аватар обновлён из Telegram",
    });
  } catch (error) {
    console.error("[POST /api/profile/avatar/sync-telegram]", error);
    return NextResponse.json(
      { error: "Ошибка синхронизации аватара" },
      { status: 500 },
    );
  }
}
