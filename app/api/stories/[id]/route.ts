// app/api/stories/[id]/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { sanitizeApplicationStoryHtml } from "@/lib/applications/sanitize";
import { publicStoryWhereById } from "@/lib/stories/publicStoryWhere";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import {
  normalizeStoryReactionCounts,
  type StoryReactionType,
} from "@/lib/stories/reactions";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Пытаемся декодировать URL на случай, если ID был закодирован
  let decodedId = id;
  try {
    decodedId = decodeURIComponent(id);
  } catch (error) {
    logRouteCatchError(
      `[API GET /api/stories/${id}] decodeURIComponent`,
      error,
    );
  }

  // Валидация ID (не модифицируем входные данные)
  // Разрешаем a-zA-Z0-9_- (на будущее/совместимость)
  if (!/^[a-zA-Z0-9_-]+$/.test(decodedId)) {
    return Response.json({ error: "Invalid ID format" }, { status: 400 });
  }
  const finalId = decodedId;

  const session = await getSession();

  const story = await prisma.application.findFirst({
    where: publicStoryWhereById(finalId),
    select: {
      id: true,
      title: true,
      summary: true,
      story: true,
      createdAt: true,
      status: true,
      publishInStories: true,
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
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (!story) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const reactionGroups = await prisma.storyLike.groupBy({
    by: ["type"],
    where: { applicationId: finalId },
    _count: { _all: true },
  });
  const reactionCounts = normalizeStoryReactionCounts(
    reactionGroups.map((group) => ({
      type: group.type as StoryReactionType,
      count: group._count._all,
    })),
  );

  // Проверяем, какую реакцию поставил текущий пользователь
  let userLiked = false;
  let userReaction: StoryReactionType | null = null;
  if (session?.uid) {
    const userLike = await prisma.storyLike.findFirst({
      where: {
        applicationId: finalId,
        userId: session.uid,
      },
      select: { type: true },
    });
    userLiked = !!userLike;
    userReaction = (userLike?.type as StoryReactionType | undefined) ?? null;
  }

  return Response.json(
    {
      ...story,
      isContestWinner: story.status === "CONTEST" && story.publishInStories,
      story: sanitizeApplicationStoryHtml(story.story || ""),
      user: story.user
        ? sanitizeEmailForViewer(story.user, session?.uid ?? "")
        : story.user,
      userLiked,
      userReaction,
      reactionCounts,
    },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  );
}
