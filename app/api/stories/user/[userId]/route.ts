import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import {
  createEmptyStoryReactionCounts,
  type StoryReactionType,
} from "@/lib/stories/reactions";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { userId: string } },
) {
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

    const storyIds = stories.map((story) => story.id);
    const reactionCountsByStory = new Map<
      string,
      Record<StoryReactionType, number>
    >();

    if (storyIds.length) {
      const reactionGroups = await prisma.storyLike
        .groupBy({
          by: ["applicationId", "type"],
          where: { applicationId: { in: storyIds } },
          _count: { _all: true },
        })
        .catch(() => []);

      for (const group of reactionGroups) {
        const current =
          reactionCountsByStory.get(group.applicationId) ||
          createEmptyStoryReactionCounts();
        current[group.type as StoryReactionType] = group._count._all;
        reactionCountsByStory.set(group.applicationId, current);
      }
    }

    // Проверяем, какие реакции оставил текущий пользователь
    let userReactionByStory: Map<string, StoryReactionType> | null = null;
    if (viewerId && stories.length) {
      const reactions = await prisma.storyLike
        .findMany({
          where: {
            userId: viewerId,
            applicationId: { in: storyIds },
          },
          select: { applicationId: true, type: true },
        })
        .catch(() => []);
      userReactionByStory = new Map(
        reactions.map((reaction) => [
          reaction.applicationId,
          reaction.type as StoryReactionType,
        ]),
      );
    }

    // Санитизируем email
    const safeStories = stories.map((story) => ({
      ...story,
      user: story.user
        ? sanitizeEmailForViewer(story.user, viewerId || "")
        : story.user,
      reactionCounts:
        reactionCountsByStory.get(story.id) || createEmptyStoryReactionCounts(),
      userLiked: userReactionByStory
        ? userReactionByStory.has(story.id)
        : false,
      userReaction: userReactionByStory?.get(story.id) ?? null,
    }));

    return NextResponse.json({ stories: safeStories });
  } catch (error) {
    logRouteCatchError("GET /api/stories/user/[userId]:", error);
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}
