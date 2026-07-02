// app/api/users/online/route.ts
// Пользователи, которые в сети (lastSeen за последние 5 минут)
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeEmailForViewer } from "@/lib/privacy";

export const dynamic = "force-dynamic";

const ONLINE_MINUTES = 5;

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    const since = new Date(Date.now() - ONLINE_MINUTES * 60 * 1000);

    const users = await prisma.user.findMany({
      where: {
        id: { not: session.uid },
        lastSeen: { gte: since },
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        hideEmail: true,
        vkLink: true,
        telegramLink: true,
        youtubeLink: true,
        createdAt: true,
        lastSeen: true,
      },
      orderBy: { lastSeen: "desc" },
      take: 100,
    });

    const usersWithFriendshipStatus = await Promise.all(
      users.map(async (user) => {
        const friendship = await prisma.friendship.findFirst({
          where: {
            OR: [
              { requesterId: session.uid, receiverId: user.id },
              { requesterId: user.id, receiverId: session.uid },
            ],
          },
          select: {
            id: true,
            status: true,
            requesterId: true,
          },
        });

        return {
          ...sanitizeEmailForViewer(user as any, session.uid),
          friendshipStatus: friendship?.status,
          friendshipId: friendship?.id,
          isRequester: friendship?.requesterId === session.uid,
        };
      }),
    );

    return NextResponse.json({ users: usersWithFriendshipStatus });
  } catch (error) {
    console.error("Online users error:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки списка онлайн" },
      { status: 500 },
    );
  }
}
