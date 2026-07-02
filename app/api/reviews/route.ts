import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ApplicationStatus, type Prisma } from "@prisma/client";
import { loadUserEconomyContext } from "@/lib/applications/userEconomyContext";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import { ACHIEVEMENT_SLUGS } from "@/lib/achievements/definitions";
import { checkAndUnlockAchievement } from "@/lib/achievements/unlock";
import {
  REVIEW_MAX_IMAGES,
  REVIEW_MAX_TEXT_LENGTH,
  REVIEW_MIN_IMAGES,
  REVIEW_MIN_TEXT_LENGTH,
} from "@/lib/reviews/constants";
import { upsertApplicationReview } from "@/lib/reviews/reviewForApplication";

export const dynamic = "force-dynamic";

const MAX_IMAGES = REVIEW_MAX_IMAGES;
const MIN_IMAGES = REVIEW_MIN_IMAGES;
const MAX_TEXT_LENGTH = REVIEW_MAX_TEXT_LENGTH;
const MIN_TEXT_LENGTH = REVIEW_MIN_TEXT_LENGTH;

const REVIEW_SELECT = {
  id: true,
  userId: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  applicationId: true,
  images: {
    orderBy: { sort: "asc" as const },
    select: { url: true, sort: true },
  },
  user: {
    select: {
      id: true,
      name: true,
      username: true,
      avatar: true,
      avatarFrame: true,
      vkLink: true,
      telegramLink: true,
      youtubeLink: true,
    },
  },
};

// Проверка безопасности URL загруженных файлов
function isSafeUploadUrl(url: string): boolean {
  // Разрешаем только файлы, выданные нашим upload-роутом
  if (typeof url !== "string" || !url.trim()) return false;
  const trimmed = url.trim();
  // Разрешаем только относительные пути к /api/uploads/
  return trimmed.startsWith("/api/uploads/") && !trimmed.includes("..");
}

type ReviewListRow = Prisma.ReviewGetPayload<{ select: typeof REVIEW_SELECT }>;

async function mapReviews(raw: ReviewListRow[], viewerId: string | null) {
  if (!raw.length) return [];

  const userIds = Array.from(new Set(raw.map((r) => r.userId)));

  const approvedGroups = await prisma.application
    .groupBy({
      by: ["userId"],
      where: {
        userId: { in: userIds },
        status: ApplicationStatus.APPROVED,
      },
      _count: { _all: true },
    })
    .catch(() => []);

  const approvedMap = new Map<string, number>();
  approvedGroups.forEach((g) => {
    approvedMap.set(g.userId, g._count._all);
  });

  return raw.map((item) => {
    const approvedApplications = approvedMap.get(item.userId) ?? 0;
    const displayName = item.user.name || item.user.username || "Без имени";

    return {
      id: item.id,
      content: item.content,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      images:
        item.images?.map((img) => ({ url: img.url, sort: img.sort })) ?? [],
      user: {
        id: item.user.id,
        name: displayName,
        username: item.user.username,
        avatar: item.user.avatar,
        avatarFrame: item.user.avatarFrame,
        vkLink: item.user.vkLink,
        telegramLink: item.user.telegramLink,
        youtubeLink: item.user.youtubeLink,
        approvedApplications,
        isSelf: viewerId ? viewerId === item.userId : false,
      },
    };
  });
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const viewerId = session?.uid ? String(session.uid) : null;

    const url = new URL(req.url);
    const limit = Math.min(
      30,
      Math.max(1, Number(url.searchParams.get("limit") || 12)),
    );
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const skip = (page - 1) * limit;

    const select = REVIEW_SELECT;

    // Один формат отображения: показываем все существующие отзывы
    // (включая исторические записи с applicationId != null).
    const where = {};
    const orderBy = { createdAt: "desc" as const } as const;

    const economy = viewerId
      ? await loadUserEconomyContext(prisma, viewerId)
      : null;
    const viewerApproved = economy?.approvedApplicationCount ?? 0;
    const lastApprovedApp = economy?.lastApprovedApplication ?? null;

    const [totalCount, anyReview, viewerSingleReview] = await Promise.all([
      prisma.review.count({ where }),
      viewerId
        ? prisma.review.findFirst({
            where: { userId: viewerId },
            select: { id: true },
          })
        : null,
      viewerId
        ? prisma.review.findFirst({
            where: { userId: viewerId },
            orderBy: { createdAt: "desc" },
            select,
          })
        : null,
    ]);

    const items = await prisma.review.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select,
    });

    const mapped = await mapReviews(items, viewerId);
    // Требуем отзыв только один раз: если есть одобренная заявка, но ещё нет отзыва
    const shouldRequireFirstReview =
      Boolean(viewerId) && viewerApproved >= 1 && !anyReview;
    const pendingReviewApplication =
      shouldRequireFirstReview && lastApprovedApp
        ? { id: lastApprovedApp.id, title: lastApprovedApp.title }
        : null;
    const mappedReviewForPending = viewerSingleReview
      ? (await mapReviews([viewerSingleReview], viewerId))[0]
      : null;

    return NextResponse.json({
      limit,
      page,
      pages: Math.ceil(totalCount / limit) || 1,
      total: totalCount,
      items: mapped,
      viewer: {
        canReview: Boolean(viewerId && pendingReviewApplication),
        approvedApplications: viewerApproved,
        pendingReviewApplication,
        review: mappedReviewForPending ?? null,
      },
    });
  } catch (error) {
    logRouteCatchError("[API GET /api/reviews]", error);
    return NextResponse.json(
      {
        limit: 12,
        page: 1,
        pages: 1,
        items: [],
        total: 0,
        viewer: {
          canReview: false,
          approvedApplications: 0,
          pendingReviewApplication: null,
          review: null,
        },
      },
      { status: 200 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  const viewerId = session?.uid ? String(session.uid) : null;
  if (!viewerId) {
    return NextResponse.json(
      { error: "Требуется авторизация" },
      { status: 401 },
    );
  }

  try {
    const select = REVIEW_SELECT;
    const body = await req.json();
    const applicationId =
      typeof body?.applicationId === "string" ? body.applicationId.trim() : "";
    const content = String(body?.content || "").trim();
    const images = Array.isArray(body?.images) ? (body.images as string[]) : [];

    if (!applicationId) {
      return NextResponse.json(
        { error: "Укажите историю, по которой оставляете отзыв" },
        { status: 400 },
      );
    }
    if (!content) {
      return NextResponse.json(
        { error: "Текст отзыва пустой" },
        { status: 400 },
      );
    }
    if (content.length < MIN_TEXT_LENGTH) {
      return NextResponse.json(
        {
          error: `Опишите опыт подробнее (минимум ${MIN_TEXT_LENGTH} символов)`,
        },
        { status: 400 },
      );
    }
    if (content.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `Текст не должен превышать ${MAX_TEXT_LENGTH} символов` },
        { status: 400 },
      );
    }
    if (images.length > MAX_IMAGES) {
      return NextResponse.json(
        { error: `Максимум ${MAX_IMAGES} фото` },
        { status: 400 },
      );
    }
    if (images.length < MIN_IMAGES) {
      return NextResponse.json(
        {
          error: "Добавьте хотя бы одно фото (чек, товар или результат гонорара)",
        },
        { status: 400 },
      );
    }

    const sanitizedImages: string[] = [];
    for (const img of images) {
      const url = String(img || "").trim();
      if (!url) continue;
      if (!isSafeUploadUrl(url)) {
        return NextResponse.json(
          { error: "Разрешены только файлы, загруженные через форму" },
          { status: 400 },
        );
      }
      sanitizedImages.push(url);
    }
    if (sanitizedImages.length < MIN_IMAGES) {
      return NextResponse.json(
        { error: "Добавьте хотя бы одно фото" },
        { status: 400 },
      );
    }

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        userId: viewerId,
        status: ApplicationStatus.APPROVED,
      },
      select: { id: true },
    });
    if (!application) {
      return NextResponse.json(
        {
          error:
            "История не найдена, не одобрена или вы не можете оставить по ней отзыв",
        },
        { status: 403 },
      );
    }

    const result = await prisma.$transaction(async (tx) =>
      upsertApplicationReview(tx, {
        userId: viewerId,
        applicationId,
        content,
        sanitizedImages,
        select,
      }),
    );

    const mapped = (await mapReviews([result], viewerId))[0] ?? null;

    checkAndUnlockAchievement(viewerId, ACHIEVEMENT_SLUGS.LEFT_REVIEW).catch(
      (error) => {
        logRouteCatchError(
          "[API POST /api/reviews] left-review achievement",
          error,
        );
      },
    );

    return NextResponse.json({ review: mapped }, { status: 200 });
  } catch (error) {
    const status = (error as { status?: number }).status;
    if (status === 403) {
      return NextResponse.json(
        { error: "Нельзя изменить чужой отзыв" },
        { status: 403 },
      );
    }
    logRouteCatchError("[API POST /api/reviews]", error);
    return NextResponse.json(
      { error: "Не удалось сохранить отзыв" },
      { status: 500 },
    );
  }
}
