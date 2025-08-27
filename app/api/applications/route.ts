// app/api/applications/route.ts
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  const session = getSession();
  if (!session) return Response.json({ error: "Требуется вход" }, { status: 401 });

  try {
    const { title, summary, story, payment, images } = await req.json() as {
      title: string; summary: string; story: string; payment: string; images: string[];
    };

    // Валидация длин
    if (!title || title.length > 40) return Response.json({ error: "Заголовок обязателен (≤ 40)" }, { status: 400 });
    if (!summary || summary.length > 140) return Response.json({ error: "Кратко обязательно (≤ 140)" }, { status: 400 });
    if (!story || story.length < 200 || story.length > 3000) return Response.json({ error: "История 200–3000 символов" }, { status: 400 });
    if (!payment || payment.length < 10 || payment.length > 200) return Response.json({ error: "Реквизиты 10–200 символов" }, { status: 400 });
    if (!Array.isArray(images) || images.length > 5) return Response.json({ error: "До 5 изображений" }, { status: 400 });

    // Лимит раз в 24 часа
    const last = await prisma.application.findFirst({
      where: { userId: session.uid },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });
    if (last) {
      const diff = Date.now() - last.createdAt.getTime();
      const left = DAY_MS - diff;
      if (left > 0) {
        return Response.json({ error: "Лимит: 1 заявка в 24 часа", leftMs: left }, { status: 429 });
      }
    }

    // Создаём заявку
    const app = await prisma.application.create({
      data: {
        userId: session.uid,
        title, summary, story, payment,
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

    return Response.json({ ok: true, id: app.id });
  } catch {
    return Response.json({ error: "Ошибка сохранения заявки" }, { status: 500 });
  }
}
