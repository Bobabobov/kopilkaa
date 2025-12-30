// app/api/donations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { AchievementService } from "@/lib/achievements/service";

// Создать запись оплаты (цифровая услуга / тестовый режим)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json().catch(() => ({}));

    const amount = Number(body.amount);
    const type = body.type === "PAYOUT" || body.type === "ADJUST" ? body.type : "SUPPORT";
    const comment = typeof body.comment === "string" ? body.comment.slice(0, 500) : null;

    if (!amount || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Некорректная сумма" },
        { status: 400 },
      );
    }

    const donation = await prisma.donation.create({
      data: {
        amount: Math.round(amount),
        type,
        comment: comment || undefined,
        userId: session?.uid ?? null,
      },
    });

    // Автоматически проверяем/выдаём достижения после оплаты (важно для /heroes статусов)
    if (session?.uid && type === "SUPPORT") {
      try {
        await AchievementService.checkAndGrantAutomaticAchievements(session.uid);
      } catch {
        // не блокируем ответ по оплате из‑за достижений
      }
    }

    return NextResponse.json({ success: true, donation });
  } catch (error) {
    console.error("Error creating donation:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка создания платежа" },
      { status: 500 },
    );
  }
}


