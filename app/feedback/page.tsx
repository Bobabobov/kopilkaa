import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { buildAuthModalUrl } from '@/lib/authModalUrl';
import { FeedbackPageClient } from './_components/FeedbackPageClient';

export const metadata: Metadata = {
  title: 'Обратная связь',
  description:
    'Сообщите о баге, неудобстве или идее по улучшению платформы Копилка.',
};

interface FeedbackPageProps {
  searchParams: Promise<{ topic?: string }>;
}

export default async function FeedbackPage({ searchParams }: FeedbackPageProps) {
  const session = await getSession();
  const params = await searchParams;
  const topicSearch =
    params.topic && params.topic.trim()
      ? `?topic=${encodeURIComponent(params.topic.trim())}`
      : '';

  if (!session) {
    redirect(
      buildAuthModalUrl({
        pathname: '/feedback',
        search: topicSearch,
        modal: 'auth/login/email',
      }),
    );
  }

  return (
    <Suspense fallback={null}>
      <FeedbackPageClient />
    </Suspense>
  );
}
