'use client';

import { useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import {
  FEEDBACK_TOPICS,
  type FeedbackTopicId,
  isFeedbackTopicId,
} from '@/lib/feedback/config';
import { SiteFeedbackForm } from '@/components/feedback/SiteFeedbackForm';
import { Card } from '@/components/ui/Card';

function resolveTopic(searchTopic: string | null): FeedbackTopicId {
  if (searchTopic && isFeedbackTopicId(searchTopic)) {
    return searchTopic;
  }
  return 'general';
}

function resolveSource(
  searchTopic: string | null,
): 'page' | 'games_link' {
  return searchTopic === 'games' ? 'games_link' : 'page';
}

export function FeedbackPageClient() {
  const pathname = usePathname() ?? '/feedback';
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic');
  const topic = useMemo(() => resolveTopic(topicParam), [topicParam]);
  const source = useMemo(() => resolveSource(topicParam), [topicParam]);
  const lockTopic = Boolean(topicParam && isFeedbackTopicId(topicParam) && topic !== 'general');

  return (
    <main className='relative min-h-screen px-4 py-10 sm:px-6 sm:py-14'>
      <div className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute right-0 top-0 h-72 w-72 rounded-full bg-[#f9bc60]/5 blur-3xl' />
        <div className='absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#abd1c6]/5 blur-3xl' />
      </div>

      <div className='mx-auto max-w-2xl'>
        <div className='mb-6 text-center sm:mb-8'>
          <span className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#f9bc60]/25 bg-[#f9bc60]/10 text-[#f9bc60]'>
            <MessageSquare className='h-7 w-7' aria-hidden />
          </span>
          <h1 className='text-3xl font-black text-[#fffffe] sm:text-4xl'>
            Обратная связь
          </h1>
          <p className='mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#abd1c6]/90 sm:text-base'>
            Помогите нам улучшить Копилку: сообщите о баге, неудобстве или идее.
          </p>
        </div>

        {lockTopic && (
          <Card variant='darkGlass' padding='md' className='mb-4 border-[#f9bc60]/20'>
            <p className='text-sm text-[#abd1c6]/90'>
              Вы пишете по теме «{FEEDBACK_TOPICS[topic].label}».{' '}
              {FEEDBACK_TOPICS[topic].description}
            </p>
          </Card>
        )}

        <SiteFeedbackForm
          initialTopic={topic}
          lockTopic={lockTopic}
          source={source}
          pagePath={pathname}
        />

      </div>
    </main>
  );
}
