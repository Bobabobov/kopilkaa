import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  getNextLevelRequirement,
  getTrustLevelFromApprovedCount,
  getTrustLimits,
  type TrustLevel,
} from "@/lib/trustLevel";
import { ApplicationStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const MAX_IMAGES = 5;
const MIN_IMAGES = 1;
const MAX_TEXT_LENGTH = 1200;
const MIN_TEXT_LENGTH = 50;

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

type TrustSnapshot = {
  status: Lowercase<TrustLevel>;
  approved: number;
  supportRange: string;
  nextRequirement: string | null;
};

function buildTrustSnapshot(approved: number): TrustSnapshot {
  const level = getTrustLevelFromApprovedCount(approved);
  const status = level.toLowerCase() as Lowercase<TrustLevel>;
  const limits = getTrustLimits(level);
  const supportRange = `Ориентир: от ${limits.min.toLocaleString("ru-RU")} до ${limits.max.toLocaleString("ru-RU")} ₽`;
  const nextReq = getNextLevelRequirement(level);
  const nextRequirement =
    nextReq === null
      ? null
      : `До пересмотра уровня — ещё ${Math.max(0, nextReq - approved)} одобренных заявок`;

  return {
    status,
    approved,
    supportRange,
    nextRequirement,
  };
}

async function mapReviews(raw: any[], viewerId: string | null) {
  if (!raw.length) return [];

  const userIds = Array.from(new Set(raw.map((r) => r.userId)));

  const [effectiveGroups] = await Promise.all([
    prisma.application
      .groupBy({
        by: ["userId"],
        where: {
          userId: { in: userIds },
          status: ApplicationStatus.APPROVED,
          countTowardsTrust: true,
        },
        _count: { _all: true },
      })
      .catch(() => []),
  ]);

  const approvedMap = new Map<string, number>();
  effectiveGroups.forEach((g: any) => {
    approvedMap.set(g.userId, g._count?._all ?? 0);
  });

  return raw.map((item) => {
    const approvedCount = approvedMap.get(item.userId) ?? 0;
    const trust = buildTrustSnapshot(approvedCount);
    const displayName = item.user.name || item.user.username || "Без имени";

    return {
      id: item.id,
      content: item.content,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      images:
        item.images?.map((img: any) => ({ url: img.url, sort: img.sort })) ??
        [],
      user: {
        id: item.user.id,
        name: displayName,
        username: item.user.username,
        avatar: item.user.avatar,
        avatarFrame: item.user.avatarFrame,
        vkLink: item.user.vkLink,
        telegramLink: item.user.telegramLink,
        youtubeLink: item.user.youtubeLink,
        trust,
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

    // Один формат: старые отзывы без привязки к заявке (applicationId == null)
    const where = { applicationId: null };
    const orderBy = { createdAt: "desc" as const } as const;

    const [
      totalCount,
      viewerApproved,
      lastApprovedApp,
      anyReview,
      viewerSingleReview,
    ] = await Promise.all([
      prisma.review.count({ where }),
      viewerId
        ? prisma.application.count({
            where: { userId: viewerId, status: ApplicationStatus.APPROVED },
          }).catch(() => 0)
        : 0,
      viewerId
        ? prisma.application.findFirst({
            where: {
              userId: viewerId,
              status: ApplicationStatus.APPROVED,
            },
            orderBy: { createdAt: "desc" },
            select: { id: true, title: true },
          })
        : null,
      viewerId
        ? prisma.review.findFirst({
            where: { userId: viewerId, applicationId: null },
            select: { id: true },
          })
        : null,
      viewerId
        ? prisma.review.findFirst({
            where: { userId: viewerId, applicationId: null },
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
    const mappedReviewForPending =
      viewerSingleReview
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
    console.error("Error fetching reviews:", error);
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
    const applicationId = typeof body?.applicationId === "string" ? body.applicationId.trim() : "";
    const content = String(body?.content || "").trim();
    const images = Array.isArray(body?.images) ? (body.images as string[]) : [];

    if (!applicationId) {
      return NextResponse.json(
        { error: "Укажите заявку, по которой оставляете отзыв" },
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
        { error: `Опишите опыт подробнее (минимум ${MIN_TEXT_LENGTH} символов)` },
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
        { error: "Добавьте хотя бы одно фото (чек, товар или результат помощи)" },
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
            "Заявка не найдена, не одобрена или вы не можете оставить по ней отзыв",
        },
        { status: 403 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Старый формат: 1 отзыв на пользователя, без привязки к заявке (applicationId == null)
      const existingByUser = await tx.review.findFirst({
        where: { userId: viewerId, applicationId: null },
        select: { id: true },
      });

      if (existingByUser) {
        await tx.reviewImage.deleteMany({ where: { reviewId: existingByUser.id } });
        const updated = await tx.review.update({
          where: { id: existingByUser.id },
          data: {
            content,
            images: {
              create: sanitizedImages.map((url, idx) => ({ url, sort: idx })),
            },
          },
          select,
        });
        return updated;
      }

      const created = await tx.review.create({
        data: {
          userId: viewerId,
          applicationId: null,
          content,
          images: {
            create: sanitizedImages.map((url, idx) => ({ url, sort: idx })),
          },
        },
        select,
      });
      return created;
    });

    const mapped = (await mapReviews([result], viewerId))[0] ?? null;

    return NextResponse.json({ review: mapped }, { status: 200 });
  } catch (error) {
    console.error("Error creating/updating review:", error);
    return NextResponse.json(
      { error: "Не удалось сохранить отзыв" },
      { status: 500 },
    );
  }
}
