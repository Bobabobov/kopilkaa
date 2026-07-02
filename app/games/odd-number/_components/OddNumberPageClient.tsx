'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  DAILY_ATTEMPT_LIMIT,
  GAME_COST,
  TARGET_COUNT,
  TIME_LIMIT_MS,
  WIN_REWARD,
  type OddNumberAnswerResult,
  type OddNumberCell,
} from '@/lib/games/oddNumberSchulte';
import { getMessageFromApiJson } from '@/lib/api/parseApiError';
import { invalidateProfileCache } from '@/hooks/profile/useProfileDashboard';
import { NumberTicker } from '@/app/games/_components/effects/NumberTicker';
import { GamePurchaseAttemptButton } from '@/app/games/_components/GamePurchaseAttemptButton';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { useGameAttemptPurchase } from '@/hooks/games/useGameAttemptPurchase';
import { cn } from '@/lib/utils';
import '@/app/games/_components/effects/gamesLobby.css';
import { OddNumberGrid } from './OddNumberGrid';
import { OddNumberResultPanel } from './OddNumberResultPanel';
import { useFeedbackMeaningfulOnResult } from '@/hooks/feedback/useFeedbackMeaningfulOnResult';

type OddNumberPhase = 'idle' | 'playing' | 'verifying' | 'result';

interface StartApiResponse {
  success: boolean;
  data: {
    cells: OddNumberCell[];
    timeLimitMs: number;
    balanceAfter: number;
    serverStartTime: number;
    dailyAttemptsUsed: number;
    dailyAttemptsLeft: number;
    purchasedAttemptsAvailable: number;
  };
}

interface VerifyApiResponse {
  success: boolean;
  data: OddNumberAnswerResult;
}

interface OddNumberPageClientProps {
  initialBalance: number;
  initialDailyAttemptsUsed: number;
  initialPurchasedAttemptsAvailable: number;
  initialDailyAttemptPurchasesUsed: number;
}

type BriefingIconName = 'Clock' | 'LayoutGrid' | 'Target';

const BRIEFING_ICON_MAP = {
  Clock: LucideIcons.Clock,
  LayoutGrid: LucideIcons.LayoutGrid,
  Target: LucideIcons.Target,
} as const;

const ODD_NUMBER_TIMER_SEC = TIME_LIMIT_MS / 1000;

const BRIEFING_ITEMS: Array<{
  icon: BriefingIconName;
  text: string;
  iconClass: string;
}> = [
  {
    icon: 'LayoutGrid',
    text: 'Сетка 4×4: числа 1–16 в случайном порядке',
    iconClass: 'text-sky-400',
  },
  {
    icon: 'Target',
    text: 'Кликайте строго по порядку: 1, 2, 3 … до 16',
    iconClass: 'text-amber-400',
  },
  {
    icon: 'Clock',
    text: `Всего ${ODD_NUMBER_TIMER_SEC} секунд на всю таблицу — таймер на сервере`,
    iconClass: 'text-red-400',
  },
];

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function OddNumberPageClient({
  initialBalance,
  initialDailyAttemptsUsed,
  initialPurchasedAttemptsAvailable,
  initialDailyAttemptPurchasesUsed,
}: OddNumberPageClientProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [dailyAttemptsUsed, setDailyAttemptsUsed] = useState(
    initialDailyAttemptsUsed,
  );
  const [phase, setPhase] = useState<OddNumberPhase>('idle');
  useFeedbackMeaningfulOnResult(phase === 'result');
  const [cells, setCells] = useState<OddNumberCell[]>([]);
  const [timeLeftMs, setTimeLeftMs] = useState(TIME_LIMIT_MS);
  const [completedValues, setCompletedValues] = useState<Set<number>>(
    () => new Set(),
  );
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);
  const [result, setResult] = useState<OddNumberAnswerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const timerFrameRef = useRef<number | null>(null);
  const serverStartTimeRef = useRef<number | null>(null);
  const hasTimedOutRef = useRef(false);
  const gameOverRef = useRef(false);
  const playerClicksRef = useRef<number[]>([]);
  const nextExpectedRef = useRef(1);

  const dailyAttemptsLeft = Math.max(0, DAILY_ATTEMPT_LIMIT - dailyAttemptsUsed);
  const isBusy = phase === 'verifying' || isStarting;

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
    purchaseUrl: '/api/games/odd-number/purchase-attempt',
    initialPurchasedAttemptsAvailable,
    initialDailyAttemptPurchasesUsed,
    dailyAttemptsLeft,
    balance,
    phase,
    isSubmitting: isBusy,
    difficulty: 'medium',
    onError: setError,
    onBalanceChange: setBalance,
  });

  const canAfford = balance >= GAME_COST;
  const canStart =
    canAfford && phase === 'idle' && !isBusy && !isPurchasing && hasAttemptSlot;

  const stopTimer = useCallback(() => {
    if (timerFrameRef.current !== null) {
      cancelAnimationFrame(timerFrameRef.current);
      timerFrameRef.current = null;
    }
  }, []);

  const submitVerify = useCallback(
    async (clicks: number[], timedOut = false) => {
      setPhase('verifying');

      try {
        const response = await fetch('/api/games/odd-number/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({ clicks, timedOut }),
        });

        const raw = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            getMessageFromApiJson(raw, 'Не удалось проверить результат'),
          );
        }

        const payload = raw as VerifyApiResponse;
        setResult(payload.data);

        if (payload.data.balanceAfter !== null) {
          setBalance(payload.data.balanceAfter);
        }

        setPhase('result');
        invalidateProfileCache();
      } catch (verifyError) {
        setError(
          verifyError instanceof Error
            ? verifyError.message
            : 'Не удалось проверить результат',
        );
        setPhase('idle');
      }
    },
    [],
  );

  const finishWithTimeout = useCallback(() => {
    if (hasTimedOutRef.current || gameOverRef.current) {
      return;
    }

    hasTimedOutRef.current = true;
    gameOverRef.current = true;
    stopTimer();
    void submitVerify(playerClicksRef.current, true);
  }, [stopTimer, submitVerify]);

  const startTimer = useCallback(
    (serverStartTime: number) => {
      serverStartTimeRef.current = serverStartTime;
      hasTimedOutRef.current = false;
      gameOverRef.current = false;

      const tick = () => {
        if (serverStartTimeRef.current === null || gameOverRef.current) {
          return;
        }

        const serverElapsed = Date.now() - serverStartTimeRef.current;
        const remaining = Math.max(0, TIME_LIMIT_MS - serverElapsed);
        setTimeLeftMs(remaining);

        if (remaining <= 0 || serverElapsed > TIME_LIMIT_MS) {
          finishWithTimeout();
          return;
        }

        timerFrameRef.current = requestAnimationFrame(tick);
      };

      timerFrameRef.current = requestAnimationFrame(tick);
    },
    [finishWithTimeout],
  );

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  const handleStart = useCallback(async () => {
    if (!canStart) {
      return;
    }

    setError(null);
    setResult(null);
    nextExpectedRef.current = 1;
    playerClicksRef.current = [];
    setCompletedValues(new Set());
    setWrongIndex(null);
    setIsStarting(true);

    try {
      const response = await fetch('/api/games/odd-number/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      const raw = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(raw, 'Не удалось запустить «Лишнее число»'),
        );
      }

      const payload = raw as StartApiResponse;
      setCells(payload.data.cells);
      setBalance(payload.data.balanceAfter);
      setDailyAttemptsUsed(payload.data.dailyAttemptsUsed);
      setPurchasedAttemptsAvailable(payload.data.purchasedAttemptsAvailable);
      setTimeLeftMs(TIME_LIMIT_MS);
      setPhase('playing');
      startTimer(payload.data.serverStartTime);
    } catch (startError) {
      setPhase('idle');
      setError(
        startError instanceof Error
          ? startError.message
          : 'Не удалось запустить «Лишнее число»',
      );
    } finally {
      setIsStarting(false);
    }
  }, [canStart, setPurchasedAttemptsAvailable, startTimer]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (phase !== 'playing' || gameOverRef.current || hasTimedOutRef.current) {
        return;
      }

      const clickedValue = cells.find((cell) => cell.index === index)?.value;
      if (clickedValue === undefined || completedValues.has(clickedValue)) {
        return;
      }

      const expected = nextExpectedRef.current;

      if (clickedValue !== expected) {
        gameOverRef.current = true;
        stopTimer();
        setWrongIndex(index);
        const clicks = [...playerClicksRef.current, index];
        void (async () => {
          await wait(280);
          void submitVerify(clicks);
        })();
        return;
      }

      playerClicksRef.current.push(index);
      const next = expected + 1;
      nextExpectedRef.current = next;

      setCompletedValues((prev) => {
        const updated = new Set(prev);
        updated.add(clickedValue);
        return updated;
      });

      if (next > TARGET_COUNT) {
        gameOverRef.current = true;
        stopTimer();
        void submitVerify(playerClicksRef.current);
      }
    },
    [cells, completedValues, phase, stopTimer, submitVerify],
  );

  const handlePlayAgain = useCallback(() => {
    stopTimer();
    serverStartTimeRef.current = null;
    hasTimedOutRef.current = false;
    gameOverRef.current = false;
    playerClicksRef.current = [];
    nextExpectedRef.current = 1;
    setCells([]);
    setResult(null);
    setCompletedValues(new Set());
    setWrongIndex(null);
    setTimeLeftMs(TIME_LIMIT_MS);
    setError(null);
    setPhase('idle');
  }, [stopTimer]);

  const timerPercent = Math.max(0, (timeLeftMs / TIME_LIMIT_MS) * 100);
  const timerUrgent = timeLeftMs <= 2500;

  return (
    <div className='games-lobby-scrollbar relative flex h-full min-h-0 w-full flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain bg-zinc-950'>
      <div
        className='pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:48px_48px]'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12)_0%,transparent_70%)]'
        aria-hidden
      />

      <main className='relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
        <header className='mb-6 sm:mb-8'>
          <Link
            href='/games'
            className='inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-sky-400'
          >
            <LucideIcons.ArrowLeft size='sm' />
            ../games
          </Link>

          <div className='mt-4 flex items-center gap-3'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/5 font-mono text-xs text-sky-400'>
              ON
            </div>
            <div>
              <h1 className='font-mono text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl'>
                Лишнее число
              </h1>
              <p className='mt-0.5 font-mono text-xs text-zinc-500'>
                schulte_table v2.0 · peripheral_vision
              </p>
            </div>
          </div>
        </header>

        <div className='grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6'>
          <section className='lg:col-span-2'>
            <div className='flex min-h-[400px] flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-8'>
              <div className='mb-4 flex items-center justify-between border-b border-zinc-800/80 pb-3'>
                <span className='font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600'>
                  {phase === 'idle' && 'status: standby'}
                  {phase === 'playing' && 'status: scanning'}
                  {phase === 'verifying' && 'status: verifying'}
                  {phase === 'result' && 'status: complete'}
                </span>
                <span className='flex items-center gap-1.5 font-mono text-[10px] text-zinc-600'>
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      phase === 'playing'
                        ? timerUrgent
                          ? 'animate-pulse bg-red-400 shadow-[0_0_6px_#f87171]'
                          : 'animate-pulse bg-sky-400 shadow-[0_0_6px_#38bdf8]'
                        : phase === 'verifying'
                          ? 'animate-pulse bg-amber-400'
                          : 'bg-zinc-700',
                    )}
                  />
                  {phase === 'playing' || phase === 'verifying' ? 'live' : 'idle'}
                </span>
              </div>

              <AnimatePresence mode='wait'>
                {phase === 'idle' && (
                  <motion.div
                    key='idle'
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className='flex flex-1 flex-col justify-between gap-8 transform-gpu will-change-transform'
                  >
                    <div className='space-y-4'>
                      <p className='font-mono text-[10px] uppercase tracking-[0.25em] text-sky-500/80'>
                        // mission_brief
                      </p>
                      <ul className='space-y-3'>
                        {BRIEFING_ITEMS.map((item) => {
                          const Icon = BRIEFING_ICON_MAP[item.icon];

                          return (
                            <li
                              key={item.text}
                              className='flex items-start gap-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40 px-3 py-2.5'
                            >
                              <span
                                className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80'
                                aria-hidden
                              >
                                <Icon size='sm' className={item.iconClass} />
                              </span>
                              <span className='text-sm leading-snug text-zinc-400'>
                                {item.text}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div className='flex flex-col items-center gap-3'>
                      {!canAfford && (
                        <p className='font-mono text-xs text-orange-400'>
                          Недостаточно бонусов (нужно {GAME_COST})
                        </p>
                      )}
                      {dailyAttemptsLeft <= 0 && purchasedAttemptsAvailable <= 0 && (
                        <p className='font-mono text-xs text-orange-400'>
                          Суточный лимит исчерпан — купите доп. попытку за{' '}
                          {extraAttemptCost} бонусов
                        </p>
                      )}

                      <motion.button
                        type='button'
                        disabled={!canStart}
                        onClick={() => void handleStart()}
                        whileTap={canStart ? { scale: 0.98 } : undefined}
                        className={cn(
                          'relative w-full max-w-md overflow-hidden rounded-xl',
                          'border-b-4 border-sky-700 bg-gradient-to-b from-sky-500 to-sky-600',
                          'px-6 py-4 font-mono text-base font-bold tracking-wide text-white',
                          'transform-gpu will-change-transform',
                          'active:translate-y-[4px] active:border-b-0',
                          'disabled:cursor-not-allowed disabled:opacity-40',
                        )}
                      >
                        <span
                          className='games-lobby-shimmer-beam transform-gpu'
                          aria-hidden
                        />
                        <span className='relative z-10 flex items-center justify-center gap-2'>
                          <LucideIcons.Zap size='sm' />
                          {isStarting ? 'Запуск…' : 'Начать тест'}
                        </span>
                      </motion.button>

                      <GamePurchaseAttemptButton
                        visible={dailyAttemptsLeft <= 0}
                        disabled={!canPurchaseAttempt}
                        isPurchasing={isPurchasing}
                        canAffordPurchase={canAffordPurchase}
                        extraAttemptCost={extraAttemptCost}
                        purchasedAttemptsAvailable={purchasedAttemptsAvailable}
                        dailyAttemptPurchasesRemaining={
                          dailyAttemptPurchasesRemaining
                        }
                        onPurchase={() => void handlePurchaseAttempt()}
                      />
                    </div>
                  </motion.div>
                )}

                {(phase === 'playing' || phase === 'verifying') && (
                  <motion.div
                    key='playing'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='flex flex-1 flex-col gap-4 transform-gpu will-change-transform'
                  >
                    <div
                      className={cn(
                        'rounded-xl border px-4 py-3 text-center',
                        timerUrgent
                          ? 'border-red-500/40 bg-red-950/30'
                          : 'border-amber-500/30 bg-amber-950/20',
                      )}
                    >
                      <p
                        className={cn(
                          'font-mono text-[10px] uppercase tracking-[0.2em]',
                          timerUrgent ? 'text-red-400' : 'text-amber-400/90',
                        )}
                      >
                        Задание
                      </p>
                      <p className='mt-1 text-sm font-semibold text-zinc-100 sm:text-base'>
                        Кликни по числам строго по порядку от 1 до 16
                      </p>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center justify-between font-mono text-xs'>
                        <span className='text-zinc-500'>
                          Прогресс: {completedValues.size}/{TARGET_COUNT}
                        </span>
                        <span
                          className={cn(
                            'tabular-nums font-bold',
                            timerUrgent ? 'text-red-400' : 'text-sky-400',
                          )}
                        >
                          {(timeLeftMs / 1000).toFixed(1)} с
                        </span>
                      </div>
                      <div className='h-2 overflow-hidden rounded-full bg-zinc-800'>
                        <motion.div
                          className={cn(
                            'h-full rounded-full',
                            timerUrgent ? 'bg-red-500' : 'bg-sky-500',
                          )}
                          animate={{ width: `${timerPercent}%` }}
                          transition={{ duration: 0.08 }}
                        />
                      </div>
                    </div>

                    <OddNumberGrid
                      cells={cells}
                      disabled={phase === 'verifying'}
                      completedValues={completedValues}
                      wrongIndex={wrongIndex}
                      onCellClick={handleCellClick}
                    />

                    {phase === 'verifying' && (
                      <p className='text-center font-mono text-xs text-zinc-500'>
                        Проверка результата…
                      </p>
                    )}
                  </motion.div>
                )}

                {phase === 'result' && result && (
                  <motion.div
                    key='result'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='flex flex-1 flex-col gap-4 transform-gpu will-change-transform'
                  >
                    {cells.length > 0 && (
                      <OddNumberGrid
                        cells={cells}
                        disabled
                        completedValues={
                          result.won
                            ? new Set(
                                Array.from(
                                  { length: TARGET_COUNT },
                                  (_, index) => index + 1,
                                ),
                              )
                            : completedValues
                        }
                        wrongIndex={wrongIndex}
                        onCellClick={() => {}}
                      />
                    )}
                    <OddNumberResultPanel
                      result={result}
                      balance={balance}
                      onPlayAgain={handlePlayAgain}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <div className='mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 font-mono text-xs text-red-300'>
                  {error}
                </div>
              )}
            </div>
          </section>

          <aside className='lg:col-span-1'>
            <div className='space-y-6 rounded-2xl border border-sky-500/10 bg-zinc-900/40 p-6 backdrop-blur-md'>
              <p className='font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600'>
                // control_panel
              </p>

              <div className='grid grid-cols-2 gap-3 lg:grid-cols-1'>
                <div className='rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-zinc-600'>
                    Доступно бонусов
                  </p>
                  <p className='mt-1 font-mono text-2xl font-bold text-sky-400'>
                    <NumberTicker value={balance} durationMs={800} />
                  </p>
                </div>

                <div className='rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-zinc-600'>
                    Стоимость / награда
                  </p>
                  <p className='mt-1 font-mono text-lg font-bold text-zinc-100'>
                    {GAME_COST}
                    <span className='mx-1 text-zinc-600'>→</span>
                    <span className='text-sky-400'>+{WIN_REWARD}</span>
                  </p>
                </div>
              </div>

              <div className='rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-zinc-600'>
                  Лимит времени
                </p>
                <p className='mt-1 font-mono text-2xl font-bold text-red-400'>
                  {ODD_NUMBER_TIMER_SEC} сек
                </p>
                <p className='mt-1 text-xs text-zinc-500'>
                  На все 16 кликов, не на каждое число
                </p>
              </div>

              <div className='rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-zinc-600'>
                  Суточный лимит
                </p>
                <p className='mt-1.5 font-mono text-sm text-zinc-400'>
                  Осталось попыток:{' '}
                  <span
                    className={cn(
                      'text-lg font-bold',
                      dailyAttemptsLeft <= 2
                        ? 'text-orange-400'
                        : 'text-sky-400',
                    )}
                  >
                    {dailyAttemptsLeft}
                  </span>{' '}
                  из {DAILY_ATTEMPT_LIMIT}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
