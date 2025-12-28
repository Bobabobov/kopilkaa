import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { getSupportBadgesForUsers } from "@/lib/supportBadges";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  const limitParam = new URL(request.url).searchParams.get("limit");
  const limit = Math.min(Math.max(Number(limitParam) || 5, 1), 20);

  try {
    const links = await prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: session.uid }, { receiverId: session.uid }],
      },
      select: {
        requesterId: true,
        receiverId: true,
      },
    });

    const excludeIds = new Set<string>();
    excludeIds.add(session.uid);
    for (const link of links) {
      excludeIds.add(link.requesterId);
      excludeIds.add(link.receiverId);
    }

    const users = await prisma.user.findMany({
      where: {
        id: { notIn: Array.from(excludeIds) },
      },
      select: {
        id: true,
        name: true,
        email: true,
        hideEmail: true,
        avatar: true,
        lastSeen: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const badgeMap = await getSupportBadgesForUsers(users.map((u) => u.id));
    const safeUsers = users.map((u: any) =>
      sanitizeEmailForViewer(
        { ...u, supportBadge: badgeMap[u.id] ?? null },
        session.uid,
      ),
    );

    return NextResponse.json({ users: safeUsers });
  } catch (error) {
    console.error("GET /api/friends/suggestions error:", error);
    return NextResponse.json(
      { message: "Ошибка получения рекомендаций" },
      { status: 500 },
    );
  }
}




