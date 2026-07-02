'use client';

import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  COLOR_CONFLICT_DIFFICULTIES,
  DAILY_ATTEMPT_LIMIT,
  type ColorConflictAnswerResult,
  type ColorConflictDifficulty,
  type ColorConflictOptionView,
  type ColorConflictRoundPayload,
} from '@/lib/games/colorConflict';
import { getMessageFromApiJson } from '@/lib/api/parseApiError';
import { invalidateProfileCache } from '@/hooks/profile/useProfileDashboard';
import { NumberTicker } from '@/app/games/_components/effects/NumberTicker';
import { GamePurchaseAttemptButton } from '@/app/games/_components/GamePurchaseAttemptButton';
import { useGameAttemptPurchase } from '@/hooks/games/useGameAttemptPurchase';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { Brain, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import '@/app/games/_components/effects/gamesLobby.css';
import { ColorConflictResultPanel } from './ColorConflictResultPanel';
import { ColorConflictDifficultyPicker } from './ColorConflictDifficultyPicker';
import { useFeedbackMeaningfulOnResult } from '@/hooks/feedback/useFeedbackMeaningfulOnResult';

type ColorConflictPhase = 'idle' | 'playing' | 'result';

interface StartApiResponse {
  success: boolean;
  data: ColorConflictRoundPayload & {
    difficulty: ColorConflictDifficulty;
    balanceAfter: number;
    dailyAttemptsUsed: number;
    dailyAttemptsLeft: number;
    purchasedAttemptsAvailable: number;
  };
}

interface AnswerApiResponse {
  success: boolean;
  data: ColorConflictAnswerResult;
}

interface RoundState {
  wordText: string;
  displayColorHex: string;
  displayGlowRgb: string;
  options: ColorConflictOptionView[];
  currentRound: number;
  seriesTarget: number;
  timeLimitMs: number;
  serverStartTime: number;
}

interface AnswerFeedback {
  value: string;
  isCorrect: boolean;
}

interface ColorConflictPageClientProps {
  initialBalance: number;
  initialDailyAttemptsUsed: number;
  initialPurchasedAttemptsAvailable: number;
  initialDailyAttemptPurchasesUsed: number;
}

const BRIEFING_ITEMS = [
  {
    Icon: Brain,
    iconClassName: 'text-violet-400',
    text: 'Внимание на цвет текста, а не на слово',
  },
  {
    Icon: Clock,
    iconClassName: 'text-sky-400',
    text: 'До 1.8–3 с на ответ — таймер на сервере',
  },
  {
    Icon: Zap,
    iconClassName: 'text-amber-400',
    text: 'Ошибка или таймаут = обнуление серии',
  },
] as const;

function applyRoundPayload(payload: ColorConflictRoundPayload): RoundState {
  return {
    wordText: payload.wordText,
    displayColorHex: payload.displayColorHex,
    displayGlowRgb: payload.displayGlowRgb,
    options: payload.options,
    currentRound: payload.currentRound,
    seriesTarget: payload.seriesTarget,
    timeLimitMs: payload.timeLimitMs,
    serverStartTime: payload.serverStartTime,
  };
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function ColorConflictPageClient({
  initialBalance,
  initialDailyAttemptsUsed,
  initialPurchasedAttemptsAvailable,
  initialDailyAttemptPurchasesUsed,
}: ColorConflictPageClientProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [dailyAttemptsUsed, setDailyAttemptsUsed] = useState(
    initialDailyAttemptsUsed,
  );
  const [phase, setPhase] = useState<ColorConflictPhase>('idle');
  useFeedbackMeaningfulOnResult(phase === 'result');
  const [difficulty, setDifficulty] = useState<ColorConflictDifficulty>('medium');
  const [round, setRound] = useState<RoundState | null>(null);
  const [timeLeftMs, setTimeLeftMs] = useState(
    COLOR_CONFLICT_DIFFICULTIES.medium.timeLimitMs,
  );
  const [result, setResult] = useState<ColorConflictAnswerResult | null>(null);
  const [answerFeedback, setAnswerFeedback] = useState<AnswerFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roundFlash, setRoundFlash] = useState(false);
  const [isRoundReady, setIsRoundReady] = useState(false);

  const serverStartTimeRef = useRef<number | null>(null);
  const timerFrameRef = useRef<number | null>(null);
  const hasTimedOutRef = useRef(false);
  const gameArenaRef = useRef<HTMLDivElement>(null);
  const timerBootstrappedKeyRef = useRef<string | null>(null);

  const activeConfig = COLOR_CONFLICT_DIFFICULTIES[difficulty];
  const timeLimitMs = round?.timeLimitMs ?? activeConfig.timeLimitMs;
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
    purchaseUrl: '/api/games/color/purchase-attempt',
    initialPurchasedAttemptsAvailable,
    initialDailyAttemptPurchasesUsed,
    dailyAttemptsLeft,
    balance,
    phase,
    isSubmitting,
    difficulty,
    onError: setError,
    onBalanceChange: setBalance,
  });

  const canAfford = balance >= activeConfig.cost;
  const canStart =
    canAfford && hasAttemptSlot && phase === 'idle' && !isSubmitting && !isPurchasing;
  const settingsLocked = phase !== 'idle';

  const stopTimer = useCallback(() => {
    if (timerFrameRef.current !== null) {
      cancelAnimationFrame(timerFrameRef.current);
      timerFrameRef.current = null;
    }
  }, []);

  const finishWithTimeout = useCallback(async () => {
    if (hasTimedOutRef.current || isSubmitting) {
      return;
    }

    hasTimedOutRef.current = true;
    stopTimer();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/games/color/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ selectedAnswer: null }),
      });

      const raw = await response.json().catch(() => null);
      const payload = raw as AnswerApiResponse | null;

      if (payload?.data) {
        setResult(payload.data);
      } else {
        setResult({
          gameOver: true,
          won: false,
          reason: 'timeout',
          reactionMs: timeLimitMs + 1,
          reward: 0,
          balanceAfter: null,
          difficulty,
          currentStreak: (round?.currentRound ?? 1) - 1,
          seriesTarget: round?.seriesTarget ?? activeConfig.seriesTarget,
          nextRound: null,
        });
      }

      setPhase('result');
    } catch {
      setResult({
        gameOver: true,
        won: false,
        reason: 'timeout',
        reactionMs: timeLimitMs + 1,
        reward: 0,
        balanceAfter: null,
        difficulty,
        currentStreak: (round?.currentRound ?? 1) - 1,
        seriesTarget: round?.seriesTarget ?? activeConfig.seriesTarget,
        nextRound: null,
      });
      setPhase('result');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    activeConfig.seriesTarget,
    difficulty,
    isSubmitting,
    round?.currentRound,
    round?.seriesTarget,
    stopTimer,
    timeLimitMs,
  ]);

  const startTimer = useCallback(
    (serverStartTime: number, limitMs: number) => {
      serverStartTimeRef.current = serverStartTime;
      hasTimedOutRef.current = false;
      setTimeLeftMs(limitMs);

      const tick = () => {
        if (serverStartTimeRef.current === null) {
          return;
        }

        const serverElapsed = Date.now() - serverStartTimeRef.current;
        const remaining = Math.max(0, limitMs - serverElapsed);
        setTimeLeftMs(remaining);

        if (remaining <= 0 || serverElapsed > limitMs) {
          void finishWithTimeout();
          return;
        }

        timerFrameRef.current = requestAnimationFrame(tick);
      };

      timerFrameRef.current = requestAnimationFrame(tick);
    },
    [finishWithTimeout],
  );

  const bootstrapRoundFocusAndTimer = useCallback(
    async (roundState: RoundState) => {
      const roundKey = `${roundState.currentRound}-${roundState.serverStartTime}`;
      if (timerBootstrappedKeyRef.current === roundKey) {
        return;
      }

      setIsRoundReady(false);
      gameArenaRef.current?.scrollIntoView({
        behavior: 'auto',
        block: 'start',
      });

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });

      try {
        const response = await fetch('/api/games/color/ready', {
          method: 'POST',
          cache: 'no-store',
        });

        const raw = await response.json().catch(() => null);

        if (response.ok && raw?.data?.serverStartTime) {
          timerBootstrappedKeyRef.current = roundKey;
          startTimer(raw.data.serverStartTime, raw.data.timeLimitMs);
          setIsRoundReady(true);
          return;
        }
      } catch {
        // fallback ниже
      }

      timerBootstrappedKeyRef.current = roundKey;
      startTimer(roundState.serverStartTime, roundState.timeLimitMs);
      setIsRoundReady(true);
    },
    [startTimer],
  );

  useLayoutEffect(() => {
    if (phase !== 'playing' || !round) {
      return;
    }

    void bootstrapRoundFocusAndTimer(round);
  }, [phase, round, bootstrapRoundFocusAndTimer]);

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
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/games/color/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ difficulty }),
      });

      const raw = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(raw, 'Не удалось запустить «Цветовой конфликт»'),
        );
      }

      const payload = raw as StartApiResponse;
      const nextRound = applyRoundPayload(payload.data);
      timerBootstrappedKeyRef.current = null;
      setIsRoundReady(false);
      setRound(nextRound);
      setBalance(payload.data.balanceAfter);
      setDailyAttemptsUsed(payload.data.dailyAttemptsUsed);
      setPurchasedAttemptsAvailable(payload.data.purchasedAttemptsAvailable);
      setTimeLeftMs(payload.data.timeLimitMs);
      setPhase('playing');
    } catch (startError) {
      setPhase('idle');
      setError(
        startError instanceof Error
          ? startError.message
          : 'Не удалось запустить «Цветовой конфликт»',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [canStart, difficulty]);

  const handleAnswer = useCallback(
    async (selectedAnswer: string) => {
      if (phase !== 'playing' || isSubmitting || hasTimedOutRef.current) {
        return;
      }

      stopTimer();
      setIsSubmitting(true);

      try {
        const response = await fetch('/api/games/color/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          body: JSON.stringify({ selectedAnswer }),
        });

        const raw = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            getMessageFromApiJson(raw, 'Не удалось отправить ответ'),
          );
        }

        const payload = raw as AnswerApiResponse;
        const answerData = payload.data;

        if (answerData.gameOver) {
          setAnswerFeedback({ value: selectedAnswer, isCorrect: answerData.won });
          await wait(320);
          setAnswerFeedback(null);
          setResult(answerData);
          if (answerData.balanceAfter !== null) {
            setBalance(answerData.balanceAfter);
          }
          setPhase('result');
          invalidateProfileCache();
          return;
        }

        if (answerData.nextRound) {
          setAnswerFeedback({ value: selectedAnswer, isCorrect: true });
          await wait(180);
          setAnswerFeedback(null);
          setRoundFlash(true);
          timerBootstrappedKeyRef.current = null;
          setIsRoundReady(false);
          setRound(applyRoundPayload(answerData.nextRound));
          setTimeLeftMs(answerData.nextRound.timeLimitMs);
          setPhase('playing');
          window.setTimeout(() => setRoundFlash(false), 220);
          return;
        }

        setResult(answerData);
        setPhase('result');
      } catch (answerError) {
        setError(
          answerError instanceof Error
            ? answerError.message
            : 'Не удалось отправить ответ',
        );
        setPhase('idle');
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, phase, stopTimer],
  );

  const handlePlayAgain = useCallback(() => {
    stopTimer();
    serverStartTimeRef.current = null;
    hasTimedOutRef.current = false;
    timerBootstrappedKeyRef.current = null;
    setIsRoundReady(false);
    setRound(null);
    setResult(null);
    setAnswerFeedback(null);
    setTimeLeftMs(activeConfig.timeLimitMs);
    setError(null);
    setPhase('idle');
  }, [activeConfig.timeLimitMs, stopTimer]);

  const progressPercent = isRoundReady
    ? Math.max(0, Math.min(100, (timeLeftMs / timeLimitMs) * 100))
    : 100;
  const isUrgent = isRoundReady && progressPercent <= 35;
  const completedRounds = round ? Math.max(0, round.currentRound - 1) : 0;

  return (
    <div className='games-lobby-scrollbar relative flex h-full min-h-0 w-full flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain bg-zinc-950'>
      <div
        className='pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:28px_28px]'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[min(90vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.18),transparent_65%)] blur-2xl'
        aria-hidden
      />

      <main className='relative z-10 px-3 py-5 sm:px-6 sm:py-8 lg:px-8'>
        <header className='mx-auto mb-5 max-w-6xl sm:mb-8'>
          <Link
            href='/games'
            className='inline-flex items-center gap-2 font-mono text-xs text-zinc-500 transition-colors hover:text-emerald-400'
          >
            <LucideIcons.ArrowLeft size='sm' />
            ../games
          </Link>

          <div className='mt-4 flex items-center gap-3'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-violet-500/25 bg-violet-500/10 font-mono text-xs text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.15)]'>
              CC
            </div>
            <div>
              <h1 className='font-mono text-xl font-bold tracking-tight text-zinc-100 sm:text-2xl'>
                Цветовой Конфликт
              </h1>
              <p className='mt-0.5 font-mono text-xs text-zinc-500'>
                neuro_core v1.0 · stroop_protocol
              </p>
            </div>
          </div>
        </header>

        <div className='mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6'>
          {/* Левая колонка — нейро-ядро / экран тестирования */}
          <section className='lg:col-span-2' ref={gameArenaRef}>
            <div
              className={cn(
                'flex min-h-[380px] flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-8',
                roundFlash && 'transform-gpu will-change-transform',
              )}
            >
              <div className='mb-4 flex items-center justify-between border-b border-zinc-800/80 pb-3'>
                <span className='font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600'>
                  {phase === 'idle' && 'status: standby'}
                  {phase === 'playing' && 'status: conflict_test'}
                  {phase === 'result' && 'status: complete'}
                </span>
                <span className='flex items-center gap-1.5 font-mono text-[10px] text-zinc-600'>
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full transform-gpu',
                      phase === 'playing' && isRoundReady
                        ? 'animate-pulse bg-emerald-400 shadow-[0_0_6px_#10b981]'
                        : 'bg-zinc-700',
                    )}
                  />
                  {phase === 'playing' && isRoundReady ? 'live' : 'idle'}
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
                      <p className='font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-500/80'>
                        // neuro_brief
                      </p>
                      <ul className='space-y-3'>
                        {BRIEFING_ITEMS.map((item) => {
                          const Icon = item.Icon;

                          return (
                          <li
                            key={item.text}
                            className='flex items-start gap-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40 px-3 py-2.5'
                          >
                            <span
                              className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80'
                              aria-hidden
                            >
                              <Icon className={`h-4 w-4 ${item.iconClassName}`} />
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
                          Недостаточно бонусов (нужно {activeConfig.cost})
                        </p>
                      )}
                      {!hasAttemptSlot && (
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
                          'border-b-4 border-emerald-700 bg-gradient-to-b from-emerald-500 to-emerald-600',
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
                          Начать серию ({activeConfig.cost} бонусов)
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

                      <p className='max-w-md text-center text-xs text-zinc-500'>
                        Время ответа рассчитывается на сервере. Играйте при
                        стабильном интернет-соединении.
                      </p>
                      <p className='font-mono text-xs text-zinc-500'>
                        Осталось попыток:{' '}
                        <span
                          className={cn(
                            'font-bold',
                            dailyAttemptsLeft <= 2
                              ? 'text-orange-400'
                              : 'text-emerald-400',
                          )}
                        >
                          {dailyAttemptsLeft}
                        </span>{' '}
                        из {DAILY_ATTEMPT_LIMIT}
                      </p>
                    </div>
                  </motion.div>
                )}

                {phase === 'playing' && round && (
                  <motion.div
                    key={`playing-${round.currentRound}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='flex flex-1 flex-col justify-between gap-6 transform-gpu will-change-transform'
                  >
                    <div className='flex flex-1 flex-col items-center justify-center py-2'>
                      <p className='mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600'>
                        Какого цвета надпись?
                      </p>
                      <motion.p
                        key={`${round.wordText}-${round.displayColorHex}`}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{
                          opacity: 1,
                          scale: roundFlash ? 1.04 : 1,
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                        className='text-center text-5xl font-black uppercase tracking-wide filter drop-shadow-[0_0_15px_currentColor] transform-gpu will-change-transform'
                        style={{
                          color: round.displayColorHex,
                          textShadow: `0 0 30px rgba(${round.displayGlowRgb}, 0.55)`,
                        }}
                      >
                        {round.wordText}
                      </motion.p>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center justify-between font-mono text-xs text-zinc-600'>
                        <span>round_timer</span>
                        <span
                          className={cn(
                            'tabular-nums',
                            !isRoundReady
                              ? 'text-violet-400'
                              : isUrgent
                                ? 'text-red-400'
                                : 'text-orange-400',
                          )}
                        >
                          {!isRoundReady
                            ? 'Старт…'
                            : `${(timeLeftMs / 1000).toFixed(1)}s`}
                        </span>
                      </div>
                      <div className='relative h-1.5 overflow-hidden rounded-full bg-zinc-800/80'>
                        <motion.div
                          className={cn(
                            'h-full transform-gpu rounded-full will-change-transform',
                            isUrgent
                              ? 'bg-red-500 shadow-[0_0_15px_#ef4444]'
                              : 'bg-orange-500 shadow-[0_0_15px_#f97316]',
                          )}
                          style={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.05, ease: 'linear' }}
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                      {round.options.map((option) => {
                        const isFeedbackTarget =
                          answerFeedback !== null &&
                          answerFeedback.value === option.name;
                        const flashCorrect =
                          isFeedbackTarget && answerFeedback.isCorrect;
                        const flashWrong =
                          isFeedbackTarget && !answerFeedback.isCorrect;

                        return (
                          <motion.button
                            key={option.name}
                            type='button'
                            disabled={isSubmitting || !isRoundReady}
                            whileTap={
                              isSubmitting || !isRoundReady
                                ? undefined
                                : { scale: 0.95 }
                            }
                            onClick={() => void handleAnswer(option.name)}
                            className={cn(
                              'transform-gpu rounded-xl border border-zinc-800 bg-zinc-950/80 py-4 text-lg font-bold uppercase tracking-wide text-zinc-200 transition-all will-change-transform',
                              'hover:border-zinc-600 active:scale-95',
                              'disabled:cursor-not-allowed disabled:opacity-50',
                              flashCorrect &&
                                'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.35)]',
                              flashWrong &&
                                'border-red-500/50 bg-red-950/40 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.2)]',
                            )}
                          >
                            {option.name}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {phase === 'result' && result && (
                  <motion.div
                    key='result'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='flex flex-1 flex-col transform-gpu will-change-transform'
                  >
                    <ColorConflictResultPanel
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

          {/* Правая колонка — HUD панель прогресса */}
          <aside className='lg:col-span-1'>
            <motion.div
              animate={
                difficulty === 'hard'
                  ? {
                      boxShadow: [
                        '0 0 0 rgba(249,115,22,0)',
                        '0 0 20px rgba(249,115,22,0.1)',
                        '0 0 0 rgba(249,115,22,0)',
                      ],
                    }
                  : { boxShadow: '0 0 0 rgba(0,0,0,0)' }
              }
              transition={
                difficulty === 'hard'
                  ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.2 }
              }
              className={cn(
                'space-y-6 rounded-2xl border bg-zinc-900/40 p-6 backdrop-blur-md transform-gpu',
                difficulty === 'hard'
                  ? 'border-violet-500/25'
                  : 'border-emerald-500/10',
              )}
            >
              <p className='font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600'>
                // control_panel
              </p>

              <div className='grid grid-cols-2 gap-3 lg:grid-cols-1'>
                <div className='rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-zinc-600'>
                    Доступно бонусов
                  </p>
                  <p className='mt-1 font-mono text-2xl font-bold text-emerald-400'>
                    <NumberTicker value={balance} durationMs={800} />
                  </p>
                </div>

                <div className='rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-zinc-600'>
                    Стоимость запуска
                  </p>
                  <p className='mt-1 font-mono text-2xl font-bold text-zinc-100'>
                    {activeConfig.cost}
                    <span className='ml-1 text-sm font-normal text-zinc-500'>
                      бон.
                    </span>
                  </p>
                </div>
              </div>

              <ColorConflictDifficultyPicker
                difficulty={difficulty}
                onChange={setDifficulty}
                disabled={settingsLocked}
              />

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
                        : 'text-emerald-400',
                    )}
                  >
                    {dailyAttemptsLeft}
                  </span>{' '}
                  из {DAILY_ATTEMPT_LIMIT}
                </p>
                <div className='mt-2 h-1 overflow-hidden rounded-full bg-zinc-800'>
                  <motion.div
                    className='h-full transform-gpu rounded-full bg-emerald-500/70 will-change-transform'
                    animate={{
                      width: `${(dailyAttemptsLeft / DAILY_ATTEMPT_LIMIT) * 100}%`,
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                  />
                </div>

                {purchasedAttemptsAvailable > 0 && (
                  <p className='mt-2 font-mono text-xs text-zinc-500'>
                    Доп. попыток в резерве:{' '}
                    <span className='font-bold text-teal-400'>
                      {purchasedAttemptsAvailable}
                    </span>
                  </p>
                )}
              </div>

              {phase === 'playing' && round && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='rounded-xl border border-emerald-500/15 bg-zinc-950/60 px-4 py-4'
                >
                  <div className='flex items-center justify-between'>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-zinc-500'>
                      Серия
                    </p>
                    <p className='font-mono text-xs text-zinc-400'>
                      Раунд{' '}
                      <span className='font-bold text-zinc-100'>
                        {round.currentRound}
                      </span>{' '}
                      из {round.seriesTarget}
                    </p>
                  </div>

                  <div className='mt-3 flex flex-wrap gap-1.5'>
                    {Array.from({ length: round.seriesTarget }, (_, index) => {
                      const isDone = index < completedRounds;
                      const isCurrent = index === completedRounds;

                      return (
                        <span
                          key={index}
                          className={cn(
                            'h-2 w-2 rounded-full transform-gpu transition-all duration-300',
                            isDone &&
                              'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
                            isCurrent &&
                              (isUrgent
                                ? 'bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.6)]'
                                : 'bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.5)]'),
                            !isDone &&
                              !isCurrent &&
                              'bg-zinc-800 ring-1 ring-zinc-700/80',
                          )}
                          aria-hidden
                        />
                      );
                    })}
                  </div>

                  <p className='mt-3 font-mono text-[10px] text-zinc-600'>
                    {completedRounds} верных · награда +{activeConfig.reward} бон.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
}
