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

// С этой даты — "Что купили на помощь", раньше — "Отзывы (ранее)" (архив).
const REVIEWS_NEW_FROM = new Date("2026-03-08T00:00:00.000Z");

const MAX_IMAGES = 5;
const MIN_IMAGES = 1;
const MAX_TEXT_LENGTH = 1200;
const MIN_TEXT_LENGTH = 50;

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
    const section = url.searchParams.get("section") as "old" | "new" | null;

    const select = {
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

    const whereNew = {
      applicationId: { not: null },
      createdAt: { gte: REVIEWS_NEW_FROM },
    };
    const whereOld = {
      applicationId: { not: null },
      createdAt: { lt: REVIEWS_NEW_FROM },
    };
    const orderBy = { createdAt: "desc" as const } as const;

    const [totalNewCount, totalOldCount, viewerApproved, lastApprovedApp] =
      await Promise.all([
        prisma.review.count({ where: whereNew }),
        prisma.review.count({ where: whereOld }),
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
    ]);

    let reviewForLastApproved: Awaited<
      ReturnType<typeof prisma.review.findUnique>
    > = null;
    if (lastApprovedApp) {
      reviewForLastApproved = await prisma.review.findUnique({
        where: { applicationId: lastApprovedApp.id },
        select,
      });
    }

    const totalNew = totalNewCount;
    const totalOld = totalOldCount;

    let itemsNew: Awaited<ReturnType<typeof prisma.review.findMany>> = [];
    let itemsOld: Awaited<ReturnType<typeof prisma.review.findMany>> = [];

    if (section === "old") {
      itemsOld = await prisma.review.findMany({
        where: whereOld,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select,
      });
    } else if (section === "new") {
      itemsNew = await prisma.review.findMany({
        where: whereNew,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select,
      });
    } else {
      [itemsNew, itemsOld] = await Promise.all([
        prisma.review.findMany({
          where: whereNew,
          orderBy,
          skip: 0,
          take: limit,
          select,
        }),
        prisma.review.findMany({
          where: whereOld,
          orderBy,
          skip: 0,
          take: limit,
          select,
        }),
      ]);
    }

    const mappedOld = await mapReviews(itemsOld, viewerId);
    const mappedNew = await mapReviews(itemsNew, viewerId);
    const pendingReviewApplication =
      lastApprovedApp && !reviewForLastApproved
        ? { id: lastApprovedApp.id, title: lastApprovedApp.title }
        : null;
    const mappedReviewForPending =
      reviewForLastApproved
        ? (await mapReviews([reviewForLastApproved], viewerId))[0]
        : null;

    if (section === "old") {
      return NextResponse.json({
        section: "old",
        page,
        limit,
        total: totalOld,
        pages: Math.ceil(totalOld / limit) || 1,
        items: mappedOld,
      });
    }
    if (section === "new") {
      return NextResponse.json({
        section: "new",
        page,
        limit,
        total: totalNew,
        pages: Math.ceil(totalNew / limit) || 1,
        items: mappedNew,
      });
    }

    return NextResponse.json({
      limit,
      itemsOld: mappedOld,
      itemsNew: mappedNew,
      totalOld,
      totalNew,
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
        itemsOld: [],
        itemsNew: [],
        totalOld: 0,
        totalNew: 0,
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
      const existing = await tx.review.findUnique({
        where: { applicationId: application.id },
      });

      if (existing) {
        await tx.reviewImage.deleteMany({ where: { reviewId: existing.id } });
        const updated = await tx.review.update({
          where: { id: existing.id },
          data: {
            content,
            images: {
              create: sanitizedImages.map((url, idx) => ({ url, sort: idx })),
            },
          },
          select: {
            id: true,
            userId: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            images: {
              orderBy: { sort: "asc" },
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
          },
        });
        return updated;
      }

      const created = await tx.review.create({
        data: {
          userId: viewerId,
          applicationId: application.id,
          content,
          images: {
            create: sanitizedImages.map((url, idx) => ({ url, sort: idx })),
          },
        },
        select: {
          id: true,
          userId: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          images: {
            orderBy: { sort: "asc" },
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
        },
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
