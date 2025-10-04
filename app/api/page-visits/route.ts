// app/api/page-visits/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Требуется авторизация" }, { status: 401 });
    }

    const { page, timeSpent } = await req.json();

    if (!page || typeof timeSpent !== 'number' || timeSpent < 0) {
      return Response.json({ error: "Некорректные данные" }, { status: 400 });
    }

    // Записываем время посещения страницы
    const visit = await prisma.pageVisit.create({
      data: {
        userId: session.uid,
        page,
        timeSpent,
      },
    });

    return Response.json({ success: true, visit });
  } catch (error) {
    console.error("Ошибка записи времени посещения:", error);
    return Response.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
