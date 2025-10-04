// app/api/profile/my-story-likes/route.ts
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session?.uid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Получаем лайки историй пользователя
    const likes = await prisma.storyLike.findMany({
      where: {
        application: {
          userId: session.uid,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            avatarFrame: true,
            hideEmail: true,
            lastSeen: true,
          },
        },
        application: {
          select: {
            id: true,
            title: true,
            summary: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ likes });
  } catch (error) {
    console.error("Error getting user story likes:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
