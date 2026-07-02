'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import {
  DAILY_ATTEMPT_LIMIT,
  FLASH_INTERVAL_MS,
  GAME_COST,
  type SequenceVerifyResult,
} from '@/lib/games/sequenceGame';
import { getMessageFromApiJson } from '@/lib/api/parseApiError';
import { invalidateProfileCache } from '@/hooks/profile/useProfileDashboard';
import { GameLeaderboard } from '@/app/games/_components/GameLeaderboard';
import { GamePurchaseAttemptButton } from '@/app/games/_components/GamePurchaseAttemptButton';
import { GamesFullscreenScrollShell } from '@/app/games/_components/GamesFullscreenScrollShell';
import { useGameAttemptPurchase } from '@/hooks/games/useGameAttemptPurchase';
import { useGameLeaderboard } from '@/hooks/games/useGameLeaderboard';
import { SequenceGrid } from './SequenceGrid';
import { SequenceHud } from './SequenceHud';
import { SequenceStartButton } from './SequenceStartButton';
import { useFeedbackMeaningfulOnResult } from '@/hooks/feedback/useFeedbackMeaningfulOnResult';

type SequencePhase =
  | 'idle'
  | 'starting'
  | 'playback'
  | 'input'
  | 'verifying'
  | 'result';

interface StartApiResponse {
  success: boolean;
  data: {
    sequence: number[];
    currentRound: number;
    serverStartTime: number;
    timeLimitMs: number;
    balanceAfter: number;
    maxSequenceRecord: number;
    dailyAttemptsUsed: number;
    dailyAttemptsLeft: number;
    purchasedAttemptsAvailable: number;
  };
}

interface VerifyApiResponse {
  success: boolean;
  data: SequenceVerifyResult;
}

interface SequencePageClientProps {
  initialBalance: number;
  initialMaxRecord: number;
  initialDailyAttemptsUsed: number;
  initialPurchasedAttemptsAvailable: number;
  initialDailyAttemptPurchasesUsed: number;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getPhaseLabel(phase: SequencePhase): string {
  switch (phase) {
    case 'playback':
      return 'Запоминайте последовательность…';
    case 'input':
      return 'Ваш ход — повторите цепочку';
    case 'verifying':
      return 'Проверка…';
    case 'result':
      return 'Игра завершена';
    case 'starting':
      return 'Запуск сессии…';
    default:
      return 'Готовы к запуску';
  }
}

export default function SequencePageClient({
  initialBalance,
  initialMaxRecord,
  initialDailyAttemptsUsed,
  initialPurchasedAttemptsAvailable,
  initialDailyAttemptPurchasesUsed,
}: SequencePageClientProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [maxRecord, setMaxRecord] = useState(initialMaxRecord);
  const [dailyAttemptsUsed, setDailyAttemptsUsed] = useState(
    initialDailyAttemptsUsed,
  );
  const [phase, setPhase] = useState<SequencePhase>('idle');
  useFeedbackMeaningfulOnResult(phase === 'result');
  const [currentRound, setCurrentRound] = useState(1);
  const [sequence, setSequence] = useState<number[]>([]);
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [playerClicks, setPlayerClicks] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SequenceVerifyResult | null>(null);
  const {
    entries: leaderboard,
    isLoading: leaderboardLoading,
    meta: leaderboardMeta,
  } = useGameLeaderboard('sequence');

  const serverStartTimeRef = useRef<number | null>(null);
  const timeLimitMsRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  const dailyAttemptsLeft = Math.max(0, DAILY_ATTEMPT_LIMIT - dailyAttemptsUsed);

  const {
    purchasedAttemptsAvailable,
    setPurchasedAttemptsAvailable,
    isPurchasing,
    canAffordPurchase,
    canPurchaseAttempt,
    hasAttemptSlot,
    handlePurchaseAttempt,
    extraAttemptCost,
    dailyAttemptPurchasesRemaining,
  } = useGameAttemptPurchase({
    purchaseUrl: '/api/games/sequence/purchase-attempt',
    initialPurchasedAttemptsAvailable,
    initialDailyAttemptPurchasesUsed,
    dailyAttemptsLeft,
    balance,
    phase,
    isSubmitting: phase === 'starting' || phase === 'verifying',
    onError: setError,
    onBalanceChange: setBalance,
  });

  const canAfford = balance >= GAME_COST;
  const canStart =
    phase === 'idle' &&
    canAfford &&
    hasAttemptSlot &&
    !isPurchasing;

  const clearInputTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const playSequence = useCallback(async (cells: number[]) => {
    setPhase('playback');
    setActiveCell(null);
    setPlayerClicks([]);

    for (const cellIndex of cells) {
      if (!isMountedRef.current) {
        return;
      }

      setActiveCell(cellIndex);
      await delay(FLASH_INTERVAL_MS);
      setActiveCell(null);
      await delay(80);
    }

    if (isMountedRef.current) {
      setPhase('input');
    }
  }, []);

  const submitClicks = useCallback(
    async (clicks: number[]) => {
      clearInputTimeout();
      setPhase('verifying');

      try {
        const response = await fetch('/api/games/sequence/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({ clicks }),
        });

        const raw = await response.json().catch(() => null);
        const payload = raw as VerifyApiResponse | null;

        if (!response.ok || !payload?.data) {
          throw new Error(
            getMessageFromApiJson(raw, 'Не удалось проверить последовательность'),
          );
        }

        const verifyResult = payload.data;
        setMaxRecord(verifyResult.maxSequenceRecord);

        if (verifyResult.gameOver) {
          if (verifyResult.balanceAfter !== null) {
            setBalance(verifyResult.balanceAfter);
            invalidateProfileCache();
          }

          setResult(verifyResult);
          setPhase('result');
          return;
        }

        if (
          verifyResult.nextSequence &&
          verifyResult.serverStartTime &&
          verifyResult.timeLimitMs
        ) {
          setSequence(verifyResult.nextSequence);
          setCurrentRound(verifyResult.currentRound);
          serverStartTimeRef.current = verifyResult.serverStartTime;
          timeLimitMsRef.current = verifyResult.timeLimitMs;
          await playSequence(verifyResult.nextSequence);
        }
      } catch (verifyError) {
        setError(
          verifyError instanceof Error
            ? verifyError.message
            : 'Ошибка проверки последовательности',
        );
        setPhase('idle');
      }
    },
    [clearInputTimeout, playSequence],
  );

  const scheduleInputTimeout = useCallback(() => {
    clearInputTimeout();

    const serverStart = serverStartTimeRef.current;
    const limitMs = timeLimitMsRef.current;

    if (serverStart === null || limitMs <= 0) {
      return;
    }

    const remaining = serverStart + limitMs - Date.now();

    timeoutRef.current = window.setTimeout(() => {
      void submitClicks([]);
    }, Math.max(0, remaining));
  }, [clearInputTimeout, submitClicks]);

  useEffect(() => {
    if (phase === 'input') {
      scheduleInputTimeout();
    }

    return () => {
      clearInputTimeout();
    };
  }, [phase, sequence, scheduleInputTimeout, clearInputTimeout]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      clearInputTimeout();
    };
  }, [clearInputTimeout]);

  const handleStart = useCallback(async () => {
    if (!canStart) {
      return;
    }

    setError(null);
    setResult(null);
    setPhase('starting');

    try {
      const response = await fetch('/api/games/sequence/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      const raw = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(raw, 'Не удалось запустить игру'),
        );
      }

      const payload = raw as StartApiResponse;

      setBalance(payload.data.balanceAfter);
      setMaxRecord(payload.data.maxSequenceRecord);
      setDailyAttemptsUsed(payload.data.dailyAttemptsUsed);
      setPurchasedAttemptsAvailable(payload.data.purchasedAttemptsAvailable);
      setSequence(payload.data.sequence);
      setCurrentRound(payload.data.currentRound);
      serverStartTimeRef.current = payload.data.serverStartTime;
      timeLimitMsRef.current = payload.data.timeLimitMs;
      invalidateProfileCache();

      await playSequence(payload.data.sequence);
    } catch (startError) {
      setPhase('idle');
      setError(
        startError instanceof Error
          ? startError.message
          : 'Не удалось запустить игру',
      );
    }
  }, [canStart, playSequence, setPurchasedAttemptsAvailable]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (phase !== 'input') {
        return;
      }

      const nextClicks = [...playerClicks, index];
      setPlayerClicks(nextClicks);
      setActiveCell(index);

      window.setTimeout(() => {
        setActiveCell((current) => (current === index ? null : current));
      }, 150);

      if (nextClicks.length >= sequence.length) {
        void submitClicks(nextClicks);
      }
    },
    [phase, playerClicks, sequence.length, submitClicks],
  );

  const handleReset = useCallback(() => {
    clearInputTimeout();
    setPhase('idle');
    setSequence([]);
    setPlayerClicks([]);
    setActiveCell(null);
    setResult(null);
    setError(null);
    serverStartTimeRef.current = null;
    timeLimitMsRef.current = 0;
    setCurrentRound(1);
  }, [clearInputTimeout]);

  const inputEnabled = phase === 'input';
  const gridDisabled = phase === 'verifying' || phase === 'starting';

  return (
    <div className='relative flex h-full min-h-0 w-full flex-col bg-zinc-950'>
      <div
        className='pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:48px_48px]'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.14),transparent_55%)]'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,78,59,0.25),transparent_45%)]'
        aria-hidden
      />

      <GamesFullscreenScrollShell>
      <div className='relative z-10 mx-auto max-w-7xl px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8'>
        <Link
          href='/games'
          className='mb-8 inline-flex transform-gpu items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-500 transition-colors will-change-transform hover:text-emerald-400'
        >
          <ArrowLeft className='h-4 w-4' />
          К каталогу игр
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className='grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8'
        >
          <section className='lg:col-span-2'>
            <div className='rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-8'>
              <header className='mb-8 border-b border-zinc-800/80 pb-6'>
                <p className='mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-500/60'>
                  Memory Protocol v3
                </p>
                <h1 className='text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl'>
                  Секретная последовательность
                </h1>
                <p className='mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500'>
                  Simon Says на сетке 3×3 — запоминайте неоновые вспышки и
                  повторяйте цепочку. Каждый раунд длиннее на один шаг.
                </p>
              </header>

              <SequenceHud
                currentRound={currentRound}
                maxSequenceRecord={maxRecord}
                balance={balance}
                phaseLabel={getPhaseLabel(phase)}
              />

              <div className='my-8 flex justify-center'>
                <SequenceGrid
                  activeIndex={activeCell}
                  disabled={gridDisabled}
                  inputEnabled={inputEnabled}
                  onCellClick={handleCellClick}
                />
              </div>

              <AnimatePresence mode='wait'>
                {phase === 'result' && result && (
                  <motion.div
                    key='result'
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className='mx-auto max-w-lg rounded-2xl border border-emerald-500/20 bg-emerald-950/30 p-6 text-center backdrop-blur-sm'
                  >
                    <p className='font-mono text-lg font-bold uppercase tracking-wider text-zinc-100'>
                      {result.reason === 'success' ? 'Отлично!' : 'Игра окончена'}
                    </p>
                    <p className='mt-2 text-sm text-zinc-400'>
                      Достигнуто шагов:{' '}
                      <span className='font-mono text-xl font-bold text-emerald-400'>
                        {result.achievedSteps}
                      </span>
                    </p>
                    {result.reward > 0 && (
                      <p className='mt-2 font-mono text-2xl font-bold text-orange-400'>
                        +{result.reward} бонусов
                      </p>
                    )}
                    <button
                      type='button'
                      onClick={handleReset}
                      className='mt-5 transform-gpu rounded-xl border border-emerald-500/30 px-8 py-2.5 font-mono text-sm font-semibold uppercase tracking-wider text-emerald-400 transition-colors will-change-transform hover:bg-emerald-500/10'
                    >
                      Вернуться к старту
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {phase === 'idle' && (
                <div className='mt-8 flex flex-col items-center gap-4'>
                  <SequenceStartButton
                    disabled={!canStart}
                    cost={GAME_COST}
                    onClick={() => void handleStart()}
                  />

                  <GamePurchaseAttemptButton
                    visible={dailyAttemptsLeft <= 0}
                    disabled={!canPurchaseAttempt}
                    isPurchasing={isPurchasing}
                    canAffordPurchase={canAffordPurchase}
                    extraAttemptCost={extraAttemptCost}
                    purchasedAttemptsAvailable={purchasedAttemptsAvailable}
                    dailyAttemptPurchasesRemaining={dailyAttemptPurchasesRemaining}
                    onPurchase={() => void handlePurchaseAttempt()}
                  />

                  <p className='font-mono text-sm text-zinc-400'>
                    Осталось попыток:{' '}
                    <span className='font-bold text-emerald-400'>
                      {dailyAttemptsLeft}
                    </span>{' '}
                    из {DAILY_ATTEMPT_LIMIT}
                  </p>

                  {purchasedAttemptsAvailable > 0 && (
                    <p className='font-mono text-xs text-teal-400'>
                      Доп. попыток в резерве: {purchasedAttemptsAvailable}
                    </p>
                  )}

                  {!canAfford && (
                    <p className='text-sm text-orange-400'>
                      Недостаточно бонусов для старта
                    </p>
                  )}

                  {dailyAttemptsLeft <= 0 && purchasedAttemptsAvailable <= 0 && (
                    <p className='text-center text-sm text-orange-400'>
                      Суточный лимит исчерпан — купите доп. попытку за{' '}
                      {extraAttemptCost} бонусов
                    </p>
                  )}

                  <p className='max-w-md text-center text-xs text-zinc-500'>
                    Для честной игры нужен стабильный интернет — время ответа
                    проверяется на сервере с пинг-буфером +200 мс.
                  </p>
                </div>
              )}

              {(phase === 'starting' ||
                phase === 'playback' ||
                phase === 'input' ||
                phase === 'verifying') && (
                <div className='mt-6 flex justify-center'>
                  <button
                    type='button'
                    onClick={handleReset}
                    className='font-mono text-xs uppercase tracking-wider text-zinc-600 underline-offset-2 transition-colors hover:text-zinc-400 hover:underline'
                  >
                    Прервать сессию
                  </button>
                </div>
              )}

              {error && (
                <p
                  className='mt-4 text-center text-sm text-red-400'
                  role='alert'
                >
                  {error}
                </p>
              )}
            </div>
          </section>

          <div className='lg:col-span-1'>
            <GameLeaderboard
              entries={leaderboard}
              isLoading={leaderboardLoading}
              meta={leaderboardMeta}
            />
          </div>
        </motion.div>
      </div>
      </GamesFullscreenScrollShell>
    </div>
  );
}
