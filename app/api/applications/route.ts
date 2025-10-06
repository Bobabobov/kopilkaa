// app/api/applications/route.ts
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
// import { checkAndGrantAchievements } from "@/lib/achievements"; // Удалено - система достижений отключена

const DAY_MS = 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session)
    return Response.json({ error: "Требуется вход" }, { status: 401 });

  try {
    const { title, summary, story, amount, payment, images } =
      (await req.json()) as {
        title: string;
        summary: string;
        story: string;
        amount: string;
        payment: string;
        images: string[];
      };

    // Валидация длин (расширенные лимиты для администратора)
    const isAdmin = session.role === "ADMIN";
    const titleMax = isAdmin ? 100 : 40;
    const summaryMax = isAdmin ? 300 : 140;
    const storyMax = isAdmin ? 10000 : 3000;
    const paymentMax = isAdmin ? 500 : 200;

    if (!title || title.length > titleMax)
      return Response.json(
        { error: `Заголовок обязателен (≤ ${titleMax})` },
        { status: 400 },
      );
    if (!summary || summary.length > summaryMax)
      return Response.json(
        { error: `Кратко обязательно (≤ ${summaryMax})` },
        { status: 400 },
      );
    if (!story || story.length < 200 || story.length > storyMax)
      return Response.json(
        { error: `История 200–${storyMax} символов` },
        { status: 400 },
      );
    if (
      !amount ||
      isNaN(parseInt(amount)) ||
      parseInt(amount) < 1 ||
      parseInt(amount) > 1000000
    )
      return Response.json(
        { error: `Сумма должна быть от 1 до 1 000 000 рублей` },
        { status: 400 },
      );
    if (!payment || payment.length < 10 || payment.length > paymentMax)
      return Response.json(
        { error: `Реквизиты 10–${paymentMax} символов` },
        { status: 400 },
      );
    // Ограничение на количество изображений (администратор может загружать больше)
    const maxImages = session.role === "ADMIN" ? 20 : 5;
    if (!Array.isArray(images) || images.length > maxImages) {
      return Response.json(
        { error: `До ${maxImages} изображений` },
        { status: 400 },
      );
    }

    // Лимит раз в 24 часа (только для обычных пользователей)
    if (session.role !== "ADMIN") {
      const last = await prisma.application.findFirst({
        where: { userId: session.uid },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      });
      if (last) {
        const diff = Date.now() - last.createdAt.getTime();
        const left = DAY_MS - diff;
        if (left > 0) {
          return Response.json(
            { error: "Лимит: 1 заявка в 24 часа", leftMs: left },
            { status: 429 },
          );
        }
      }
    }

    // Создаём заявку
    const app = await prisma.application.create({
      data: {
        userId: session.uid,
        title,
        summary,
        story,
        amount: parseInt(amount),
        payment,
      },
      select: { id: true },
    });

    // Привязываем изображения по порядку
    if (images.length) {
      await prisma.applicationImage.createMany({
        data: images.map((url: string, i: number) => ({
          applicationId: app.id,
          url,
          sort: i,
        })),
      });
    }

    // Система достижений отключена

    return Response.json({ ok: true, id: app.id });
  } catch (error) {
    console.error("Error creating application:", error);
    return Response.json(
      { error: "Ошибка сохранения заявки" },
      { status: 500 },
    );
  }
}
