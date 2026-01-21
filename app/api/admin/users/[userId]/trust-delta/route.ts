import { NextResponse } from "next/server";

import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const trustDeltaRaw = Number(body?.trustDelta ?? 0);
    const trustDelta = Number.isFinite(trustDeltaRaw) ? Math.trunc(trustDeltaRaw) : 0;

    const updated = await prisma.user.update({
      where: { id: params.userId },
      data: { trustDelta },
      select: { trustDelta: true },
    });

    return NextResponse.json({ ok: true, trustDelta: updated.trustDelta });
  } catch (error) {
    console.error("Error updating trustDelta:", error);
    return NextResponse.json(
      { error: "Не удалось обновить trustDelta" },
      { status: 500 },
    );
  }
}
