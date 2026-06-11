import { NextRequest, NextResponse } from "next/server";

import { isUserAllowedAdmin } from "@/lib/adminAccess";
import { getAuthUser } from "@/lib/auth";
import { checkUserBan } from "@/lib/ban-check";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import { prisma } from "@/lib/db";
import { publicStoryWhereById } from "@/lib/stories/publicStoryWhere";
import {
  buildStoryCommentThreads,
  countUserApprovedApplications,
  fetchStoryCommentThreadRows,
  fetchViewerLikedCommentIds,
  getCommentCooldownSecondsRemaining,
  getStoryCommentDepth,
  isValidStoryId,
  mapStoryComment,
  parseStoryCommentParentId,
  STORY_COMMENT_MAX_DEPTH,
  STORY_COMMENT_MAX_LENGTH,
  STORY_COMMENT_MIN_LENGTH,
  STORY_COMMENT_NO_LINKS_ERROR,
  STORY_COMMENT_SELECT,
  resolveStoryCommentPermissions,
  validateStoryCommentContent,
} from "@/lib/stories/storyComments";
import { ACHIEVEMENT_SLUGS } from "@/lib/achievements/definitions";
import { checkAndUnlockAchievement } from "@/lib/achievements/unlock";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

const noCacheHeaders = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

async function buildViewerState(
  userId: string | null,
  sessionRole?: string | null,
) {
  if (!userId) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      canComment: false,
      approvedApplications: 0,
      cooldownSecondsRemaining: null as number | null,
    };
  }

  const [approvedApplications, user, isAdmin] = await Promise.all([
    countUserApprovedApplications(userId),
    prisma.user.findUnique({
      where: { id: userId },
      select: { lastCommentAt: true },
    }),
    isUserAllowedAdmin(userId, sessionRole),
  ]);

  const { canComment, cooldownSecondsRemaining } = resolveStoryCommentPermissions(
    {
      isAdmin,
      approvedApplications,
      lastCommentAt: user?.lastCommentAt,
    },
  );

  return {
    isAuthenticated: true,
    isAdmin,
    canComment,
    approvedApplications,
    cooldownSecondsRemaining,
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: storyId } = await params;

    if (!isValidStoryId(storyId)) {
      return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });
    }

    const story = await prisma.application.findFirst({
      where: publicStoryWhereById(storyId),
      select: { id: true },
    });

    if (!story) {
      return NextResponse.json({ error: "История не найдена" }, { status: 404 });
    }

    const session = await getAuthUser(req);
    const viewerId = session?.uid ?? null;

    const page = Math.max(1, Number(req.nextUrl.searchParams.get("page")) || 1);
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, Number(req.nextUrl.searchParams.get("limit")) || DEFAULT_LIMIT),
    );
    const skip = (page - 1) * limit;

    const [total, rootTotal, rootRows, viewer] = await Promise.all([
      prisma.storyComment.count({ where: { applicationId: storyId } }),
      prisma.storyComment.count({
        where: { applicationId: storyId, parentId: null },
      }),
      prisma.storyComment.findMany({
        where: { applicationId: storyId, parentId: null },
        orderBy: [{ likes: { _count: "desc" } }, { createdAt: "desc" }],
        skip,
        take: limit,
        select: { id: true },
      }),
      buildViewerState(viewerId, session?.role),
    ]);

    const rootIds = rootRows.map((row) => row.id);
    const rows = await fetchStoryCommentThreadRows(storyId, rootIds);
    const likedCommentIds = await fetchViewerLikedCommentIds(
      viewerId,
      rows.map((row) => row.id),
    );
    const items = buildStoryCommentThreads(
      rows,
      viewerId,
      rootIds,
      viewer.isAdmin,
      likedCommentIds,
    );

    return NextResponse.json(
      {
        items,
        total,
        rootTotal,
        page,
        pages: Math.ceil(rootTotal / limit) || 1,
        limit,
        viewer,
      },
      { headers: noCacheHeaders },
    );
  } catch (error) {
    logRouteCatchError("GET /api/stories/[id]/comments", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAuthUser(req);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const { id: storyId } = await params;
    const userId = session.uid;

    if (!isValidStoryId(storyId)) {
      return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });
    }

    const story = await prisma.application.findFirst({
      where: publicStoryWhereById(storyId),
      select: { id: true },
    });

    if (!story) {
      return NextResponse.json({ error: "История не найдена" }, { status: 404 });
    }

    const isAdmin = await isUserAllowedAdmin(userId, session.role);

    if (!isAdmin) {
      const [banStatus, approvedApplications] = await Promise.all([
        checkUserBan(userId),
        countUserApprovedApplications(userId),
      ]);

      if (banStatus.isBanned) {
        return NextResponse.json(
          { error: "Действие недоступно для заблокированного аккаунта" },
          { status: 403 },
        );
      }

      if (approvedApplications < 1) {
        return NextResponse.json(
          {
            error:
              "Комментарии доступны только участникам с хотя бы одной одобренной заявкой",
          },
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
    const parentIdRaw =
      body &&
      typeof body === "object" &&
      body !== null &&
      !Array.isArray(body) &&
      "parentId" in body
        ? (body as { parentId: unknown }).parentId
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

    const parentId = parseStoryCommentParentId(parentIdRaw);
    if (parentIdRaw !== null && parentIdRaw !== undefined && parentIdRaw !== "" && !parentId) {
      return NextResponse.json(
        { error: "Некорректный комментарий для ответа" },
        { status: 400 },
      );
    }

    if (parentId) {
      const parent = await prisma.storyComment.findFirst({
        where: {
          id: parentId,
          applicationId: storyId,
        },
        select: { id: true, parentId: true },
      });

      if (!parent) {
        return NextResponse.json(
          { error: "Комментарий для ответа не найден" },
          { status: 404 },
        );
      }

      const parentDepth = await getStoryCommentDepth(parent.id);
      if (parentDepth >= STORY_COMMENT_MAX_DEPTH) {
        return NextResponse.json(
          { error: "Достигнута максимальная глубина обсуждения" },
          { status: 400 },
        );
      }
    }

    const content = validation.content;

    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { lastCommentAt: true },
      });

      if (!isAdmin) {
        const cooldownSecondsRemaining = getCommentCooldownSecondsRemaining(
          user?.lastCommentAt,
        );
        if (cooldownSecondsRemaining !== null) {
          throw new Error(`COOLDOWN:${cooldownSecondsRemaining}`);
        }
      }

      const comment = await tx.storyComment.create({
        data: {
          userId,
          applicationId: storyId,
          parentId,
          content,
        },
        select: STORY_COMMENT_SELECT,
      });

      await tx.user.update({
        where: { id: userId },
        data: { lastCommentAt: new Date() },
      });

      return comment;
    });

    const viewer = await buildViewerState(userId, session.role);

    checkAndUnlockAchievement(userId, ACHIEVEMENT_SLUGS.COMMENTS_10).catch(
      (error) => {
        logRouteCatchError(
          "POST /api/stories/[id]/comments story-voice achievement",
          error,
        );
      },
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          comment: mapStoryComment(created, userId, isAdmin, new Set()),
        },
        viewer,
      },
      { status: 201, headers: noCacheHeaders },
    );
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("COOLDOWN:")) {
      const seconds = Number(error.message.split(":")[1]) || 1;
      return NextResponse.json(
        {
          error: `Подождите ${seconds} сек. перед следующим комментарием`,
          cooldownSecondsRemaining: seconds,
        },
        { status: 429 },
      );
    }

    logRouteCatchError("POST /api/stories/[id]/comments", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
