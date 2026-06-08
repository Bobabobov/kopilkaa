import { NextResponse } from "next/server";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { buildAdminBonusReport } from "@/lib/admin/bonusReport";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const report = await buildAdminBonusReport();
    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error("[API Error] GET /api/admin/bonuses/report", error);
    return NextResponse.json(
      { error: "Не удалось загрузить отчёт по бонусам" },
      { status: 500 },
    );
  }
}
