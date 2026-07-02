'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type FooterLinkAccent = 'emerald' | 'teal' | 'amber';

export const accentStyles: Record<
  FooterLinkAccent,
  {
    row: string;
    icon: string;
    text: string;
    arrow: string;
  }
> = {
  emerald: {
    row: 'border-emerald-400/35 bg-emerald-500/12 hover:border-emerald-400/55 hover:bg-emerald-500/16 hover:shadow-[0_0_18px_rgba(16,185,129,0.14)]',
    icon: 'border-emerald-400/40 bg-emerald-500/22 text-emerald-300',
    text: 'text-emerald-100/95 group-hover:text-emerald-50',
    arrow: 'text-emerald-400',
  },
  teal: {
    row: 'border-[#abd1c6]/28 bg-[#abd1c6]/8 hover:border-[#abd1c6]/45 hover:bg-[#abd1c6]/12 hover:shadow-[0_0_18px_rgba(171,209,198,0.12)]',
    icon: 'border-[#abd1c6]/35 bg-[#abd1c6]/16 text-[#abd1c6]',
    text: 'text-[#abd1c6] group-hover:text-[#fffffe]',
    arrow: 'text-[#abd1c6]',
  },
  amber: {
    row: 'border-[#f9bc60]/35 bg-[#f9bc60]/10 hover:border-[#f9bc60]/55 hover:bg-[#f9bc60]/14 hover:shadow-[0_0_18px_rgba(249,188,96,0.16)]',
    icon: 'border-[#f9bc60]/40 bg-[#f9bc60]/22 text-[#f9bc60]',
    text: 'text-[#f9bc60]/95 group-hover:text-[#f9bc60]',
    arrow: 'text-[#f9bc60]',
  },
};

interface FooterLinkItemProps {
  href: string;
  label: string;
  icon: ReactNode;
  accent: FooterLinkAccent;
}

export function FooterLinkItem({
  href,
  label,
  icon,
  accent,
}: FooterLinkItemProps) {
  const styles = accentStyles[accent];

  return (
    <Link
      href={href}
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
        <div className='h-4 w-4'>{icon}</div>
      </div>
      <span className={cn('flex-1 text-xs font-semibold transition-colors sm:text-sm', styles.text)}>
        {label}
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
