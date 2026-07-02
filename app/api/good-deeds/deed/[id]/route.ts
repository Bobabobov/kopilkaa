import { NextRequest, NextResponse } from "next/server";
import { GoodDeedSubmissionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import { isValidCuidLikeId } from "@/lib/reviews/reviewId";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    if (!id?.trim()) {
      return NextResponse.json({ error: "Не указан отчёт" }, { status: 400 });
    }
    if (!isValidCuidLikeId(id)) {
      return NextResponse.json({ error: "Некорректный идентификатор" }, { status: 400 });
    }

    const submission = await prisma.goodDeedSubmission.findFirst({
      where: {
        id,
        status: GoodDeedSubmissionStatus.APPROVED,
      },
      select: {
        id: true,
        taskTitle: true,
        taskDescription: true,
        storyText: true,
        reward: true,
        createdAt: true,
        updatedAt: true,
        media: {
          orderBy: { sort: "asc" },
          select: { url: true, type: true },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            vkLink: true,
            telegramLink: true,
            youtubeLink: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: "Не найдено" }, { status: 404 });
    }

    return NextResponse.json({
      deed: {
        id: submission.id,
        taskTitle: submission.taskTitle,
        taskDescription: submission.taskDescription,
        storyText: submission.storyText || "",
        reward: submission.reward,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
        media: submission.media.map((m) => ({
          url: m.url,
          type: m.type,
        })),
        user: {
          id: submission.user.id,
          name:
            submission.user.name ||
            submission.user.username ||
            "Пользователь",
          username: submission.user.username,
          avatar: submission.user.avatar,
          vkLink: submission.user.vkLink,
          telegramLink: submission.user.telegramLink,
          youtubeLink: submission.user.youtubeLink,
        },
      },
    });
  } catch (error) {
    logRouteCatchError("GET /api/good-deeds/deed/[id] error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить отчёт" },
      { status: 500 },
    );
  }
}
