// app/api/admin/applications/[id]/route.ts
export const runtime = "nodejs"; // чтобы работало с nodemailer на Node

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { publish } from "@/lib/sse";
import { sendStatusEmail } from "@/lib/email";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const s = getSession();
  if (!s || s.role !== "ADMIN") return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const status = body?.status as "PENDING" | "APPROVED" | "REJECTED" | undefined;
  const adminComment = typeof body?.adminComment === "string" ? body.adminComment : undefined;
  if (!status || !["PENDING", "APPROVED", "REJECTED"].includes(status))
    return Response.json({ error: "Invalid status" }, { status: 400 });

  try {
    const item = await prisma.application.update({
      where: { id: params.id },
      data: { status, adminComment: adminComment ?? null },
      include: {
        user:   { select: { email: true, id: true } },
        images: { orderBy: { sort: "asc" }, select: { url: true, sort: true } },
      },
    });

    // 🔔 НЕ ждём SMTP — отправляем "в фоне" и логируем ошибки
    if (item.user?.email) {
      sendStatusEmail(item.user.email, {
        title: item.title,
        status: item.status,
        comment: item.adminComment ?? "",
      }).catch((e) => console.error("mail error:", e));
    }

    // 🛰️ SSE для админки
    publish("application:update", {
      id: item.id,
      status: item.status,
      adminComment: item.adminComment ?? "",
    });
    publish("stats:dirty", {});

    return Response.json({ ok: true, item });
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}
