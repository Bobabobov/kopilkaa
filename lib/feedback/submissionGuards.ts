import { prisma } from '@/lib/db';
import { FEEDBACK_MAX_SUBMISSIONS_PER_HOUR } from './constants';

export interface FeedbackGuardError {
  error: string;
  status: number;
}

/** Проверка лимита отправок отзывов с одного аккаунта за последний час. */
export async function assertFeedbackSubmissionAllowed(
  userId: string,
): Promise<FeedbackGuardError | null> {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const count = await prisma.siteFeedback.count({
    where: {
      userId,
      createdAt: { gte: since },
    },
  });

  if (count >= FEEDBACK_MAX_SUBMISSIONS_PER_HOUR) {
    return {
      error:
        'Слишком много отзывов за короткое время. Подождите час и попробуйте снова.',
      status: 429,
    };
  }

  return null;
}
