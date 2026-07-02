'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { MAX_DAILY_ATTEMPT_PURCHASES } from '@/lib/games/gameAttemptPurchases';
import { LucideIcons } from '@/components/ui/LucideIcons';
import { cn } from '@/lib/utils';

interface GamePurchaseAttemptButtonProps {
  visible: boolean;
  disabled: boolean;
  isPurchasing: boolean;
  canAffordPurchase: boolean;
  extraAttemptCost: number;
  purchasedAttemptsAvailable: number;
  dailyAttemptPurchasesRemaining: number;
  onPurchase: () => void;
  className?: string;
}

function getRemainingNumberClass(remaining: number): string {
  if (remaining <= 1) return 'text-rose-400';
  if (remaining <= 2) return 'text-amber-400';
  return 'text-emerald-400';
}

export function GamePurchaseAttemptButton({
  visible,
  disabled,
  isPurchasing,
  canAffordPurchase,
  extraAttemptCost,
  purchasedAttemptsAvailable,
  dailyAttemptPurchasesRemaining,
  onPurchase,
  className,
}: GamePurchaseAttemptButtonProps) {
  const reduceMotion = useReducedMotion();

  if (!visible) {
    return null;
  }

  const hasReservedAttempt = purchasedAttemptsAvailable > 0;
  const purchaseLimitReached = dailyAttemptPurchasesRemaining <= 0;
  const numberClass = getRemainingNumberClass(dailyAttemptPurchasesRemaining);

  if (hasReservedAttempt) {
    return (
      <div
        className={cn(
          'flex w-full max-w-md flex-col items-center gap-1.5 text-center',
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <p className="pointer-events-none flex items-center justify-center gap-2 font-mono text-sm font-semibold text-emerald-400">
          <LucideIcons.CheckCircle className="h-4 w-4 shrink-0" aria-hidden />
          Попытка куплена
          {purchasedAttemptsAvailable > 1 && (
            <span className="font-normal text-emerald-400/80">
              · в резерве {purchasedAttemptsAvailable}
            </span>
          )}
        </p>
        <p className="pointer-events-none font-mono text-xs leading-relaxed text-zinc-400">
          Нажмите кнопку выше, чтобы играть
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flex w-full max-w-md flex-col items-center gap-2', className)}>
      <motion.button
        type="button"
        disabled={disabled || purchaseLimitReached || isPurchasing}
        onClick={onPurchase}
        whileHover={
          disabled || purchaseLimitReached || isPurchasing
            ? undefined
            : { scale: 1.02 }
        }
        whileTap={
          disabled || purchaseLimitReached || isPurchasing
            ? undefined
            : { scale: 0.98 }
        }
        className={cn(
          'flex w-full transform-gpu items-center justify-center gap-2 rounded-full',
          'border border-teal-500/30 bg-zinc-900/50 px-6 py-3',
          'font-mono text-sm font-semibold text-teal-400 will-change-transform',
          'transition-colors hover:bg-teal-500/10',
          'disabled:cursor-not-allowed disabled:opacity-40',
        )}
      >
        <LucideIcons.Coins size="sm" />
        {isPurchasing
          ? 'Покупка…'
          : `Купить попытку — ${extraAttemptCost} бонусов`}
      </motion.button>

      {purchaseLimitReached && (
        <p className="pointer-events-none text-center font-mono text-xs text-zinc-500">
          Лимит покупок на сегодня исчерпан ({MAX_DAILY_ATTEMPT_PURCHASES} в день)
        </p>
      )}

      {!purchaseLimitReached && !canAffordPurchase && (
        <p className="pointer-events-none text-center font-mono text-xs text-orange-400">
          Недостаточно бонусов для покупки ({extraAttemptCost})
        </p>
      )}

      {!purchaseLimitReached && canAffordPurchase && (
        <p
          className="pointer-events-none select-none text-center font-mono text-xs leading-relaxed"
          aria-live="polite"
        >
          <span className="text-zinc-400">Покупок сегодня осталось: </span>
          <motion.span
            key={dailyAttemptPurchasesRemaining}
            initial={reduceMotion ? false : { opacity: 0.7, y: 2 }}
            animate={
              reduceMotion
                ? { opacity: 1, y: 0 }
                : { opacity: [0.85, 1, 0.85], y: 0 }
            }
            transition={
              reduceMotion
                ? { duration: 0.2 }
                : {
                    opacity: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
                    y: { duration: 0.25 },
                  }
            }
            className={cn(
              'inline-block text-sm font-bold tabular-nums',
              numberClass,
            )}
          >
            {dailyAttemptPurchasesRemaining}
          </motion.span>
          <span className="text-zinc-500"> из </span>
          <span className="font-semibold tabular-nums text-teal-400/90">
            {MAX_DAILY_ATTEMPT_PURCHASES}
          </span>
        </p>
      )}
    </div>
  );
}
