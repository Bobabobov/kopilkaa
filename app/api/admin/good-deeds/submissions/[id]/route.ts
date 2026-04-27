import { NextRequest, NextResponse } from "next/server";
import { GoodDeedSubmissionStatus } from "@prisma/client";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import {
  GOOD_DEED_FIRST_IN_FEED_BONUS_BONUSES,
  GOOD_DEED_FIRST_IN_FEED_BONUS_ROW_ID,
} from "@/lib/goodDeedsFirstFeedBonus";
import {
  getCompletionBonusForDifficulty,
  getTaskDifficulty,
  getTasksForDifficulty,
  TASKS_PER_WEEK,
} from "@/lib/goodDeeds";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Не указан id заявки" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const action = String(body?.action || "").trim();
    const adminCommentRaw = body?.adminComment;
    const adminComment =
      typeof adminCommentRaw === "string" ? adminCommentRaw.trim() : "";

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Некорректное действие" },
        { status: 400 },
      );
    }

    if (action === "reject" && !adminComment) {
      return NextResponse.json(
        { error: "При отклонении добавьте комментарий" },
        { status: 400 },
      );
    }

    if (action === "reject") {
      const updated = await prisma.goodDeedSubmission.updateMany({
        where: {
          id,
          status: GoodDeedSubmissionStatus.PENDING,
        },
        data: {
          status: GoodDeedSubmissionStatus.REJECTED,
          reviewedAt: new Date(),
          reviewedById: admin.id,
          adminComment: adminComment || null,
        },
      });

      if (updated.count === 0) {
        return NextResponse.json(
          { error: "Задание не найдено или уже обработано" },
          { status: 409 },
        );
      }

      return NextResponse.json({ success: true });
    }

    const approvalMeta = await prisma.$transaction(async (tx) => {
      const pending = await tx.goodDeedSubmission.findFirst({
        where: { id, status: GoodDeedSubmissionStatus.PENDING },
        select: { id: true, userId: true, weekKey: true, taskKey: true },
      });

      if (!pending) {
        return null;
      }

      await tx.$executeRaw`
        INSERT OR IGNORE INTO "GoodDeedFirstFeedBonusMeta" ("id", "submissionId", "bonusBonuses", "createdAt")
        VALUES (${GOOD_DEED_FIRST_IN_FEED_BONUS_ROW_ID}, ${id}, ${GOOD_DEED_FIRST_IN_FEED_BONUS_BONUSES}, datetime('now'))
      `;
      const changesRows = await tx.$queryRaw<{ n: bigint }[]>`
        SELECT changes() AS n
      `;
      const insertedFirstBonus = Number(changesRows[0]?.n ?? 0) > 0;
      const firstFeedBonus = insertedFirstBonus
        ? GOOD_DEED_FIRST_IN_FEED_BONUS_BONUSES
        : 0;

      const taskDifficulty = getTaskDifficulty(pending.taskKey);
      let categoryCompletionBonus = 0;
      if (taskDifficulty) {
        const taskIdsInDifficulty = getTasksForDifficulty(taskDifficulty).map(
          (task) => task.id,
        );
        const approvedInDifficulty = await tx.goodDeedSubmission.count({
          where: {
            userId: pending.userId,
            weekKey: pending.weekKey,
            status: GoodDeedSubmissionStatus.APPROVED,
            taskKey: { in: taskIdsInDifficulty },
          },
        });
        if (approvedInDifficulty === TASKS_PER_WEEK - 1) {
          categoryCompletionBonus =
            getCompletionBonusForDifficulty(taskDifficulty);
        }
      }
      const extraReward = firstFeedBonus + categoryCompletionBonus;

      const updated = await tx.goodDeedSubmission.updateMany({
        where: {
          id,
          status: GoodDeedSubmissionStatus.PENDING,
        },
        data: {
          status: GoodDeedSubmissionStatus.APPROVED,
          reviewedAt: new Date(),
          reviewedById: admin.id,
          adminComment: adminComment || null,
          ...(extraReward > 0 ? { reward: { increment: extraReward } } : {}),
        },
      });

      if (updated.count === 0) {
        throw new Error("CONFLICT_APPROVE");
      }

      return {
        firstFeedBonusGranted: firstFeedBonus > 0,
        categoryCompletionBonus,
      };
    });

    if (approvalMeta === null) {
      return NextResponse.json(
        { error: "Задание не найдено или уже обработано" },
        { status: 409 },
      );
    }

    return NextResponse.json({
      success: true,
      firstFeedBonusGranted: approvalMeta.firstFeedBonusGranted,
      categoryCompletionBonus: approvalMeta.categoryCompletionBonus,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CONFLICT_APPROVE") {
      return NextResponse.json(
        { error: "Задание не найдено или уже обработано" },
        { status: 409 },
      );
    }
    console.error("PATCH /api/admin/good-deeds/submissions/[id] error:", error);
    return NextResponse.json(
      { error: "Не удалось обновить статус задания" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Не указан id заявки" },
        { status: 400 },
      );
    }

    await prisma.goodDeedSubmission.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "DELETE /api/admin/good-deeds/submissions/[id] error:",
      error,
    );
    return NextResponse.json(
      { error: "Не удалось удалить задание" },
      { status: 500 },
    );
  }
}
