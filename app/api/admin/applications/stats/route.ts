// app/api/admin/applications/stats/route.ts
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const [pending, approved, rejected, total, totalAmount] = await Promise.all([
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.application.count({ where: { status: "APPROVED" } }),
    prisma.application.count({ where: { status: "REJECTED" } }),
    prisma.application.count(),
    prisma.application
      .aggregate({
        _sum: { amount: true },
      })
      .then((result) => result._sum.amount || 0),
  ]);

  return Response.json({ pending, approved, rejected, total, totalAmount });
}
