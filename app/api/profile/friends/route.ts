// app/api/profile/friends/route.ts
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'friends';

  try {
    let whereClause: any = {};

    switch (type) {
      case 'friends':
        whereClause = {
          OR: [
            { requesterId: session.uid, status: 'ACCEPTED' },
            { receiverId: session.uid, status: 'ACCEPTED' }
          ]
        };
        break;
      case 'sent':
        whereClause = { requesterId: session.uid, status: 'PENDING' };
        break;
      case 'received':
        whereClause = { receiverId: session.uid, status: 'PENDING' };
        break;
      case 'all':
        whereClause = {
          OR: [
            { requesterId: session.uid },
            { receiverId: session.uid }
          ]
        };
        break;
      default:
        return NextResponse.json({ message: 'Неверный тип запроса' }, { status: 400 });
    }

    const friendships = await prisma.friendship.findMany({
      where: whereClause,
      include: {
        requester: {
          select: { id: true, name: true, email: true, avatar: true, avatarFrame: true, headerTheme: true, hideEmail: true, createdAt: true, lastSeen: true }
        },
        receiver: {
          select: { id: true, name: true, email: true, avatar: true, avatarFrame: true, headerTheme: true, hideEmail: true, createdAt: true, lastSeen: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ friendships });
  } catch (error) {
    console.error('Get friendships error:', error);
    return NextResponse.json({ message: 'Ошибка получения списка друзей' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  try {
    const { receiverId } = await request.json();

    if (!receiverId) {
      return NextResponse.json({ message: 'ID получателя обязателен' }, { status: 400 });
    }

    if (receiverId === session.uid) {
      return NextResponse.json({ message: 'Нельзя добавить себя в друзья' }, { status: 400 });
    }

    // Проверяем, существует ли пользователь
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true }
    });

    if (!receiver) {
      return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
    }

    // Проверяем, не существует ли уже заявка
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: session.uid, receiverId },
          { requesterId: receiverId, receiverId: session.uid }
        ]
      }
    });

    if (existingFriendship) {
      return NextResponse.json({ message: 'Заявка уже существует' }, { status: 400 });
    }

    // Создаем заявку в друзья
    const friendship = await prisma.friendship.create({
      data: {
        requesterId: session.uid,
        receiverId,
        status: 'PENDING'
      },
      include: {
        requester: {
          select: { id: true, name: true, email: true, avatar: true, hideEmail: true, createdAt: true }
        },
        receiver: {
          select: { id: true, name: true, email: true, avatar: true, hideEmail: true, createdAt: true }
        }
      }
    });

    return NextResponse.json({ friendship });
  } catch (error) {
    console.error('Create friendship error:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ message: 'Ошибка создания заявки в друзья' }, { status: 500 });
  }
}
