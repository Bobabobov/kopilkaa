// app/api/stories/[id]/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { sanitizeApplicationStoryHtml } from "@/lib/applications/sanitize";
import { getHeroBadgeForUser } from "@/lib/heroBadges";

export async function GET(
  request: Request,
  { params: { id } }: { params: { id: string } },
) {
  // Пытаемся декодировать URL на случай, если ID был закодирован
  let decodedId = id;
  try {
    decodedId = decodeURIComponent(id);
  } catch (error) {
    // Игнорируем ошибки декодирования
  }

  // Валидация ID (не модифицируем входные данные)
  // Разрешаем a-zA-Z0-9_- (на будущее/совместимость)
  if (!/^[a-zA-Z0-9_-]+$/.test(decodedId)) {
    return Response.json({ error: "Invalid ID format" }, { status: 400 });
  }
  const finalId = decodedId;

  const session = await getSession();

  const story = await prisma.application.findFirst({
    where: { id: finalId, status: "APPROVED" },
    select: {
      id: true,
      title: true,
      summary: true,
      story: true,
      createdAt: true,
      images: { orderBy: { sort: "asc" }, select: { url: true, sort: true } },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          avatarFrame: true,
          headerTheme: true,
          hideEmail: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (!story) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const heroBadge = story.user?.id
    ? await getHeroBadgeForUser(story.user.id)
    : null;

  // Проверяем, лайкнул ли текущий пользователь
  let userLiked = false;
  if (session?.uid) {
    const userLike = await prisma.storyLike.findFirst({
      where: {
        applicationId: finalId,
        userId: session.uid,
      },
    });
    userLiked = !!userLike;
  }

  return Response.json(
    {
      ...story,
      story: sanitizeApplicationStoryHtml(story.story || ""),
      user: story.user
        ? {
            ...(sanitizeEmailForViewer(
              story.user as any,
              session?.uid || "",
            ) as any),
            heroBadge,
          }
        : story.user,
      userLiked,
    },
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  );
}
