// app/api/bug-reports/[id]/like/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { isLike } = await request.json();

    // Проверяем существование баг-репорта
    const bugReport = await prisma.bugReport.findUnique({
      where: { id },
    });

    if (!bugReport) {
      return NextResponse.json(
        { message: "Баг-репорт не найден" },
        { status: 404 }
      );
    }

    // Проверяем, есть ли уже лайк от этого пользователя
    const existingLike = await prisma.bugReportLike.findUnique({
      where: {
        userId_bugReportId: {
          userId: session.uid,
          bugReportId: id,
        },
      },
    });

    if (existingLike) {
      // Если лайк уже есть и тип совпадает - удаляем, иначе обновляем
      if (existingLike.isLike === isLike) {
        await prisma.bugReportLike.delete({
          where: {
            userId_bugReportId: {
              userId: session.uid,
              bugReportId: id,
            },
          },
        });
      } else {
        await prisma.bugReportLike.update({
          where: {
            userId_bugReportId: {
              userId: session.uid,
              bugReportId: id,
            },
          },
          data: { isLike },
        });
      }
    } else {
      // Создаем новый лайк
      await prisma.bugReportLike.create({
        data: {
          userId: session.uid,
          bugReportId: id,
          isLike: isLike === true,
        },
      });
    }

    // Получаем обновленную статистику
    const likes = await prisma.bugReportLike.count({
      where: { bugReportId: id, isLike: true },
    });
    const dislikes = await prisma.bugReportLike.count({
      where: { bugReportId: id, isLike: false },
    });

    return NextResponse.json({
      likes,
      dislikes,
    });
  } catch (error) {
    console.error("Like bug report error:", error);
    return NextResponse.json(
      { message: "Ошибка обработки лайка" },
      { status: 500 }
    );
  }
}

























