import { NextResponse } from "next/server";

import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  try {
    const { userId } = params;
    if (!userId) {
      return NextResponse.json(
        { error: "Некорректный ID пользователя" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const marked =
      body?.marked === true ||
      body?.markedAsDeceiver === true ||
      body?.marked === "true";

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    if (user.role === "ADMIN") {
      return NextResponse.json(
        { error: "Нельзя пометить администратора" },
        { status: 400 },
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { markedAsDeceiver: marked },
      select: { id: true, markedAsDeceiver: true },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: marked
        ? "Метка «Обманывал» установлена"
        : "Метка «Обманывал» снята",
    });
  } catch (error) {
    console.error("[API Error] PATCH deceiver-mark:", error);
    return NextResponse.json(
      { error: "Не удалось обновить метку пользователя" },
      { status: 500 },
    );
  }
}
