import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import {
  resolveFeedbackTopicLabel,
  submitSiteFeedbackSchema,
} from '@/lib/feedback/validation';
import { assertFeedbackSubmissionAllowed } from '@/lib/feedback/submissionGuards';
import { normalizeFeedbackImageUrls } from '@/lib/feedback/sanitize';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.uid) {
      return NextResponse.json(
        { error: 'Войдите в аккаунт, чтобы отправить отзыв' },
        { status: 401 },
      );
    }

    const guardError = await assertFeedbackSubmissionAllowed(session.uid);
    if (guardError) {
      return NextResponse.json(
        { error: guardError.error },
        { status: guardError.status },
      );
    }

    const body = await request.json().catch(() => ({}));
    const parsed = submitSiteFeedbackSchema.safeParse(body);
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? 'Проверьте данные формы';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { rating, message, topic, source, pagePath, imageUrls } =
      parsed.data;
    const normalizedImages = normalizeFeedbackImageUrls(imageUrls);

    const feedback = await prisma.siteFeedback.create({
      data: {
        user: { connect: { id: session.uid } },
        rating: rating ?? null,
        message,
        topic,
        topicLabel: resolveFeedbackTopicLabel(topic),
        source,
        pagePath: pagePath ?? null,
        imageUrls:
          normalizedImages.length > 0 ? normalizedImages : undefined,
        status: 'new',
      },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    logRouteCatchError('[API Error] POST /api/feedback', error);
    return NextResponse.json(
      { error: 'Не удалось отправить отзыв' },
      { status: 500 },
    );
  }
}
