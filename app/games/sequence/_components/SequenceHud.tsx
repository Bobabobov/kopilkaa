'use client';

import { motion } from 'framer-motion';
import { NumberTicker } from '@/app/games/_components/effects/NumberTicker';

interface SequenceHudProps {
  currentRound: number;
  maxSequenceRecord: number;
  balance: number;
  phaseLabel: string;
}

function HudIndicator({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: number;
  valueClassName: string;
}) {
  return (
    <div className='relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/50 px-5 py-3 backdrop-blur-sm'>
      <div
        className='pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent'
        aria-hidden
      />
      <p className='font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500'>
        {label}
      </p>
      <motion.p
        key={value}
        initial={{ opacity: 0.6, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={`transform-gpu font-mono text-3xl font-bold tabular-nums will-change-transform ${valueClassName}`}
      >
        {value}
      </motion.p>
    </div>
  );
}

export function SequenceHud({
  currentRound,
  maxSequenceRecord,
  balance,
  phaseLabel,
}: SequenceHudProps) {
  return (
    <div className='mb-8 flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-between'>
      <div className='grid flex-1 grid-cols-2 gap-3 sm:gap-4'>
        <HudIndicator
          label='Раунд'
          value={currentRound}
          valueClassName='text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.45)]'
        />
        <HudIndicator
          label='Личный рекорд'
          value={maxSequenceRecord}
          valueClassName='text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.45)]'
        />
      </div>

      <div className='relative overflow-hidden rounded-xl border border-emerald-500/15 bg-zinc-950/60 px-5 py-3 backdrop-blur-sm lg:min-w-[200px]'>
        <div
          className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_70%)]'
          aria-hidden
        />
        <p className='font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500'>
          Баланс
        </p>
        <p className='mt-0.5 flex flex-wrap items-baseline gap-x-1.5'>
          <NumberTicker
            value={balance}
            className='transform-gpu font-mono text-2xl font-bold text-zinc-100 will-change-transform sm:text-3xl'
          />
          <span className='font-mono text-sm text-zinc-500'>бонусов</span>
        </p>
        <motion.p
          key={phaseLabel}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className='mt-2 font-mono text-[11px] uppercase tracking-wider text-emerald-500/80'
        >
          {phaseLabel}
        </motion.p>
      </div>
    </div>
  );
}
