import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// POST - создание новой заявки на рекламу (публичный)
export async function POST(request: NextRequest) {
  try {
    const { companyName, email, website, format, duration, bannerUrl, comment } = await request.json();

    // Валидация обязательных полей
    if (!companyName || !email || !format || !duration) {
      return NextResponse.json(
        { error: "Заполните все обязательные поля" },
        { status: 400 }
      );
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Некорректный email адрес" },
        { status: 400 }
      );
    }

    // Валидация срока
    if (duration < 1 || duration > 365) {
      return NextResponse.json(
        { error: "Срок должен быть от 1 до 365 дней" },
        { status: 400 }
      );
    }

    // Создание заявки
    const adRequest = await prisma.adRequest.create({
      data: {
        companyName,
        email,
        website: website || null,
        format,
        duration,
        bannerUrl: bannerUrl || null,
        comment: comment || null,
        status: "new",
      },
    });

    return NextResponse.json({ 
      success: true,
      message: "Спасибо! Мы свяжемся с вами в ближайшее время.",
      adRequest 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating ad request:", error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку" },
      { status: 500 }
    );
  }
}

// GET - получение всех заявок (только для админов)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where = status && status !== "all" ? { status } : {};

    const adRequests = await prisma.adRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Подсчет по статусам
    const stats = {
      total: await prisma.adRequest.count(),
      new: await prisma.adRequest.count({ where: { status: "new" } }),
      processing: await prisma.adRequest.count({ where: { status: "processing" } }),
      approved: await prisma.adRequest.count({ where: { status: "approved" } }),
      rejected: await prisma.adRequest.count({ where: { status: "rejected" } }),
    };

    return NextResponse.json({ adRequests, stats });
  } catch (error) {
    console.error("Error fetching ad requests:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить заявки" },
      { status: 500 }
    );
  }
}

