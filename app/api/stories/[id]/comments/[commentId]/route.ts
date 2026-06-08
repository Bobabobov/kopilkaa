import { NextRequest, NextResponse } from "next/server";

import { isUserAllowedAdmin } from "@/lib/adminAccess";
import { getAuthUser } from "@/lib/auth";
import { checkUserBan } from "@/lib/ban-check";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import { prisma } from "@/lib/db";
import { publicStoryWhereById } from "@/lib/stories/publicStoryWhere";
import {
  canManageStoryComment,
  fetchViewerLikedCommentIds,
  isValidStoryCommentId,
  isValidStoryId,
  mapStoryComment,
  STORY_COMMENT_MAX_LENGTH,
  STORY_COMMENT_MIN_LENGTH,
  STORY_COMMENT_NO_LINKS_ERROR,
  STORY_COMMENT_SELECT,
  validateStoryCommentContent,
} from "@/lib/stories/storyComments";

export const dynamic = "force-dynamic";

const noCacheHeaders = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

async function loadCommentForStory(storyId: string, commentId: string) {
  return prisma.storyComment.findFirst({
    where: {
      id: commentId,
      applicationId: storyId,
    },
    select: {
      id: true,
      userId: true,
      applicationId: true,
    },
  });
}

export async function PATCH(
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

    const story = await prisma.application.findFirst({
      where: publicStoryWhereById(storyId),
      select: { id: true },
    });

    if (!story) {
      return NextResponse.json({ error: "История не найдена" }, { status: 404 });
    }

    const existing = await loadCommentForStory(storyId, commentId);
    if (!existing) {
      return NextResponse.json({ error: "Комментарий не найден" }, { status: 404 });
    }

    const isAdmin = await isUserAllowedAdmin(userId, session.role);

    if (
      !canManageStoryComment({
        viewerId: userId,
        commentUserId: existing.userId,
        isAdmin,
      })
    ) {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    if (!isAdmin) {
      const banStatus = await checkUserBan(userId);
      if (banStatus.isBanned) {
        return NextResponse.json(
          { error: "Действие недоступно для заблокированного аккаунта" },
          { status: 403 },
        );
      }
    }

    const body = await req.json().catch(() => null);
    const contentRaw =
      body &&
      typeof body === "object" &&
      body !== null &&
      !Array.isArray(body) &&
      "content" in body
        ? (body as { content: unknown }).content
        : null;

    const validation = validateStoryCommentContent(contentRaw);
    if (!validation.ok) {
      if (validation.code === "links") {
        return NextResponse.json(
          { error: STORY_COMMENT_NO_LINKS_ERROR },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          error: `Комментарий: от ${STORY_COMMENT_MIN_LENGTH} до ${STORY_COMMENT_MAX_LENGTH} символов`,
        },
        { status: 400 },
      );
    }

    const updated = await prisma.storyComment.update({
      where: { id: commentId },
      data: { content: validation.content },
      select: STORY_COMMENT_SELECT,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          comment: mapStoryComment(
            updated,
            userId,
            isAdmin,
            await fetchViewerLikedCommentIds(userId, [updated.id]),
          ),
        },
      },
      { headers: noCacheHeaders },
    );
  } catch (error) {
    logRouteCatchError("PATCH /api/stories/[id]/comments/[commentId]", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  const session = await getAuthUser(_req);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const { id: storyId, commentId } = await params;
    const userId = session.uid;

    if (!isValidStoryId(storyId) || !isValidStoryCommentId(commentId)) {
      return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });
    }

    const story = await prisma.application.findFirst({
      where: publicStoryWhereById(storyId),
      select: { id: true },
    });

    if (!story) {
      return NextResponse.json({ error: "История не найдена" }, { status: 404 });
    }

    const existing = await loadCommentForStory(storyId, commentId);
    if (!existing) {
      return NextResponse.json({ error: "Комментарий не найден" }, { status: 404 });
    }

    const isAdmin = await isUserAllowedAdmin(userId, session.role);

    if (
      !canManageStoryComment({
        viewerId: userId,
        commentUserId: existing.userId,
        isAdmin,
      })
    ) {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    if (!isAdmin) {
      const banStatus = await checkUserBan(userId);
      if (banStatus.isBanned) {
        return NextResponse.json(
          { error: "Действие недоступно для заблокированного аккаунта" },
          { status: 403 },
        );
      }
    }

    await prisma.storyComment.delete({
      where: { id: commentId },
    });

    return NextResponse.json(
      { success: true },
      { headers: noCacheHeaders },
    );
  } catch (error) {
    logRouteCatchError("DELETE /api/stories/[id]/comments/[commentId]", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
