// app/api/stories/[id]/likes/route.ts
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { publicStoryWhereById } from "@/lib/stories/publicStoryWhere";
import { logRouteCatchError } from "@/lib/api/parseApiError";

export const dynamic = "force-dynamic";

function isValidStoryId(id: string) {
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

const likeUserSelect = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  avatarFrame: true,
  hideEmail: true,
} as const;

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAuthUser(request);
  const { id } = await context.params;

  try {
    if (!isValidStoryId(id)) {
      return Response.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const story = await prisma.application.findFirst({
      where: publicStoryWhereById(id),
      select: { id: true },
    });

    if (!story) {
      return Response.json({ error: "Story not found" }, { status: 404 });
    }

    const likeCount = await prisma.storyLike.count({
      where: { applicationId: id },
    });

    let userLiked = false;
    if (session?.uid) {
      const userLike = await prisma.storyLike.findUnique({
        where: {
          userId_applicationId: {
            userId: session.uid,
            applicationId: id,
          },
        },
      });
      userLiked = Boolean(userLike);
    }

    const likes = session?.uid
      ? await prisma.storyLike.findMany({
          where: { applicationId: id },
          include: {
            user: {
              select: likeUserSelect,
            },
          },
          orderBy: { createdAt: "desc" },
        })
      : [];

    return Response.json({
      count: likeCount,
      userLiked,
      likes: likes.map((like) => ({
        id: like.id,
        user: like.user
          ? sanitizeEmailForViewer(like.user, session?.uid ?? "")
          : like.user,
        createdAt: like.createdAt,
      })),
    });
  } catch (error) {
    logRouteCatchError("GET /api/stories/[id]/likes:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
