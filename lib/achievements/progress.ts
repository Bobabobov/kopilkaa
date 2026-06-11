import { GoodDeedSubmissionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  ACHIEVEMENT_SLUGS,
  type AchievementSlug,
} from "@/lib/achievements/definitions";
import { DAILY_BONUS_RISK_WIN_AMOUNT } from "@/lib/dailyBonus/constants";

/** Текущий прогресс пользователя по ачивке (для отображения и проверки). */
export async function getAchievementProgress(
  userId: string,
  slug: AchievementSlug,
): Promise<number> {
  switch (slug) {
    case ACHIEVEMENT_SLUGS.WELCOME: {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
      });
      return user ? 1 : 0;
    }

    case ACHIEVEMENT_SLUGS.LOGIN_STREAK_7: {
      const state = await prisma.loginStreakState.findUnique({
        where: { userId },
        select: { currentStreak: true },
      });
      return state?.currentStreak ?? 0;
    }

    case ACHIEVEMENT_SLUGS.FIRST_APPLICATION: {
      const count = await prisma.application.count({ where: { userId } });
      return count;
    }

    case ACHIEVEMENT_SLUGS.COMMENTS_10: {
      const count = await prisma.storyComment.count({ where: { userId } });
      return count;
    }

    case ACHIEVEMENT_SLUGS.REACTIONS_10_STORIES: {
      const groups = await prisma.storyLike.groupBy({
        by: ["applicationId"],
        where: { userId },
      });
      return groups.length;
    }

    case ACHIEVEMENT_SLUGS.FIRST_FRIEND: {
      const count = await prisma.friendship.count({
        where: {
          status: "ACCEPTED",
          OR: [{ requesterId: userId }, { receiverId: userId }],
        },
      });
      return count;
    }

    case ACHIEVEMENT_SLUGS.REFERRAL_5: {
      const count = await prisma.referralRegistration.count({
        where: { referrerUserId: userId },
      });
      return count;
    }

    case ACHIEVEMENT_SLUGS.LEFT_REVIEW: {
      const count = await prisma.review.count({ where: { userId } });
      return count;
    }

    case ACHIEVEMENT_SLUGS.GOOD_DEED: {
      const count = await prisma.goodDeedSubmission.count({
        where: {
          userId,
          status: GoodDeedSubmissionStatus.APPROVED,
        },
      });
      return count;
    }

    case ACHIEVEMENT_SLUGS.PROFILE_STYLE: {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatarUpdatedAt: true, headerCover: true },
      });
      if (!user) return 0;
      return user.avatarUpdatedAt || user.headerCover ? 1 : 0;
    }

    case ACHIEVEMENT_SLUGS.DAILY_BONUS_CLAIMED: {
      const count = await prisma.dailyBonusClaim.count({ where: { userId } });
      return count;
    }

    case ACHIEVEMENT_SLUGS.DAILY_BONUS_RISK: {
      const count = await prisma.dailyBonusClaim.count({
        where: {
          userId,
          OR: [
            { dailyBonus: DAILY_BONUS_RISK_WIN_AMOUNT },
            { dailyBonus: { lt: 0 } },
            { dailyBonus: 0, milestoneBonus: 0 },
          ],
        },
      });
      return count > 0 ? 1 : 0;
    }

    default:
      return 0;
  }
}
