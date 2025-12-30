// app/api/users/[userId]/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { getHeroBadgeForUser } from "@/lib/heroBadges";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const { userId } = await params;
    console.log("=== GET /api/users/[userId] ===", { userId });
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        headerTheme: true,
        avatarFrame: true,
        hideEmail: true,
        vkLink: true,
        telegramLink: true,
        youtubeLink: true,
        lastSeen: true,
        createdAt: true,
        role: true,
        isBanned: true,
        bannedUntil: true,
        bannedReason: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 },
      );
    }

    const heroBadge = await getHeroBadgeForUser(user.id);
    const safeUser = sanitizeEmailForViewer(
      { ...(user as any), heroBadge },
      session.uid,
    );

    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { message: "Ошибка получения пользователя" },
      { status: 500 },
    );
  }
}
