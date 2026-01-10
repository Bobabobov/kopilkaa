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
  const supportRange = `от ${limits.min.toLocaleString("ru-RU")} до ${limits.max.toLocaleString("ru-RU")} ₽`;
  const nextReq = getNextLevelRequirement(level);
  const nextRequirement =
    nextReq === null
      ? null
      : `До следующего уровня — ещё ${Math.max(0, nextReq - approved)} одобренных заявок`;

  return {
    status,
    approved,
    supportRange,
    nextRequirement,
  };
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    const viewerId = session?.uid || null;
    const reviewId = params.id;
    if (!reviewId) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
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

    if (!review) {
      return NextResponse.json({ error: "Не найдено" }, { status: 404 });
    }

    const approvedCount = await prisma.application.count({
      where: { userId: review.userId, status: "APPROVED" },
    });
    const trust = buildTrustSnapshot(approvedCount);
    const heroBadge = review.user ? (await getHeroBadgesForUsers([review.user.id]))[review.user.id] ?? null : null;

    const mapped = {
      id: review.id,
      content: review.content,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      images: review.images?.map((img) => ({ url: img.url, sort: img.sort })) ?? [],
      user: review.user
        ? {
            ...review.user,
            heroBadge,
            trust,
            isSelf: viewerId ? viewerId === review.userId : false,
          }
        : null,
    };

    return NextResponse.json({ review: mapped });
  } catch (error) {
    console.error("Error fetching review by id:", error);
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}
