// app/api/admin/achievements/init/route.ts
import { NextResponse } from 'next/server';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import { prisma } from '@/lib/db';
import { DEFAULT_ACHIEVEMENTS } from '@/lib/achievements/config';

const LEGACY_RENAMES_BY_SLUG: Record<string, string[]> = {
  // renamed achievements (oldName -> new slug/name)
  applications_5: ["Помощник"],
  applications_10: ["Активный участник"],
  ratings_5: ["Помощник сообщества"],
  ratings_25: ["Ангел-хранитель"],
  ratings_100: ["Герой сообщества"],
  ratings_50: ["Сердце сообщества"],
  heroes_custom: ["Благодарность"],
};

// POST /api/admin/achievements/init - инициализировать базовые достижения
export async function POST(request: Request) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const achievementData of DEFAULT_ACHIEVEMENTS) {
      const slug = (achievementData as any).slug ?? null;

      // 1) Prefer slug (stable id)
      const bySlug = slug ? await prisma.achievement.findUnique({ where: { slug } }) : null;

      // 2) Fallback for old records without slug: match by name+type, then "migrate" by setting slug
      const byNameType =
        !bySlug
          ? await prisma.achievement.findFirst({
              where: {
                name: achievementData.name,
                type: achievementData.type,
              },
            })
          : null;

      // 3) Legacy renames: if we changed "name"/"type", migrate old record by known legacy names
      const legacyNames = slug ? LEGACY_RENAMES_BY_SLUG[slug] : undefined;
      const byLegacyName =
        !bySlug && !byNameType && legacyNames?.length
          ? await prisma.achievement.findFirst({
              where: {
                name: { in: legacyNames },
              },
            })
          : null;

      const existing = bySlug ?? byNameType ?? byLegacyName;

      if (existing) {
        await prisma.achievement.update({
          where: { id: existing.id },
          data: {
            ...achievementData,
            slug: slug || existing.slug,
            validFrom: (achievementData as any).validFrom || null,
            validTo: (achievementData as any).validTo || null,
          } as any,
        });
        updatedCount++;
        continue;
      }

      await prisma.achievement.create({
        data: {
          ...achievementData,
          slug,
          validFrom: (achievementData as any).validFrom || null,
          validTo: (achievementData as any).validTo || null,
        } as any,
      });
      createdCount++;
    }

    return NextResponse.json({
      success: true,
      data: {
        createdCount,
        updatedCount,
        skippedCount,
        totalProcessed: createdCount + updatedCount + skippedCount,
      },
      message: `Создано ${createdCount}, обновлено ${updatedCount}, пропущено ${skippedCount}`,
    });
  } catch (error) {
    console.error('Error initializing achievements:', error);
    return NextResponse.json(
      { error: 'Ошибка инициализации достижений' },
      { status: 500 }
    );
  }
}
