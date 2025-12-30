// app/api/profile/friends/[friendshipId]/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { getHeroBadgesForUsers } from "@/lib/heroBadges";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ friendshipId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const { status } = await request.json();
    const { friendshipId } = await params;

    if (!["ACCEPTED", "DECLINED"].includes(status)) {
      return NextResponse.json({ message: "Неверный статус" }, { status: 400 });
    }

    // Проверяем, что пользователь является получателем заявки
    const friendship = await prisma.friendship.findFirst({
      where: {
        id: friendshipId,
        receiverId: session.uid,
        status: "PENDING",
      },
    });

    if (!friendship) {
      return NextResponse.json(
        { message: "Заявка не найдена" },
        { status: 404 },
      );
    }

    // Обновляем статус заявки
    const updatedFriendship = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            hideEmail: true,
            avatar: true,
            createdAt: true,
            vkLink: true,
            telegramLink: true,
            youtubeLink: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            hideEmail: true,
            avatar: true,
            createdAt: true,
            vkLink: true,
            telegramLink: true,
            youtubeLink: true,
          },
        },
      },
    });

    const badgeMap = await getHeroBadgesForUsers([
      updatedFriendship.requesterId,
      updatedFriendship.receiverId,
    ]);
    const safe = {
      ...updatedFriendship,
      requester: updatedFriendship.requester
        ? sanitizeEmailForViewer(
            {
              ...(updatedFriendship.requester as any),
              heroBadge: badgeMap[updatedFriendship.requesterId] ?? null,
            },
            session.uid,
          )
        : updatedFriendship.requester,
      receiver: updatedFriendship.receiver
        ? sanitizeEmailForViewer(
            {
              ...(updatedFriendship.receiver as any),
              heroBadge: badgeMap[updatedFriendship.receiverId] ?? null,
            },
            session.uid,
          )
        : updatedFriendship.receiver,
    };

    return NextResponse.json({ friendship: safe });
  } catch (error) {
    console.error("Update friendship error:", error);
    return NextResponse.json(
      { message: "Ошибка обновления заявки" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ friendshipId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const { friendshipId } = await params;
    console.log("=== DELETE /api/profile/friends/[friendshipId] ===", { friendshipId, userId: session.uid });

    // Проверяем, что пользователь является участником заявки
    const friendship = await prisma.friendship.findFirst({
      where: {
        id: friendshipId,
        OR: [{ requesterId: session.uid }, { receiverId: session.uid }],
      },
    });

    if (!friendship) {
      console.log("Friendship not found:", { friendshipId, userId: session.uid });
      return NextResponse.json(
        { message: "Заявка не найдена" },
        { status: 404 },
      );
    }

    console.log("Found friendship:", {
      id: friendship.id,
      requesterId: friendship.requesterId,
      receiverId: friendship.receiverId,
      status: friendship.status,
    });

    // Удаляем заявку
    await prisma.friendship.delete({
      where: { id: friendshipId },
    });

    console.log("Friendship deleted successfully");
    return NextResponse.json({ message: "Заявка удалена" });
  } catch (error) {
    console.error("Delete friendship error:", error);
    return NextResponse.json(
      { message: "Ошибка удаления заявки" },
      { status: 500 },
    );
  }
}
