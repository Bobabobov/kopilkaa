// app/api/bug-reports/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET - получить список баг-репортов
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const category = searchParams.get("category") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (status !== "all") {
      where.status = status;
    }
    
    if (category !== "all") {
      where.category = category;
    }

    const reports = await prisma.bugReport.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        images: {
          orderBy: { sort: "asc" },
        },
        likes: {
          select: {
            userId: true,
            isLike: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.bugReport.count({ where });

    // Подсчитываем лайки и дизлайки
    const reportsWithStats = reports.map((report) => {
      const likes = report.likes.filter((l) => l.isLike).length;
      const dislikes = report.likes.filter((l) => !l.isLike).length;
      return {
        ...report,
        likesCount: likes,
        dislikesCount: dislikes,
        likes: undefined, // Убираем массив likes из ответа
      };
    });

    return NextResponse.json({
      reports: reportsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Get bug reports error:", error);
    return NextResponse.json(
      { 
        message: "Ошибка загрузки баг-репортов",
        error: error?.message || String(error)
      },
      { status: 500 }
    );
  }
}

// POST - создать новый баг-репорт
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, category, images } = body;

    const isAdmin = session.role === "ADMIN";

    // Ограничение: не больше 1 заявки в сутки на пользователя (для обычных пользователей)
    if (!isAdmin) {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentReport = await prisma.bugReport.findFirst({
        where: { userId: session.uid, createdAt: { gte: oneDayAgo } },
        orderBy: { createdAt: "desc" },
        select: { id: true, createdAt: true },
      });

      if (recentReport) {
        return NextResponse.json(
          { message: "Можно отправлять только 1 баг-репорт в сутки" },
          { status: 429 }
        );
      }
    }
    
    console.log("Received bug report data:", { 
      title: title?.substring(0, 20), 
      description: description?.substring(0, 20),
      category,
      imagesCount: images?.length || 0
    });

    if (!title || !description) {
      return NextResponse.json(
        { message: "Заголовок и описание обязательны" },
        { status: 400 }
      );
    }

    if (title.length > 40) {
      return NextResponse.json(
        { message: "Заголовок не должен превышать 40 символов" },
        { status: 400 }
      );
    }

    if (description.length > 700) {
      return NextResponse.json(
        { message: "Описание не должно превышать 700 символов" },
        { status: 400 }
      );
    }

    const report = await prisma.bugReport.create({
      data: {
        userId: session.uid,
        title: title.trim(),
        description: description.trim(),
        category: category || "MODERATOR",
        images: {
          create: (images || []).map((url: string, index: number) => ({
            url,
            sort: index,
          })),
        },
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

    return NextResponse.json({ report }, { status: 201 });
  } catch (error: any) {
    console.error("Create bug report error:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack
    });
    return NextResponse.json(
      { 
        message: "Ошибка создания баг-репорта",
        error: error?.message || String(error)
      },
      { status: 500 }
    );
  }
}

