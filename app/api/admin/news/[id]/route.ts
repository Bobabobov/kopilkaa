// app/api/admin/news/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAllowedAdminUser } from "@/lib/adminAccess";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    await prisma.projectNewsPost.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/news/[id] error:", error);
    return NextResponse.json({ error: "Ошибка удаления новости" }, { status: 500 });
  }
}



