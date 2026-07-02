'use client';

import Link from 'next/link';
import { Construction, MessageSquarePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SECTION_FEEDBACK_COPY,
  SECTION_FEEDBACK_THEME,
  SECTION_FEEDBACK_TOPIC,
  type SectionFeedbackVariant,
} from './sectionFeedbackStyles';

export type SectionFeedbackLayout = 'banner' | 'compact' | 'footer-row';

interface SectionFeedbackCtaProps {
  variant: SectionFeedbackVariant;
  layout?: SectionFeedbackLayout;
  className?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
}

export function SectionFeedbackCta({
  variant,
  layout = 'banner',
  className,
  title,
  description,
  buttonLabel,
}: SectionFeedbackCtaProps) {
  const topic = SECTION_FEEDBACK_TOPIC[variant];
  const copy = SECTION_FEEDBACK_COPY[variant];
  const theme = SECTION_FEEDBACK_THEME[variant];
  const href = `/feedback?topic=${topic}`;
  const Icon = variant === 'games' ? Construction : MessageSquarePlus;

  const resolvedTitle = title ?? copy.title;
  const resolvedDescription = description ?? copy.description;
  const resolvedButton = buttonLabel ?? copy.button;

  if (layout === 'compact') {
    return (
      <Link
        href={href}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wide transition-colors sm:text-sm',
          theme.button,
          className,
        )}
      >
        <MessageSquarePlus className='h-4 w-4 shrink-0' aria-hidden />
        {resolvedButton}
      </Link>
    );
  }

  if (layout === 'footer-row') {
    return (
      <Link
        href={href}
        className={cn(
          'group flex items-center gap-3 rounded-lg border p-2.5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:translate-x-0.5 hover:shadow-[0_0_15px_rgba(249,188,96,0.15)]',
          theme.banner,
          className,
        )}
      >
        <div
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 group-hover:scale-105',
            theme.icon,
          )}
          aria-hidden
        >
          <MessageSquarePlus className='h-3.5 w-3.5' />
        </div>
        <span className={cn('flex-1 text-xs font-medium transition-colors group-hover:text-[#fffffe]', theme.text)}>
          {resolvedButton}
        </span>
        <svg
          className='h-3 w-3 shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100'
          style={{ color: '#f9bc60' }}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          aria-hidden
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
        </svg>
      </Link>
    );
  }

  if (layout === 'footer-card') {
    return (
      <Link
        href={href}
        className={cn(
          'group flex flex-col gap-3 rounded-xl border p-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(249,188,96,0.12)]',
          theme.banner,
          className,
        )}
      >
        <div className='flex items-start gap-3'>
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border',
              theme.icon,
            )}
            aria-hidden
          >
            <MessageSquarePlus className='h-5 w-5' />
          </div>
          <div className='min-w-0'>
            <p className={cn('font-bold', theme.title)}>{resolvedTitle}</p>
            <p className={cn('mt-1 text-sm leading-relaxed', theme.text)}>
              {resolvedDescription}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
            theme.button,
          )}
        >
          {resolvedButton}
        </span>
      </Link>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-2xl border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5',
        theme.banner,
        className,
      )}
      role='note'
    >
      <div className='flex min-w-0 items-start gap-3 sm:gap-4'>
        <div
          className={cn(
            'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border sm:h-11 sm:w-11',
            theme.icon,
          )}
          aria-hidden
        >
          <Icon className='h-5 w-5' />
        </div>
        <div className='min-w-0'>
          <p
            className={cn(
              'text-sm font-bold sm:text-base',
              theme.title,
              variant === 'games' &&
                'font-mono text-xs uppercase tracking-wide sm:text-sm',
            )}
          >
            {resolvedTitle}
          </p>
          <p className={cn('mt-1 text-sm leading-relaxed', theme.text)}>
            {resolvedDescription}
          </p>
        </div>
      </div>
      <Link
        href={href}
        className={cn(
          'inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors',
          theme.button,
          variant === 'games' && 'rounded-full font-mono text-xs',
        )}
      >
        <MessageSquarePlus className='h-4 w-4' aria-hidden />
        {resolvedButton}
      </Link>
    </div>
  );
}
