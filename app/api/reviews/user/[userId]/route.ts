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
import { isValidCuidLikeId } from "@/lib/reviews/reviewId";
import { logRouteCatchError } from "@/lib/api/parseApiError";

export const dynamic = "force-dynamic";

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

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const session = await getSession();
    const viewerId = session?.uid ? String(session.uid) : null;
    const { userId } = await context.params;

    if (!userId || !isValidCuidLikeId(userId)) {
      return NextResponse.json(
        { error: "Некорректный userId" },
        { status: 400 },
      );
    }

    const select = {
      id: true,
      userId: true,
      content: true,
      createdAt: true,
      updatedAt: true,
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

    // Показываем последний отзыв пользователя независимо от типа исторической записи.
    const review = await prisma.review.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select,
    });

    if (!review) {
      return NextResponse.json({ review: null });
    }

    const approvedCount = await prisma.application.count({
      where: {
        userId: review.userId,
        status: ApplicationStatus.APPROVED,
        countTowardsTrust: true,
      },
    });
    const trust = buildTrustSnapshot(approvedCount);
    const mapped = {
      id: review.id,
      content: review.content,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      images:
        review.images?.map((img) => ({ url: img.url, sort: img.sort })) ?? [],
      user: review.user
        ? {
            ...review.user,
            trust,
            isSelf: viewerId ? viewerId === review.userId : false,
          }
        : null,
    };

    return NextResponse.json({ review: mapped });
  } catch (error) {
    logRouteCatchError("[API GET /api/reviews/user/[userId]]", error);
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}
