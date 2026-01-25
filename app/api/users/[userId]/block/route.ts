// app/api/users/[userId]/block/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { resolveUserIdFromIdentifier } from "@/lib/userResolve";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const { userId: identifier } = await params;

    const userId = await resolveUserIdFromIdentifier(identifier);
    if (!userId) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 },
      );
    }

    if (!userId || userId === session.uid) {
      return NextResponse.json(
        { message: "Нельзя заблокировать себя" },
        { status: 400 },
      );
    }

    // resolveUserIdFromIdentifier уже проверил существование пользователя

    // Ищем существующую связь между пользователями
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: session.uid, receiverId: userId },
          { requesterId: userId, receiverId: session.uid },
        ],
      },
    });

    // Если уже есть связь со статусом BLOCKED, проверяем кто заблокировал
    if (existingFriendship?.status === "BLOCKED") {
      // В статусе BLOCKED requesterId - это тот, кто заблокировал
      if (existingFriendship.requesterId === session.uid) {
        // Пользователь уже заблокирован этим пользователем - разблокируем
        await prisma.friendship.delete({
          where: { id: existingFriendship.id },
        });

        return NextResponse.json({
          message: "Пользователь разблокирован",
          blocked: false,
        });
      } else {
        // Другой пользователь заблокировал вас - нельзя блокировать его
        return NextResponse.json(
          { message: "Вы заблокированы этим пользователем" },
          { status: 403 },
        );
      }
    }

    // Если есть другая связь (PENDING, ACCEPTED, DECLINED), удаляем её и создаем BLOCKED
    if (existingFriendship) {
      await prisma.friendship.delete({
        where: { id: existingFriendship.id },
      });
    }

    // Создаем новую связь со статусом BLOCKED
    // requesterId = тот, кто блокирует, receiverId = тот, кого блокируют
    const friendship = await prisma.friendship.create({
      data: {
        requesterId: session.uid,
        receiverId: userId,
        status: "BLOCKED",
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Пользователь заблокирован",
      friendship,
      blocked: true,
    });
  } catch (error) {
    console.error("Block user error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    return NextResponse.json(
      { message: "Ошибка блокировки пользователя", error: errorMessage },
      { status: 500 },
    );
  }
}
