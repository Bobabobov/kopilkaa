import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getHeroBadgesForUsers } from "@/lib/heroBadges";
import {
  getNextLevelRequirement,
  getTrustLevelFromApprovedCount,
  getTrustLimits,
  type TrustLevel,
} from "@/lib/trustLevel";
import { ApplicationStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const MAX_IMAGES = 5;
const MAX_TEXT_LENGTH = 1200;

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

  const [badges, effectiveGroups] = await Promise.all([
    getHeroBadgesForUsers(userIds),
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
    const heroBadge = badges[item.user.id] ?? null;
    const displayName = item.user.name || item.user.username || "Без имени";

    return {
      id: item.id,
      content: item.content,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      images: item.images?.map((img: any) => ({ url: img.url, sort: img.sort })) ?? [],
      user: {
        id: item.user.id,
        name: displayName,
        username: item.user.username,
        avatar: item.user.avatar,
        avatarFrame: item.user.avatarFrame,
        heroBadge,
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
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const limit = Math.min(30, Math.max(1, Number(url.searchParams.get("limit") || 12)));
    const skip = (page - 1) * limit;

    const [items, total, viewerApproved, viewerReviewRaw] = await Promise.all([
      prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          userId: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          images: { orderBy: { sort: "asc" }, select: { url: true, sort: true } },
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
      }).catch(() => []),
      prisma.review.count().catch(() => 0),
      viewerId
        ? prisma.application
            .count({
              where: {
                userId: viewerId,
                status: ApplicationStatus.APPROVED,
              },
            })
            .catch((err) => {
              console.error("[reviews] Error counting approved apps:", err);
              return 0;
            })
        : 0,
      viewerId
        ? prisma.review.findUnique({
            where: { userId: viewerId },
            select: {
              id: true,
              userId: true,
              content: true,
              createdAt: true,
              updatedAt: true,
              images: { orderBy: { sort: "asc" }, select: { url: true, sort: true } },
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
          })
        : null,
    ]);

  const mappedItems = await mapReviews(items, viewerId);
  const mappedViewerReview = viewerReviewRaw ? (await mapReviews([viewerReviewRaw], viewerId))[0] : null;

    return NextResponse.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      items: mappedItems,
      viewer: {
        canReview: Boolean(viewerId && viewerApproved > 0),
        approvedApplications: viewerApproved,
        review: mappedViewerReview,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        page: 1,
        limit: 0,
        total: 0,
        pages: 0,
        items: [],
        viewer: { canReview: false, approvedApplications: 0, review: null },
      },
      { status: 200 },
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  const viewerId = session?.uid ? String(session.uid) : null;
  if (!viewerId) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const content = String(body?.content || "").trim();
    const images = Array.isArray(body?.images) ? (body.images as string[]) : [];

    if (!content) {
      return NextResponse.json({ error: "Текст отзыва пустой" }, { status: 400 });
    }
    if (content.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: `Текст не должен превышать ${MAX_TEXT_LENGTH} символов` }, { status: 400 });
    }
    if (images.length > MAX_IMAGES) {
      return NextResponse.json({ error: `Максимум ${MAX_IMAGES} фото` }, { status: 400 });
    }
    
    // Валидация и санитизация URL изображений
    const sanitizedImages: string[] = [];
    for (const img of images) {
      const url = String(img || "").trim();
      if (!url) continue;
      
      // Проверяем, что URL безопасен (только наши загруженные файлы)
      if (!isSafeUploadUrl(url)) {
        return NextResponse.json(
          { error: "Разрешены только файлы, загруженные через форму" },
          { status: 400 }
        );
      }
      
      sanitizedImages.push(url);
    }

    const approvedCount = await prisma.application
      .count({
        where: {
          userId: viewerId,
          status: ApplicationStatus.APPROVED,
        },
      })
      .catch(() => 0);
    if (approvedCount <= 0) {
      return NextResponse.json(
        { error: "Оставлять отзыв могут только пользователи с одобренной заявкой" },
        { status: 403 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.review.findUnique({ where: { userId: viewerId } });

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
            images: { orderBy: { sort: "asc" }, select: { url: true, sort: true } },
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
          images: { orderBy: { sort: "asc" }, select: { url: true, sort: true } },
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
    return NextResponse.json({ error: "Не удалось сохранить отзыв" }, { status: 500 });
  }
}
