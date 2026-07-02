'use client';

import type { FirstWithdrawalBonusStatus } from '@/lib/bonusWithdrawals/firstWithdrawalBonus';
import { ProfileBonusWithdrawCard } from '@/components/profile/ProfileBonusWithdrawCard';
import { ProfileFirstWithdrawalBonusClaim } from '@/components/profile/level-roadmap/ProfileFirstWithdrawalBonusClaim';

interface ProfileBonusWithdrawSectionProps {
  profileLevel: number;
  availableBonuses: number;
  bonusesInvestedInExperience?: number;
  hasPendingWithdrawal?: boolean;
  withdrawalBlocked?: boolean;
  firstWithdrawalBonus: FirstWithdrawalBonusStatus;
  onWithdrawClick: () => void;
  onBonusClaimed?: () => void;
}

export function ProfileBonusWithdrawSection({
  profileLevel,
  availableBonuses,
  bonusesInvestedInExperience = 0,
  hasPendingWithdrawal = false,
  withdrawalBlocked = false,
  firstWithdrawalBonus,
  onWithdrawClick,
  onBonusClaimed,
}: ProfileBonusWithdrawSectionProps) {
  return (
    <>
      <ProfileFirstWithdrawalBonusClaim
        bonus={firstWithdrawalBonus}
        className="mt-5"
        onClaimed={onBonusClaimed}
      />
      <ProfileBonusWithdrawCard
        profileLevel={profileLevel}
        availableBonuses={availableBonuses}
        bonusesInvestedInExperience={bonusesInvestedInExperience}
        hasPendingWithdrawal={hasPendingWithdrawal}
        withdrawalBlocked={withdrawalBlocked}
        onWithdrawClick={onWithdrawClick}
      />
    </>
  );
}
