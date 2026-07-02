'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Coins, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatExperience } from '@/lib/format';
import {
  getMaxApplicationAmount,
  getNextLevelMilestonePreview,
} from '@/lib/level-config';
import {
  bonusesToDisplayExperience,
  displayExperienceToBonusesNeeded,
} from '@/lib/userLevel/economy';
import type { UserLevelProgress } from '@/lib/userLevel';
import { LevelProgressRing } from '@/components/profile/LevelProgressRing';
import { LevelsSectionHeader } from './LevelsSectionHeader';

interface LevelsDashboardProps {
  userLevel: UserLevelProgress;
  availableBonuses: number;
}

function StatCell({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col justify-center bg-[#001e1d]/50 px-4 py-4 sm:px-5 sm:py-5">
      <p className="text-xs font-medium text-[#abd1c6]/60">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums tracking-tight text-[#fffffe] sm:text-2xl">
        {value}
      </p>
      {sub ? (
        <p className="mt-1 text-xs leading-snug text-[#abd1c6]/55">{sub}</p>
      ) : null}
    </div>
  );
}

export function LevelsDashboard({
  userLevel,
  availableBonuses,
}: LevelsDashboardProps) {
  const {
    level,
    progressPercent,
    nextLevel,
    xpToNextLevel,
    xpInCurrentLevel,
    xpNeededForNext,
  } = userLevel;
  const honorLimit = getMaxApplicationAmount(level);
  const preview = getNextLevelMilestonePreview(level);
  const investableXp = bonusesToDisplayExperience(availableBonuses);
  const bonusesNeeded = displayExperienceToBonusesNeeded(xpToNextLevel);

  return (
    <motion.section
      id="levels-dashboard"
      aria-label="Ваш прогресс"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-28"
    >
      <LevelsSectionHeader
        kicker="Статус"
        title="Ваш прогресс"
        subtitle="Текущий уровень и ближайшие цели"
      />

      <Card
        variant="darkGlass"
        padding="none"
        className="overflow-hidden border-white/[0.06] bg-[#004643]/25 backdrop-blur-xl"
      >
        <div className="flex flex-col lg:flex-row">
          <div className="flex items-center justify-center border-b border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent px-6 py-8 lg:w-[220px] lg:shrink-0 lg:border-b-0 lg:border-r xl:w-[240px]">
            <LevelProgressRing
              level={level}
              progressPercent={progressPercent}
              size="md"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] border-b border-white/[0.06]">
              <StatCell
                label="Лимит гонорара"
                value={`до ${honorLimit} ₽`}
              />
              <StatCell
                label="Баланс бонусов"
                value={availableBonuses.toLocaleString('ru-RU')}
                sub={
                  investableXp > 0
                    ? `+${formatExperience(investableXp)} опыта при вложении`
                    : undefined
                }
              />
              <StatCell
                label="До следующего уровня"
                value={
                  xpNeededForNext > 0
                    ? formatExperience(xpToNextLevel)
                    : 'Максимум'
                }
                sub={
                  xpNeededForNext > 0
                    ? `~${bonusesNeeded.toLocaleString('ru-RU')} бон.`
                    : undefined
                }
              />
              <StatCell
                label="Опыт в уровне"
                value={`${formatExperience(xpInCurrentLevel)} / ${formatExperience(xpNeededForNext || 0)}`}
                sub={
                  xpNeededForNext > 0
                    ? `${progressPercent}% пройдено`
                    : undefined
                }
              />
            </div>

            <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5">
              {preview && xpNeededForNext > 0 ? (
                <p className="text-sm text-[#abd1c6]/75">
                  Уровень {nextLevel}:{' '}
                  <span className="font-medium text-[#fffffe]">
                    {preview.detail.headline}
                  </span>
                  {preview.detail.maxApplicationAmount != null && (
                    <span className="text-[#f9bc60]">
                      {' '}
                      · до {preview.detail.maxApplicationAmount} ₽
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-sm text-[#abd1c6]/75">
                  Достигнут максимальный активный уровень
                </p>
              )}

              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href="/profile#profile-wallet"
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#f9bc60] px-4 text-sm font-semibold text-[#001e1d] transition-opacity hover:opacity-90"
                >
                  <Coins className="h-4 w-4" />
                  Вложить
                </Link>
                <a
                  href="#levels-earn"
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 text-sm font-medium text-[#abd1c6] transition-colors hover:bg-white/[0.07] hover:text-[#fffffe]"
                >
                  <Wallet className="h-4 w-4" />
                  Заработать
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.section>
  );
}
