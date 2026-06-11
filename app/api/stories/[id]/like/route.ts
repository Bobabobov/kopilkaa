// app/api/stories/[id]/like/route.ts
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { publicStoryWhereById } from "@/lib/stories/publicStoryWhere";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import {
  isStoryReactionType,
  normalizeStoryReactionCounts,
  type StoryReactionType,
} from "@/lib/stories/reactions";
import { ACHIEVEMENT_SLUGS } from "@/lib/achievements/definitions";
import { checkAndUnlockAchievement } from "@/lib/achievements/unlock";

function isValidStoryId(id: string) {
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

export const dynamic = "force-dynamic";

const noCacheHeaders = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

async function getReactionSummary(storyId: string, userId: string) {
  const [reactionGroups, userReaction] = await Promise.all([
    prisma.storyLike.groupBy({
      by: ["type"],
      where: { applicationId: storyId },
      _count: { _all: true },
    }),
    prisma.storyLike.findUnique({
      where: {
        userId_applicationId: {
          userId,
          applicationId: storyId,
        },
      },
      select: { type: true },
    }),
  ]);

  const reactionCounts = normalizeStoryReactionCounts(
    reactionGroups.map((group) => ({
      type: group.type as StoryReactionType,
      count: group._count._all,
    })),
  );
  const count = Object.values(reactionCounts).reduce(
    (sum, value) => sum + value,
    0,
  );

  return {
    count,
    userLiked: Boolean(userReaction),
    userReaction: (userReaction?.type as StoryReactionType | undefined) ?? null,
    reactionCounts,
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAuthUser(request);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const { id: storyId } = await params;
    const userId = session.uid;

    if (!isValidStoryId(storyId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Проверяем, что история существует и публично доступна (как в GET /api/stories/:id)
    const story = await prisma.application.findFirst({
      where: publicStoryWhereById(storyId),
      select: { id: true },
    });

    if (!story) {
      return NextResponse.json(
        { error: "История не найдена" },
        { status: 404 },
      );
    }

    const body = await request.json().catch(() => null);
    const requestedType =
      body && typeof body === "object" && "type" in body ? body.type : "HEART";
    const reactionType = isStoryReactionType(requestedType)
      ? requestedType
      : null;

    if (!reactionType) {
      return NextResponse.json(
        { error: "Некорректный тип реакции" },
        { status: 400 },
      );
    }

    await prisma.storyLike.upsert({
      where: {
        userId_applicationId: {
          userId,
          applicationId: storyId,
        },
      },
      create: {
        applicationId: storyId,
        userId,
        type: reactionType,
      },
      update: {
        type: reactionType,
      },
    });

    checkAndUnlockAchievement(
      userId,
      ACHIEVEMENT_SLUGS.REACTIONS_10_STORIES,
    ).catch((error) => {
      logRouteCatchError(
        "POST /api/stories/[id]/like warm-heart achievement",
        error,
      );
    });

    return NextResponse.json(
      {
        message: "Реакция сохранена",
        ...(await getReactionSummary(storyId, userId)),
      },
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    logRouteCatchError("POST /api/stories/[id]/like:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAuthUser(request);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const { id: storyId } = await params;
    const userId = session.uid;

    if (!isValidStoryId(storyId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Удаляем лайк
    const deletedLike = await prisma.storyLike.deleteMany({
      where: {
        applicationId: storyId,
        userId: userId,
      },
    });

    if (deletedLike.count === 0) {
      return NextResponse.json({ error: "Лайк не найден" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Реакция удалена",
        ...(await getReactionSummary(storyId, userId)),
      },
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    logRouteCatchError("DELETE /api/stories/[id]/like:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
