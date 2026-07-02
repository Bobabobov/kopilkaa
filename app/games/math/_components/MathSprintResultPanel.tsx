'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MATH_SPRINT_DIFFICULTIES,
  type MathSprintAnswerResult,
} from '@/lib/games/shared/mathSprint';
import { celebrateMathSprintWin } from '@/lib/games/mathSprintConfetti';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { cn } from '@/lib/utils';

interface MathSprintResultPanelProps {
  result: MathSprintAnswerResult;
  balance: number;
  onPlayAgain: () => void;
}

function getLossMeta(reason: MathSprintAnswerResult['reason']) {
  switch (reason) {
    case 'timeout':
      return {
        title: 'Время истекло',
        hint: 'Таймер обнулился. Стоимость запуска уже списана — перезапусти ядро.',
        icon: 'clock' as const,
      };
    case 'wrong_answer':
      return {
        title: 'Неверный ответ',
        hint: 'Сигнал сбойнул. Следующий пример будет другим.',
        icon: 'x' as const,
      };
    default:
      return {
        title: 'Сессия не найдена',
        hint: 'Активная игра не найдена или истекла. Запусти спринт заново.',
        icon: 'x' as const,
      };
  }
}

export function MathSprintResultPanel({
  result,
  balance,
  onPlayAgain,
}: MathSprintResultPanelProps) {
  const difficultyLabel =
    result.difficulty !== null
      ? MATH_SPRINT_DIFFICULTIES[result.difficulty].label
      : null;

  useEffect(() => {
    if (result.won && result.reward > 0) {
      celebrateMathSprintWin(result.reward);
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
            className='pointer-events-none absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl'
            aria-hidden
          />
          <div className='relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-400/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_40px_rgba(16,185,129,0.3)]'>
            <LucideIcons.Trophy size='lg' />
          </div>
        </div>

        <div>
          <p className='text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-500'>
            // mission_success
          </p>
          <p className='mt-2 font-mono text-3xl font-bold text-zinc-100'>
            Молниеносно!
          </p>
        </div>

        <div className='inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-5 py-3'>
          <LucideIcons.Coins size='md' className='text-emerald-400' />
          <span className='font-mono text-3xl font-bold text-emerald-400'>
            +{result.reward}
          </span>
          <span className='text-sm text-emerald-400/70'>бонусов</span>
        </div>

        <div className='grid w-full max-w-sm grid-cols-2 gap-2 text-left'>
          {result.reactionMs !== null && (
            <div className='rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5'>
              <p className='text-[10px] uppercase tracking-wide text-zinc-600'>
                Реакция
              </p>
              <p className='mt-0.5 font-mono text-lg font-bold text-zinc-100'>
                {result.reactionMs} мс
              </p>
            </div>
          )}
          <div className='rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5'>
            <p className='text-[10px] uppercase tracking-wide text-zinc-600'>
              Баланс
            </p>
            <p className='mt-0.5 font-mono text-lg font-bold text-emerald-400'>
              {result.balanceAfter ?? balance}
            </p>
          </div>
          {difficultyLabel && (
            <div className='col-span-2 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5'>
              <p className='text-[10px] uppercase tracking-wide text-zinc-600'>
                Уровень
              </p>
              <p className='mt-0.5 text-base font-bold text-zinc-100'>
                {difficultyLabel}
              </p>
            </div>
          )}
        </div>

        <motion.button
          type='button'
          onClick={onPlayAgain}
          whileTap={{ scale: 0.97 }}
          className='inline-flex w-full max-w-sm transform-gpu items-center justify-center gap-2 rounded-xl border-b-4 border-emerald-700 bg-gradient-to-b from-emerald-500 to-emerald-600 px-6 py-3.5 font-bold text-white will-change-transform active:translate-y-[4px] active:border-b-0'
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
          // mission_failed
        </p>
        <p className='mt-2 text-2xl font-bold text-zinc-100'>{loss.title}</p>
        <p className='mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-500'>
          {loss.hint}
        </p>
      </div>

      <div className='grid w-full max-w-sm grid-cols-2 gap-2 text-left'>
        {result.reactionMs !== null && result.reason !== 'no_active_session' && (
          <div className='rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5'>
            <p className='text-[10px] uppercase tracking-wide text-zinc-600'>
              Реакция
            </p>
            <p className='mt-0.5 font-mono text-lg font-bold text-zinc-100'>
              {result.reactionMs} мс
            </p>
          </div>
        )}
        <div className='rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5'>
          <p className='text-[10px] uppercase tracking-wide text-zinc-600'>
            Награда
          </p>
          <p className='mt-0.5 text-lg font-bold text-red-400/90'>0</p>
        </div>
        {difficultyLabel && (
          <div className='col-span-2 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5'>
            <p className='text-[10px] uppercase tracking-wide text-zinc-600'>
              Уровень
            </p>
            <p className='mt-0.5 text-base font-bold text-zinc-100'>
              {difficultyLabel}
            </p>
          </div>
        )}
      </div>

      <motion.button
        type='button'
        onClick={onPlayAgain}
        whileTap={{ scale: 0.97 }}
        className='inline-flex w-full max-w-sm transform-gpu items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-zinc-950/80 px-6 py-3.5 font-semibold text-emerald-400 will-change-transform hover:bg-emerald-500/10'
      >
        <LucideIcons.RefreshCw size='sm' />
        Попробовать снова
      </motion.button>
    </motion.div>
  );
}
