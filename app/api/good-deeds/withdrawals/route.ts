import { NextRequest, NextResponse } from "next/server";
import { GoodDeedWithdrawalStatus } from "@prisma/client";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeGoodDeedBonusWallet } from "@/lib/goodDeedBonusWallet";
import {
  MAX_WITHDRAWAL_BANK_LEN,
  MAX_WITHDRAWAL_DETAILS_LEN,
  MIN_WITHDRAWAL_BONUSES,
} from "@/lib/goodDeeds";
import { digitsFingerprint } from "@/lib/admin/requisitesFingerprint";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getAuthUser(req);
  if (!session?.uid) {
    return NextResponse.json(
      { error: "Требуется авторизация" },
      { status: 401 },
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const rawAmount = body?.amountBonuses ?? body?.amount;
    const amountBonuses =
      typeof rawAmount === "number"
        ? Math.floor(rawAmount)
        : parseInt(String(rawAmount ?? ""), 10);

    const bankName = String(body?.bankName ?? "").trim();
    const details = String(body?.details ?? "").trim();

    if (
      !Number.isFinite(amountBonuses) ||
      amountBonuses < MIN_WITHDRAWAL_BONUSES
    ) {
      return NextResponse.json(
        {
          error: `Минимальная сумма вывода — ${MIN_WITHDRAWAL_BONUSES} бонусов`,
        },
        { status: 400 },
      );
    }

    if (!bankName.length || bankName.length > MAX_WITHDRAWAL_BANK_LEN) {
      return NextResponse.json(
        { error: "Укажите название банка" },
        { status: 400 },
      );
    }

    if (!details.length || details.length > MAX_WITHDRAWAL_DETAILS_LEN) {
      return NextResponse.json(
        { error: "Укажите реквизиты для перевода (карта, счёт, телефон)" },
        { status: 400 },
      );
    }

    const wallet = await computeGoodDeedBonusWallet(session.uid);

    if (wallet.hasPendingWithdrawal) {
      return NextResponse.json(
        {
          error:
            "У вас уже есть заявка на вывод на проверке. Дождитесь решения.",
        },
        { status: 409 },
      );
    }

    if (amountBonuses > wallet.availableBonuses) {
      return NextResponse.json(
        {
          error: "Недостаточно доступных бонусов для этой суммы",
          availableBonuses: wallet.availableBonuses,
        },
        { status: 400 },
      );
    }

    await prisma.goodDeedWithdrawalRequest.create({
      data: {
        userId: session.uid,
        amountBonuses,
        bankName,
        details,
        detailsFingerprint: digitsFingerprint(details),
        status: GoodDeedWithdrawalStatus.PENDING,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/good-deeds/withdrawals error:", error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку" },
      { status: 500 },
    );
  }
}
