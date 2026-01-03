// app/api/users/[userId]/friends/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { getHeroBadgesForUsers } from "@/lib/heroBadges";
import { resolveUserIdFromIdentifier } from "@/lib/userResolve";

interface RouteParams {
  params: {
    userId: string;
  };
}

export async function GET(_req: Request, { params }: RouteParams) {
  const { userId: identifier } = params;

  if (!identifier) {
    return NextResponse.json(
      { error: "Не указан идентификатор пользователя" },
      { status: 400 },
    );
  }

  try {
    const session = await getSession();
    const viewerId = session?.uid ?? "";

    const userId = await resolveUserIdFromIdentifier(identifier);
    if (!userId) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    const friendships = await prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: userId }, { receiverId: userId }],
      },
      include: {
        requester: true,
        receiver: true,
      },
    });

    const friends = friendships.map((f) => {
      const friend = f.requesterId === userId ? f.receiver : f.requester;
      return {
        id: friend.id,
        name: friend.name,
        email: friend.email,
        hideEmail: friend.hideEmail,
        avatar: friend.avatar,
        lastSeen: friend.lastSeen,
      };
    });

    const badgeMap = await getHeroBadgesForUsers(friends.map((f) => f.id));
    const safeFriends = friends.map((u: any) =>
      sanitizeEmailForViewer(
        { ...u, heroBadge: badgeMap[u.id] ?? null },
        viewerId,
      ),
    );

    return NextResponse.json({ success: true, friends: safeFriends });
  } catch (error) {
    console.error("Error fetching user friends:", error);
    return NextResponse.json(
      { error: "Ошибка получения списка друзей" },
      { status: 500 },
    );
  }
}


