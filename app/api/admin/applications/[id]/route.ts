// app/api/admin/applications/[id]/route.ts
export const runtime = "nodejs"; // чтобы работало с nodemailer на Node

import { prisma } from "@/lib/db";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { publish } from "@/lib/sse";
import { sendStatusEmail } from "@/lib/email";
import { sanitizeApplicationStoryHtml } from "@/lib/applications/sanitize";

type SameRef = {
  id: string;
  createdAt: Date;
  user: { id: string; email: string | null; name: string | null };
};

function resolveId(params: { id: string } | Promise<{ id: string }>): Promise<string> {
  return Promise.resolve(params).then((p) => p.id);
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const id = await resolveId(params);
  if (!id) return Response.json({ error: "Bad request" }, { status: 400 });

  try {
    const item = await prisma.application.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        title: true,
        summary: true,
        story: true,
        amount: true,
        payment: true,
        status: true,
        publishInStories: true,
        adminComment: true,
        filledMs: true,
        storyEditMs: true,
        submitterIp: true,
        createdAt: true,
        updatedAt: true,
        countTowardsTrust: true,
        user: { select: { email: true, id: true, trustDelta: true } },
        images: { orderBy: { sort: "asc" }, select: { url: true, sort: true } },
      },
    });

    if (!item) return Response.json({ error: "Not found" }, { status: 404 });

    // Нормализация реквизитов: пробелы/переносы → один пробел, trim
    const normalizePayment = (s: string) =>
      (s ?? "").replace(/\s+/g, " ").trim();
    // Только цифры из реквизитов (для сопоставления, когда в одной заявке "Банк: ...", в другой только номер)
    const paymentDigits = (s: string) => (s ?? "").replace(/\D/g, "");
    const paymentNorm = normalizePayment(item.payment);
    const currentDigits = paymentDigits(item.payment);
    let samePaymentApplications: SameRef[] = [];

    if (paymentNorm || currentDigits.length >= 10) {
      const all = await prisma.application.findMany({
        where: { id: { not: id } },
        orderBy: { createdAt: "desc" },
        take: 500,
        select: {
          id: true,
          createdAt: true,
          userId: true,
          payment: true,
        },
      });
      const matching = all.filter((a) => {
        const norm = normalizePayment(a.payment);
        const digits = paymentDigits(a.payment);
        if (paymentNorm && norm === paymentNorm) return true;
        if (currentDigits.length >= 10 && digits === currentDigits) return true;
        return false;
      });
      if (matching.length) {
        const userIds = [...new Set(matching.map((m) => m.userId))];
        const users = await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, email: true, name: true },
        });
        const userMap = new Map(users.map((u) => [u.id, u]));
        samePaymentApplications = matching.slice(0, 30).map((m) => ({
          id: m.id,
          createdAt: m.createdAt,
          user: userMap.get(m.userId) ?? {
            id: m.userId,
            email: null,
            name: null,
          },
        }));
      }
    }

    let sameIpApplications: SameRef[] = [];
    if (item.submitterIp) {
      const others = await prisma.application.findMany({
        where: {
          id: { not: id },
          submitterIp: item.submitterIp,
        },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true,
          createdAt: true,
          user: { select: { id: true, email: true, name: true } },
        },
      });
      sameIpApplications = others.map((a) => ({
        id: a.id,
        createdAt: a.createdAt,
        user: a.user,
      }));
    }

    const toIso = (d: Date) => (d instanceof Date ? d.toISOString() : d);

    const payload = {
      item: {
        ...item,
        createdAt: toIso(item.createdAt),
        updatedAt: item.updatedAt ? toIso(item.updatedAt) : null,
        story: sanitizeApplicationStoryHtml(item.story ?? ""),
        samePaymentApplications: samePaymentApplications.map((s) => ({
          ...s,
          createdAt: toIso(s.createdAt),
        })),
        sameIpApplications: sameIpApplications.map((s) => ({
          ...s,
          createdAt: toIso(s.createdAt),
        })),
      },
    };

    return Response.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    console.error("[admin applications GET]", message, stack ?? "");
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const id = await resolveId(params);
  if (!id) return Response.json({ error: "Bad request" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const status = body?.status as
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "CONTEST"
    | undefined;
  const publishInStories =
    typeof body?.publishInStories === "boolean"
      ? body.publishInStories
      : undefined;
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
        where: { id },
        data: {
          status,
          adminComment: adminComment ?? null,
          publishInStories:
            status === "CONTEST" ? !!publishInStories : false,
          // Одобренные заявки всегда учитываются в уровне доверия (админ может потом снять галку)
          ...(status === "APPROVED" ? { countTowardsTrust: true } : {}),
          // Для микростатистики: галка «Понизить уровень» — можно и выставить, и снять
          ...(status === "APPROVED" || status === "REJECTED"
            ? { trustDecreasedAtDecision: decreaseTrustOnDecision }
            : {}),
        },
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
  { params }: { params: { id: string } | Promise<{ id: string }> },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const id = await resolveId(params);
  if (!id) return Response.json({ error: "Bad request" }, { status: 400 });

  try {
    // Удаляем заявку (изображения удалятся автоматически из-за onDelete: Cascade)
    await prisma.application.delete({
      where: { id },
    });

    // 🛰️ SSE для админки
    publish("application:delete", { id });
    publish("stats:dirty", {});

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}
