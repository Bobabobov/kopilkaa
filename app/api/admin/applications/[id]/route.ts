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

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;

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
        review: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            images: {
              orderBy: { sort: "asc" },
              select: { url: true, sort: true },
            },
          },
        },
      },
    });

    if (!item) return Response.json({ error: "Not found" }, { status: 404 });

    // Отзыв по прошлой одобренной заявке (для проверки админом перед одобрением)
    const previousApproved = await prisma.application.findFirst({
      where: {
        userId: item.userId,
        id: { not: id },
        status: "APPROVED",
        createdAt: { lt: item.createdAt },
      },
      orderBy: { createdAt: "desc" },
      take: 1,
      select: {
        id: true,
        title: true,
        createdAt: true,
        review: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            images: {
              orderBy: { sort: "asc" },
              select: { url: true, sort: true },
            },
          },
        },
      },
    });
    const previousApprovedWithReview = previousApproved
      ? {
          id: previousApproved.id,
          title: previousApproved.title,
          createdAt: previousApproved.createdAt,
          review: previousApproved.review,
        }
      : null;

    // Нормализация реквизитов: пробелы/переносы → один пробел, trim
    const normalizePayment = (s: string) =>
      (s ?? "").replace(/\s+/g, " ").trim();
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

    return Response.json({
      item: {
        ...item,
        story: sanitizeApplicationStoryHtml(item.story ?? ""),
        samePaymentApplications,
        sameIpApplications,
        previousApprovedWithReview,
      },
    });
  } catch (error) {
    console.error("[admin applications GET]", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
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
          ...(status === "APPROVED" ? { countTowardsTrust: true } : {}),
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

    if (
      item.user?.email &&
      (status === "APPROVED" || status === "REJECTED" || status === "PENDING")
    ) {
      sendStatusEmail(item.user.email, {
        title: item.title,
        status,
        comment: item.adminComment ?? "",
      }).catch((e) => console.error("mail error:", e));
    }

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
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    await prisma.application.delete({
      where: { id },
    });

    publish("application:delete", { id });
    publish("stats:dirty", {});

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}
