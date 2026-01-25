import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getHeroBadgesForUsers } from "@/lib/heroBadges";
import { type TrustLevel } from "@/lib/trustLevel";
import { computeUserTrustSnapshot } from "@/lib/trust/computeTrustSnapshot";

export const dynamic = "force-dynamic";

type TrustSnapshot = {
  status: Lowercase<TrustLevel>;
  approved: number;
  supportRange: string;
  nextRequirement: string | null;
};

function buildTrustSnapshot(
  trust: Awaited<ReturnType<typeof computeUserTrustSnapshot>>,
): TrustSnapshot {
  const status = trust.trustLevel.toLowerCase() as Lowercase<TrustLevel>;
  const nextRequirement =
    trust.nextRequired === null
      ? null
      : `До следующего уровня — ещё ${Math.max(
          0,
          trust.nextRequired - trust.effectiveApprovedApplications,
        )} одобренных заявок`;

  return {
    status,
    approved: trust.effectiveApprovedApplications,
    supportRange: trust.supportRangeText,
    nextRequirement,
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const trust = buildTrustSnapshot(
      await computeUserTrustSnapshot(review.userId),
    );
    const heroBadge = review.user
      ? ((await getHeroBadgesForUsers([review.user.id]))[review.user.id] ??
        null)
      : null;

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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getSession();
    const viewerId = session?.uid ? String(session.uid) : null;

    if (!viewerId) {
      return NextResponse.json(
        { error: "Требуется авторизация" },
        { status: 401 },
      );
    }

    const reviewId = params.id;
    if (!reviewId) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    // Проверяем, что отзыв существует и принадлежит текущему пользователю
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { id: true, userId: true },
    });

    if (!review) {
      return NextResponse.json({ error: "Отзыв не найден" }, { status: 404 });
    }

    if (review.userId !== viewerId) {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    // Удаляем отзыв (изображения удалятся каскадно из-за onDelete: Cascade)
    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json(
      { success: true, message: "Отзыв удалён" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Не удалось удалить отзыв" },
      { status: 500 },
    );
  }
}
