import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ApplicationStatus } from "@prisma/client";
import { isValidCuidLikeId } from "@/lib/reviews/reviewId";
import { logRouteCatchError } from "@/lib/api/parseApiError";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: reviewId } = await params;
    const session = await getSession();
    const viewerId = session?.uid || null;
    if (!reviewId || !isValidCuidLikeId(reviewId)) {
      return NextResponse.json({ error: "Некорректный id" }, { status: 400 });
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

    const approvedApplications = await prisma.application.count({
      where: {
        userId: review.userId,
        status: ApplicationStatus.APPROVED,
      },
    });

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
            approvedApplications,
            isSelf: viewerId ? viewerId === review.userId : false,
          }
        : null,
    };

    return NextResponse.json({ review: mapped });
  } catch (error) {
    logRouteCatchError("[API GET /api/reviews/[id]]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: reviewId } = await params;
    const session = await getSession();
    const viewerId = session?.uid ? String(session.uid) : null;

    if (!viewerId) {
      return NextResponse.json(
        { error: "Требуется авторизация" },
        { status: 401 },
      );
    }
    if (!reviewId || !isValidCuidLikeId(reviewId)) {
      return NextResponse.json({ error: "Некорректный id" }, { status: 400 });
    }

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

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json(
      { success: true, message: "Отзыв удалён" },
      { status: 200 },
    );
  } catch (error) {
    logRouteCatchError("[API DELETE /api/reviews/[id]]", error);
    return NextResponse.json(
      { error: "Не удалось удалить отзыв" },
      { status: 500 },
    );
  }
}
