'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  DAILY_ATTEMPT_LIMIT,
  GAME_COST,
  ROUNDS_IN_SERIES,
  TIME_LIMIT_MS,
  WIN_REWARD,
  type QuickBalanceComparison,
  type QuickBalanceRoundView,
  type QuickBalanceVerifyResult,
} from '@/lib/games/quickBalance';
import {
  evaluateBalanceExpression,
  getComparisonFromValues,
} from '@/lib/games/quickBalanceEval';
import { getMessageFromApiJson } from '@/lib/api/parseApiError';
import { invalidateProfileCache } from '@/hooks/profile/useProfileDashboard';
import { NumberTicker } from '@/app/games/_components/effects/NumberTicker';
import { GamePurchaseAttemptButton } from '@/app/games/_components/GamePurchaseAttemptButton';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { useGameAttemptPurchase } from '@/hooks/games/useGameAttemptPurchase';
import { cn } from '@/lib/utils';
import '@/app/games/_components/effects/gamesLobby.css';
import { QuickBalancePlayingStage } from './QuickBalancePlayingStage';
import { QuickBalanceResultPanel } from './QuickBalanceResultPanel';
import { useFeedbackMeaningfulOnResult } from '@/hooks/feedback/useFeedbackMeaningfulOnResult';

type QuickBalancePhase = 'idle' | 'playing' | 'verifying' | 'result';

interface StartApiResponse {
  success: boolean;
  data: {
    rounds: QuickBalanceRoundView[];
    timeLimitMs: number;
    roundsInSeries: number;
    balanceAfter: number;
    serverStartTime: number;
    dailyAttemptsUsed: number;
    dailyAttemptsLeft: number;
    purchasedAttemptsAvailable: number;
  };
}

interface VerifyApiResponse {
  success: boolean;
  data: QuickBalanceVerifyResult;
}

interface QuickBalancePageClientProps {
  initialBalance: number;
  initialDailyAttemptsUsed: number;
  initialPurchasedAttemptsAvailable: number;
  initialDailyAttemptPurchasesUsed: number;
}

function getCorrectChoice(round: QuickBalanceRoundView): QuickBalanceComparison {
  const left = evaluateBalanceExpression(round.leftText);
  const right = evaluateBalanceExpression(round.rightText);
  return getComparisonFromValues(left, right);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function QuickBalancePageClient({
  initialBalance,
  initialDailyAttemptsUsed,
  initialPurchasedAttemptsAvailable,
  initialDailyAttemptPurchasesUsed,
}: QuickBalancePageClientProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [dailyAttemptsUsed, setDailyAttemptsUsed] = useState(
    initialDailyAttemptsUsed,
  );
  const [phase, setPhase] = useState<QuickBalancePhase>('idle');
  useFeedbackMeaningfulOnResult(phase === 'result');
  const [rounds, setRounds] = useState<QuickBalanceRoundView[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(TIME_LIMIT_MS);
  const [wrongChoice, setWrongChoice] = useState<QuickBalanceComparison | null>(
    null,
  );
  const [result, setResult] = useState<QuickBalanceVerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const timerFrameRef = useRef<number | null>(null);
  const roundStartTimeRef = useRef<number | null>(null);
  const hasTimedOutRef = useRef(false);
  const gameOverRef = useRef(false);
  const choicesRef = useRef<QuickBalanceComparison[]>([]);

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
    purchaseUrl: '/api/games/quick-balance/purchase-attempt',
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
    async (choices: QuickBalanceComparison[], timedOut = false) => {
      setPhase('verifying');

      try {
        const response = await fetch('/api/games/quick-balance/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({ choices, timedOut }),
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

  const finishRoundWithTimeout = useCallback(() => {
    if (hasTimedOutRef.current || gameOverRef.current) {
      return;
    }

    hasTimedOutRef.current = true;
    gameOverRef.current = true;
    stopTimer();
    void submitVerify(choicesRef.current, true);
  }, [stopTimer, submitVerify]);

  const startRoundTimer = useCallback(() => {
    roundStartTimeRef.current = Date.now();
    hasTimedOutRef.current = false;
    setTimeLeftMs(TIME_LIMIT_MS);

    const tick = () => {
      if (roundStartTimeRef.current === null || gameOverRef.current) {
        return;
      }

      const elapsed = Date.now() - roundStartTimeRef.current;
      const remaining = Math.max(0, TIME_LIMIT_MS - elapsed);
      setTimeLeftMs(remaining);

      if (remaining <= 0 || elapsed > TIME_LIMIT_MS) {
        finishRoundWithTimeout();
        return;
      }

      timerFrameRef.current = requestAnimationFrame(tick);
    };

    timerFrameRef.current = requestAnimationFrame(tick);
  }, [finishRoundWithTimeout]);

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
    setWrongChoice(null);
    setCurrentRoundIndex(0);
    choicesRef.current = [];
    gameOverRef.current = false;
    setIsStarting(true);

    try {
      const response = await fetch('/api/games/quick-balance/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      const raw = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(raw, 'Не удалось запустить «Быстрый баланс»'),
        );
      }

      const payload = raw as StartApiResponse;
      setRounds(payload.data.rounds);
      setBalance(payload.data.balanceAfter);
      setDailyAttemptsUsed(payload.data.dailyAttemptsUsed);
      setPurchasedAttemptsAvailable(payload.data.purchasedAttemptsAvailable);
      setPhase('playing');
      startRoundTimer();
    } catch (startError) {
      setPhase('idle');
      setError(
        startError instanceof Error
          ? startError.message
          : 'Не удалось запустить «Быстрый баланс»',
      );
    } finally {
      setIsStarting(false);
    }
  }, [canStart, setPurchasedAttemptsAvailable, startRoundTimer]);

  const handleChoose = useCallback(
    (choice: QuickBalanceComparison) => {
      if (phase !== 'playing' || gameOverRef.current || hasTimedOutRef.current) {
        return;
      }

      const round = rounds[currentRoundIndex];
      if (!round) {
        return;
      }

      const correct = getCorrectChoice(round);
      choicesRef.current = [...choicesRef.current, choice];

      if (choice !== correct) {
        gameOverRef.current = true;
        stopTimer();
        setWrongChoice(choice);
        void (async () => {
          await wait(300);
          void submitVerify(choicesRef.current);
        })();
        return;
      }

      if (currentRoundIndex + 1 >= ROUNDS_IN_SERIES) {
        gameOverRef.current = true;
        stopTimer();
        void submitVerify(choicesRef.current);
        return;
      }

      stopTimer();
      setCurrentRoundIndex((prev) => prev + 1);
      startRoundTimer();
    },
    [currentRoundIndex, phase, rounds, startRoundTimer, stopTimer, submitVerify],
  );

  const handlePlayAgain = useCallback(() => {
    stopTimer();
    roundStartTimeRef.current = null;
    hasTimedOutRef.current = false;
    gameOverRef.current = false;
    choicesRef.current = [];
    setRounds([]);
    setResult(null);
    setCurrentRoundIndex(0);
    setWrongChoice(null);
    setTimeLeftMs(TIME_LIMIT_MS);
    setError(null);
    setPhase('idle');
  }, [stopTimer]);

  const activeRound = rounds[currentRoundIndex];

  return (
    <div className='games-lobby-scrollbar relative flex h-full min-h-0 w-full flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain bg-zinc-950'>
      <div
        className='pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.03)_1px,transparent_1px)] bg-[size:48px_48px]'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(217,70,239,0.12)_0%,transparent_70%)]'
        aria-hidden
      />

      <main className='relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
        <header className='mb-6 sm:mb-8'>
          <Link
            href='/games'
            className='inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-fuchsia-400'
          >
            <LucideIcons.ArrowLeft size='sm' />
            ../games
          </Link>

          <div className='mt-4 flex items-center gap-3'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/5 font-mono text-xs text-fuchsia-400'>
              QB
            </div>
            <div>
              <h1 className='font-mono text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl'>
                Быстрый баланс
              </h1>
              <p className='mt-0.5 font-mono text-xs text-zinc-500'>
                math_deception v1.0 · compare_engine
              </p>
            </div>
          </div>
        </header>

        <div className='grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6'>
          <section className='lg:col-span-2'>
            <div className='flex min-h-[420px] flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-8'>
              <AnimatePresence mode='wait'>
                {phase === 'idle' && (
                  <motion.div
                    key='idle'
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className='flex flex-1 flex-col justify-between gap-8'
                  >
                    <div className='space-y-4'>
                      <p className='font-mono text-[10px] uppercase tracking-[0.25em] text-fuchsia-500/80'>
                        // mission_brief
                      </p>
                      <ul className='space-y-3 text-sm text-zinc-400'>
                        <li>Слева и справа — два выражения (+, −, ×, ÷).</li>
                        <li>
                          Выберите знак: <strong className='text-zinc-200'>меньше</strong>,{' '}
                          <strong className='text-zinc-200'>равно</strong> или{' '}
                          <strong className='text-zinc-200'>больше</strong>.
                        </li>
                        <li>
                          <strong className='text-red-400'>
                            {(TIME_LIMIT_MS / 1000).toFixed(1)} секунды
                          </strong>{' '}
                          на каждое сравнение — таймер сбрасывается каждый раунд.
                        </li>
                        <li>
                          Нужно <strong className='text-emerald-400'>3 верных подряд</strong>{' '}
                          — награда {WIN_REWARD} бонусов.
                        </li>
                      </ul>
                    </div>

                    <div className='flex flex-col items-center gap-3'>
                      {!canAfford && (
                        <p className='font-mono text-xs text-orange-400'>
                          Недостаточно бонусов (нужно {GAME_COST})
                        </p>
                      )}

                      <motion.button
                        type='button'
                        disabled={!canStart}
                        onClick={() => void handleStart()}
                        whileTap={canStart ? { scale: 0.98 } : undefined}
                        className={cn(
                          'relative w-full max-w-md overflow-hidden rounded-xl',
                          'border-b-4 border-fuchsia-800 bg-gradient-to-b from-fuchsia-500 to-fuchsia-700',
                          'px-6 py-4 font-mono text-base font-bold text-white',
                          'disabled:cursor-not-allowed disabled:opacity-40',
                        )}
                      >
                        <span
                          className='games-lobby-shimmer-beam transform-gpu'
                          aria-hidden
                        />
                        <span className='relative z-10 flex items-center justify-center gap-2'>
                          <LucideIcons.Zap size='sm' />
                          {isStarting ? 'Запуск…' : 'Начать серию'}
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

                {(phase === 'playing' || phase === 'verifying') && activeRound && (
                  <motion.div
                    key='playing'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='flex flex-1 flex-col'
                  >
                    <QuickBalancePlayingStage
                      round={activeRound}
                      roundIndex={currentRoundIndex}
                      roundsTotal={ROUNDS_IN_SERIES}
                      timeLeftMs={timeLeftMs}
                      timeLimitMs={TIME_LIMIT_MS}
                      disabled={phase === 'verifying' || gameOverRef.current}
                      wrongChoice={wrongChoice}
                      onChoose={handleChoose}
                    />
                    {phase === 'verifying' && (
                      <p className='mt-4 text-center font-mono text-xs text-zinc-500'>
                        Проверка серии…
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
                    className='flex flex-1 flex-col'
                  >
                    <QuickBalanceResultPanel
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
            <div className='space-y-6 rounded-2xl border border-fuchsia-500/10 bg-zinc-900/40 p-6 backdrop-blur-md'>
              <div className='rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-zinc-600'>
                  Баланс
                </p>
                <p className='mt-1 font-mono text-2xl font-bold text-fuchsia-400'>
                  <NumberTicker value={balance} durationMs={800} />
                </p>
              </div>

              <div className='rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-zinc-600'>
                  Ставка → награда
                </p>
                <p className='mt-1 font-mono text-lg font-bold text-zinc-100'>
                  {GAME_COST}
                  <span className='mx-1 text-zinc-600'>→</span>
                  <span className='text-emerald-400'>+{WIN_REWARD}</span>
                </p>
                <p className='mt-1 text-xs text-zinc-500'>За 3 верных сравнения подряд</p>
              </div>

              <div className='rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-zinc-600'>
                  Таймер раунда
                </p>
                <p className='mt-1 font-mono text-2xl font-bold text-red-400'>
                  {(TIME_LIMIT_MS / 1000).toFixed(1)} сек
                </p>
              </div>

              <div className='rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3'>
                <p className='text-[10px] font-bold uppercase tracking-widest text-zinc-600'>
                  Попыток сегодня
                </p>
                <p className='mt-1 font-mono text-lg text-zinc-300'>
                  {dailyAttemptsLeft} / {DAILY_ATTEMPT_LIMIT}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
