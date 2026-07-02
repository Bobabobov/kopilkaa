'use client';

import { motion } from 'framer-motion';
import type { BonusGeneratorRunResult } from '@/lib/games/bonusGenerator';
import {
  formatBonusDelta,
  GENERATOR_OUTCOME_MESSAGES,
  GENERATOR_OUTCOME_TITLES,
} from '@/lib/games/bonusGeneratorDisplay';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { BonusGeneratorAnimatedReward } from './BonusGeneratorAnimatedReward';

interface BonusGeneratorResultPanelProps {
  result: BonusGeneratorRunResult;
  variant?: 'card' | 'core';
}

export function BonusGeneratorResultPanel({
  result,
  variant = 'card',
}: BonusGeneratorResultPanelProps) {
  const title = GENERATOR_OUTCOME_TITLES[result.label];
  const message = GENERATOR_OUTCOME_MESSAGES[result.label];
  const isPositive = result.reward > 0;

  if (variant === 'core') {
    return (
      <motion.div
        className='relative z-10 mt-4 w-full max-w-sm px-1'
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.12 }}
      >
        {result.isMegaBonus && (
          <motion.div
            className='pointer-events-none absolute -inset-x-4 -top-4 h-20 bg-gradient-to-b from-amber-400/25 to-transparent'
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <div className='relative text-center'>
          <p
            className={cn(
              'text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 sm:text-sm',
              result.isMegaBonus && 'text-amber-400',
            )}
          >
            {title}
          </p>
          {isPositive ? (
            <p
              className={cn(
                'mt-2 text-3xl tabular-nums sm:text-4xl',
                result.isMegaBonus && 'animate-pulse',
              )}
            >
              <span className='bg-gradient-to-r from-amber-400 via-yellow-200 to-orange-500 bg-clip-text font-extrabold text-transparent'>
                <BonusGeneratorAnimatedReward value={result.reward} />
              </span>
              <span className='ml-2 text-base font-semibold text-zinc-400 sm:text-lg'>
                бонусов
              </span>
            </p>
          ) : (
            <p className='mt-2 text-3xl font-black tabular-nums text-zinc-100 sm:text-4xl'>
              <BonusGeneratorAnimatedReward value={result.reward} />
              <span className='ml-2 text-base font-semibold text-zinc-400 sm:text-lg'>
                бонусов
              </span>
            </p>
          )}
          <p className='mt-2 text-xs text-zinc-400 sm:text-sm'>{message}</p>
        </div>

        <div className='mt-4 grid grid-cols-3 gap-2'>
          <div className='rounded-xl border border-emerald-500/10 bg-zinc-900/50 px-2 py-2.5 text-center backdrop-blur-sm sm:px-3 sm:py-3'>
            <p className='text-[10px] uppercase tracking-wide text-zinc-500 sm:text-xs'>
              Списано
            </p>
            <p className='mt-1 text-base font-bold text-zinc-100 sm:text-lg'>
              −{result.cost}
            </p>
          </div>
          <div className='rounded-xl border border-emerald-500/10 bg-zinc-900/50 px-2 py-2.5 text-center backdrop-blur-sm sm:px-3 sm:py-3'>
            <p className='text-[10px] uppercase tracking-wide text-zinc-500 sm:text-xs'>
              Итог
            </p>
            <p
              className={cn(
                'mt-1 text-base font-bold sm:text-lg',
                result.netChange >= 0 ? 'text-amber-400' : 'text-zinc-100',
              )}
            >
              {formatBonusDelta(result.netChange)}
            </p>
          </div>
          <div className='rounded-xl border border-emerald-500/10 bg-zinc-900/50 px-2 py-2.5 text-center backdrop-blur-sm sm:px-3 sm:py-3'>
            <p className='text-[10px] uppercase tracking-wide text-zinc-500 sm:text-xs'>
              Баланс
            </p>
            <p className='mt-1 text-base font-bold text-zinc-100 sm:text-lg'>
              {result.balanceAfter}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Card
        variant='darkGlass'
        padding='md'
        className={cn(
          'overflow-hidden border-white/[0.08]',
          result.isMegaBonus &&
            'border-[#f9bc60]/40 shadow-[0_0_30px_rgba(249,188,96,0.18)]',
          !result.isMegaBonus &&
            isPositive &&
            'border-[#f9bc60]/20 shadow-[0_0_20px_rgba(249,188,96,0.08)]',
        )}
      >
        {result.isMegaBonus && (
          <>
            <div className='pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f9bc60]/15 to-transparent' />
            <motion.div
              className='pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(249,188,96,0.12)_50%,transparent_60%)]'
              initial={{ x: '-120%' }}
              animate={{ x: '120%' }}
              transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.2 }}
            />
          </>
        )}

        <div className='relative text-center'>
          <p
            className={cn(
              'text-sm font-semibold uppercase tracking-[0.18em] text-[#abd1c6]',
              result.isMegaBonus && 'text-[#f9bc60]',
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              'mt-3 text-4xl font-black tabular-nums text-[#fffffe] sm:text-5xl',
              result.reward > 0 && 'text-[#f9bc60]',
            )}
          >
            <BonusGeneratorAnimatedReward value={result.reward} />
            <span className='ml-2 text-lg font-semibold text-[#abd1c6] sm:text-xl'>
              бонусов
            </span>
          </p>
          <p className='mt-3 text-sm text-[#abd1c6] sm:text-base'>{message}</p>
        </div>

        <div className='mt-6 grid gap-3 sm:grid-cols-3'>
          <div className='rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center'>
            <p className='text-xs uppercase tracking-wide text-[#abd1c6]/80'>
              Списано
            </p>
            <p className='mt-1 text-lg font-bold text-[#fffffe]'>
              −{result.cost}
            </p>
          </div>
          <div className='rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center'>
            <p className='text-xs uppercase tracking-wide text-[#abd1c6]/80'>
              Итог
            </p>
            <p
              className={cn(
                'mt-1 text-lg font-bold',
                result.netChange >= 0 ? 'text-[#f9bc60]' : 'text-[#fffffe]',
              )}
            >
              {formatBonusDelta(result.netChange)}
            </p>
          </div>
          <div className='rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center'>
            <p className='text-xs uppercase tracking-wide text-[#abd1c6]/80'>
              Баланс
            </p>
            <p className='mt-1 text-lg font-bold text-[#fffffe]'>
              {result.balanceAfter}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
