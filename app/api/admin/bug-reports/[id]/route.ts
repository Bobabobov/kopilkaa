// app/api/admin/bug-reports/[id]/route.ts
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    return NextResponse.json({ message: "Доступ запрещён" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { status, adminComment } = await request.json();

    const bugReport = await prisma.bugReport.findUnique({
      where: { id },
    });

    if (!bugReport) {
      return NextResponse.json(
        { message: "Баг-репорт не найден" },
        { status: 404 }
      );
    }

    const updated = await prisma.bugReport.update({
      where: { id },
      data: {
        status: status || bugReport.status,
        adminComment: adminComment || bugReport.adminComment,
        processedBy: admin.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        images: true,
      },
    });

    return NextResponse.json({ report: updated });
  } catch (error) {
    console.error("Update bug report error:", error);
    return NextResponse.json(
      { message: "Ошибка обновления баг-репорта" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    return NextResponse.json({ message: "Доступ запрещён" }, { status: 403 });
  }

  try {
    const { id } = await params;

    const existing = await prisma.bugReport.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ message: "Баг-репорт не найден" }, { status: 404 });
    }

    await prisma.bugReport.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete bug report error:", error);
    return NextResponse.json(
      { message: "Ошибка удаления баг-репорта" },
      { status: 500 }
    );
  }
}


