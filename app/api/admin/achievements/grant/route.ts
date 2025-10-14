// app/api/admin/achievements/grant/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { AchievementService } from '@/lib/achievements/service';

// POST /api/admin/achievements/grant - выдать достижение пользователю
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.uid || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, achievementId } = body;

    if (!userId || !achievementId) {
      return NextResponse.json(
        { error: 'Необходимы userId и achievementId' },
        { status: 400 }
      );
    }

    const grantedAchievement = await AchievementService.grantAchievement(
      userId,
      achievementId,
      session.uid,
      'Администратор'
    );

    return NextResponse.json({
      success: true,
      data: grantedAchievement,
      message: 'Достижение успешно выдано',
    });
  } catch (error) {
    console.error('Error granting achievement:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Ошибка выдачи достижения';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
