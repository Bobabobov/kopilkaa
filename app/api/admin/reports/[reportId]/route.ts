// app/api/admin/reports/[reportId]/route.ts
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    return NextResponse.json({ message: "Доступ запрещён" }, { status: 403 });
  }

  try {
    const { reportId } = await params;
    const { status, adminComment } = await request.json();

    const report = await prisma.userReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json(
        { message: "Жалоба не найдена" },
        { status: 404 },
      );
    }

    const updated = await prisma.userReport.update({
      where: { id: reportId },
      data: {
        status: status || report.status,
        adminComment: adminComment || report.adminComment,
        processedBy: admin.id,
      },
    });

    return NextResponse.json({ report: updated });
  } catch (error) {
    console.error("Update report error:", error);
    return NextResponse.json(
      { message: "Ошибка обновления жалобы" },
      { status: 500 },
    );
  }
}
