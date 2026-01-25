// app/api/stories/[id]/likes/route.ts
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sanitizeEmailForViewer } from "@/lib/privacy";

function isValidStoryId(id: string) {
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

export async function GET(
  _: Request,
  { params: { id } }: { params: { id: string } },
) {
  const session = await getSession();

  try {
    if (!isValidStoryId(id)) {
      return Response.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Проверяем, существует ли история
    const story = await prisma.application.findFirst({
      where: { id, status: "APPROVED" },
    });

    if (!story) {
      return Response.json({ error: "Story not found" }, { status: 404 });
    }

    // Получаем количество лайков
    const likeCount = await prisma.storyLike.count({
      where: { applicationId: id },
    });

    // Проверяем, лайкнул ли текущий пользователь (только если авторизован)
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
      userLiked = !!userLike;
    }

    // Получаем список пользователей, которые лайкнули (только если авторизован)
    let likes: any[] = [];
    if (session?.uid) {
      likes = await prisma.storyLike.findMany({
        where: { applicationId: id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              avatarFrame: true,
              hideEmail: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return Response.json({
      count: likeCount,
      userLiked,
      likes: likes.map((like) => ({
        id: like.id,
        user: like.user
          ? sanitizeEmailForViewer(like.user, session?.uid || "")
          : like.user,
        createdAt: like.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error getting likes:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
