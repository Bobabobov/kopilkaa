'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import '@/app/games/_components/effects/gamesLobby.css';

interface SequenceStartButtonProps {
  disabled: boolean;
  cost: number;
  onClick: () => void;
}

export function SequenceStartButton({
  disabled,
  cost,
  onClick,
}: SequenceStartButtonProps) {
  return (
    <motion.button
      type='button'
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={cn(
        'relative w-full max-w-lg transform-gpu overflow-hidden rounded-2xl',
        'border border-emerald-500/30 border-b-4 border-b-emerald-700',
        'bg-gradient-to-b from-emerald-500 to-emerald-700',
        'px-8 py-5 font-mono text-base font-extrabold uppercase tracking-[0.15em] text-zinc-950',
        'shadow-[0_8px_0_0_rgba(4,120,87,0.8),0_0_40px_rgba(16,185,129,0.25)]',
        'transition-[transform,border,box-shadow] duration-150 will-change-transform',
        'active:translate-y-[4px] active:border-b-0 active:shadow-[0_4px_0_0_rgba(4,120,87,0.8)]',
        'disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none',
      )}
    >
      <span className='games-lobby-shimmer-beam transform-gpu' aria-hidden />
      <span className='relative z-10'>Старт — {cost} бонусов</span>
    </motion.button>
  );
}
