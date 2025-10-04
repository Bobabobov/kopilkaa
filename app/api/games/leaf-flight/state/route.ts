import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    // Получаем или создаем запись игры для пользователя
    let gameRecord = await prisma.gameRecord.findFirst({
      where: {
        userId: session.uid,
        gameType: 'leaf-flight'
      }
    });

    if (!gameRecord) {
      // Администратор может играть без ограничений
      const maxAttempts = session.role === "ADMIN" ? 999 : 3;
      gameRecord = await prisma.gameRecord.create({
        data: {
          userId: session.uid,
          gameType: 'leaf-flight',
          attempts: 0,
          maxAttempts: maxAttempts,
          cooldownEnd: null
        }
      });
    }

    return NextResponse.json({
      attempts: gameRecord.attempts,
      maxAttempts: gameRecord.maxAttempts,
      cooldownEnd: gameRecord.cooldownEnd,
      bestScore: gameRecord.bestScore || 0
    });
  } catch (error) {
    console.error('Ошибка загрузки состояния игры:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
