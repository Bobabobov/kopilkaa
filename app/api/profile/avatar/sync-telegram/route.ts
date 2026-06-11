import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isUsableTelegramPhotoUrl } from "@/lib/avatar";
import { persistTelegramAvatar } from "@/lib/telegramAvatarSync";

export const runtime = "nodejs";
export const maxDuration = 60;

/** POST /api/profile/avatar/sync-telegram — подтянуть аватар из Telegram */
export async function POST(req: NextRequest) {
  const session = await getAuthUser(req);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const widgetPhotoUrl =
      typeof body?.photoUrl === "string" ? body.photoUrl.trim() : null;

    const user = await prisma.user.findUnique({
      where: { id: session.uid },
      select: {
        id: true,
        telegramId: true,
        avatar: true,
        avatarUpdatedAt: true,
      },
    });

    if (!user?.telegramId) {
      return NextResponse.json(
        { error: "Telegram не привязан к аккаунту" },
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

    const avatar = await persistTelegramAvatar({
      userId: user.id,
      telegramId: user.telegramId,
      widgetPhotoUrl,
      currentAvatar: user.avatar,
      avatarUpdatedAt: user.avatarUpdatedAt,
    });

    if (!avatar) {
      return NextResponse.json(
        {
          error:
            "Не удалось получить фото из Telegram. Откройте настройки Telegram → Конфиденциальность → Фото профиля → «Все» и попробуйте снова.",
        },
        { status: 502 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { avatar },
    });

    return NextResponse.json({
      ok: true,
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
