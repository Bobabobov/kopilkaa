import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// PUT - обновление статуса заявки (только для админов)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await Promise.resolve(params);
    const { status, adminComment } = await request.json();

    // Валидация статуса
    const validStatuses = ["new", "processing", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Некорректный статус" },
        { status: 400 }
      );
    }

    const adRequest = await prisma.adRequest.update({
      where: { id: resolvedParams.id },
      data: {
        status,
        adminComment: adminComment || null,
        processedBy: session.uid,
      },
    });

    return NextResponse.json({ adRequest });
  } catch (error) {
    console.error("Error updating ad request:", error);
    return NextResponse.json(
      { error: "Не удалось обновить заявку" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";

// DELETE - удаление заявки (только для админов)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await Promise.resolve(params);

    // Используем deleteMany, чтобы не падать, если запись уже была удалена
    await prisma.adRequest.deleteMany({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ message: "Заявка удалена" });
  } catch (error) {
    console.error("Error deleting ad request:", error);
    return NextResponse.json(
      { error: "Не удалось удалить заявку" },
      { status: 500 }
    );
  }
}

