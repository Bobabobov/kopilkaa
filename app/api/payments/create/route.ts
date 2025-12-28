// app/api/payments/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

/**
 * Создаёт платёж через ЮKassa
 * 
 * Что нужно сделать:
 * 1. Зарегистрироваться в https://yookassa.ru/
 * 2. Получить shopId и secretKey в личном кабинете
 * 3. Добавить в .env.local:
 *    YOOKASSA_SHOP_ID=твой_shop_id
 *    YOOKASSA_SECRET_KEY=твой_secret_key
 * 4. Установить пакет: npm install @yookassa/sdk
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, comment } = body;

    // Проверяем сумму
    const amountNum = Number(amount);
    if (!amountNum || amountNum < 10 || amountNum > 100000) {
      return NextResponse.json(
        { success: false, error: "Сумма должна быть от 10 до 100 000 рублей" },
        { status: 400 }
      );
    }

    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;

    // Получаем информацию о пользователе (если авторизован)
    const session = await getSession();
    const userId = session?.uid || null;

    if (!shopId || !secretKey) {
      console.error("YOOKASSA_SHOP_ID или YOOKASSA_SECRET_KEY не настроены в .env.local");
      return NextResponse.json({
        success: false,
        error: "Платёжная система не настроена",
      }, { status: 500 });
    }

    // Создаём уникальный ID для платежа
    const paymentId = `kopilka_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Формируем данные для ЮKassa
    // ВАЖНО: Нужно установить @yookassa/sdk для работы
    // npm install @yookassa/sdk
    
    // Пока возвращаем заглушку - после установки SDK раскомментируй код ниже
    // TODO: Раскомментировать после установки SDK
    return NextResponse.json({
      success: false,
      error: "SDK не установлен. Выполни: npm install @yookassa/sdk",
    });

  } catch (error: any) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Ошибка создания платежа" },
      { status: 500 }
    );
  }
}



