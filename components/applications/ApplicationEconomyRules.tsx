'use client';

import { cn } from '@/lib/utils';
import type { ApplicationEligibility } from '@/lib/applications/applicationEconomy';
import { formatCooldownRemaining } from '@/lib/level-config';
import { formatAmount } from '@/lib/format';
import { INSUFFICIENT_BONUSES_ERROR } from '@/lib/level-config';
import Link from 'next/link';
import { LucideIcons } from '@/components/ui/LucideIcons';

interface ApplicationEconomyRulesProps {
  eligibility: ApplicationEligibility | null;
  loading?: boolean;
  className?: string;
  /** Крупный блок на 1 шаге вместо выбора категории */
  variant?: 'sidebar' | 'step-gate' | 'embedded';
}

export function ApplicationEconomyRules({
  eligibility,
  loading = false,
  className,
  variant = 'sidebar',
}: ApplicationEconomyRulesProps) {
  if (loading) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-[#94a1b2]',
          className,
        )}
      >
        Загружаем условия подачи…
      </div>
    );
  }

  if (!eligibility) return null;

  const {
    userLevel,
    maxApplicationAmount,
    submitCost,
    standardSubmitCost,
    publishDiscountLabel,
    isFirstApplication,
    cooldownLabel,
    cooldownRemainingMs,
    availableBonuses,
  } = eligibility;

  const insufficientBonuses =
    submitCost > 0 && submitCost > availableBonuses;

  const isStepGate = variant === 'step-gate';
  const isEmbedded = variant === 'embedded';

  return (
    <div
      className={cn(
        !isEmbedded && 'rounded-2xl border p-4 sm:p-5',
        !isEmbedded &&
          (insufficientBonuses
            ? 'border-[#e16162]/60 bg-gradient-to-br from-[#e16162]/20 via-[#e16162]/8 to-[#001e1d]/30 shadow-[0_0_20px_rgba(225,97,98,0.15)]'
            : 'border-[#f9bc60]/25 bg-[#f9bc60]/[0.06]'),
        isEmbedded &&
          'rounded-2xl border border-[#f9bc60]/25 bg-[#f9bc60]/[0.06] p-4 sm:p-5',
        isEmbedded &&
          insufficientBonuses &&
          'border-[#e16162]/60 bg-gradient-to-br from-[#e16162]/20 via-[#e16162]/8 to-[#001e1d]/30 shadow-[0_0_20px_rgba(225,97,98,0.15)]',
        isStepGate && insufficientBonuses && 'p-5 sm:p-7',
        className,
      )}
      aria-label="Условия публикации истории"
    >
      {insufficientBonuses && (
        <div
          role="alert"
          className={cn(
            'mb-4 flex gap-3 rounded-xl border border-[#e16162]/50 bg-[#e16162]/15 p-3',
            isStepGate && 'mb-5 p-4 sm:p-5',
          )}
        >
          <div
            className={cn(
              'flex shrink-0 items-center justify-center rounded-xl border border-[#e16162]/50 bg-[#e16162]/20 text-[#ffb4b4]',
              isStepGate ? 'h-12 w-12' : 'h-8 w-8',
            )}
          >
            <LucideIcons.Alert size={isStepGate ? 'md' : 'sm'} />
          </div>
          <div className="min-w-0">
            <p
              className={cn(
                'font-bold text-[#ffb4b4]',
                isStepGate ? 'text-lg sm:text-xl' : 'text-sm',
              )}
            >
              {INSUFFICIENT_BONUSES_ERROR}
            </p>
            <p
              className={cn(
                'mt-1 text-[#fffffe]/85',
                isStepGate ? 'text-sm sm:text-base' : 'text-sm',
              )}
            >
              Нужно {formatAmount(submitCost)}, на балансе{' '}
              {formatAmount(availableBonuses)}.
            </p>
            <p
              className={cn(
                'mt-2 text-[#abd1c6]',
                isStepGate ? 'text-sm' : 'hidden',
              )}
            >
              Бонусы можно копить или обменивать на опыт. Получите ежедневный
              бонус и выполняйте добрые дела.
            </p>
            <Link
              href="/profile"
              className={cn(
                'mt-2 inline-flex items-center gap-1 font-semibold text-[#f9bc60] hover:underline',
                isStepGate ? 'text-sm sm:text-base' : 'text-sm',
              )}
            >
              Копить бонусы в профиле
              <LucideIcons.ArrowRight size="xs" />
            </Link>
          </div>
        </div>
      )}

      <p
        className={cn(
          'text-xs font-semibold uppercase tracking-wider',
          insufficientBonuses ? 'text-[#ffb4b4]' : 'text-[#f9bc60]',
        )}
      >
        Условия подачи
      </p>

      <ul className="mt-3 space-y-2 text-sm text-[#e8f2ef]">
        <li>
          <span className="text-[#94a1b2]">Ваш уровень:</span>{' '}
          <span className="font-semibold">{userLevel}</span>
        </li>
        <li>
          <span className="text-[#94a1b2]">Доступная сумма:</span>{' '}
          <span className="font-semibold">до {maxApplicationAmount} ₽</span>
        </li>

        {submitCost === 0 ? (
          <>
            <li className="font-medium text-[#abd1c6]">
              Первая публикация бесплатная.
            </li>
            <li className="text-[#94a1b2]">
              Чем выше уровень — тем больше гонорар можно запросить.
            </li>
          </>
        ) : (
          <>
            <li>
              <span className="text-[#94a1b2]">Стоимость подачи:</span>{' '}
              <span className="font-semibold">
                {formatAmount(submitCost)} бонусов
                {publishDiscountLabel &&
                  standardSubmitCost > submitCost && (
                    <span className="ml-1.5 text-[#94a1b2] line-through">
                      {formatAmount(standardSubmitCost)}
                    </span>
                  )}
              </span>
            </li>
            {publishDiscountLabel && (
              <li className="text-[#abd1c6]">{publishDiscountLabel}</li>
            )}
            <li>
              <span className="text-[#94a1b2]">Интервал:</span>{' '}
              <span className="font-semibold">{cooldownLabel}</span>
            </li>
            {cooldownRemainingMs != null && cooldownRemainingMs > 0 && (
              <li className="text-[#f9bc60]">
                Следующую историю можно опубликовать через:{' '}
                {formatCooldownRemaining(cooldownRemainingMs)}
              </li>
            )}
            <li className="text-[#94a1b2]">
              На балансе:{' '}
              <span
                className={cn(
                  'font-semibold',
                  insufficientBonuses ? 'text-[#ffb4b4]' : 'text-[#fffffe]',
                )}
              >
                {formatAmount(availableBonuses)} бонусов
              </span>
            </li>
          </>
        )}
      </ul>

      {!isFirstApplication && submitCost > 0 && (
        <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-relaxed text-[#94a1b2]">
          Если материал отклонят, бонусы не возвращаются.
        </p>
      )}
    </div>
  );
}
