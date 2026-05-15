import { GoodDeedSubmissionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { USER_PUBLIC_BADGE_SELECT } from "@/lib/userPublicBadges";

/** Единый select для публичной ленты одобренных отчётов (главная + раздел «Добрые дела»). */
export const GOOD_DEED_PUBLIC_FEED_SELECT = {
  id: true,
  taskTitle: true,
  taskDescription: true,
  storyText: true,
  reward: true,
  createdAt: true,
  updatedAt: true,
  media: {
    orderBy: { sort: "asc" as const },
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
      ...USER_PUBLIC_BADGE_SELECT,
    },
  },
} as const;

export type GoodDeedPublicFeedRow = Awaited<
  ReturnType<typeof fetchApprovedGoodDeedFeedRows>
>[number];

export async function fetchApprovedGoodDeedFeedRows(take: number) {
  return prisma.goodDeedSubmission.findMany({
    where: {
      status: GoodDeedSubmissionStatus.APPROVED,
    },
    orderBy: { updatedAt: "desc" },
    take,
    select: GOOD_DEED_PUBLIC_FEED_SELECT,
  });
}

/** Полный объект `feed` для `GET /api/good-deeds` и типов страницы. */
export function mapFeedRowToGoodDeedsApiItem(row: GoodDeedPublicFeedRow) {
  return {
    id: row.id,
    taskTitle: row.taskTitle,
    taskDescription: row.taskDescription,
    storyText: row.storyText || "",
    reward: row.reward,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    media: row.media.map((m) => ({
      url: m.url,
      type: m.type,
    })),
    user: {
      id: row.user.id,
      name: row.user.name || row.user.username || "Пользователь",
      username: row.user.username,
      avatar: row.user.avatar,
      vkLink: row.user.vkLink,
      telegramLink: row.user.telegramLink,
      youtubeLink: row.user.youtubeLink,
      markedAsDeceiver: row.user.markedAsDeceiver,
    },
  };
}

/** Урезанный DTO только для главной: без соцсетей и лишних полей пользователя. */
export function mapFeedRowToHomePreviewItem(row: GoodDeedPublicFeedRow) {
  return {
    id: row.id,
    taskTitle: row.taskTitle,
    taskDescription: row.taskDescription,
    storyText: row.storyText || "",
    reward: row.reward,
    media: row.media.map((m) => ({
      url: m.url,
      type: m.type,
    })),
    user: {
      name: row.user.name || row.user.username || "Пользователь",
      markedAsDeceiver: row.user.markedAsDeceiver,
    },
  };
}
