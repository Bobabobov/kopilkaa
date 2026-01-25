// app/api/payments/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

    // ВАЖНО: webhook нельзя "доверять" на слово. Любой может отправить POST на этот URL.
    // Поэтому мы подтверждаем платёж отдельным серверным запросом в YooKassa API.
    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;
    if (!shopId || !secretKey) {
      console.error("YOOKASSA_SHOP_ID / YOOKASSA_SECRET_KEY не настроены");
      return NextResponse.json({ error: "Не настроено" }, { status: 500 });
    }

    const event = body?.event; // 'payment.succeeded' или 'payment.canceled'
    const payment = body?.object;
    const ykPaymentId = payment?.id;

    if (!ykPaymentId || typeof ykPaymentId !== "string") {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 },
      );
    }

    if (event === "payment.succeeded" && payment.status === "succeeded") {
      const verifyRes = await fetch(
        `https://api.yookassa.ru/v3/payments/${encodeURIComponent(ykPaymentId)}`,
        {
          method: "GET",
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(`${shopId}:${secretKey}`).toString("base64"),
          },
          cache: "no-store",
        },
      );

      if (!verifyRes.ok) {
        const text = await verifyRes.text().catch(() => "");
        console.error(
          "YooKassa verify failed:",
          verifyRes.status,
          text.slice(0, 500),
        );
        return NextResponse.json(
          { error: "Payment verification failed" },
          { status: 400 },
        );
      }

      const verified = await verifyRes.json().catch(() => null);
      if (!verified || verified.id !== ykPaymentId) {
        return NextResponse.json(
          { error: "Payment verification failed" },
          { status: 400 },
        );
      }
      if (verified.status !== "succeeded") {
        // webhook пришёл, но по факту платёж не succeeded — не создаём донат
        return NextResponse.json({ success: true, ignored: true });
      }

      // Платёж успешен - добавляем деньги в копилку
      const amount = Math.round(
        parseFloat(
          String(verified.amount?.value ?? payment?.amount?.value ?? "0"),
        ),
      );
      const userIdRaw = (verified.metadata?.userId ??
        payment?.metadata?.userId ??
        null) as unknown;
      const safeUserId =
        typeof userIdRaw === "string" && /^[a-zA-Z0-9_-]+$/.test(userIdRaw)
          ? userIdRaw
          : null;

      // Проверяем, не обрабатывали ли мы уже этот платёж
      const existing = await prisma.donation.findFirst({
        where: {
          comment: `yookassa_${ykPaymentId}`,
        },
      });

      if (existing) {
        return NextResponse.json({ success: true, message: "Уже обработан" });
      }

      // Создаём запись о донате
      await prisma.donation.create({
        data: {
          amount,
          type: "SUPPORT",
          userId: safeUserId && safeUserId !== "anonymous" ? safeUserId : null,
          comment: `yookassa_${ykPaymentId}`,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка обработки webhook" },
      { status: 500 },
    );
  }
}
