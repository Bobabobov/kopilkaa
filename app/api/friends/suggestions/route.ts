import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sanitizeEmailForViewer } from "@/lib/privacy";
export const dynamic = "force-dynamic";

function shuffleUsers<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const limitParam = new URL(request.url).searchParams.get("limit");
    const limit = Math.min(Math.max(Number(limitParam) || 5, 1), 20);
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

    const candidateUsers = await prisma.user.findMany({
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
    });

    const users = shuffleUsers(candidateUsers).slice(0, limit);

    const safeUsers = users.map((u) =>
      sanitizeEmailForViewer(u, session.uid),
    );

    return NextResponse.json({ users: safeUsers });
  } catch (error) {
    console.error("GET /api/friends/suggestions error:", error);
    return NextResponse.json(
      { error: "Ошибка получения рекомендаций" },
      { status: 500 },
    );
  }
}
