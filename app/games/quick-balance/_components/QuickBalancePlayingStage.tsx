'use client';

import { motion } from 'framer-motion';
import type { QuickBalanceComparison } from '@/lib/games/shared/quickBalance';
import type { QuickBalanceRoundView } from '@/lib/games/shared/quickBalance';
import { cn } from '@/lib/utils';

interface QuickBalancePlayingStageProps {
  round: QuickBalanceRoundView;
  roundIndex: number;
  roundsTotal: number;
  timeLeftMs: number;
  timeLimitMs: number;
  disabled: boolean;
  wrongChoice: QuickBalanceComparison | null;
  onChoose: (choice: QuickBalanceComparison) => void;
}

const CHOICES: Array<{
  id: QuickBalanceComparison;
  label: string;
  emoji: string;
  className: string;
}> = [
  {
    id: 'lt',
    label: 'Меньше',
    emoji: '❌',
    className:
      'border-rose-400/50 bg-rose-950/70 text-rose-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-rose-300/70 hover:bg-rose-900/80 hover:text-white',
  },
  {
    id: 'eq',
    label: 'Равно',
    emoji: '🤝',
    className:
      'border-zinc-400/50 bg-zinc-800/90 text-zinc-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-zinc-300/70 hover:bg-zinc-700/90 hover:text-white',
  },
  {
    id: 'gt',
    label: 'Больше',
    emoji: '🟩',
    className:
      'border-emerald-400/50 bg-emerald-950/70 text-emerald-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-emerald-300/70 hover:bg-emerald-900/80 hover:text-white',
  },
];

export function QuickBalancePlayingStage({
  round,
  roundIndex,
  roundsTotal,
  timeLeftMs,
  timeLimitMs,
  disabled,
  wrongChoice,
  onChoose,
}: QuickBalancePlayingStageProps) {
  const timerPercent = Math.max(0, (timeLeftMs / timeLimitMs) * 100);
  const timerUrgent = timeLeftMs <= 900;

  return (
    <div className='flex flex-1 flex-col gap-5'>
      <div className='flex items-center justify-center gap-2'>
        {Array.from({ length: roundsTotal }).map((_, index) => (
          <span
            key={index}
            className={cn(
              'h-2 w-8 rounded-full transition-colors',
              index < roundIndex
                ? 'bg-emerald-500/70'
                : index === roundIndex
                  ? 'bg-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,0.5)]'
                  : 'bg-zinc-800',
            )}
          />
        ))}
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between font-mono text-xs'>
          <span className='text-zinc-500'>
            Раунд {roundIndex + 1}/{roundsTotal}
          </span>
          <span
            className={cn(
              'tabular-nums font-bold',
              timerUrgent ? 'text-red-400' : 'text-fuchsia-400',
            )}
          >
            {(timeLeftMs / 1000).toFixed(1)} с
          </span>
        </div>
        <div className='h-2 overflow-hidden rounded-full bg-zinc-800'>
          <motion.div
            className={cn(
              'h-full rounded-full',
              timerUrgent
                ? 'bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_16px_rgba(248,113,113,0.6)]'
                : 'bg-gradient-to-r from-fuchsia-600 to-pink-400 shadow-[0_0_12px_rgba(217,70,239,0.45)]',
            )}
            animate={{ width: `${timerPercent}%` }}
            transition={{ duration: 0.06 }}
          />
        </div>
      </div>

      <div className='grid flex-1 grid-cols-1 items-center gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-6'>
        <div className='rounded-2xl border border-fuchsia-500/20 bg-fuchsia-950/20 px-4 py-6 text-center sm:px-6 sm:py-8'>
          <p className='font-mono text-[10px] uppercase tracking-[0.2em] text-fuchsia-400/70'>
            Слева
          </p>
          <p className='mt-3 font-mono text-2xl font-bold leading-tight text-zinc-50 sm:text-3xl'>
            {round.leftText}
          </p>
        </div>

        <div className='flex flex-col gap-2 sm:gap-3'>
          {CHOICES.map((choice) => (
            <motion.button
              key={choice.id}
              type='button'
              disabled={disabled}
              onClick={() => onChoose(choice.id)}
              whileTap={disabled ? undefined : { scale: 0.97 }}
              className={cn(
                'min-h-[52px] rounded-xl border px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider transition-colors sm:min-h-[56px] sm:text-base',
                'drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]',
                choice.className,
                disabled && 'cursor-not-allowed opacity-50',
                wrongChoice === choice.id &&
                  '!border-red-400 !bg-red-500/40 !text-white',
              )}
            >
              <span className='mr-2' aria-hidden>
                {choice.emoji}
              </span>
              {choice.label}
            </motion.button>
          ))}
        </div>

        <div className='rounded-2xl border border-fuchsia-500/20 bg-fuchsia-950/20 px-4 py-6 text-center sm:px-6 sm:py-8'>
          <p className='font-mono text-[10px] uppercase tracking-[0.2em] text-fuchsia-400/70'>
            Справа
          </p>
          <p className='mt-3 font-mono text-2xl font-bold leading-tight text-zinc-50 sm:text-3xl'>
            {round.rightText}
          </p>
        </div>
      </div>
    </div>
  );
}
