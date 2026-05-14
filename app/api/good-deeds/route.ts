import { NextRequest, NextResponse } from "next/server";
import { GoodDeedSubmissionStatus } from "@prisma/client";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeGoodDeedBonusWallet } from "@/lib/goodDeedBonusWallet";
import {
  fetchApprovedGoodDeedFeedRows,
  mapFeedRowToGoodDeedsApiItem,
} from "@/lib/goodDeedPublicFeed";
import {
  getActiveTasksByDifficulty,
  getGoodDeedCycleKey,
  getTaskRotationState,
} from "@/lib/goodDeedTasksAdmin";
import { type GoodDeedDifficulty, getWeekInfo } from "@/lib/goodDeeds";
import { logRouteCatchError } from "@/lib/api/parseApiError";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthUser(req);
    const weekInfo = getWeekInfo(new Date());
    const cycleKey = await getGoodDeedCycleKey(weekInfo.key);
    const rotationState = await getTaskRotationState();
    const tasksByDifficulty = await getActiveTasksByDifficulty();

    const [weeklySubmissions, feedSubmissions] = await Promise.all([
      session?.uid
        ? prisma.goodDeedSubmission.findMany({
            where: {
              userId: session.uid,
              weekKey: cycleKey,
            },
            select: {
              taskKey: true,
              status: true,
              adminComment: true,
              reviewedAt: true,
            },
          })
        : Promise.resolve([]),
      fetchApprovedGoodDeedFeedRows(24),
    ]);

    const submissionMap = new Map(
      weeklySubmissions.map((submission) => [submission.taskKey, submission]),
    );

    const withStatus = (task: (typeof tasksByDifficulty)["EASY"][number]) => {
      const submission = submissionMap.get(task.id);
      return {
        ...task,
        submissionStatus: submission?.status ?? null,
        adminComment: submission?.adminComment ?? null,
      };
    };

    const categorizedTasks = {
      EASY: tasksByDifficulty.EASY.map(withStatus),
      MEDIUM: tasksByDifficulty.MEDIUM.map(withStatus),
      HARD: tasksByDifficulty.HARD.map(withStatus),
    };

    const difficultyOrder: GoodDeedDifficulty[] = ["EASY", "MEDIUM", "HARD"];
    const weeklyTasks = difficultyOrder.flatMap((key) => {
      const first = categorizedTasks[key][0];
      return first ? [first] : [];
    });

    const weeklyProgress = {
      approved: weeklyTasks.filter(
        (task) => task.submissionStatus === GoodDeedSubmissionStatus.APPROVED,
      ).length,
      pending: weeklyTasks.filter(
        (task) => task.submissionStatus === GoodDeedSubmissionStatus.PENDING,
      ).length,
      rejected: weeklyTasks.filter(
        (task) => task.submissionStatus === GoodDeedSubmissionStatus.REJECTED,
      ).length,
      total: weeklyTasks.length,
    };

    let approvedCount = 0;
    let pendingCount = 0;
    let walletInfo = {
      totalEarnedBonuses: 0,
      availableBonuses: 0,
      pendingWithdrawalBonuses: 0,
      withdrawnBonuses: 0,
      hasPendingWithdrawal: false,
    };

    if (session?.uid) {
      walletInfo = await computeGoodDeedBonusWallet(session.uid);

      const userStats = await prisma.goodDeedSubmission.groupBy({
        by: ["status"],
        where: { userId: session.uid },
        _count: { _all: true },
      });

      for (const stat of userStats) {
        if (stat.status === GoodDeedSubmissionStatus.APPROVED) {
          approvedCount = stat._count._all;
        }
        if (stat.status === GoodDeedSubmissionStatus.PENDING) {
          pendingCount = stat._count._all;
        }
      }
    }

    return NextResponse.json({
      week: weekInfo,
      cycle: {
        key: cycleKey,
        nextRotationAt: rotationState.nextRotationAt.toISOString(),
        version: rotationState.version,
      },
      weeklyTasks,
      stats: {
        approvedCount,
        pendingCount,
        ...walletInfo,
      },
      feed: feedSubmissions.map(mapFeedRowToGoodDeedsApiItem),
      viewer: {
        isAuthenticated: Boolean(session?.uid),
      },
      weeklyProgress,
    });
  } catch (error) {
    logRouteCatchError("GET /api/good-deeds error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить страницу добрых дел" },
      { status: 500 },
    );
  }
}
