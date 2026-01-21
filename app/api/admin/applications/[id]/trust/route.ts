import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getAllowedAdminUser } from "@/lib/adminAccess";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const countTowardsTrust = Boolean(body?.countTowardsTrust);

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: { countTowardsTrust },
      select: { id: true, countTowardsTrust: true },
    });

    return NextResponse.json({ ok: true, countTowardsTrust: updated.countTowardsTrust });
  } catch (error) {
    console.error("Error updating countTowardsTrust:", error);
    return NextResponse.json({ error: "Не удалось обновить флаг доверия" }, { status: 500 });
  }
}
