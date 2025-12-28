// app/api/admin/users/[userId]/delete/route.ts
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    return NextResponse.json({ message: "Доступ запрещён" }, { status: 403 });
  }

  try {
    const { userId } = await params;
    console.log("=== DELETE /api/admin/users/[userId]/delete ===", { userId });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 },
      );
    }

    if (user.role === "ADMIN") {
      return NextResponse.json(
        { message: "Нельзя удалить администратора" },
        { status: 400 },
      );
    }

    // Удаляем пользователя (каскадное удаление через Prisma)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: "Пользователь удалён",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { message: "Ошибка удаления пользователя" },
      { status: 500 },
    );
  }
}

