import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// PUT - обновление статуса заявки (только для админов)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      where: { id: params.id },
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

// DELETE - удаление заявки (только для админов)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.adRequest.delete({
      where: { id: params.id },
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

