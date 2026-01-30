// app/api/profile/friends/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { getHeroBadgesForUsers } from "@/lib/heroBadges";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "friends";

    let whereClause: Parameters<typeof prisma.friendship.findMany>[0]["where"] = {};

    switch (type) {
      case "friends":
        whereClause = {
          OR: [
            { requesterId: session.uid, status: "ACCEPTED" },
            { receiverId: session.uid, status: "ACCEPTED" },
          ],
        };
        break;
      case "sent":
        whereClause = { requesterId: session.uid, status: "PENDING" };
        break;
      case "received":
        whereClause = { receiverId: session.uid, status: "PENDING" };
        break;
      case "all":
        whereClause = {
          OR: [{ requesterId: session.uid }, { receiverId: session.uid }],
        };
        break;
      default:
        return NextResponse.json(
          { error: "Неверный тип запроса" },
          { status: 400 },
        );
    }

    const friendships = await prisma.friendship.findMany({
      where: whereClause,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            avatarFrame: true,
            headerTheme: true,
            hideEmail: true,
            vkLink: true,
            telegramLink: true,
            youtubeLink: true,
            createdAt: true,
            lastSeen: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            avatarFrame: true,
            headerTheme: true,
            hideEmail: true,
            vkLink: true,
            telegramLink: true,
            youtubeLink: true,
            createdAt: true,
            lastSeen: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const badgeMap = await getHeroBadgesForUsers(
      friendships.flatMap((f: any) => [f.requesterId, f.receiverId]),
    );

    const safe = friendships.map((f: any) => ({
      ...f,
      requester: f.requester
        ? sanitizeEmailForViewer(
            {
              ...(f.requester as any),
              heroBadge: badgeMap[f.requesterId] ?? null,
            },
            session.uid,
          )
        : f.requester,
      receiver: f.receiver
        ? sanitizeEmailForViewer(
            {
              ...(f.receiver as any),
              heroBadge: badgeMap[f.receiverId] ?? null,
            },
            session.uid,
          )
        : f.receiver,
    }));

    return NextResponse.json({ friendships: safe });
  } catch (error) {
    console.error("Get friendships error:", error);
    return NextResponse.json(
      { error: "Ошибка получения списка друзей" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { receiverId } = await request.json();

    if (!receiverId) {
      return NextResponse.json(
        { error: "ID получателя обязателен" },
        { status: 400 },
      );
    }

    if (receiverId === session.uid) {
      return NextResponse.json(
        { error: "Нельзя добавить себя в друзья" },
        { status: 400 },
      );
    }

    // Проверяем, существует ли пользователь
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    // Проверяем, не существует ли уже заявка или блокировка
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: session.uid, receiverId },
          { requesterId: receiverId, receiverId: session.uid },
        ],
      },
    });

    if (existingFriendship) {
      // Проверяем, не заблокирован ли пользователь
      if (existingFriendship.status === "BLOCKED") {
        // Проверяем, кто заблокировал
        const blockerId = existingFriendship.requesterId;
        const blockedId = existingFriendship.receiverId;

        if (blockerId === receiverId && blockedId === session.uid) {
          // Пользователь заблокировал вас - нельзя отправить заявку
          return NextResponse.json(
            { error: "Вы заблокированы этим пользователем" },
            { status: 403 },
          );
        } else if (blockerId === session.uid && blockedId === receiverId) {
          // Вы заблокировали пользователя - удаляем блокировку и создаем заявку
          // Удаляем блокировку
          await prisma.friendship.delete({
            where: { id: existingFriendship.id },
          });
          // Продолжаем создание заявки (не возвращаем ошибку)
        } else {
          // Неизвестная ситуация с блокировкой
          return NextResponse.json(
            { error: "Заявка уже существует" },
            { status: 400 },
          );
        }
      } else if (
        existingFriendship.status === "PENDING" ||
        existingFriendship.status === "ACCEPTED"
      ) {
        // Заявка уже существует или пользователи уже друзья
        return NextResponse.json(
          { error: "Заявка уже существует" },
          { status: 400 },
        );
      } else if (existingFriendship.status === "DECLINED") {
        // Заявка была отклонена - удаляем и создаем новую
        await prisma.friendship.delete({
          where: { id: existingFriendship.id },
        });
        // Продолжаем создание заявки
      }
    }

    // Дополнительная проверка: не заблокировал ли получатель отправителя
    const reverseBlock = await prisma.friendship.findFirst({
      where: {
        requesterId: receiverId,
        receiverId: session.uid,
        status: "BLOCKED",
      },
    });

    if (reverseBlock) {
      return NextResponse.json(
        { error: "Вы заблокированы этим пользователем" },
        { status: 403 },
      );
    }

    // Создаем заявку в друзья
    const friendship = await prisma.friendship.create({
      data: {
        requesterId: session.uid,
        receiverId,
        status: "PENDING",
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            hideEmail: true,
            vkLink: true,
            telegramLink: true,
            youtubeLink: true,
            createdAt: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            hideEmail: true,
            vkLink: true,
            telegramLink: true,
            youtubeLink: true,
            createdAt: true,
          },
        },
      },
    });

    const badgeMap = await getHeroBadgesForUsers([
      friendship.requesterId,
      friendship.receiverId,
    ]);
    return NextResponse.json({
      friendship: {
        ...friendship,
        requester: friendship.requester
          ? sanitizeEmailForViewer(
              {
                ...(friendship.requester as any),
                heroBadge: badgeMap[friendship.requesterId] ?? null,
              },
              session.uid,
            )
          : friendship.requester,
        receiver: friendship.receiver
          ? sanitizeEmailForViewer(
              {
                ...(friendship.receiver as any),
                heroBadge: badgeMap[friendship.receiverId] ?? null,
              },
              session.uid,
            )
          : friendship.receiver,
      },
    });
  } catch (error) {
    console.error("Create friendship error:", error);
    return NextResponse.json(
      { error: "Ошибка создания заявки в друзья" },
      { status: 500 },
    );
  }
}
