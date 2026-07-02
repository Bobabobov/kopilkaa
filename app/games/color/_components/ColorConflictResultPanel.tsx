'use client';

import { useEffect } from 'react';
import {
  COLOR_CONFLICT_DIFFICULTIES,
  type ColorConflictAnswerResult,
} from '@/lib/games/colorConflict';
import { celebrateColorConflictWin } from '@/lib/games/colorConflictConfetti';
import { LucideIcons } from '@/components/ui/LucideIcons';

interface ColorConflictResultPanelProps {
  result: ColorConflictAnswerResult;
  balance: number;
  onPlayAgain: () => void;
}

function getLossMeta(reason: ColorConflictAnswerResult['reason']) {
  switch (reason) {
    case 'timeout':
      return {
        title: 'Время вышло',
        hint: 'Таймер обнулил серию. Стоимость входа уже списана — попробуй снова.',
        icon: 'clock' as const,
      };
    case 'wrong_answer':
      return {
        title: 'Неверный цвет',
        hint: 'Мозг читает слово быстрее, чем видит краску. Смотри на цвет надписи — в следующий раз получится.',
        icon: 'eye' as const,
      };
    default:
      return {
        title: 'Серия прервана',
        hint: 'Активная сессия не найдена или истекла. Запусти игру заново.',
        icon: 'x' as const,
      };
  }
}

export function ColorConflictResultPanel({
  result,
  balance,
  onPlayAgain,
}: ColorConflictResultPanelProps) {
  const difficultyLabel =
    result.difficulty !== null
      ? COLOR_CONFLICT_DIFFICULTIES[result.difficulty].label
      : null;

  useEffect(() => {
    if (result.won && result.reward > 0) {
      celebrateColorConflictWin(result.reward);
    }
  }, [result.won, result.reward]);

  if (result.won) {
    return (
      <div className='animate-in fade-in-0 zoom-in-95 py-4 duration-500 fill-mode-backwards sm:py-6'>
        <div className='relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-emerald-950/30 px-5 py-8 text-center backdrop-blur-sm sm:px-8 sm:py-10'>
          <div
            className='pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/15 blur-3xl'
            aria-hidden
          />

          <div className='relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-400/40 bg-emerald-500/20 text-emerald-300 shadow-[0_0_48px_rgba(16,185,129,0.35)] sm:h-24 sm:w-24'>
            <LucideIcons.Trophy size='lg' />
          </div>

          <p className='relative text-xs font-bold uppercase tracking-[0.2em] text-emerald-400/90'>
            Серия пройдена
          </p>
          <p className='relative mt-3 text-3xl font-bold text-zinc-100 sm:text-4xl'>
            Отличная работа!
          </p>

          <div className='relative mx-auto mt-6 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-5 py-3'>
            <LucideIcons.Coins size='md' className='text-emerald-400' />
            <span className='font-mono text-3xl font-bold text-emerald-400 sm:text-4xl'>
              +{result.reward}
            </span>
            <span className='text-sm font-semibold text-emerald-400/80'>бонусов</span>
          </div>

          <div className='relative mt-6 grid grid-cols-2 gap-2.5 text-left sm:gap-3'>
            <div className='rounded-xl border border-emerald-500/10 bg-zinc-900/50 px-3 py-2.5 sm:px-4 sm:py-3'>
              <p className='text-[10px] uppercase tracking-wide text-zinc-500 sm:text-xs'>
                Раундов
              </p>
              <p className='mt-0.5 text-lg font-bold text-zinc-100 sm:text-xl'>
                {result.seriesTarget} / {result.seriesTarget}
              </p>
            </div>
            <div className='rounded-xl border border-emerald-500/10 bg-zinc-900/50 px-3 py-2.5 sm:px-4 sm:py-3'>
              <p className='text-[10px] uppercase tracking-wide text-zinc-500 sm:text-xs'>
                Баланс
              </p>
              <p className='mt-0.5 font-mono text-lg font-bold text-emerald-400 sm:text-xl'>
                {result.balanceAfter ?? balance}
              </p>
            </div>
            {difficultyLabel && (
              <div className='col-span-2 rounded-xl border border-emerald-500/10 bg-zinc-900/50 px-3 py-2.5 sm:px-4 sm:py-3'>
                <p className='text-[10px] uppercase tracking-wide text-zinc-500 sm:text-xs'>
                  Уровень
                </p>
                <p className='mt-0.5 text-base font-bold text-zinc-100 sm:text-lg'>
                  {difficultyLabel}
                </p>
              </div>
            )}
          </div>

          <p className='relative mt-5 text-sm text-zinc-400'>
            Все {result.seriesTarget} раундов без ошибок — награда начислена на счёт.
          </p>
        </div>

        <button
          type='button'
          onClick={onPlayAgain}
          className='mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3.5 text-base font-bold tracking-wide text-white shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-400 hover:to-teal-500 active:scale-95 sm:w-auto sm:px-8'
        >
          <LucideIcons.RefreshCw size='sm' />
          Играть снова
        </button>
      </div>
    );
  }

  const loss = getLossMeta(result.reason);

  return (
    <div className='animate-in fade-in-0 slide-in-from-bottom-3 py-4 duration-400 fill-mode-backwards sm:py-6'>
      <div className='relative overflow-hidden rounded-2xl border border-red-500/20 bg-red-950/20 px-5 py-8 text-center backdrop-blur-sm sm:px-8 sm:py-10'>
        <div className='relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-400/30 bg-red-500/15 text-red-300 shadow-[0_0_40px_rgba(239,68,68,0.15)] sm:h-24 sm:w-24'>
          {loss.icon === 'clock' && <LucideIcons.Clock size='lg' />}
          {loss.icon === 'eye' && <LucideIcons.Eye size='lg' />}
          {loss.icon === 'x' && <LucideIcons.X size='lg' />}
        </div>

        <p className='text-xs font-bold uppercase tracking-[0.2em] text-red-300/80'>
          Серия сброшена
        </p>
        <p className='mt-3 text-2xl font-bold text-zinc-100 sm:text-3xl'>
          {loss.title}
        </p>
        <p className='mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-400'>
          {loss.hint}
        </p>

        <div className='mt-6 grid grid-cols-2 gap-2.5 text-left sm:gap-3'>
          <div className='rounded-xl border border-emerald-500/10 bg-zinc-900/50 px-3 py-2.5 sm:px-4 sm:py-3'>
            <p className='text-[10px] uppercase tracking-wide text-zinc-500 sm:text-xs'>
              Прогресс
            </p>
            <p className='mt-0.5 text-lg font-bold text-zinc-100 sm:text-xl'>
              {result.currentStreak}{' '}
              <span className='text-zinc-500'>/ {result.seriesTarget}</span>
            </p>
          </div>
          <div className='rounded-xl border border-emerald-500/10 bg-zinc-900/50 px-3 py-2.5 sm:px-4 sm:py-3'>
            <p className='text-[10px] uppercase tracking-wide text-zinc-500 sm:text-xs'>
              Награда
            </p>
            <p className='mt-0.5 text-lg font-bold text-red-400/90 sm:text-xl'>0</p>
          </div>
          {difficultyLabel && (
            <div className='col-span-2 rounded-xl border border-emerald-500/10 bg-zinc-900/50 px-3 py-2.5 sm:px-4 sm:py-3'>
              <p className='text-[10px] uppercase tracking-wide text-zinc-500 sm:text-xs'>
                Уровень
              </p>
              <p className='mt-0.5 text-base font-bold text-zinc-100 sm:text-lg'>
                {difficultyLabel}
              </p>
            </div>
          )}
        </div>

        {result.reactionMs !== null && result.reason !== 'no_active_session' && (
          <p className='mt-4 text-xs text-zinc-500'>
            Время реакции:{' '}
            <span className='font-mono text-sm text-zinc-200'>
              {result.reactionMs} мс
            </span>
          </p>
        )}
      </div>

      <button
        type='button'
        onClick={onPlayAgain}
        className='mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-6 py-3.5 text-base font-semibold text-emerald-400 transition hover:bg-emerald-500/10 sm:w-auto sm:px-8'
      >
        <LucideIcons.RefreshCw size='sm' />
        Попробовать снова
      </button>
    </div>
  );
}
