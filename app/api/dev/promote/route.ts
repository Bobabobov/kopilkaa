// app/api/dev/promote/route.ts
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // Защита: обязательный секрет в заголовке
    const secret = req.headers.get("x-promote-secret") || "";
    if (secret !== (process.env.PROMOTE_SECRET || "")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, role } = await req.json();
    if (!email) return Response.json({ error: "email required" }, { status: 400 });

    const targetRole = role === "USER" ? "USER" : "ADMIN"; // по умолчанию ADMIN
    const user = await prisma.user.update({
      where: { email },
      data: { role: targetRole as any },
      select: { id: true, email: true, role: true },
    });

    return Response.json({ ok: true, user });
  } catch (e: any) {
    // Если пользователя с email нет — отдадим 404
    if (e?.code === "P2025") {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
