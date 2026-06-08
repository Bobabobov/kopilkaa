import { NextRequest, NextResponse } from "next/server";

import { getAuthUser } from "@/lib/auth";
import { checkUserBan } from "@/lib/ban-check";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import { prisma } from "@/lib/db";
import { publicStoryWhereById } from "@/lib/stories/publicStoryWhere";
import {
  isValidStoryCommentId,
  isValidStoryId,
} from "@/lib/stories/storyComments";

export const dynamic = "force-dynamic";

const noCacheHeaders = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

async function getCommentLikeSummary(commentId: string, userId: string) {
  const [likeCount, userLike] = await Promise.all([
    prisma.storyCommentLike.count({ where: { commentId } }),
    prisma.storyCommentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
      select: { id: true },
    }),
  ]);

  return {
    likeCount,
    isLiked: Boolean(userLike),
  };
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  const session = await getAuthUser(req);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const { id: storyId, commentId } = await params;
    const userId = session.uid;

    if (!isValidStoryId(storyId) || !isValidStoryCommentId(commentId)) {
      return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });
    }

    const [story, comment, banStatus] = await Promise.all([
      prisma.application.findFirst({
        where: publicStoryWhereById(storyId),
        select: { id: true },
      }),
      prisma.storyComment.findFirst({
        where: { id: commentId, applicationId: storyId },
        select: { id: true },
      }),
      checkUserBan(userId),
    ]);

    if (!story) {
      return NextResponse.json({ error: "История не найдена" }, { status: 404 });
    }

    if (!comment) {
      return NextResponse.json({ error: "Комментарий не найден" }, { status: 404 });
    }

    if (banStatus.isBanned) {
      return NextResponse.json(
        { error: "Действие недоступно для заблокированного аккаунта" },
        { status: 403 },
      );
    }

    const existing = await prisma.storyCommentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId,
        },
      },
      select: { id: true },
    });

    if (existing) {
      await prisma.storyCommentLike.delete({ where: { id: existing.id } });
    } else {
      await prisma.storyCommentLike.create({
        data: {
          userId,
          commentId,
        },
      });
    }

    const summary = await getCommentLikeSummary(commentId, userId);

    return NextResponse.json(
      { success: true, data: summary },
      { headers: noCacheHeaders },
    );
  } catch (error) {
    logRouteCatchError("POST /api/stories/[id]/comments/[commentId]/like", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
