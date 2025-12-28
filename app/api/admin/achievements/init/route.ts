// app/api/admin/achievements/init/route.ts
import { NextResponse } from 'next/server';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import { prisma } from '@/lib/db';
import { DEFAULT_ACHIEVEMENTS } from '@/lib/achievements/config';

// POST /api/admin/achievements/init - инициализировать базовые достижения
export async function POST(request: Request) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    let createdCount = 0;
    let skippedCount = 0;

    for (const achievementData of DEFAULT_ACHIEVEMENTS) {
      // Проверяем, существует ли уже такое достижение
      const existing = await prisma.achievement.findFirst({
        where: {
          name: achievementData.name,
          type: achievementData.type,
        },
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      // Создаём новое достижение
      await prisma.achievement.create({
        data: {
          ...achievementData,
          validFrom: achievementData.validFrom || null,
          validTo: achievementData.validTo || null,
        },
      });

      createdCount++;
    }

    return NextResponse.json({
      success: true,
      data: {
        createdCount,
        skippedCount,
        totalProcessed: createdCount + skippedCount,
      },
      message: `Создано ${createdCount} новых достижений, пропущено ${skippedCount} существующих`,
    });
  } catch (error) {
    console.error('Error initializing achievements:', error);
    return NextResponse.json(
      { error: 'Ошибка инициализации достижений' },
      { status: 500 }
    );
  }
}
