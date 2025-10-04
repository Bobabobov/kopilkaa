import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const { score } = await request.json();

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json({ error: 'Неверный счет' }, { status: 400 });
    }

    // Найти существующую запись или создать новую
    let gameRecord = await prisma.gameRecord.findFirst({
      where: {
        userId: session.uid,
        gameType: 'leaf-flight'
      }
    });

    if (gameRecord) {
      // Обновить существующую запись, если новый счет лучше
      if (score > (gameRecord.bestScore || 0)) {
        gameRecord = await prisma.gameRecord.update({
          where: { id: gameRecord.id },
          data: { 
            bestScore: score,
            updatedAt: new Date()
          }
        });
      }
    } else {
      // Создать новую запись
      gameRecord = await prisma.gameRecord.create({
        data: {
          userId: session.uid,
          gameType: 'leaf-flight',
          bestScore: score
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      score: gameRecord.bestScore,
      isNewRecord: score === gameRecord.bestScore
    });

  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json({ error: 'Ошибка сохранения счета' }, { status: 500 });
  }
}