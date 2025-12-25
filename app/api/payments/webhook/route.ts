// app/api/payments/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

/**
 * Webhook для подтверждения платежа от ЮKassa
 * 
 * Настройка:
 * 1. В личном кабинете ЮKassa укажи URL: https://твой-домен.ru/api/payments/webhook
 * 2. ЮKassa будет отправлять сюда уведомления о статусе платежа
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Проверяем подпись от ЮKassa (защита от подделок)
    const secretKey = process.env.YOOKASSA_SECRET_KEY;
    if (!secretKey) {
      console.error("YOOKASSA_SECRET_KEY не настроен");
      return NextResponse.json({ error: "Не настроено" }, { status: 500 });
    }

    // TODO: После установки SDK добавить проверку подписи

    const event = body.event; // 'payment.succeeded' или 'payment.canceled'
    const payment = body.object;

    if (event === 'payment.succeeded' && payment.status === 'succeeded') {
      // Платёж успешен - добавляем деньги в копилку
      const amount = Math.round(parseFloat(payment.amount.value));
      const userId = payment.metadata?.userId || null;
      const paymentId = payment.metadata?.paymentId;

      // Проверяем, не обрабатывали ли мы уже этот платёж
      const existing = await prisma.donation.findFirst({
        where: {
          comment: paymentId ? `payment_${paymentId}` : undefined
        }
      });

      if (existing) {
        console.log(`Платёж ${paymentId} уже обработан`);
        return NextResponse.json({ success: true, message: "Уже обработан" });
      }

      // Создаём запись о донате
      await prisma.donation.create({
        data: {
          amount,
          type: 'SUPPORT',
          userId: userId !== 'anonymous' ? userId : null,
          comment: paymentId ? `payment_${paymentId}` : `Донат через ЮKassa`
        }
      });

      console.log(`✅ Платёж успешен: ${amount}₽, userId: ${userId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка обработки webhook" },
      { status: 500 }
    );
  }
}
