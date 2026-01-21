// app/api/applications/route.ts
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { AchievementService } from "@/lib/achievements/service";
import { publish } from "@/lib/sse";
import {
  getPlainTextLenFromHtml,
  sanitizeApplicationStoryHtml,
} from "@/lib/applications/sanitize";
import { computeUserTrustSnapshot } from "@/lib/trust/computeTrustSnapshot";
import { ApplicationStatus } from "@prisma/client";

const DAY_MS = 24 * 60 * 60 * 1000;

function getWhitelistEmails(): string[] {
  const raw = process.env.WHITELIST_EMAILS || "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session)
    return Response.json({ error: "Требуется вход" }, { status: 401 });

  const requester = await prisma.user.findUnique({
    where: { id: session.uid },
    select: { email: true },
  });
  const whitelistEmails = getWhitelistEmails();
  const isWhitelisted =
    requester?.email && whitelistEmails.includes(requester.email.toLowerCase());

  try {
    const {
      title,
      summary,
      story,
      amount,
      payment,
      images,
      hpCompany,
      clientMeta,
      acknowledgedRules,
    } = (await req.json()) as {
      title: string;
      summary: string;
      story: string;
      amount: string;
      payment: string;
      images: string[];
      hpCompany?: string;
      clientMeta?: { filledMs?: number | null };
      acknowledgedRules?: boolean;
    };

    // Anti-spam (no captcha): honeypot + "too fast submit"
    if (typeof hpCompany === "string" && hpCompany.trim().length > 0) {
      return Response.json({ error: "Spam detected" }, { status: 400 });
    }

    const filledMs = clientMeta?.filledMs;
    const clampedFilledMs =
      typeof filledMs === "number" && Number.isFinite(filledMs) && filledMs >= 0
        ? Math.min(Math.round(filledMs), 24 * 60 * 60 * 1000) // до 24 часов
        : null;
    const isAdmin = session.role === "ADMIN";
    if (
      !isAdmin &&
      !isWhitelisted &&
      typeof filledMs === "number" &&
      Number.isFinite(filledMs) &&
      filledMs >= 0 &&
      filledMs < 2500
    ) {
      return Response.json(
        {
          error:
            "Слишком быстро заполнено (менее 3 секунд). Заполните форму вручную и отправьте ещё раз.",
          retryAfterMs: 5000,
        },
        { status: 429 },
      );
    }

    if (!acknowledgedRules) {
      return Response.json(
        { error: "Необходимо подтвердить понимание условий" },
        { status: 400 },
      );
    }

    const sanitizedStory = sanitizeApplicationStoryHtml(story);
    const storyTextLen = getPlainTextLenFromHtml(sanitizedStory);

    // Валидация длин (расширенные лимиты для администратора)
    const titleMax = isAdmin ? 100 : 40;
    const summaryMax = isAdmin ? 300 : 60;
    const storyMax = isAdmin ? 10000 : 3000;
    const storyMin = 10;
    const paymentMax = isAdmin ? 500 : 200;

    if (!title || title.length > titleMax)
      return Response.json(
        { error: `Заголовок обязателен (≤ ${titleMax})` },
        { status: 400 },
      );
    if (!summary || summary.length > summaryMax)
      return Response.json(
        { error: `Кратко обязательно (≤ ${summaryMax})` },
        { status: 400 },
      );
    if (!sanitizedStory || storyTextLen < storyMin || storyTextLen > storyMax)
      return Response.json(
        { error: `История ${storyMin}–${storyMax} символов` },
        { status: 400 },
      );
    const amountNumber = parseInt(amount);
    if (!amount || isNaN(amountNumber) || amountNumber < 1 || amountNumber > 1000000)
      return Response.json(
        { error: `Сумма должна быть от 1 до 1 000 000 рублей` },
        { status: 400 },
      );
    if (!payment || payment.length < 10 || payment.length > paymentMax)
      return Response.json(
        { error: `Реквизиты 10–${paymentMax} символов` },
        { status: 400 },
      );
    // Ограничение на количество изображений (администратор может загружать больше)
    const maxImages = session.role === "ADMIN" ? 20 : 5;
    if (!Array.isArray(images) || images.length > maxImages) {
      return Response.json(
        { error: `До ${maxImages} изображений` },
        { status: 400 },
      );
    }
    if (images.length === 0) {
      return Response.json(
        { error: "Необходимо добавить хотя бы одно фото" },
        { status: 400 },
      );
    }

    // Лимит раз в 24 часа (только для обычных пользователей)
    if (session.role !== "ADMIN" && !isWhitelisted) {
      const last = await prisma.application.findFirst({
        where: { userId: session.uid },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      });
      if (last) {
        const diff = Date.now() - last.createdAt.getTime();
        const left = DAY_MS - diff;
        if (left > 0) {
          return Response.json(
            { error: "Лимит: 1 заявка в 24 часа", leftMs: left },
            { status: 429 },
          );
        }
      }
    }

    // Проверка уровня доверия и допустимой суммы (кроме администраторов и вайтлиста)
    if (session.role !== "ADMIN" && !isWhitelisted) {
      const trust = await computeUserTrustSnapshot(session.uid);

      // Если есть одобренная заявка, проверяем наличие отзыва
      if (trust.approvedApplications > 0) {
        const review = await prisma.review.findUnique({
          where: { userId: session.uid },
          select: { id: true },
        });
        
        if (!review) {
          return Response.json(
            { 
              error: "Для создания новой заявки необходимо сначала оставить отзыв о предыдущей одобренной заявке. Перейдите на страницу /reviews и оставьте отзыв.",
              requiresReview: true,
            },
            { status: 403 },
          );
        }
      }
      
      if (amountNumber < trust.limits.min || amountNumber > trust.limits.max) {
        const minText = trust.limits.min.toLocaleString("ru-RU");
        const maxText = trust.limits.max.toLocaleString("ru-RU");
        return Response.json(
          { error: `Сумма не соответствует ориентиру вашего уровня (от ${minText} до ${maxText} ₽).` },
          { status: 400 },
        );
      }
    }

    // Используем транзакцию для атомарности
    const result = await prisma.$transaction(async (tx) => {
      // Создаём заявку
      const app = await tx.application.create({
        data: {
          userId: session.uid,
          title,
          summary,
          story: sanitizedStory,
          amount: amountNumber,
          payment,
          filledMs: clampedFilledMs,
        },
        select: { id: true },
      });

      // Привязываем изображения по порядку
      if (images.length) {
        await tx.applicationImage.createMany({
          data: images.map((url: string, i: number) => ({
            applicationId: app.id,
            url,
            sort: i,
          })),
        });
      }

      return app;
    });

    // Проверяем и выдаём достижения (после создания заявки)
    try {
      await AchievementService.checkAndGrantAutomaticAchievements(session.uid);
    } catch (error) {
      console.error("Error checking achievements:", error);
      // Не прерываем создание заявки из-за ошибки достижений
    }

    // SSE уведомления для админки
    await new Promise(resolve => setTimeout(resolve, 50));
    
    publish("application:created", {
      id: result.id,
      userId: session.uid,
      title,
      summary,
      amount: parseInt(amount),
      status: "PENDING"
    });
    
    publish("stats:dirty", {});

    return Response.json({ ok: true, id: result.id });
  } catch (error) {
    console.error("Error creating application:", error);
    return Response.json(
      { error: "Ошибка сохранения заявки" },
      { status: 500 },
    );
  }
}
