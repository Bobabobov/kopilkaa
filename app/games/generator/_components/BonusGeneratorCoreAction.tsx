'use client';

import { motion } from 'framer-motion';
import { GENERATOR_COST } from '@/lib/games/bonusGenerator';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { cn } from '@/lib/utils';
import type { BonusGeneratorPhase } from './BonusGeneratorVisual';

interface BonusGeneratorCoreActionProps {
  phase: BonusGeneratorPhase;
  canActivate: boolean;
  onActivate: () => void;
  cost?: number;
}

export function BonusGeneratorCoreAction({
  phase,
  canActivate,
  onActivate,
  cost = GENERATOR_COST,
}: BonusGeneratorCoreActionProps) {
  const isRunning = phase === 'running';
  const isResult = phase === 'result';
  const showInsufficient = !canActivate && !isRunning;

  const label = isRunning
    ? 'Запуск…'
    : isResult
      ? `Запустить снова (−${cost})`
      : `Запустить генератор (−${cost})`;

  return (
    <div className='relative z-20 mt-5 flex w-full flex-col items-center gap-2 px-4'>
      <motion.button
        type='button'
        disabled={!canActivate || isRunning}
        onClick={(event) => {
          event.stopPropagation();
          if (canActivate && !isRunning) {
            onActivate();
          }
        }}
        className={cn(
          'inline-flex h-12 w-full max-w-[17.5rem] items-center justify-center gap-2 rounded-xl',
          'bg-gradient-to-r from-emerald-500 to-teal-600 px-5 text-sm font-bold tracking-wide text-white sm:text-base',
          'shadow-lg shadow-emerald-500/20 transition-all duration-200',
          'hover:from-emerald-400 hover:to-teal-500 active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:from-emerald-500 disabled:hover:to-teal-600 disabled:active:scale-100',
        )}
        whileHover={canActivate && !isRunning ? { scale: 1.02 } : undefined}
        whileTap={canActivate && !isRunning ? { scale: 0.98 } : undefined}
      >
        {isRunning ? (
          <LucideIcons.Loader2 className='animate-spin' size='sm' />
        ) : (
          <LucideIcons.Sparkles size='sm' />
        )}
        {label}
      </motion.button>

      {showInsufficient && (
        <p className='text-center text-xs text-zinc-400 sm:text-sm'>
          Недостаточно бонусов. Нужно минимум {cost}.
        </p>
      )}
    </div>
  );
}
