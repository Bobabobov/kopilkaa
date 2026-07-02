'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { OddNumberAnswerResult } from '@/lib/games/shared/oddNumberSchulte';
import { TARGET_COUNT, TIME_LIMIT_MS } from '@/lib/games/shared/oddNumberSchulte';
import { celebrateOddNumberWin } from '@/lib/games/oddNumberSchulteConfetti';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { cn } from '@/lib/utils';

interface OddNumberResultPanelProps {
  result: OddNumberAnswerResult;
  balance: number;
  onPlayAgain: () => void;
}

function getLossMeta(reason: OddNumberAnswerResult['reason']) {
  switch (reason) {
    case 'timeout':
      return {
        title: 'Время истекло',
        hint: `${TIME_LIMIT_MS / 1000} секунд на всю таблицу — не успели. Ставка уже списана.`,
        icon: 'clock' as const,
      };
    case 'wrong_answer':
      return {
        title: 'Не по порядку',
        hint: 'Нужно кликать строго от 1 до 16. Следующая сетка будет другой.',
        icon: 'x' as const,
      };
    default:
      return {
        title: 'Сессия не найдена',
        hint: 'Активная игра не найдена или истекла. Запустите заново.',
        icon: 'x' as const,
      };
  }
}

export function OddNumberResultPanel({
  result,
  balance,
  onPlayAgain,
}: OddNumberResultPanelProps) {
  useEffect(() => {
    if (result.won && result.reward > 0) {
      celebrateOddNumberWin(result.reward);
    }
  }, [result.won, result.reward]);

  if (result.won) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className='flex flex-1 flex-col items-center justify-center gap-6 py-4 text-center transform-gpu will-change-transform'
      >
        <div className='relative'>
          <div
            className='pointer-events-none absolute inset-0 rounded-full bg-sky-500/20 blur-2xl'
            aria-hidden
          />
          <div className='relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-sky-400/40 bg-sky-500/15 text-sky-300 shadow-[0_0_40px_rgba(56,189,248,0.3)]'>
            <LucideIcons.Trophy size='lg' />
          </div>
        </div>

        <div>
          <p className='text-[10px] font-bold uppercase tracking-[0.25em] text-sky-500'>
            // schulte_clear
          </p>
          <p className='mt-2 font-mono text-3xl font-bold text-zinc-100'>
            Все 16!
          </p>
        </div>

        <div className='inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-950/40 px-5 py-3'>
          <LucideIcons.Coins size='md' className='text-sky-400' />
          <span className='font-mono text-3xl font-bold text-sky-400'>
            +{result.reward}
          </span>
          <span className='text-sm text-sky-400/70'>бонусов</span>
        </div>

        <div className='grid w-full max-w-sm grid-cols-2 gap-2 text-left'>
          {result.reactionMs !== null && (
            <div className='rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5'>
              <p className='text-[10px] uppercase tracking-wide text-zinc-600'>
                Время
              </p>
              <p className='mt-0.5 font-mono text-lg font-bold text-zinc-100'>
                {(result.reactionMs / 1000).toFixed(2)} с
              </p>
            </div>
          )}
          <div className='rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5'>
            <p className='text-[10px] uppercase tracking-wide text-zinc-600'>
              Баланс
            </p>
            <p className='mt-0.5 font-mono text-lg font-bold text-sky-400'>
              {result.balanceAfter ?? balance}
            </p>
          </div>
        </div>

        <motion.button
          type='button'
          onClick={onPlayAgain}
          whileTap={{ scale: 0.97 }}
          className='inline-flex w-full max-w-sm transform-gpu items-center justify-center gap-2 rounded-xl border-b-4 border-sky-700 bg-gradient-to-b from-sky-500 to-sky-600 px-6 py-3.5 font-bold text-white will-change-transform active:translate-y-[4px] active:border-b-0'
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
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className='flex flex-1 flex-col items-center justify-center gap-6 py-4 text-center transform-gpu will-change-transform'
    >
      <div
        className={cn(
          'flex h-20 w-20 items-center justify-center rounded-full border-2',
          'border-red-400/30 bg-red-500/10 text-red-300 shadow-[0_0_30px_rgba(239,68,68,0.12)]',
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
          // focus_lost
        </p>
        <p className='mt-2 text-2xl font-bold text-zinc-100'>{loss.title}</p>
        <p className='mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-500'>
          {loss.hint}
        </p>
        {result.progress > 0 && (
          <p className='mt-3 font-mono text-xs text-zinc-600'>
            Дошли до {result.progress} из {TARGET_COUNT}
          </p>
        )}
      </div>

      <motion.button
        type='button'
        onClick={onPlayAgain}
        whileTap={{ scale: 0.97 }}
        className='inline-flex w-full max-w-sm transform-gpu items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-zinc-950/80 px-6 py-3.5 font-semibold text-sky-400 will-change-transform hover:bg-sky-500/10'
      >
        <LucideIcons.RefreshCw size='sm' />
        Попробовать снова
      </motion.button>
    </motion.div>
  );
}
