import { NextRequest, NextResponse } from "next/server";
import { GoodDeedSubmissionStatus } from "@prisma/client";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeGoodDeedBonusWallet } from "@/lib/goodDeedBonusWallet";
import {
  getCompletionBonusForDifficulty,
  getDifficultyDescription,
  getDifficultyLabel,
  type GoodDeedDifficulty,
  getTaskDifficulty,
  getTasksByDifficulty,
  getWeekInfo,
} from "@/lib/goodDeeds";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthUser(req);
    const weekInfo = getWeekInfo(new Date());
    const tasksByDifficulty = getTasksByDifficulty();

    const [weeklySubmissions, feedSubmissions] = await Promise.all([
      session?.uid
        ? prisma.goodDeedSubmission.findMany({
            where: {
              userId: session.uid,
              weekKey: weekInfo.key,
            },
            select: {
              taskKey: true,
              status: true,
              adminComment: true,
              reviewedAt: true,
            },
          })
        : Promise.resolve([]),
      prisma.goodDeedSubmission.findMany({
        where: {
          status: GoodDeedSubmissionStatus.APPROVED,
        },
        orderBy: { updatedAt: "desc" },
        take: 24,
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
      }),
    ]);

    const submissionMap = new Map(
      weeklySubmissions.map((submission) => [submission.taskKey, submission]),
    );
    const selectedDifficultyFromSubmissions = (() => {
      for (const submission of weeklySubmissions) {
        const difficulty = getTaskDifficulty(submission.taskKey);
        if (difficulty) return difficulty;
      }
      return null;
    })();
    const lastApprovedSubmission = session?.uid
      ? await prisma.goodDeedSubmission.findFirst({
          where: {
            userId: session.uid,
            status: GoodDeedSubmissionStatus.APPROVED,
          },
          orderBy: { updatedAt: "desc" },
          select: { taskKey: true },
        })
      : null;
    const lastApprovedDifficulty = lastApprovedSubmission
      ? getTaskDifficulty(lastApprovedSubmission.taskKey)
      : null;
    const hasApprovedSubmissionEver = Boolean(lastApprovedSubmission);
    const selectedDifficulty: GoodDeedDifficulty =
      selectedDifficultyFromSubmissions ?? lastApprovedDifficulty ?? "MEDIUM";

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
    const selectedTasks = categorizedTasks[selectedDifficulty];

    const categoryStats = {
      EASY: {
        completedCount: categorizedTasks.EASY.filter(
          (task) => task.submissionStatus === GoodDeedSubmissionStatus.APPROVED,
        ).length,
        totalCount: categorizedTasks.EASY.length,
        completionBonus: getCompletionBonusForDifficulty("EASY"),
        label: getDifficultyLabel("EASY"),
        description: getDifficultyDescription("EASY"),
      },
      MEDIUM: {
        completedCount: categorizedTasks.MEDIUM.filter(
          (task) => task.submissionStatus === GoodDeedSubmissionStatus.APPROVED,
        ).length,
        totalCount: categorizedTasks.MEDIUM.length,
        completionBonus: getCompletionBonusForDifficulty("MEDIUM"),
        label: getDifficultyLabel("MEDIUM"),
        description: getDifficultyDescription("MEDIUM"),
      },
      HARD: {
        completedCount: categorizedTasks.HARD.filter(
          (task) => task.submissionStatus === GoodDeedSubmissionStatus.APPROVED,
        ).length,
        totalCount: categorizedTasks.HARD.length,
        completionBonus: getCompletionBonusForDifficulty("HARD"),
        label: getDifficultyLabel("HARD"),
        description: getDifficultyDescription("HARD"),
      },
    };
    const selectedCategoryProgress = {
      approved: selectedTasks.filter(
        (task) => task.submissionStatus === GoodDeedSubmissionStatus.APPROVED,
      ).length,
      pending: selectedTasks.filter(
        (task) => task.submissionStatus === GoodDeedSubmissionStatus.PENDING,
      ).length,
      rejected: selectedTasks.filter(
        (task) => task.submissionStatus === GoodDeedSubmissionStatus.REJECTED,
      ).length,
      total: selectedTasks.length,
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
      tasksByDifficulty: categorizedTasks,
      tasks: selectedTasks,
      stats: {
        approvedCount,
        pendingCount,
        ...walletInfo,
      },
      categoryStats,
      feed: feedSubmissions.map((item) => ({
        id: item.id,
        taskTitle: item.taskTitle,
        taskDescription: item.taskDescription,
        storyText: item.storyText || "",
        reward: item.reward,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        media: item.media.map((media) => ({
          url: media.url,
          type: media.type,
        })),
        user: {
          id: item.user.id,
          name: item.user.name || item.user.username || "Пользователь",
          username: item.user.username,
          avatar: item.user.avatar,
          vkLink: item.user.vkLink,
          telegramLink: item.user.telegramLink,
          youtubeLink: item.user.youtubeLink,
        },
      })),
      viewer: {
        isAuthenticated: Boolean(session?.uid),
        selectedDifficulty,
        canChangeDifficulty: !hasApprovedSubmissionEver,
      },
      selectedCategoryProgress,
    });
  } catch (error) {
    console.error("GET /api/good-deeds error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить страницу добрых дел" },
      { status: 500 },
    );
  }
}
