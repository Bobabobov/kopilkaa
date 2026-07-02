'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import './gamesLobby.css';

interface ShimmerPlayButtonProps {
  href: Route;
  children: ReactNode;
  className?: string;
}

export function ShimmerPlayButton({
  href,
  children,
  className,
}: ShimmerPlayButtonProps) {
  return (
    <motion.div
      className='w-full transform-gpu will-change-transform'
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
    >
      <Link
        href={href}
        className={cn(
          'relative flex min-h-[44px] w-full transform-gpu items-center justify-center overflow-hidden rounded-full',
          'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600',
          'px-5 py-3.5 text-xs font-extrabold uppercase tracking-widest text-zinc-950',
          'shadow-lg shadow-emerald-500/10 will-change-transform',
          'transition-[box-shadow,background] duration-300',
          'hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-500 hover:shadow-emerald-500/25',
          'motion-reduce:transition-none',
          className,
        )}
      >
        <span className='games-lobby-shimmer-beam transform-gpu' aria-hidden />
        <span className='relative z-10'>{children}</span>
      </Link>
    </motion.div>
  );
}
