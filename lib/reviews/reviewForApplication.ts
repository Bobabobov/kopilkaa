import type { Prisma } from '@prisma/client';

/** Поля отзыва для админки и карточки «прошлая заявка». */
export const APPLICATION_REVIEW_DETAIL_SELECT = {
  id: true,
  content: true,
  createdAt: true,
  images: {
    orderBy: { sort: 'asc' as const },
    select: { url: true, sort: true },
  },
} as const;

export type ApplicationReviewDetail = Prisma.ReviewGetPayload<{
  select: typeof APPLICATION_REVIEW_DETAIL_SELECT;
}>;

type ReviewDb = Prisma.TransactionClient | typeof import('@/lib/db').prisma;

/**
 * Отзыв, привязанный к заявке. Если в БД остался legacy-отзыв без applicationId —
 * подставляем его и при linkOrphan записываем привязку.
 */
export async function resolveReviewForApplication(
  db: ReviewDb,
  userId: string,
  applicationId: string,
  options?: { linkOrphan?: boolean },
): Promise<ApplicationReviewDetail | null> {
  const linked = await db.review.findUnique({
    where: { applicationId },
    select: APPLICATION_REVIEW_DETAIL_SELECT,
  });
  if (linked) return linked;

  const orphan = await db.review.findFirst({
    where: { userId, applicationId: null },
    orderBy: { createdAt: 'desc' },
    select: APPLICATION_REVIEW_DETAIL_SELECT,
  });
  if (!orphan) return null;

  if (options?.linkOrphan) {
    try {
      await db.review.update({
        where: { id: orphan.id },
        data: { applicationId },
      });
    } catch {
      // applicationId уже занят другим отзывом — показываем orphan как есть
    }
  }

  return orphan;
}

/** Создание или обновление отзыва с обязательной привязкой к заявке. */
export async function upsertApplicationReview<TSelect extends Prisma.ReviewSelect>(
  tx: Prisma.TransactionClient,
  params: {
    userId: string;
    applicationId: string;
    content: string;
    sanitizedImages: string[];
    select: TSelect;
  },
): Promise<Prisma.ReviewGetPayload<{ select: TSelect }>> {
  const { userId, applicationId, content, sanitizedImages, select } = params;
  const imageRows = sanitizedImages.map((url, idx) => ({ url, sort: idx }));

  const existingByApp = await tx.review.findUnique({
    where: { applicationId },
    select: { id: true, userId: true },
  });

  if (existingByApp) {
    if (existingByApp.userId !== userId) {
      throw Object.assign(new Error('Отзыв принадлежит другому пользователю'), {
        status: 403,
      });
    }
    await tx.reviewImage.deleteMany({ where: { reviewId: existingByApp.id } });
    return tx.review.update({
      where: { id: existingByApp.id },
      data: {
        content,
        images: { create: imageRows },
      },
      select,
    });
  }

  const legacyOrphan = await tx.review.findFirst({
    where: { userId, applicationId: null },
    select: { id: true },
  });

  if (legacyOrphan) {
    await tx.reviewImage.deleteMany({ where: { reviewId: legacyOrphan.id } });
    return tx.review.update({
      where: { id: legacyOrphan.id },
      data: {
        applicationId,
        content,
        images: { create: imageRows },
      },
      select,
    });
  }

  return tx.review.create({
    data: {
      userId,
      applicationId,
      content,
      images: { create: imageRows },
    },
    select,
  });
}
