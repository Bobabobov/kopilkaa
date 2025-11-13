// app/api/achievements/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { AchievementService } from '@/lib/achievements/service';

interface RouteParams {
  params: {
    userId: string;
  };
}

// GET /api/achievements/[userId] - получить достижения конкретного пользователя
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session?.uid) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const { userId } = params;
    
    // Можно получить достижения любого пользователя для просмотра
    const userAchievements = await AchievementService.getUserAchievements(userId);
    const stats = await AchievementService.getUserAchievementStats(userId);

    return NextResponse.json({
      success: true,
      data: {
        achievements: userAchievements,
        stats,
      },
    });
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return NextResponse.json(
      { error: 'Ошибка получения достижений пользователя' },
      { status: 500 }
    );
  }
}
