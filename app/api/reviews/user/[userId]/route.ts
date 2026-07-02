import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ApplicationStatus } from "@prisma/client";
import { isValidCuidLikeId } from "@/lib/reviews/reviewId";
import { logRouteCatchError } from "@/lib/api/parseApiError";

export const dynamic = "force-dynamic";

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

    const review = await prisma.review.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select,
    });

    if (!review) {
      return NextResponse.json({ review: null });
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
    logRouteCatchError("[API GET /api/reviews/user/[userId]]", error);
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}
