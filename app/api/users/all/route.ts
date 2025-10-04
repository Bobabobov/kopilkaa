// app/api/users/all/route.ts
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        hideEmail: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ 
      total: users.length,
      users: users.filter((u: any) => u.id !== session.uid) // Исключаем текущего пользователя
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return NextResponse.json({ message: 'Ошибка получения пользователей' }, { status: 500 });
  }
}