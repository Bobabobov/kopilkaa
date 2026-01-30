// app/api/admin/applications/[id]/route.ts
export const runtime = "nodejs"; // чтобы работало с nodemailer на Node

import { prisma } from "@/lib/db";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { publish } from "@/lib/sse";
import { sendStatusEmail } from "@/lib/email";
import { sanitizeApplicationStoryHtml } from "@/lib/applications/sanitize";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  try {
    const item = await prisma.application.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        userId: true,
        title: true,
        summary: true,
        story: true,
        amount: true,
        payment: true,
        status: true,
        adminComment: true,
        filledMs: true,
        createdAt: true,
        updatedAt: true,
        countTowardsTrust: true,
        user: { select: { email: true, id: true, trustDelta: true } },
        images: { orderBy: { sort: "asc" }, select: { url: true, sort: true } },
      },
    });

    if (!item) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({
      item: {
        ...item,
        story: sanitizeApplicationStoryHtml(item.story),
      },
    });
  } catch (error) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const status = body?.status as
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "CONTEST"
    | undefined;
  const decreaseTrustOnDecision = Boolean(body?.decreaseTrustOnDecision);
  const adminComment =
    typeof body?.adminComment === "string" ? body.adminComment : undefined;
  if (
    !status ||
    !["PENDING", "APPROVED", "REJECTED", "CONTEST"].includes(status)
  )
    return Response.json({ error: "Invalid status" }, { status: 400 });

  try {
    const item = await prisma.$transaction(async (tx) => {
      const updated = await tx.application.update({
        where: { id: params.id },
        data: { status, adminComment: adminComment ?? null },
        include: {
          user: { select: { email: true, id: true } },
          images: {
            orderBy: { sort: "asc" },
            select: { url: true, sort: true },
          },
        },
      });

      if (
        decreaseTrustOnDecision &&
        (status === "APPROVED" || status === "REJECTED") &&
        updated.user?.id
      ) {
        await tx.user.update({
          where: { id: updated.user.id },
          data: { trustDelta: { decrement: 3 } },
        });
      }

      return updated;
    });

    // 🔔 Письмо только при одобрении/отклонении. «Конкурс» — только пометка для админа.
    if (
      item.user?.email &&
      (status === "APPROVED" || status === "REJECTED" || status === "PENDING")
    ) {
      sendStatusEmail(item.user.email, {
        title: item.title,
        status, // здесь status уже PENDING | APPROVED | REJECTED
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  try {
    // Удаляем заявку (изображения удалятся автоматически из-за onDelete: Cascade)
    await prisma.application.delete({
      where: { id: params.id },
    });

    // 🛰️ SSE для админки
    publish("application:delete", { id: params.id });
    publish("stats:dirty", {});

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}
