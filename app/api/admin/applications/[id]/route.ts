// app/api/admin/applications/[id]/route.ts
export const runtime = "nodejs"; // чтобы работало с nodemailer на Node

import { prisma } from "@/lib/db";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { publish } from "@/lib/sse";
import { sendStatusEmail } from "@/lib/email";
import { AchievementService } from "@/lib/achievements/service";
import { sanitizeApplicationStoryHtml } from "@/lib/applications/sanitize";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const admin = await getAllowedAdminUser();
  if (!admin)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  try {
    const item = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { email: true, id: true } },
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
  if (!admin)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const status = body?.status as
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | undefined;
  const adminComment =
    typeof body?.adminComment === "string" ? body.adminComment : undefined;
  if (!status || !["PENDING", "APPROVED", "REJECTED"].includes(status))
    return Response.json({ error: "Invalid status" }, { status: 400 });

  try {
    const item = await prisma.application.update({
      where: { id: params.id },
      data: { status, adminComment: adminComment ?? null },
      include: {
        user: { select: { email: true, id: true } },
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

    // Проверяем и выдаём достижения при одобрении заявки
    if (status === "APPROVED" && item.user?.id) {
      try {
        await AchievementService.checkAndGrantAutomaticAchievements(item.user.id);
      } catch (error) {
        console.error("Error checking achievements:", error);
        // Не прерываем обновление статуса из-за ошибки достижений
      }
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
  if (!admin)
    return Response.json({ error: "Forbidden" }, { status: 403 });

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
