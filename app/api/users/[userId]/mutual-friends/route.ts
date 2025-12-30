import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { getHeroBadgesForUsers } from "@/lib/heroBadges";

export async function GET(
  _request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    const otherUserId = params.userId;
    const me = session.uid;

    if (!otherUserId || otherUserId === "me") {
      return NextResponse.json(
        { message: "Некорректный ID пользователя" },
        { status: 400 },
      );
    }

    // Друзья текущего пользователя
    const myFriendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: me }, { receiverId: me }],
      },
      select: { requesterId: true, receiverId: true },
    });
    const myFriendIds = new Set(
      myFriendships.map((f) => (f.requesterId === me ? f.receiverId : f.requesterId)),
    );

    // Друзья другого пользователя
    const otherFriendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: otherUserId }, { receiverId: otherUserId }],
      },
      select: { requesterId: true, receiverId: true },
    });
    const otherFriendIds = new Set(
      otherFriendships.map((f) =>
        f.requesterId === otherUserId ? f.receiverId : f.requesterId,
      ),
    );

    // Пересечение
    const mutualIds = [...myFriendIds].filter((id) => otherFriendIds.has(id));

    if (mutualIds.length === 0) {
      return NextResponse.json({ users: [] });
    }

    const users = await prisma.user.findMany({
      where: { id: { in: mutualIds } },
      select: {
        id: true,
        name: true,
        email: true,
        hideEmail: true,
        avatar: true,
        lastSeen: true,
      },
      take: 12,
      orderBy: { createdAt: "desc" },
    });

    const badgeMap = await getHeroBadgesForUsers(users.map((u) => u.id));
    const safeUsers = users.map((u: any) =>
      sanitizeEmailForViewer(
        { ...u, heroBadge: badgeMap[u.id] ?? null },
        session.uid,
      ),
    );

    return NextResponse.json({ users: safeUsers });
  } catch (error) {
    console.error("Mutual friends error:", error);
    return NextResponse.json(
      { message: "Ошибка получения общих друзей" },
      { status: 500 },
    );
  }
}


