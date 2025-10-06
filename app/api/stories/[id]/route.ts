// app/api/stories/[id]/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

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

  // Валидация ID - не должен содержать недопустимые символы
  const hasInvalidChars = /[^a-zA-Z0-9]/.test(decodedId);

  if (hasInvalidChars) {
    return Response.json({ error: "Invalid ID format" }, { status: 400 });
  }

  // Очищаем ID от любых недопустимых символов
  const cleanId = decodedId.replace(/[^a-zA-Z0-9]/g, "");

  // Используем очищенный ID для поиска
  const finalId = cleanId;

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

  // Проверяем, лайкнул ли текущий пользователь
  let userLiked = false;
  if (session) {
    const userLike = await prisma.storyLike.findFirst({
      where: {
        applicationId: finalId,
        userId: session.uid,
      },
    });
    userLiked = !!userLike;
  }

  return Response.json({
    ...story,
    userLiked,
  });
}
