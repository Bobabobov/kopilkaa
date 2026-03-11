// app/api/applications/route.ts
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { publish } from "@/lib/sse";
import {
  getPlainTextLenFromHtml,
  sanitizeApplicationStoryHtml,
} from "@/lib/applications/sanitize";
import { computeUserTrustSnapshot } from "@/lib/trust/computeTrustSnapshot";
import { ApplicationStatus } from "@prisma/client";
import {
  checkActivityRequirement,
  isActivityRequirementMet,
} from "@/lib/activity/checkActivityRequirement";

const DAY_MS = 24 * 60 * 60 * 1000;

function getClientIp(req: Request): string | null {
  const headers = [
    "x-forwarded-for",
    "x-real-ip",
    "cf-connecting-ip",
    "x-client-ip",
    "true-client-ip",
  ];
  for (const name of headers) {
    const value = req.headers.get(name);
    if (value) {
      const first = value.split(",")[0]?.trim();
      if (first && first.length > 0) return first;
    }
  }
  return null;
}

function getWhitelistEmails(): string[] {
  const raw = process.env.WHITELIST_EMAILS || "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Требуется вход" }, { status: 401 });
  }

  const body = (await req.json()) as {
    title: string;
    summary: string;
    story: string;
    amount: string;
    payment: string;
    images: string[];
    reportImages?: string[];
    hpCompany?: string;
    clientMeta?: {
      filledMs?: number | null;
      storyEditMs?: number | null;
    };
    acknowledgedRules?: boolean;
  };

  try {
    const whitelistEmails = getWhitelistEmails();
    const [requester, lastByUser, lastApprovedByUser] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.uid },
        select: { email: true },
      }),
      prisma.application.findFirst({
        where: { userId: session.uid },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
      prisma.application.findFirst({
        where: {
          userId: session.uid,
          status: ApplicationStatus.APPROVED,
        },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      }),
    ]);
    const isWhitelisted =
      requester?.email &&
      whitelistEmails.includes(requester.email.toLowerCase());

    const {
      title,
      summary,
      story,
      amount,
      payment,
      images,
      reportImages,
      hpCompany,
      clientMeta,
      acknowledgedRules,
    } = body;

    // Anti-spam (no captcha): honeypot + "too fast submit"
    if (typeof hpCompany === "string" && hpCompany.trim().length > 0) {
      return Response.json({ error: "Spam detected" }, { status: 400 });
    }

    const filledMs = clientMeta?.filledMs;
    const clampedFilledMs =
      typeof filledMs === "number" && Number.isFinite(filledMs) && filledMs >= 0
        ? Math.min(Math.round(filledMs), 24 * 60 * 60 * 1000) // до 24 часов
        : null;

    const storyEditMsRaw = clientMeta?.storyEditMs;
    const clampedStoryEditMs =
      typeof storyEditMsRaw === "number" &&
      Number.isFinite(storyEditMsRaw) &&
      storyEditMsRaw >= 0
        ? Math.min(Math.round(storyEditMsRaw), 24 * 60 * 60 * 1000)
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
    const storyMin = 100;
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
    if (
      !amount ||
      isNaN(amountNumber) ||
      amountNumber < 1 ||
      amountNumber > 1000000
    )
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
      if (lastByUser) {
        const diff = Date.now() - lastByUser.createdAt.getTime();
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
    const trust = await computeUserTrustSnapshot(session.uid);

    if (session.role !== "ADMIN" && !isWhitelisted) {
      // Требование отзыва ТОЛЬКО перед 2-й заявкой:
      // если есть хотя бы 1 одобренная заявка, но ещё ни одного отзыва — блокируем подачу
      if (trust.approvedApplications >= 1) {
        const anyApplicationReview = await prisma.review.findFirst({
          where: { userId: session.uid },
          select: { id: true },
        });
        if (!anyApplicationReview) {
          return Response.json(
            {
              error:
                "Для создания следующей заявки необходимо сначала оставить отзыв по первой одобренной заявке. Перейдите на страницу отзывов и оставьте отзыв.",
              requiresReview: true,
            },
            { status: 403 },
          );
        }
      }

      const needActivity = trust.approvedApplications >= 3;
      const lastForActivity = needActivity ? lastByUser : null;

      if (amountNumber < trust.limits.min || amountNumber > trust.limits.max) {
        const minText = trust.limits.min.toLocaleString("ru-RU");
        const maxText = trust.limits.max.toLocaleString("ru-RU");
        return Response.json(
          {
            error: `Сумма не соответствует ориентиру вашего уровня (от ${minText} до ${maxText} ₽).`,
          },
          { status: 400 },
        );
      }

      if (needActivity) {
        const lastApplicationAt = lastForActivity?.createdAt ?? null;
        const requirement = {
          type: "LIKE_STORY" as const,
          message:
            "Для каждой 3-й и последующей заявки поставьте лайк любой истории.",
        };
        const isMet = await isActivityRequirementMet(
          session.uid,
          requirement,
          lastApplicationAt,
        );
        if (!isMet) {
          return Response.json(
            {
              error: requirement.message,
              requiresActivity: true,
              activityType: requirement.type,
            },
            { status: 403 },
          );
        }
      }
    }

    const submitterIp = getClientIp(req);

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
          countTowardsTrust: false,
          filledMs: clampedFilledMs,
          storyEditMs: clampedStoryEditMs,
          submitterIp: submitterIp || undefined,
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

      // Фото-отчёт по прошлой одобренной заявке:
      // если есть последняя одобренная заявка и переданы reportImages —
      // сохраняем их как отдельные записи, перезаписывая предыдущий отчёт.
      if (
        Array.isArray(reportImages) &&
        reportImages.length > 0 &&
        lastApprovedByUser?.id
      ) {
        const urls = reportImages.slice(
          0,
          session.role === "ADMIN" ? reportImages.length : 5,
        );
        const reportModel = (tx as any).applicationReportImage;
        if (reportModel) {
          await reportModel.deleteMany({
            where: { applicationId: lastApprovedByUser.id },
          });
          await reportModel.createMany({
            data: urls.map((url, index) => ({
              applicationId: lastApprovedByUser.id,
              url,
              sort: index,
            })),
          });
        }
      }

      return app;
    });

    // SSE уведомления для админки (без задержки — ответ отдаём сразу)
    publish("application:created", {
      id: result.id,
      userId: session.uid,
      title,
      summary,
      amount: parseInt(amount),
      status: "PENDING",
    });

    publish("stats:dirty", {});

    return Response.json({ ok: true, id: result.id });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : "";
    console.error("[POST /api/applications]", msg, stack);
    return Response.json(
      { error: "Ошибка сохранения заявки" },
      { status: 500 },
    );
  }
}
