// app/api/admin/achievements/route.ts
import { NextResponse } from 'next/server';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import { prisma } from '@/lib/db';

const IS_PROD = process.env.NODE_ENV === "production";

// GET /api/admin/achievements - получить все достижения для админа
export async function GET() {
  try {
    const admin = await getAllowedAdminUser();
    
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const achievements = await prisma.achievement.findMany({
      orderBy: [
        { isActive: 'desc' },
        { rarity: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    if (!IS_PROD) {
      console.error('Error fetching achievements for admin:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    }
    return NextResponse.json(
      { error: 'Ошибка получения достижений' },
      { status: 500 }
    );
  }
}

// POST /api/admin/achievements - создать новое достижение
export async function POST(request: Request) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      description,
      icon,
      rarity,
      type,
      isExclusive = false,
      maxCount = 1,
      isActive = true,
      validFrom,
      validTo,
    } = body;

    if (!name || !description || !icon || !rarity || !type) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      );
    }

    const achievement = await prisma.achievement.create({
      data: {
        name,
        description,
        icon,
        rarity,
        type,
        isExclusive,
        maxCount,
        isActive,
        validFrom: validFrom ? new Date(validFrom) : null,
        validTo: validTo ? new Date(validTo) : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json(
      { error: 'Ошибка создания достижения' },
      { status: 500 }
    );
  }
}
