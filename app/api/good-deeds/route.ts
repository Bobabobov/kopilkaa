import { NextRequest, NextResponse } from "next/server";
import { GoodDeedSubmissionStatus } from "@prisma/client";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeGoodDeedBonusWallet } from "@/lib/goodDeedBonusWallet";
import { getTaskById, getWeekInfo, pickTasksForWeek } from "@/lib/goodDeeds";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthUser(req);
    const weekInfo = getWeekInfo(new Date());
    const weeklyTasks = pickTasksForWeek(weekInfo.key);

    const [weeklySubmissions, weekPreference, feedSubmissions] = await Promise.all([
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
            },
          })
        : Promise.resolve([]),
      session?.uid
        ? prisma.goodDeedWeekPreference.findUnique({
            where: {
              userId_weekKey: {
                userId: session.uid,
                weekKey: weekInfo.key,
              },
            },
            select: {
              replacedTaskKey: true,
              newTaskKey: true,
            },
          })
        : Promise.resolve(null),
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

    let effectiveTasks = [...weeklyTasks];
    if (weekPreference) {
      const replacedIndex = effectiveTasks.findIndex(
        (task) => task.id === weekPreference.replacedTaskKey,
      );
      const replacementTask = getTaskById(weekPreference.newTaskKey);
      if (replacedIndex >= 0 && replacementTask) {
        effectiveTasks[replacedIndex] = replacementTask;
      }
    }

    const tasks = effectiveTasks.map((task) => {
      const submission = submissionMap.get(task.id);
      return {
        ...task,
        submissionStatus: submission?.status ?? null,
        adminComment: submission?.adminComment ?? null,
      };
    });

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
      tasks,
      stats: {
        approvedCount,
        pendingCount,
        ...walletInfo,
      },
      feed: feedSubmissions.map((item) => ({
        id: item.id,
        taskTitle: item.taskTitle,
        taskDescription: item.taskDescription,
        storyText: item.storyText || "",
        reward: item.reward,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        media: item.media.map((media) => ({ url: media.url, type: media.type })),
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
        rerollUsed: Boolean(weekPreference),
      },
    });
  } catch (error) {
    console.error("GET /api/good-deeds error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить страницу добрых дел" },
      { status: 500 },
    );
  }
}
