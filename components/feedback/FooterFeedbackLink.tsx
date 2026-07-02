'use client';

import Link from 'next/link';
import { MessageSquarePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { accentStyles, type FooterLinkAccent } from '@/components/layout/FooterLinkItem';

interface FooterFeedbackLinkProps {
  accent?: FooterLinkAccent;
}

export function FooterFeedbackLink({ accent = 'emerald' }: FooterFeedbackLinkProps) {
  const styles = accentStyles[accent];

  return (
    <Link
      href='/feedback?topic=general'
      className={cn(
        'group flex items-center gap-3 rounded-xl border p-2.5 backdrop-blur-sm transition-all duration-300 hover:translate-x-0.5',
        styles.row,
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-105',
          styles.icon,
        )}
        aria-hidden
      >
        <MessageSquarePlus className='h-4 w-4' />
      </div>
      <span className={cn('flex-1 text-xs font-semibold transition-colors sm:text-sm', styles.text)}>
        Написать в поддержку
      </span>
      <svg
        className={cn(
          'h-3.5 w-3.5 shrink-0 opacity-70 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100',
          styles.arrow,
        )}
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
