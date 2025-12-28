// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/admin/users - получить список пользователей для админа
export async function GET(request: Request) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        lastSeen: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Ошибка получения списка пользователей' },
      { status: 500 }
    );
  }
}
