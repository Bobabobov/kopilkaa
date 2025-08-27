// app/api/admin/applications/stats/route.ts
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const s = getSession();
  if (!s || s.role !== "ADMIN") return Response.json({ error: "Forbidden" }, { status: 403 });

  const [pending, approved, rejected, total] = await Promise.all([
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.application.count({ where: { status: "APPROVED" } }),
    prisma.application.count({ where: { status: "REJECTED" } }),
    prisma.application.count(),
  ]);

  return Response.json({ pending, approved, rejected, total });
}
