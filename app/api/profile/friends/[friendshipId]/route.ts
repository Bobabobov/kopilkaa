// app/api/profile/friends/[friendshipId]/route.ts
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { friendshipId: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  try {
    const { status } = await request.json();
    const { friendshipId } = params;

    if (!['ACCEPTED', 'DECLINED'].includes(status)) {
      return NextResponse.json({ message: 'Неверный статус' }, { status: 400 });
    }

    // Проверяем, что пользователь является получателем заявки
    const friendship = await prisma.friendship.findFirst({
      where: {
        id: friendshipId,
        receiverId: session.uid,
        status: 'PENDING'
      }
    });

    if (!friendship) {
      return NextResponse.json({ message: 'Заявка не найдена' }, { status: 404 });
    }

    // Обновляем статус заявки
    const updatedFriendship = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status },
      include: {
        requester: {
          select: { id: true, name: true, email: true, createdAt: true }
        },
        receiver: {
          select: { id: true, name: true, email: true, createdAt: true }
        }
      }
    });

    return NextResponse.json({ friendship: updatedFriendship });
  } catch (error) {
    console.error('Update friendship error:', error);
    return NextResponse.json({ message: 'Ошибка обновления заявки' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { friendshipId: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: 'Не авторизован' }, { status: 401 });
  }

  try {
    const { friendshipId } = params;

    // Проверяем, что пользователь является участником заявки
    const friendship = await prisma.friendship.findFirst({
      where: {
        id: friendshipId,
        OR: [
          { requesterId: session.uid },
          { receiverId: session.uid }
        ]
      }
    });

    if (!friendship) {
      return NextResponse.json({ message: 'Заявка не найдена' }, { status: 404 });
    }

    // Удаляем заявку
    await prisma.friendship.delete({
      where: { id: friendshipId }
    });

    return NextResponse.json({ message: 'Заявка удалена' });
  } catch (error) {
    console.error('Delete friendship error:', error);
    return NextResponse.json({ message: 'Ошибка удаления заявки' }, { status: 500 });
  }
}
