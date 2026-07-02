'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useBeautifulToast } from '@/components/ui/BeautifulToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatAmount, formatExperience } from '@/lib/format';
import { getMessageFromApiJson } from '@/lib/api/parseApiError';
import {
  BONUS_LEVEL_LABEL,
  LEVEL_BENEFIT_HINT,
  bonusesToDisplayExperience,
  displayExperienceToBonusesNeeded,
} from '@/lib/userLevel/economy';
import { ProfileLevelQuickStrip } from '@/components/profile/level-roadmap/ProfileLevelQuickStrip';
import { LevelProgressRing } from '@/components/profile/LevelProgressRing';
import { BonusWithdrawModal } from '@/components/profile/BonusWithdrawModal';
import { ProfileBonusWithdrawSection } from '@/components/profile/ProfileBonusWithdrawSection';
import type { FirstWithdrawalBonusStatus } from '@/lib/bonusWithdrawals/firstWithdrawalBonus';
import { emptyFirstWithdrawalBonusStatus } from '@/lib/bonusWithdrawals/firstWithdrawalBonus';
import { ProfileSectionTitle } from '@/components/profile/ProfileSectionTitle';
import {
  PROFILE_EMERALD_INPUT,
  PROFILE_EMERALD_PANEL,
} from '@/components/profile/profileEmerald';
import { invalidateProfileCache } from '@/hooks/profile/useProfileDashboard';
import type { UserLevelProgress } from '@/lib/userLevel';
import { getMaxApplicationAmount } from '@/lib/level-config';
import { BONUS_WITHDRAWAL_BLOCKED_MESSAGE } from '@/lib/admin/bonusWithdrawalBlock';

interface ProfileLevelSectionProps {
  userLevel: UserLevelProgress;
  availableBonuses?: number;
  firstWithdrawalBonus?: FirstWithdrawalBonusStatus;
  onBonusClaimed?: () => void;
}

interface ProfileWalletSectionProps {
  userLevel: UserLevelProgress;
  availableBonuses: number;
  bonusesInvestedInExperience?: number;
  hasPendingWithdrawal?: boolean;
  withdrawalBlocked?: boolean;
  firstWithdrawalBonus?: FirstWithdrawalBonusStatus;
  onInvested?: () => void;
  onWithdrawn?: () => void;
}

interface ProfileLevelStatProps {
  label: string;
  value: string;
  sub?: string;
}

function ProfileLevelStat({ label, value, sub }: ProfileLevelStatProps) {
  return (
    <div className="flex flex-col justify-center bg-[#001e1d]/40 px-3 py-3 sm:px-3.5 sm:py-3.5">
      <p className="text-[10px] font-medium text-[#abd1c6]/55 sm:text-[11px]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums tracking-tight text-[#fffffe] sm:text-base">
        {value}
      </p>
      {sub ? (
        <p className="mt-0.5 text-[10px] leading-snug text-[#abd1c6]/50 sm:text-[11px]">
          {sub}
        </p>
      ) : null}
    </div>
  );
}

export function ProfileLevelSection({
  userLevel,
  availableBonuses = 0,
  firstWithdrawalBonus = emptyFirstWithdrawalBonusStatus(),
  onBonusClaimed,
}: ProfileLevelSectionProps) {
  const {
    level,
    xpInCurrentLevel,
    xpNeededForNext,
    xpToNextLevel,
    progressPercent,
    nextLevel,
  } = userLevel;

  const honorLimit = getMaxApplicationAmount(level);
  const investableXp = bonusesToDisplayExperience(availableBonuses);
  const bonusesNeeded =
    xpNeededForNext > 0 ? displayExperienceToBonusesNeeded(xpToNextLevel) : 0;

  return (
    <article className={PROFILE_EMERALD_PANEL}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <ProfileSectionTitle
          imageSrc="/icon/pig6.png"
          imageAlt="Уровень профиля"
          title="Уровень профиля"
          subtitle={
            xpNeededForNext > 0
              ? `${progressPercent}% до уровня ${nextLevel}`
              : 'Максимальный уровень в текущей ветке'
          }
          className="mb-0 min-w-0"
        />
        <Link
          href="/profile/levels"
          className="mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#f9bc60]/40 bg-[#f9bc60]/12 px-3 py-2 text-xs font-semibold text-[#f9bc60] shadow-[0_2px_12px_rgba(0,0,0,0.25)] transition-colors hover:border-[#f9bc60]/60 hover:bg-[#f9bc60]/20"
        >
          <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="hidden xs:inline">О системе</span>
          <span className="xs:hidden">Инфо</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#004643]/35 via-[#001e1d]/45 to-transparent">
        {/* Мобильный: кольцо и статы в одну колонку */}
        <div className="flex flex-col gap-3 p-3.5 sm:hidden">
          <div className="flex items-center gap-3">
            <LevelProgressRing
              level={level}
              progressPercent={progressPercent}
              size="xs"
              className="shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#fffffe]">
                Лимит до {honorLimit} ₽
              </p>
              <p className="mt-0.5 text-xs text-[#abd1c6]/70">
                {xpNeededForNext > 0
                  ? `${formatExperience(xpToNextLevel)} до ур. ${nextLevel}`
                  : 'Максимальный уровень'}
              </p>
              <p className="mt-0.5 text-[11px] tabular-nums text-[#abd1c6]/55">
                Баланс: {formatAmount(availableBonuses)} бон.
              </p>
            </div>
          </div>

          {xpNeededForNext > 0 ? (
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px]">
                <span className="text-[#abd1c6]/55">Опыт на уровне</span>
                <span className="font-mono tabular-nums text-[#abd1c6]/75">
                  {formatExperience(xpInCurrentLevel)} /{' '}
                  {formatExperience(xpNeededForNext)}
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-black/30 ring-1 ring-white/[0.06]"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Прогресс до уровня ${nextLevel}`}
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#f9bc60] via-[#ffd089] to-emerald-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              {bonusesNeeded > 0 ? (
                <p className="mt-1.5 text-[10px] text-[#abd1c6]/50">
                  ~{bonusesNeeded.toLocaleString('ru-RU')} бон. при вложении в опыт
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Планшет и выше: кольцо + сетка 2×2 */}
        <div className="hidden flex-col gap-4 p-4 sm:flex sm:flex-row sm:items-stretch sm:gap-5 sm:p-5">
          <div className="flex shrink-0 items-center justify-center sm:justify-start">
            <LevelProgressRing
              level={level}
              progressPercent={progressPercent}
              size="md"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.06]">
              <ProfileLevelStat
                label="Лимит гонорара"
                value={`до ${honorLimit} ₽`}
              />
              <ProfileLevelStat
                label="Баланс бонусов"
                value={formatAmount(availableBonuses)}
                sub={
                  investableXp > 0
                    ? `+${formatExperience(investableXp)} опыта при вложении`
                    : undefined
                }
              />
              <ProfileLevelStat
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
              <ProfileLevelStat
                label="Опыт на уровне"
                value={
                  xpNeededForNext > 0
                    ? `${formatExperience(xpInCurrentLevel)} / ${formatExperience(xpNeededForNext)}`
                    : formatExperience(xpInCurrentLevel)
                }
                sub={xpNeededForNext > 0 ? `${progressPercent}% пройдено` : undefined}
              />
            </div>
          </div>
        </div>

        {xpNeededForNext > 0 ? (
          <div className="hidden border-t border-white/[0.06] px-4 py-3 sm:block sm:px-5">
            <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px]">
              <span className="text-[#abd1c6]/55">Прогресс до уровня {nextLevel}</span>
              <span className="font-mono tabular-nums text-[#abd1c6]/75">
                {formatExperience(xpInCurrentLevel)} / {formatExperience(xpNeededForNext)}
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-black/30 ring-1 ring-white/[0.06]"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Прогресс до уровня ${nextLevel}`}
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#f9bc60] via-[#ffd089] to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <ProfileLevelQuickStrip
        currentLevel={level}
        availableBonuses={availableBonuses}
        firstWithdrawalBonus={firstWithdrawalBonus}
        onBonusClaimed={onBonusClaimed}
        className="mt-4 space-y-3"
      />

      <p className="mt-3 text-center text-[11px] text-[#abd1c6]/45 sm:text-left">
        <Link
          href="/profile/levels#levels-earn"
          className="text-[#f9bc60]/80 underline-offset-2 transition-colors hover:text-[#f9bc60] hover:underline"
        >
          Как набирать опыт
        </Link>
        <span className="mx-1.5 text-white/15">·</span>
        <Link
          href="/profile/levels#levels-catalog"
          className="text-[#abd1c6]/70 underline-offset-2 transition-colors hover:text-[#abd1c6] hover:underline"
        >
          Все вехи уровней
        </Link>
      </p>
    </article>
  );
}

export function ProfileWalletSection({
  userLevel,
  availableBonuses,
  bonusesInvestedInExperience = 0,
  hasPendingWithdrawal = false,
  withdrawalBlocked = false,
  firstWithdrawalBonus = emptyFirstWithdrawalBonusStatus(),
  onInvested,
  onWithdrawn,
}: ProfileWalletSectionProps) {
  const { showToast } = useBeautifulToast();
  const [amountInput, setAmountInput] = useState('');
  const [investing, setInvesting] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const canInvest = availableBonuses > 0 && !investing;

  const investBonuses = async (amount: number) => {
    if (amount < 1 || investing) return;

    setInvesting(true);
    try {
      const response = await fetch('/api/profile/bonuses/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountBonuses: amount }),
      });
      const json = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(json, 'Не удалось вложить бонусы'),
        );
      }

      const invested = json?.data?.investedBonuses ?? amount;
      const xpGain = bonusesToDisplayExperience(invested);
      showToast(
        'success',
        `Вложено ${formatAmount(invested)} бонусов`,
        `+${formatExperience(xpGain)} опыта`,
      );
      setAmountInput('');
      invalidateProfileCache();
      onInvested?.();
    } catch (error) {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Не удалось вложить бонусы',
      );
    } finally {
      setInvesting(false);
    }
  };

  const handleInvestSubmit = () => {
    const amount = Number.parseInt(amountInput, 10);
    if (!Number.isFinite(amount) || amount < 1) {
      showToast('error', 'Укажите количество бонусов');
      return;
    }
    if (amount > availableBonuses) {
      showToast('error', 'Недостаточно бонусов на балансе');
      return;
    }
    void investBonuses(amount);
  };

  return (
    <>
      <article id="profile-wallet" className={PROFILE_EMERALD_PANEL}>
        <ProfileSectionTitle
          imageSrc="/icon/pig9.png"
          imageAlt="Баланс бонусов"
          title="Баланс бонусов"
          subtitle={`${BONUS_LEVEL_LABEL}. ${LEVEL_BENEFIT_HINT}`}
          className="mb-5"
        />

        <p
          className="font-mono text-3xl font-bold text-emerald-400 drop-shadow-[0_0_8px_#10b981] sm:text-4xl"
          aria-label={`Доступно ${formatAmount(availableBonuses)} бонусов`}
        >
          {formatAmount(availableBonuses)}
        </p>

        {bonusesInvestedInExperience > 0 && (
          <p className="mt-2 text-xs text-zinc-400">
            Уже вложено в опыт:{' '}
            <span className="font-semibold tabular-nums text-zinc-300">
              {formatAmount(bonusesInvestedInExperience)}
            </span>
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            type="number"
            min={1}
            max={availableBonuses}
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder="Сколько вложить"
            disabled={!canInvest}
            className={PROFILE_EMERALD_INPUT}
          />
          <Button
            type="button"
            disabled={!canInvest || !amountInput}
            onClick={handleInvestSubmit}
            className="h-10 shrink-0 rounded-xl bg-emerald-600 px-5 font-semibold text-white hover:bg-emerald-500 disabled:opacity-40 sm:min-w-[7.5rem]"
          >
            {investing ? '…' : 'Вложить'}
          </Button>
        </div>

        {withdrawalBlocked && (
          <p className="mt-3 text-xs leading-relaxed text-red-300/90">
            {BONUS_WITHDRAWAL_BLOCKED_MESSAGE}
          </p>
        )}

        <ProfileBonusWithdrawSection
          profileLevel={userLevel.level}
          availableBonuses={availableBonuses}
          bonusesInvestedInExperience={bonusesInvestedInExperience}
          hasPendingWithdrawal={hasPendingWithdrawal}
          withdrawalBlocked={withdrawalBlocked}
          firstWithdrawalBonus={firstWithdrawalBonus}
          onWithdrawClick={() => setWithdrawOpen(true)}
          onBonusClaimed={() => {
            invalidateProfileCache();
            onWithdrawn?.();
          }}
        />
      </article>

      <BonusWithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        profileLevel={userLevel.level}
        availableBonuses={availableBonuses}
        hasPendingWithdrawal={hasPendingWithdrawal}
        withdrawalBlocked={withdrawalBlocked}
        showToast={showToast}
        onSuccess={() => {
          invalidateProfileCache();
          onWithdrawn?.();
        }}
      />
    </>
  );
}
