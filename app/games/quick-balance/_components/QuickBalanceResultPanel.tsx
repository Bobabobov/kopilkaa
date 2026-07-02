'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { QuickBalanceVerifyResult } from '@/lib/games/quickBalance';
import { ROUNDS_IN_SERIES, TIME_LIMIT_MS } from '@/lib/games/quickBalance';
import { celebrateQuickBalanceWin } from '@/lib/games/quickBalanceConfetti';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { cn } from '@/lib/utils';

interface QuickBalanceResultPanelProps {
  result: QuickBalanceVerifyResult;
  balance: number;
  onPlayAgain: () => void;
}

function getLossMeta(reason: QuickBalanceVerifyResult['reason']) {
  switch (reason) {
    case 'timeout':
      return {
        title: 'Время вышло',
        hint: `${(TIME_LIMIT_MS / 1000).toFixed(1)} секунды на сравнение — серия сгорела. Ставка списана.`,
        icon: 'clock' as const,
      };
    case 'wrong_answer':
      return {
        title: 'Неверный ответ',
        hint: 'Бывает! Вы уже ближе к цели — в следующий раз точно получится.',
        icon: 'x' as const,
      };
    default:
      return {
        title: 'Сессия не найдена',
        hint: 'Запустите «Быстрый баланс» заново.',
        icon: 'x' as const,
      };
  }
}

export function QuickBalanceResultPanel({
  result,
  balance,
  onPlayAgain,
}: QuickBalanceResultPanelProps) {
  useEffect(() => {
    if (result.won && result.reward > 0) {
      celebrateQuickBalanceWin(result.reward);
    }
  }, [result.won, result.reward]);

  if (result.won) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className='flex flex-1 flex-col items-center justify-center gap-6 py-4 text-center'
      >
        <div className='relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-400/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_40px_rgba(52,211,153,0.35)]'>
          <LucideIcons.Trophy size='lg' />
        </div>

        <div>
          <p className='text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-500'>
            // series_clear
          </p>
          <p className='mt-2 font-mono text-3xl font-bold text-zinc-100'>
            Серия из {ROUNDS_IN_SERIES}!
          </p>
        </div>

        <div className='inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-5 py-3'>
          <LucideIcons.Coins size='md' className='text-emerald-400' />
          <span className='font-mono text-3xl font-bold text-emerald-400'>
            +{result.reward}
          </span>
          <span className='text-sm text-emerald-400/70'>бонусов</span>
        </div>

        <div className='rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3'>
          <p className='text-[10px] uppercase tracking-wide text-zinc-600'>Баланс</p>
          <p className='mt-0.5 font-mono text-lg font-bold text-emerald-400'>
            {result.balanceAfter ?? balance}
          </p>
        </div>

        <motion.button
          type='button'
          onClick={onPlayAgain}
          whileTap={{ scale: 0.97 }}
          className='inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border-b-4 border-emerald-700 bg-gradient-to-b from-emerald-500 to-emerald-600 px-6 py-3.5 font-bold text-white active:translate-y-[4px] active:border-b-0'
        >
          <LucideIcons.RefreshCw size='sm' />
          Играть снова
        </motion.button>
      </motion.div>
    );
  }

  const loss = getLossMeta(result.reason);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className='flex flex-1 flex-col items-center justify-center gap-6 py-4 text-center'
    >
      <div
        className={cn(
          'flex h-20 w-20 items-center justify-center rounded-full border-2',
          'border-red-400/30 bg-red-500/10 text-red-300',
        )}
      >
        {loss.icon === 'clock' ? (
          <LucideIcons.Clock size='lg' />
        ) : (
          <LucideIcons.X size='lg' />
        )}
      </div>

      <div>
        <p className='text-[10px] font-bold uppercase tracking-[0.25em] text-red-400/80'>
          // series_burned
        </p>
        <p className='mt-2 text-2xl font-bold text-zinc-100'>{loss.title}</p>
        <p className='mx-auto mt-2 max-w-sm text-sm text-zinc-500'>{loss.hint}</p>
        {result.progress > 0 && (
          <p className='mt-3 font-mono text-xs text-zinc-600'>
            Верно: {result.progress} из {ROUNDS_IN_SERIES}
          </p>
        )}
      </div>

      <motion.button
        type='button'
        onClick={onPlayAgain}
        whileTap={{ scale: 0.97 }}
        className='inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border border-fuchsia-500/30 bg-zinc-950/80 px-6 py-3.5 font-semibold text-fuchsia-400 hover:bg-fuchsia-500/10'
      >
        <LucideIcons.RefreshCw size='sm' />
        Попробовать снова
      </motion.button>
    </motion.div>
  );
}
