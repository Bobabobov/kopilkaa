// app/api/applications/route.ts
import { prisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { publish } from "@/lib/sse";
import {
  getPlainTextLenFromHtml,
  sanitizeApplicationStoryHtml,
} from "@/lib/applications/sanitize";
import { ApplicationCategory, ApplicationStatus, Prisma } from "@prisma/client";
import {
  isApplicationCategory,
  isSubmittableApplicationCategory,
  DEFAULT_APPLICATION_CATEGORY,
} from "@/lib/applications/categories";
import {
  extractClientIpFromRequest,
  normalizeClientIp,
} from "@/lib/http/clientIp";
import { digitsFingerprint } from "@/lib/admin/requisitesFingerprint";
import { parseDeviceFingerprint } from "@/lib/deviceFingerprint/validate";
import { parseClientTimezone } from "@/lib/applications/clientTimezone";
import { ACHIEVEMENT_SLUGS } from "@/lib/achievements/definitions";
import { checkAndUnlockAchievement } from "@/lib/achievements/unlock";
import { validateApplicationEconomy } from "@/lib/applications/applicationEconomy";
import { loadUserEconomyContext, requiresReviewBeforeNextApplication } from "@/lib/applications/userEconomyContext";
import { logApplicationSubmitBonusTransaction } from "@/lib/bonusTransactions/log";
import { getMaxApplicationAmount, showsDesiredAmountField } from "@/lib/level-config";
import { resolveUserProfileLevel } from "@/lib/userLevel/resolveProfileLevel";
import {
  findApplicationFieldWithLink,
  getApplicationNoLinksError,
} from "@/lib/applications/validateContent";
import { isSafeUploadUrl } from "@/lib/uploads/url";
import {
  normalizeApplicationSbpPayment,
  validateApplicationSbpPayment,
} from "@/lib/sbp/validateApplicationPayment";

function getWhitelistEmails(): string[] {
  const raw = process.env.WHITELIST_EMAILS || "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function getClientDevice(req: Request): string {
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  if (!ua) return "other";
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios")) {
    return "ios";
  }
  if (ua.includes("android")) {
    return "android";
  }
  if (
    ua.includes("windows") ||
    ua.includes("macintosh") ||
    ua.includes("linux")
  ) {
    return "desktop";
  }
  return "other";
}

export async function POST(req: Request) {
  const session = await getAuthUser(req);
  if (!session) {
    return Response.json({ error: "Требуется вход" }, { status: 401 });
  }

  const body = (await req.json()) as {
    category: string;
    title: string;
    summary: string;
    story: string;
    amount: string;
    desiredAmount?: string;
    payment: string;
    bankName?: string;
    images: string[];
    hpCompany?: string;
    clientMeta?: {
      filledMs?: number | null;
      storyEditMs?: number | null;
      deviceFingerprint?: string | null;
      clientTimezone?: string | null;
    };
    acknowledgedRules?: boolean;
  };

  try {
    const whitelistEmails = getWhitelistEmails();
    const [requester] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.uid },
        select: { email: true, level: true, experience: true },
      }),
    ]);
    const isWhitelisted =
      requester?.email &&
      whitelistEmails.includes(requester.email.toLowerCase());

    const {
      category: categoryRaw,
      title,
      summary,
      story,
      amount,
      desiredAmount: desiredAmountRaw,
      payment,
      bankName: bankNameRaw,
      images,
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

    const categoryResolved: ApplicationCategory =
      categoryRaw && isApplicationCategory(categoryRaw)
        ? categoryRaw
        : DEFAULT_APPLICATION_CATEGORY;
    if (!isSubmittableApplicationCategory(categoryResolved)) {
      return Response.json(
        { error: "Выберите актуальную категорию истории" },
        { status: 400 },
      );
    }
    const category: ApplicationCategory = categoryResolved;

    const sanitizedStory = sanitizeApplicationStoryHtml(story);
    const storyTextLen = getPlainTextLenFromHtml(sanitizedStory);

    const linkField = findApplicationFieldWithLink({
      title: typeof title === "string" ? title : "",
      summary: typeof summary === "string" ? summary : "",
      storyHtml: sanitizedStory,
      payment: typeof payment === "string" ? payment : "",
      bankName:
        typeof bankNameRaw === "string" ? bankNameRaw : undefined,
    });
    if (linkField) {
      return Response.json(
        { error: getApplicationNoLinksError(linkField) },
        { status: 400 },
      );
    }

    // Валидация длин (расширенные лимиты для администратора)
    const titleMax = isAdmin ? 100 : 40;
    const summaryMax = isAdmin ? 300 : 60;
    const storyMax = isAdmin ? 10000 : 3000;
    const storyMin = 100;
    const paymentMax = isAdmin ? 500 : 200;
    const bankName =
      typeof bankNameRaw === "string" ? bankNameRaw.trim() : "";
    const paymentError = validateApplicationSbpPayment(payment, bankName);
    if (!payment || paymentError) {
      return Response.json(
        { error: paymentError ?? "Укажите номер телефона и банк для СБП" },
        { status: 400 },
      );
    }
    const normalizedPayment = normalizeApplicationSbpPayment(payment, bankName);
    if (normalizedPayment.length > paymentMax) {
      return Response.json(
        { error: `Данные СБП: не более ${paymentMax} символов` },
        { status: 400 },
      );
    }

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
    const profileLevel = resolveUserProfileLevel(requester ?? {});
    const amountNumber = parseInt(amount);
    const userMaxAmount =
      isAdmin || isWhitelisted
        ? 1_000_000
        : getMaxApplicationAmount(profileLevel);
    if (
      !amount ||
      isNaN(amountNumber) ||
      amountNumber < 1 ||
      amountNumber > userMaxAmount
    )
      return Response.json(
        {
          error:
            isAdmin || isWhitelisted
              ? `Сумма должна быть от 1 до 1 000 000 рублей`
              : `На вашем уровне доступен гонорар до ${userMaxAmount} ₽.`,
        },
        { status: 400 },
      );

    let desiredAmountNumber: number | null = null;
    const userLevel = profileLevel;
    const canSetDesiredAmount =
      isAdmin || isWhitelisted || showsDesiredAmountField(userLevel);

    if (
      desiredAmountRaw != null &&
      String(desiredAmountRaw).trim().length > 0
    ) {
      if (!canSetDesiredAmount) {
        return Response.json(
          { error: "Желаемая сумма доступна с 2-го уровня профиля" },
          { status: 400 },
        );
      }
      desiredAmountNumber = parseInt(String(desiredAmountRaw), 10);
      if (
        isNaN(desiredAmountNumber) ||
        desiredAmountNumber < 1 ||
        desiredAmountNumber <= amountNumber
      ) {
        return Response.json(
          {
            error:
              "Желаемая сумма должна быть больше суммы гонорара",
          },
          { status: 400 },
        );
      }
    }
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
    const unsafeImage = images.find((url) => !isSafeUploadUrl(url));
    if (unsafeImage) {
      return Response.json(
        { error: "Недопустимый URL изображения" },
        { status: 400 },
      );
    }

    const economyContext = await loadUserEconomyContext(prisma, session.uid);

    // Отзыв перед 2-й заявкой в текущем экономическом цикле (вайтлист без изменений)
    if (!isWhitelisted && economyContext) {
      if (requiresReviewBeforeNextApplication(economyContext)) {
        const anyApplicationReview = await prisma.review.findFirst({
          where: { userId: session.uid },
          select: { id: true },
        });
        if (!anyApplicationReview) {
          return Response.json(
            {
              error:
                "Для публикации следующей истории необходимо сначала оставить отзыв по первой одобренной публикации. Перейдите на страницу отзывов и оставьте отзыв.",
              requiresReview: true,
            },
            { status: 403 },
          );
        }
      }
    }

    const submitterIpRaw = extractClientIpFromRequest(req);
    const submitterIp = normalizeClientIp(submitterIpRaw);
    const clientDevice = getClientDevice(req);
    const deviceFingerprint = parseDeviceFingerprint(
      clientMeta?.deviceFingerprint,
    );
    const clientTimezone = parseClientTimezone(clientMeta?.clientTimezone);

    // Используем транзакцию для атомарности
    const result = await prisma.$transaction(async (tx) => {
      const economyCheck = await validateApplicationEconomy(tx, {
        userId: session.uid,
        amount: amountNumber,
        isAdmin,
        isWhitelisted: Boolean(isWhitelisted),
      });

      if (!economyCheck.ok) {
        throw Object.assign(new Error(economyCheck.error), {
          status: economyCheck.status,
          leftMs: economyCheck.leftMs,
        });
      }

      const app = await tx.application.create({
        data: {
          userId: session.uid,
          category,
          title,
          summary,
          story: sanitizedStory,
          amount: amountNumber,
          desiredAmount: desiredAmountNumber,
          payment: normalizedPayment,
          paymentFingerprint: digitsFingerprint(normalizedPayment),
          filledMs: clampedFilledMs,
          storyEditMs: clampedStoryEditMs,
          submitterIp: submitterIp || undefined,
          clientDevice,
          clientTimezone: clientTimezone ?? undefined,
          deviceFingerprint: deviceFingerprint ?? undefined,
          isFirstFree: economyCheck.isFirstFree,
          submitBonusCost:
            isAdmin || isWhitelisted ? 0 : economyCheck.submitBonusCost,
          userLevelAtSubmit: economyCheck.userLevel,
        },
        select: { id: true },
      });

      await logApplicationSubmitBonusTransaction(tx, {
        userId: session.uid,
        applicationId: app.id,
        amount: isAdmin || isWhitelisted ? 0 : economyCheck.submitBonusCost,
        isFirstFree:
          economyCheck.isFirstFree || Boolean(isAdmin || isWhitelisted),
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

    // SSE уведомления для админки (без задержки — ответ отдаём сразу)
    publish("application:created", {
      id: result.id,
      userId: session.uid,
      title,
      summary,
      amount: amountNumber,
      status: "PENDING",
    });

    publish("stats:dirty", {});

    checkAndUnlockAchievement(session.uid, ACHIEVEMENT_SLUGS.FIRST_APPLICATION).catch(
      (error) => {
        console.error("[POST /api/applications] first-step achievement:", error);
      },
    );

    return Response.json({ ok: true, id: result.id });
  } catch (error) {
    const economyStatus =
      error &&
      typeof error === 'object' &&
      'status' in error &&
      typeof (error as { status: unknown }).status === 'number'
        ? (error as { status: number; leftMs?: number }).status
        : null;
    const economyLeftMs =
      error &&
      typeof error === 'object' &&
      'leftMs' in error &&
      typeof (error as { leftMs: unknown }).leftMs === 'number'
        ? (error as { leftMs: number }).leftMs
        : undefined;

    if (economyStatus != null && error instanceof Error) {
      return Response.json(
        {
          error: error.message,
          ...(economyLeftMs != null ? { leftMs: economyLeftMs } : {}),
        },
        { status: economyStatus },
      );
    }

    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : "";
    if (process.env.NODE_ENV !== "production") {
      console.error("[POST /api/applications]", msg, stack);
    } else {
      console.error("[POST /api/applications]", msg);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2022") {
        return Response.json(
          {
            error:
              "База данных не обновлена: отсутствует колонка в таблице заявок. Выполните у себя: npx prisma migrate deploy и prisma generate.",
          },
          { status: 500 },
        );
      }
      if (error.code === "P2002") {
        return Response.json(
          {
            error:
              "Не удалось сохранить из‑за конфликта записей. Обновите страницу и отправьте снова.",
          },
          { status: 409 },
        );
      }
      if (error.code === "P2003") {
        return Response.json(
          {
            error:
              "Ошибка связи записей в базе. Обновите страницу или напишите в поддержку.",
          },
          { status: 500 },
        );
      }
    }

    return Response.json(
      {
        error: "Ошибка сохранения истории",
        ...(process.env.NODE_ENV === "development"
          ? { detail: msg.slice(0, 300) }
          : {}),
      },
      { status: 500 },
    );
  }
}
