// app/api/admin/reports/route.ts
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    return NextResponse.json({ message: "Доступ запрещён" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "pending";
    const showUnbanned = searchParams.get("showUnbanned") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};

    // Фильтр по статусу
    if (status !== "all") {
      where.status = status;
    }

    const [reports, total] = await Promise.all([
      prisma.userReport.findMany({
        where,
        include: {
          reporter: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          reported: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              isBanned: true,
              bannedUntil: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.userReport.count({ where }),
    ]);

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get reports error:", error);
    return NextResponse.json(
      { message: "Ошибка загрузки жалоб" },
      { status: 500 },
    );
  }
}
