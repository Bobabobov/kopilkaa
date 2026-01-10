// app/api/admin/users/[userId]/badge/route.ts
import { NextResponse } from "next/server";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";
import type { HeroBadge } from "@/lib/heroBadges";

const VALID_BADGES: HeroBadge[] = ["observer", "member", "active", "hero", "honor", "legend", "tester", "custom"];

// GET - получить текущий бейдж пользователя
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { id: true, heroBadgeOverride: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        badge: user.heroBadgeOverride || null,
      },
    });
  } catch (error) {
    console.error("Error getting user badge:", error);
    return NextResponse.json(
      { error: "Ошибка получения бейджа" },
      { status: 500 }
    );
  }
}

// POST - выдать или изменить бейдж
export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { badge } = body as { badge?: string | null };

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    // Если badge = null или пустая строка, удаляем бейдж (возвращаемся к автоматическому)
    if (!badge || badge.trim() === "") {
      await prisma.user.update({
        where: { id: params.userId },
        data: { heroBadgeOverride: null },
      });

      return NextResponse.json({
        success: true,
        data: {
          userId: user.id,
          badge: null,
          message: "Бейдж удалён, будет использоваться автоматический",
        },
      });
    }

    // Проверяем валидность бейджа
    if (!VALID_BADGES.includes(badge as HeroBadge)) {
      return NextResponse.json(
        { error: `Недопустимый бейдж. Допустимые: ${VALID_BADGES.join(", ")}` },
        { status: 400 }
      );
    }

    // Обновляем бейдж
    await prisma.user.update({
      where: { id: params.userId },
      data: { heroBadgeOverride: badge },
    });

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        badge: badge as HeroBadge,
        message: `Бейдж "${badge}" успешно выдан пользователю`,
      },
    });
  } catch (error) {
    console.error("Error setting user badge:", error);
    return NextResponse.json(
      { error: "Ошибка выдачи бейджа" },
      { status: 500 }
    );
  }
}
