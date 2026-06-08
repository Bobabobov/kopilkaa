import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import { USER_PUBLIC_BADGE_SELECT } from "@/lib/userPublicBadges";
import {
  createEmptyStoryReactionCounts,
  type StoryReactionType,
} from "@/lib/stories/reactions";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const publicStoryWhere: Prisma.ApplicationWhereInput = {
  OR: [
    { status: "APPROVED" },
    { status: "CONTEST", publishInStories: true },
  ],
};

const storySelect = {
  id: true,
  title: true,
  summary: true,
  amount: true,
  createdAt: true,
  images: {
    orderBy: { sort: "asc" as const },
    select: { url: true, sort: true },
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      avatarFrame: true,
      headerTheme: true,
      hideEmail: true,
      ...USER_PUBLIC_BADGE_SELECT,
    },
  },
  _count: { select: { likes: true } },
  status: true,
  publishInStories: true,
} satisfies Prisma.ApplicationSelect;

export async function GET() {
  try {
    const session = await getSession();
    const viewerId = session?.uid || null;

    const total = await prisma.application.count({ where: publicStoryWhere });
    if (total === 0) {
      return new Response(JSON.stringify({ item: null }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      });
    }

    const skip = Math.floor(Math.random() * total);
    const rows = await prisma.application.findMany({
      where: publicStoryWhere,
      orderBy: { id: "asc" },
      skip,
      take: 1,
      select: storySelect,
    });
    const raw = rows[0];
    if (!raw) {
      return new Response(JSON.stringify({ item: null }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      });
    }

    const reactionGroups = await prisma.storyLike
      .groupBy({
        by: ["applicationId", "type"],
        where: { applicationId: raw.id },
        _count: { _all: true },
      })
      .catch(() => []);

    const reactionCounts = createEmptyStoryReactionCounts();
    for (const group of reactionGroups) {
      reactionCounts[group.type as StoryReactionType] = group._count._all;
    }

    let userReaction: StoryReactionType | null = null;
    let userLiked = false;
    if (viewerId) {
      const reaction = await prisma.storyLike
        .findFirst({
          where: { userId: viewerId, applicationId: raw.id },
          select: { type: true },
        })
        .catch(() => null);
      if (reaction) {
        userReaction = reaction.type as StoryReactionType;
        userLiked = true;
      }
    }

    const item = {
      ...raw,
      user: raw.user
        ? sanitizeEmailForViewer(raw.user, viewerId || "")
        : raw.user,
      reactionCounts,
      userLiked,
      userReaction,
      isContestWinner: raw.status === "CONTEST" && raw.publishInStories,
    };

    return new Response(JSON.stringify({ item }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    logRouteCatchError("GET /api/stories/random:", error);
    return new Response(JSON.stringify({ item: null }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }
}
