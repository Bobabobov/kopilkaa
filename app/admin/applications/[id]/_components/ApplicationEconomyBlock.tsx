'use client';

import { formatAmount } from '@/lib/format';
import { getMaxApplicationAmount } from '@/lib/level-config';

export type ApplicationEconomyAdminInfo = {
  userLevel: number;
  userLevelAtSubmit: number | null;
  helpLimit: number;
  submitBonusCost: number;
  isFirstFree: boolean;
  hoursSincePrevious: string | null;
  availableBonuses: number;
  requestedAmount?: number;
  desiredAmount?: number | null;
};

interface ApplicationEconomyAdminBlockProps {
  economy: ApplicationEconomyAdminInfo;
  className?: string;
}

export function ApplicationEconomyAdminBlock({
  economy,
  className,
}: ApplicationEconomyAdminBlockProps) {
  const {
    userLevel,
    userLevelAtSubmit,
    helpLimit,
    submitBonusCost,
    isFirstFree,
    hoursSincePrevious,
    availableBonuses,
    requestedAmount,
    desiredAmount,
  } = economy;

  const levelLabel = userLevelAtSubmit ?? userLevel;

  return (
    <div
      className={className}
      aria-label="Экономика заявки"
    >
      <div className="rounded-2xl border border-[#abd1c6]/30 bg-[#001e1d]/45 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#abd1c6]">
          Экономика заявки
        </p>
        <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {requestedAmount != null && (
            <div>
              <dt className="text-[#94a1b2]">Запрошенная сумма</dt>
              <dd className="font-semibold text-[#fffffe]">
                {requestedAmount.toLocaleString("ru-RU")} ₽
              </dd>
            </div>
          )}
          {desiredAmount != null && desiredAmount > 0 && (
            <div>
              <dt className="text-[#94a1b2]">Желаемая сумма</dt>
              <dd className="font-semibold text-[#f9bc60]">
                {desiredAmount.toLocaleString("ru-RU")} ₽
              </dd>
            </div>
          )}
          <div>
            <dt className="text-[#94a1b2]">Уровень пользователя</dt>
            <dd className="font-semibold text-[#fffffe]">{levelLabel}</dd>
          </div>
          <div>
            <dt className="text-[#94a1b2]">Лимит помощи</dt>
            <dd className="font-semibold text-[#fffffe]">
              до {helpLimit} ₽
            </dd>
          </div>
          <div>
            <dt className="text-[#94a1b2]">Стоимость подачи</dt>
            <dd className="font-semibold text-[#fffffe]">
              {isFirstFree
                ? 'Первая заявка бесплатная'
                : `${formatAmount(submitBonusCost)} бонусов`}
            </dd>
          </div>
          <div>
            <dt className="text-[#94a1b2]">Списано бонусов</dt>
            <dd className="font-semibold text-[#fffffe]">
              {formatAmount(submitBonusCost)}
            </dd>
          </div>
          <div>
            <dt className="text-[#94a1b2]">С прошлой заявки</dt>
            <dd className="font-semibold text-[#fffffe]">
              {hoursSincePrevious ?? '—'}
            </dd>
          </div>
          <div>
            <dt className="text-[#94a1b2]">Баланс бонусов сейчас</dt>
            <dd className="font-semibold text-[#f9bc60]">
              {formatAmount(availableBonuses)}
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-[#94a1b2]">
          Текущий лимит по уровню {userLevel}: до{' '}
          {getMaxApplicationAmount(userLevel)} ₽
        </p>
      </div>
    </div>
  );
}
