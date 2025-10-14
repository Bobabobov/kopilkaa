// app/api/achievements/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { AchievementService } from '@/lib/achievements/service';

// GET /api/achievements - получить все достижения
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.uid) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const achievements = await AchievementService.getAllAchievements();
    
    return NextResponse.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Ошибка получения достижений' },
      { status: 500 }
    );
  }
}
