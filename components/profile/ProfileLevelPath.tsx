'use client';

import { cn } from '@/lib/utils';
import {
  getLevelMilestoneDetails,
  getLevelRules,
  getMaxApplicationAmount,
  getNextMilestoneLevel,
} from '@/lib/level-config';
import type { FirstWithdrawalBonusStatus } from '@/lib/bonusWithdrawals/firstWithdrawalBonus';
import { emptyFirstWithdrawalBonusStatus } from '@/lib/bonusWithdrawals/firstWithdrawalBonus';
import { LucideIcons } from '@/components/ui/LucideIcons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ProfileLevelRoadmap } from '@/components/profile/level-roadmap/ProfileLevelRoadmap';
import { ProfileNextLevelPreview } from '@/components/profile/level-roadmap/ProfileNextLevelPreview';
import { ProfileLevelMilestonePanel } from '@/components/profile/level-roadmap/ProfileLevelMilestonePanel';

interface ProfileLevelPathProps {
  currentLevel: number;
  availableBonuses?: number;
  firstWithdrawalBonus?: FirstWithdrawalBonusStatus;
  onBonusClaimed?: () => void;
  className?: string;
  collapsible?: boolean;
}

function LevelPathContent({
  currentLevel,
  availableBonuses = 0,
  firstWithdrawalBonus = emptyFirstWithdrawalBonusStatus(),
  onBonusClaimed,
}: {
  currentLevel: number;
  availableBonuses?: number;
  firstWithdrawalBonus?: FirstWithdrawalBonusStatus;
  onBonusClaimed?: () => void;
}) {
  const levelOneMilestone = getLevelMilestoneDetails().find(
    (item) => item.level === 1,
  );
  const levelTwoMilestone = getLevelMilestoneDetails().find(
    (item) => item.level === 2,
  );
  const levelThreeMilestone = getLevelMilestoneDetails().find(
    (item) => item.level === 3,
  );
  const showLevelOnePanel = currentLevel <= 1 && levelOneMilestone != null;
  const showLevelTwoPanel =
    currentLevel >= 2 && currentLevel < 3 && levelTwoMilestone != null;
  const showLevelThreePanel =
    currentLevel >= 3 && currentLevel < 4 && levelThreeMilestone != null;

  return (
    <div className="space-y-4">
      <ProfileNextLevelPreview currentLevel={currentLevel} />

      {showLevelOnePanel && (
        <ProfileLevelMilestonePanel
          detail={levelOneMilestone}
          currentLevel={currentLevel}
          availableBonuses={availableBonuses}
        />
      )}

      {showLevelTwoPanel && (
        <ProfileLevelMilestonePanel
          detail={levelTwoMilestone}
          currentLevel={currentLevel}
          availableBonuses={availableBonuses}
        />
      )}

      {showLevelThreePanel && (
        <ProfileLevelMilestonePanel
          detail={levelThreeMilestone}
          currentLevel={currentLevel}
          availableBonuses={availableBonuses}
          firstWithdrawalBonus={firstWithdrawalBonus}
          onBonusClaimed={onBonusClaimed}
        />
      )}

      {currentLevel > 1 && !showLevelTwoPanel && !showLevelThreePanel && (
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#94a1b2]">
          Карта вех
        </p>
      )}

      <ProfileLevelRoadmap
        currentLevel={currentLevel}
        availableBonuses={availableBonuses}
        hideDetailWhen={(level) =>
          (showLevelOnePanel && level === 1) ||
          (showLevelTwoPanel && level === 2) ||
          (showLevelThreePanel && level === 3)
        }
      />
    </div>
  );
}

export function ProfileLevelPath({
  currentLevel,
  availableBonuses = 0,
  firstWithdrawalBonus = emptyFirstWithdrawalBonusStatus(),
  onBonusClaimed,
  className,
  collapsible = false,
}: ProfileLevelPathProps) {
  if (collapsible) {
    const currentLimit = getMaxApplicationAmount(currentLevel);
    const nextMilestone = getNextMilestoneLevel(currentLevel);
    const nextMilestoneInDev =
      nextMilestone != null && getLevelRules(nextMilestone).inDevelopment;

    return (
      <Accordion
        type="single"
        collapsible
        className={cn(
          'overflow-hidden rounded-xl border border-emerald-500/10 bg-emerald-950/30',
          className,
        )}
      >
        <AccordionItem value="level-path" className="border-0">
          <AccordionTrigger
            className={cn(
              'group gap-3 px-4 py-3',
              'text-left hover:no-underline hover:bg-emerald-950/40',
              '[&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-emerald-400',
            )}
          >
            <span className="flex min-w-0 flex-1 items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-950/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                aria-hidden
              >
                <LucideIcons.Sparkles className="h-4 w-4" />
              </span>

              <span className="min-w-0 flex-1 text-left">
                <span className="text-sm font-medium text-zinc-200">
                  Путь уровней
                </span>
                <span className="mt-1 block text-xs text-zinc-500">
                  Преимущества, подсказки и цели
                </span>
                <span className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                  <span>
                    Сейчас: ур. {currentLevel} · до {currentLimit} ₽
                  </span>
                  {nextMilestone != null && (
                    <span
                      className={
                        nextMilestoneInDev ? 'text-zinc-500' : 'text-emerald-400'
                      }
                    >
                      Следующая веха: ур. {nextMilestone}
                      {nextMilestoneInDev ? ' (скоро)' : ''}
                    </span>
                  )}
                </span>
              </span>
            </span>
          </AccordionTrigger>

          <AccordionContent className="border-t border-emerald-500/10 px-3 pb-4 pt-3 sm:px-4">
            <LevelPathContent
              currentLevel={currentLevel}
              availableBonuses={availableBonuses}
              firstWithdrawalBonus={firstWithdrawalBonus}
              onBonusClaimed={onBonusClaimed}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5',
        className,
      )}
      aria-label="Путь уровней"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[#f9bc60]">
        Путь уровней
      </p>
      <div className="mt-3">
        <LevelPathContent
          currentLevel={currentLevel}
          availableBonuses={availableBonuses}
          firstWithdrawalBonus={firstWithdrawalBonus}
          onBonusClaimed={onBonusClaimed}
        />
      </div>
    </div>
  );
}
