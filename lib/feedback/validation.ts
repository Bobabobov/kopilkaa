import { z } from 'zod';
import { isSafeUploadUrl } from '@/lib/uploads/url';
import {
  FEEDBACK_TOPICS,
  type FeedbackTopicId,
  isFeedbackTopicId,
} from './config';
import { FEEDBACK_MAX_PHOTOS } from './constants';
import {
  sanitizeFeedbackMessage,
  sanitizeFeedbackPagePath,
} from './sanitize';

const safeUploadUrlSchema = z
  .string()
  .trim()
  .refine(isSafeUploadUrl, 'Недопустимый URL изображения');

export const submitSiteFeedbackSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, 'Оценка от 1 до 5')
    .max(5, 'Оценка от 1 до 5')
    .optional()
    .nullable(),
  message: z
    .string()
    .transform(sanitizeFeedbackMessage)
    .pipe(
      z
        .string()
        .min(5, 'Сообщение слишком короткое')
        .max(4000, 'Сообщение слишком длинное'),
    ),
  topic: z
    .string()
    .refine(isFeedbackTopicId, 'Некорректная тема')
    .default('general'),
  source: z
    .enum(['popup', 'page', 'games_link', 'section_cta'])
    .default('page'),
  pagePath: z
    .string()
    .trim()
    .max(500)
    .optional()
    .nullable()
    .transform((value) => sanitizeFeedbackPagePath(value)),
  imageUrls: z
    .array(safeUploadUrlSchema)
    .max(
      FEEDBACK_MAX_PHOTOS,
      `Не более ${FEEDBACK_MAX_PHOTOS} фотографий`,
    )
    .optional()
    .default([]),
});

export type SubmitSiteFeedbackInput = z.infer<typeof submitSiteFeedbackSchema>;

export function resolveFeedbackTopicLabel(topic: FeedbackTopicId): string {
  return FEEDBACK_TOPICS[topic].label;
}

export const updateSiteFeedbackStatusSchema = z.object({
  status: z.enum(['new', 'read', 'resolved']),
  adminNote: z.string().trim().max(2000).optional().nullable(),
});

/** Парсит imageUrls из JSON-поля Prisma для API-ответов. */
export function parseFeedbackImageUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is string => typeof item === 'string' && isSafeUploadUrl(item),
  );
}
