// app/api/admin/achievements/grant/route.ts
import { NextResponse } from 'next/server';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import { prisma } from '@/lib/db';

const IS_PROD = process.env.NODE_ENV === "production";

// POST /api/admin/achievements/grant - выдать достижение пользователю
export async function POST(request: Request) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await request.json();
    const { achievementId, userId } = body;

    if (!achievementId || !userId) {
      return NextResponse.json({ error: 'Не указаны ID достижения или пользователя' }, { status: 400 });
    }

    // Проверяем, существует ли достижение
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      return NextResponse.json({ error: 'Достижение не найдено' }, { status: 404 });
    }

    if (!achievement.isActive) {
      return NextResponse.json({ error: 'Достижение неактивно' }, { status: 400 });
    }

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    // Проверяем, есть ли уже такое достижение у пользователя
    const existingUserAchievement = await prisma.userAchievement.findFirst({
      where: {
        userId: userId,
        achievementId: achievementId,
      },
    });

    if (existingUserAchievement) {
      return NextResponse.json({ error: 'У пользователя уже есть это достижение' }, { status: 400 });
    }

    // Выдаем достижение
    const userAchievement = await prisma.userAchievement.create({
      data: {
        userId: userId,
        achievementId: achievementId,
        unlockedAt: new Date(),
        grantedBy: admin.id, // ID админа, который выдал достижение
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        userAchievement,
        achievement: {
          name: achievement.name,
          description: achievement.description,
        },
        user: {
          name: user.name,
          email: user.email,
        },
      },
      message: `Достижение "${achievement.name}" успешно выдано пользователю ${user.name || user.email}`,
    });
  } catch (error) {
    console.error('Error granting achievement:', error);
    return NextResponse.json(
      { error: `Ошибка выдачи достижения: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` },
      { status: 500 }
    );
  }
}