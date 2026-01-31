// app/api/admin/balance/route.ts
import { NextResponse } from "next/server";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function computeBalance() {
  const donationSums = await prisma.donation
    .groupBy({
      by: ["type"],
      _sum: { amount: true },
    })
    .catch(() => []);

  const sumByType = new Map<string, number>();
  donationSums.forEach((row: any) => {
    const t = String(row?.type ?? "");
    const v = Number(row?._sum?.amount ?? 0);
    if (!t) return;
    sumByType.set(t, v);
  });

  const totalSupport = sumByType.get("SUPPORT") ?? 0;
  const totalPayout = sumByType.get("PAYOUT") ?? 0;
  const totalAdjust = sumByType.get("ADJUST") ?? 0;

  const balance = totalSupport - totalPayout + totalAdjust;

  return { totalSupport, totalPayout, totalAdjust, balance };
}

export async function GET() {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  const data = await computeBalance();
  return NextResponse.json(
    { success: true, data },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
  }

  let body: any = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const desiredBalanceRaw = body?.desiredBalance;
  const desiredBalance = Number(desiredBalanceRaw);
  if (!Number.isFinite(desiredBalance)) {
    return NextResponse.json(
      { error: "Некорректное значение desiredBalance" },
      { status: 400 },
    );
  }

  const current = await computeBalance();
  const delta = Math.trunc(desiredBalance) - Math.trunc(current.balance);

  if (delta === 0) {
    return NextResponse.json({
      success: true,
      data: {
        ...current,
        desiredBalance: Math.trunc(desiredBalance),
        delta: 0,
      },
      message: "Баланс уже соответствует заданному значению",
    });
  }

  // Создаём корректировку баланса через Donation(type=ADJUST).
  // Это не меняет логику платформы: главная статистика уже учитывает ADJUST.
  await prisma.donation.create({
    data: {
      userId: admin.id,
      type: "ADJUST",
      amount: delta,
      comment: `admin_set_balance:${Math.trunc(desiredBalance)}`,
    },
  });

  const updated = await computeBalance();
  return NextResponse.json({
    success: true,
    data: { ...updated, desiredBalance: Math.trunc(desiredBalance), delta },
  });
}
