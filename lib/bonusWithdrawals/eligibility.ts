import {
  MIN_WITHDRAWAL_PROFILE_LEVEL,
  getMinWithdrawalBonuses,
} from '@/lib/bonusWithdrawals/constants';

export function isBonusWithdrawalLevelUnlocked(profileLevel: number): boolean {
  return profileLevel >= MIN_WITHDRAWAL_PROFILE_LEVEL;
}

export function bonusWithdrawalLevelMessage(): string {
  return `Вывод гонорара доступен с ${MIN_WITHDRAWAL_PROFILE_LEVEL} уровня профиля`;
}

type WithdrawalGateParams = {
  profileLevel: number;
  availableBonuses: number;
  hasPendingWithdrawal: boolean;
  withdrawalBlocked: boolean;
};

export function canRequestBonusWithdrawal(params: WithdrawalGateParams): boolean {
  const minBonuses = getMinWithdrawalBonuses(params.profileLevel);
  return (
    isBonusWithdrawalLevelUnlocked(params.profileLevel) &&
    params.availableBonuses >= minBonuses &&
    !params.hasPendingWithdrawal &&
    !params.withdrawalBlocked
  );
}

export function bonusWithdrawalButtonLabel(params: WithdrawalGateParams): string {
  const minBonuses = getMinWithdrawalBonuses(params.profileLevel);
  if (params.withdrawalBlocked) {
    return 'Вывод гонорара заблокирован';
  }
  if (params.hasPendingWithdrawal) {
    return 'Запрос на проверке';
  }
  if (!isBonusWithdrawalLevelUnlocked(params.profileLevel)) {
    return `Вывод с ${MIN_WITHDRAWAL_PROFILE_LEVEL} уровня`;
  }
  if (params.availableBonuses < minBonuses) {
    return `Вывод от ${minBonuses} бонусов`;
  }
  return 'Вывести гонорар';
}
