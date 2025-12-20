import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// POST - создание новой заявки на рекламу (публичный)
export async function POST(request: NextRequest) {
  try {
    const { companyName, email, telegram, website, format, duration, bannerUrl, imageUrls, mobileBannerUrls, comment } = await request.json();

    // Валидация обязательных полей
    if (!companyName || !email || !format || !duration || !comment) {
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

    // Валидация количества изображений
    if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 5) {
      return NextResponse.json(
        { error: "Можно загрузить до 5 изображений" },
        { status: 400 }
      );
    }

    if (mobileBannerUrls && Array.isArray(mobileBannerUrls) && mobileBannerUrls.length > 5) {
      return NextResponse.json(
        { error: "Можно загрузить до 5 мобильных баннеров" },
        { status: 400 }
      );
    }

    // Валидация комментария (обязательное поле, максимум 400 символов)
    const commentTrimmed = comment?.trim() || "";
    if (!commentTrimmed) {
      return NextResponse.json(
        { error: "Поле 'Что-то ещё?' обязательно для заполнения" },
        { status: 400 }
      );
    }
    if (commentTrimmed.length > 400) {
      return NextResponse.json(
        { error: "Комментарий не должен превышать 400 символов" },
        { status: 400 }
      );
    }

    // Создание заявки
    const adRequest = await prisma.adRequest.create({
      data: {
        companyName,
        email,
        telegram: telegram || null,
        website: website || null,
        format,
        duration,
        bannerUrl: bannerUrl || null, // Для обратной совместимости
        imageUrls: imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls : null,
        mobileBannerUrls: mobileBannerUrls && Array.isArray(mobileBannerUrls) && mobileBannerUrls.length > 0 ? mobileBannerUrls : null,
        comment: commentTrimmed,
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

