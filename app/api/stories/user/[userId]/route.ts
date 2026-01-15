import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { getHeroBadgesForUsers } from "@/lib/heroBadges";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getSession();
    const viewerId = session?.uid || null;
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // Получаем одобренные истории пользователя (максимум 3)
    const stories = await prisma.application.findMany({
      where: {
        userId,
        status: "APPROVED",
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        summary: true,
        createdAt: true,
        images: { orderBy: { sort: "asc" }, select: { url: true, sort: true } },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            avatarFrame: true,
            headerTheme: true,
            hideEmail: true,
          },
        },
        _count: { select: { likes: true } },
      },
    });

    // Проверяем, какие истории лайкнул текущий пользователь
    let likedSet: Set<string> | null = null;
    if (viewerId && stories.length) {
      const likes = await prisma.storyLike.findMany({
        where: {
          userId: viewerId,
          applicationId: { in: stories.map((s) => s.id) },
        },
        select: { applicationId: true },
      }).catch(() => []);
      likedSet = new Set(likes.map((l) => l.applicationId));
    }

    // Санитизируем email
    const safeStories = stories.map((story) => ({
      ...story,
      user: story.user ? sanitizeEmailForViewer(story.user, viewerId || "") : story.user,
      userLiked: likedSet ? likedSet.has(story.id) : false,
    }));

    // Добавляем бейджи
    const userIds = safeStories.map((s) => s.user?.id).filter(Boolean) as string[];
    const badgeMap = await getHeroBadgesForUsers(userIds);

    const withBadges = safeStories.map((story) => ({
      ...story,
      user: story.user ? { ...story.user, heroBadge: badgeMap[story.user.id] ?? null } : story.user,
    }));

    return NextResponse.json({ stories: withBadges });
  } catch (error) {
    console.error("Error fetching user stories:", error);
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}
