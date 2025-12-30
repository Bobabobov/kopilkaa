// app/api/users/all/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { getHeroBadgesForUsers } from "@/lib/heroBadges";

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        hideEmail: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const visibleUsers = users.filter((u: any) => u.id !== session.uid);
    const badgeMap = await getHeroBadgesForUsers(visibleUsers.map((u: any) => u.id));

    return NextResponse.json({
      total: users.length,
      users: visibleUsers.map((u: any) =>
        sanitizeEmailForViewer(
          { ...u, heroBadge: badgeMap[u.id] ?? null },
          session.uid,
        ),
      ),
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return NextResponse.json(
      { message: "Ошибка получения пользователей" },
      { status: 500 },
    );
  }
}
