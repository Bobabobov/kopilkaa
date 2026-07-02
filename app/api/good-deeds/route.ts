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
  formatGoodDeedCycleLabel,
  getCurrentGoodDeedTasks,
  getGoodDeedCycleKey,
  getTaskRotationState,
} from "@/lib/goodDeedTasksAdmin";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import { resolveUserProfileLevel } from "@/lib/userLevel/resolveProfileLevel";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthUser(req);
    const cycleKey = await getGoodDeedCycleKey();
    const rotationState = await getTaskRotationState();
    const currentTasks = await getCurrentGoodDeedTasks();

    const preference = session?.uid
      ? await prisma.goodDeedWeekPreference.findUnique({
          where: {
            userId_weekKey: {
              userId: session.uid,
              weekKey: cycleKey,
            },
          },
          select: {
            replacedTaskKey: true,
            newTaskKey: true,
          },
        })
      : null;

    const tasks =
      preference?.newTaskKey && preference.replacedTaskKey
        ? await Promise.all(
            currentTasks.map(async (task) => {
              if (task.id !== preference.replacedTaskKey) return task;

              const replacement = await prisma.goodDeedTask.findUnique({
                where: { id: preference.newTaskKey },
                select: {
                  id: true,
                  difficulty: true,
                  title: true,
                  description: true,
                  reward: true,
                  isActive: true,
                  sortOrder: true,
                },
              });

              if (
                !replacement?.isActive ||
                replacement.difficulty !== task.difficulty
              ) {
                return task;
              }

              return {
                id: replacement.id,
                difficulty: task.difficulty,
                title: replacement.title,
                description: replacement.description,
                reward: replacement.reward,
                isActive: replacement.isActive,
                sortOrder: replacement.sortOrder,
              };
            }),
          )
        : currentTasks;

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

    const weeklyTasks = tasks.map((task) => {
      const submission = submissionMap.get(task.id);
      return {
        ...task,
        submissionStatus: submission?.status ?? null,
        adminComment: submission?.adminComment ?? null,
      };
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
      bonusesInLevel: 0,
      availableBonuses: 0,
      pendingWithdrawalBonuses: 0,
      withdrawnBonuses: 0,
      hasPendingWithdrawal: false,
      withdrawalBlocked: false,
      withdrawalsDisabled: false,
    };

    let profileLevel: number | undefined;

    if (session?.uid) {
      const user = await prisma.user.findUnique({
        where: { id: session.uid },
        select: { level: true, experience: true },
      });
      profileLevel = resolveUserProfileLevel(user ?? {});
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
      cycle: {
        key: cycleKey,
        version: rotationState.version,
        lastRotatedAt: rotationState.lastRotatedAt.toISOString(),
        label: formatGoodDeedCycleLabel(rotationState.lastRotatedAt),
      },
      weeklyTasks,
      stats: {
        approvedCount,
        pendingCount,
        ...walletInfo,
      },
      profileLevel,
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
