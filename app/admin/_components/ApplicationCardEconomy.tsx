'use client';

import { formatAmount } from '@/lib/format';

type CardEconomy = {
  userLevel: number;
  userLevelAtSubmit: number | null;
  helpLimit: number;
  submitBonusCost: number;
  isFirstFree: boolean;
  requestedAmount?: number;
  desiredAmount?: number | null;
};

interface ApplicationCardEconomyProps {
  economy?: CardEconomy | null;
}

export function ApplicationCardEconomy({ economy }: ApplicationCardEconomyProps) {
  if (!economy) return null;

  const levelLabel = economy.userLevelAtSubmit ?? economy.userLevel;

  return (
    <div className="mb-4 rounded-xl border border-[#abd1c6]/25 bg-[#001e1d]/50 p-3 text-xs sm:text-sm">
      <p className="font-semibold uppercase tracking-wide text-[#abd1c6]">
        Экономика
      </p>
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[#e8f2ef]">
        {economy.requestedAmount != null && (
          <>
            <span className="text-[#94a1b2]">Запрошено</span>
            <span className="font-medium">
              {economy.requestedAmount.toLocaleString("ru-RU")} ₽
            </span>
          </>
        )}
        {economy.desiredAmount != null && economy.desiredAmount > 0 && (
          <>
            <span className="text-[#94a1b2]">Желаемая</span>
            <span className="font-medium text-[#f9bc60]">
              {economy.desiredAmount.toLocaleString("ru-RU")} ₽
            </span>
          </>
        )}
        <span className="text-[#94a1b2]">Уровень</span>
        <span className="font-medium">{levelLabel}</span>
        <span className="text-[#94a1b2]">Лимит</span>
        <span className="font-medium">до {economy.helpLimit} ₽</span>
        <span className="text-[#94a1b2]">Подача</span>
        <span className="font-medium">
          {economy.isFirstFree
            ? 'Бесплатно'
            : `${formatAmount(economy.submitBonusCost)} бонусов`}
        </span>
      </div>
    </div>
  );
}
