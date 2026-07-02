'use client';

import Link from 'next/link';
import { CheckCircle2, Loader2, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { FEEDBACK_STATUS_LABELS } from '@/lib/feedback/config';
import { cn } from '@/lib/utils';
import { FeedbackAuthor, type FeedbackAuthorUser } from './FeedbackAuthor';
import { FeedbackImageGallery } from './FeedbackImageGallery';
import { FeedbackOriginBadge } from './FeedbackOriginBadge';

type FeedbackStatus = 'new' | 'read' | 'resolved';

export interface FeedbackCardItem {
  id: string;
  rating: number | null;
  message: string;
  source: string;
  topic: string;
  topicLabel: string | null;
  pagePath: string | null;
  status: FeedbackStatus;
  adminNote: string | null;
  imageUrls: string[];
  createdAt: string;
  user: FeedbackAuthorUser | null;
}

interface FeedbackCardProps {
  item: FeedbackCardItem;
  busy: boolean;
  note: string;
  onNoteChange: (value: string) => void;
  onStatusChange: (status: FeedbackStatus) => void;
  onImageClick: (imageUrls: string[], index: number) => void;
}

export function FeedbackCard({
  item,
  busy,
  note,
  onNoteChange,
  onStatusChange,
  onImageClick,
}: FeedbackCardProps) {
  const isNew = item.status === 'new';

  return (
    <Card
      variant='darkGlass'
      padding='none'
      className={cn(
        'overflow-hidden border transition-shadow',
        isNew
          ? 'border-[#f9bc60]/35 shadow-[0_0_0_1px_rgba(249,188,96,0.1)]'
          : 'border-[#abd1c6]/15',
      )}
    >
      <div className='border-b border-[#abd1c6]/10 bg-[#001e1d]/40 px-4 py-4 sm:px-5 sm:py-5'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
          <FeedbackAuthor user={item.user} createdAt={item.createdAt} />

          <div className='flex flex-wrap items-center gap-2 lg:max-w-xs lg:justify-end'>
            {item.rating ? (
              <div className='flex items-center gap-1 rounded-xl border border-[#f9bc60]/25 bg-[#f9bc60]/10 px-3 py-2 text-[#f9bc60]'>
                <Star className='h-4 w-4 fill-current' aria-hidden />
                <span className='text-sm font-bold'>{item.rating}</span>
                <span className='text-xs text-[#f9bc60]/80'>/ 5</span>
              </div>
            ) : null}
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-semibold',
                item.status === 'new' && 'bg-amber-500/15 text-amber-300',
                item.status === 'read' && 'bg-sky-500/15 text-sky-300',
                item.status === 'resolved' &&
                  'bg-emerald-500/15 text-emerald-300',
              )}
            >
              {FEEDBACK_STATUS_LABELS[item.status]}
            </span>
          </div>
        </div>
      </div>

      <div className='space-y-4 px-4 py-4 sm:px-5 sm:py-5'>
        <FeedbackOriginBadge
          topic={item.topic}
          topicLabel={item.topicLabel}
          source={item.source}
          pagePath={item.pagePath}
        />

        <div className='rounded-xl border border-[#f9bc60]/20 bg-[#f9bc60]/[0.06] p-4 sm:p-5'>
          <p className='text-xs font-semibold uppercase tracking-wide text-[#f9bc60]'>
            Сообщение
          </p>
          <p className='mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-[#fffffe]/95 sm:text-base [overflow-wrap:anywhere]'>
            {item.message}
          </p>
          <p className='mt-2 text-xs text-[#94a1b2]'>
            {item.message.length} символов
          </p>
        </div>

        <FeedbackImageGallery
          imageUrls={item.imageUrls}
          onImageClick={(index) => onImageClick(item.imageUrls, index)}
        />

        <div className='rounded-xl border border-[#abd1c6]/20 bg-[#001e1d]/50 p-3 sm:p-4'>
          <label
            htmlFor={`feedback-note-${item.id}`}
            className='mb-2 block text-xs font-semibold uppercase tracking-wide text-[#abd1c6]/70'
          >
            Заметка администратора
          </label>
          <textarea
            id={`feedback-note-${item.id}`}
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            rows={2}
            placeholder='Внутренняя заметка по отзыву…'
            className='w-full resize-y rounded-xl border border-[#abd1c6]/20 bg-[#001e1d]/70 px-3 py-2.5 text-sm text-[#fffffe] outline-none transition focus:border-[#f9bc60]/50 focus:ring-2 focus:ring-[#f9bc60]/10'
          />
        </div>

        <div className='flex flex-col gap-2 sm:flex-row sm:flex-wrap'>
          <Button
            type='button'
            size='sm'
            disabled={busy}
            onClick={() => onStatusChange('read')}
            className='w-full rounded-xl bg-sky-600 text-white hover:bg-sky-500 sm:w-auto'
          >
            {busy ? (
              <Loader2 className='mr-1.5 h-4 w-4 animate-spin' />
            ) : null}
            Прочитано
          </Button>
          <Button
            type='button'
            size='sm'
            disabled={busy}
            onClick={() => onStatusChange('resolved')}
            className='w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 sm:w-auto'
          >
            {busy ? (
              <Loader2 className='mr-1.5 h-4 w-4 animate-spin' />
            ) : (
              <CheckCircle2 className='mr-1.5 h-4 w-4' />
            )}
            Решено
          </Button>
          {item.user?.id ? (
            <Button
              asChild
              size='sm'
              variant='outline'
              className='w-full rounded-xl border-[#abd1c6]/25 text-[#abd1c6] hover:border-[#f9bc60]/40 hover:bg-[#f9bc60]/10 hover:text-[#fffffe] sm:w-auto'
            >
              <Link href='/admin/users'>Все пользователи</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
