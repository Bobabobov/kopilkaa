'use client';

import { cn } from '@/lib/utils';
import { getLevelMilestoneDetails } from '@/lib/level-config';
import type { FirstWithdrawalBonusStatus } from '@/lib/bonusWithdrawals/firstWithdrawalBonus';
import { emptyFirstWithdrawalBonusStatus } from '@/lib/bonusWithdrawals/firstWithdrawalBonus';
import { ProfileLevelOneQuest } from './ProfileLevelOneQuest';
import { ProfileFirstWithdrawalBonusClaim } from './ProfileFirstWithdrawalBonusClaim';
import { ProfileNextLevelPreview } from './ProfileNextLevelPreview';

interface ProfileLevelQuickStripProps {
  currentLevel: number;
  availableBonuses?: number;
  firstWithdrawalBonus?: FirstWithdrawalBonusStatus;
  onBonusClaimed?: () => void;
  className?: string;
}

export function ProfileLevelQuickStrip({
  currentLevel,
  availableBonuses = 0,
  firstWithdrawalBonus = emptyFirstWithdrawalBonusStatus(),
  onBonusClaimed,
  className,
}: ProfileLevelQuickStripProps) {
  const levelOneMilestone = getLevelMilestoneDetails().find(
    (item) => item.level === 1,
  );
  const showLevelOneQuest =
    currentLevel <= 1 && levelOneMilestone?.quest != null;
  const showWithdrawalGift =
    currentLevel >= 3 &&
    currentLevel < 4 &&
    !firstWithdrawalBonus.claimed &&
    (firstWithdrawalBonus.claimable || firstWithdrawalBonus.promised);

  return (
    <div className={cn('space-y-3', className)}>
      {showLevelOneQuest && levelOneMilestone?.quest && (
        <ProfileLevelOneQuest
          quest={levelOneMilestone.quest}
          availableBonuses={availableBonuses}
        />
      )}

      {showWithdrawalGift && (
        <ProfileFirstWithdrawalBonusClaim
          bonus={firstWithdrawalBonus}
          onClaimed={onBonusClaimed}
        />
      )}

      <ProfileNextLevelPreview currentLevel={currentLevel} />
    </div>
  );
}
