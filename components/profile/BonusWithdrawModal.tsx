'use client';

import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { GlassModal } from '@/components/ui/GlassModal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { ToastType } from '@/components/ui/BeautifulToast';
import { throwIfApiFailed } from '@/lib/api/parseApiError';
import {
  getMinWithdrawalBonuses,
  MIN_WITHDRAWAL_PROFILE_LEVEL,
} from '@/lib/bonusWithdrawals/constants';
import {
  calculateWithdrawalPayout,
  formatWithdrawalCommissionHint,
  getWithdrawalCommissionPercent,
} from '@/lib/bonusWithdrawals/commission';
import {
  bonusWithdrawalLevelMessage,
  isBonusWithdrawalLevelUnlocked,
} from '@/lib/bonusWithdrawals/eligibility';
import { BONUS_WITHDRAWAL_BLOCKED_MESSAGE } from '@/lib/admin/bonusWithdrawalBlock';
import {
  getBonusWithdrawalBankError,
  getBonusWithdrawalPhoneError,
} from '@/lib/bonusWithdrawals/validateWithdrawalInput';
import { SbpPaymentNotice } from '@/components/sbp/SbpPaymentNotice';
import { detectSbpPhoneCountry } from '@/lib/sbp/validatePhone';
import type { SbpPhoneCountryId } from '@/lib/sbp/sbpPhoneCountries';
import { RussianBankSelect } from '@/components/sbp/RussianBankSelect';
import { SbpPhoneField } from '@/components/sbp/SbpPhoneField';
import { WithdrawalPayoutBreakdown } from '@/components/profile/WithdrawalPayoutBreakdown';

type Props = {
  open: boolean;
  onClose: () => void;
  profileLevel: number;
  availableBonuses: number;
  hasPendingWithdrawal: boolean;
  withdrawalBlocked: boolean;
  showToast: (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number,
  ) => void;
  onSuccess?: () => void;
};

export function BonusWithdrawModal({
  open,
  onClose,
  profileLevel,
  availableBonuses,
  hasPendingWithdrawal,
  withdrawalBlocked,
  showToast,
  onSuccess,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [amountBonuses, setAmountBonuses] = useState('');
  const [bankName, setBankName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneCountryId, setPhoneCountryId] = useState<SbpPhoneCountryId>('RU');

  const minWithdrawalBonuses = getMinWithdrawalBonuses(profileLevel);
  const commissionPercent = getWithdrawalCommissionPercent(profileLevel);
  const parsedAmount = parseInt(amountBonuses, 10);
  const payoutPreview =
    Number.isFinite(parsedAmount) && parsedAmount >= minWithdrawalBonuses
      ? calculateWithdrawalPayout(parsedAmount, profileLevel)
      : null;

  useEffect(() => {
    if (!open) return;
    setAmountBonuses(
      availableBonuses >= minWithdrawalBonuses
        ? String(availableBonuses)
        : '',
    );
    setBankName('');
    setPhone('');
    setPhoneCountryId('RU');
  }, [open, availableBonuses, minWithdrawalBonuses]);

  useEffect(() => {
    if (!phone.trim()) return;
    setPhoneCountryId((prev) => detectSbpPhoneCountry(phone, prev));
  }, [phone]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isBonusWithdrawalLevelUnlocked(profileLevel)) {
      showToast('warning', 'Уровень', bonusWithdrawalLevelMessage());
      return;
    }

    const amount = parseInt(amountBonuses, 10);
    if (!Number.isFinite(amount) || amount < minWithdrawalBonuses) {
      showToast(
        'warning',
        'Сумма',
        `Укажите не менее ${minWithdrawalBonuses} бонусов`,
      );
      return;
    }
    if (amount > availableBonuses) {
      showToast('warning', 'Сумма', 'Недостаточно доступных бонусов');
      return;
    }

    const bankError = getBonusWithdrawalBankError(bankName, phone);
    if (bankError) {
      showToast('warning', 'Банк', bankError);
      return;
    }

    const phoneError = getBonusWithdrawalPhoneError(phone);
    if (phoneError) {
      showToast('warning', 'Телефон', phoneError);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/good-deeds/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountBonuses: amount,
          bankName: bankName.trim(),
          details: phone.trim(),
        }),
      });
      const json = await res.json().catch(() => ({}));
      throwIfApiFailed(res, json, 'Не удалось отправить запрос на вывод гонорара');
      showToast(
        'success',
        'Запрос отправлен',
        'После проверки выполним перевод по СБП на указанный номер телефона',
      );
      onClose();
      onSuccess?.();
    } catch (err) {
      showToast(
        'error',
        'Не отправлено',
        err instanceof Error ? err.message : 'Попробуйте позже',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      size="lg"
      zIndex={9400}
      title="Вывод гонорара"
      icon={<Wallet className="h-4 w-4 text-[#f9bc60]" />}
      subtitle={
        <>
          Комиссия на вывод — {commissionPercent}%. Минимальная заявка —{' '}
          {minWithdrawalBonuses} бонусов
          {profileLevel < 4 ? (
            <>
              {' '}
              (с 4 уровня — от 50). Доступен с {MIN_WITHDRAWAL_PROFILE_LEVEL} уровня.
            </>
          ) : (
            '.'
          )}{' '}
          {formatWithdrawalCommissionHint(profileLevel)} Укажите номер телефона и банк для СБП.
        </>
      }
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-[#abd1c6]/35"
            onClick={onClose}
            disabled={submitting}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            form="bonus-withdraw-form"
            disabled={submitting}
            className="rounded-xl bg-[#f9bc60] font-semibold text-[#001e1d] hover:bg-[#f7b24a]"
          >
            {submitting ? 'Отправка…' : 'Отправить запрос'}
          </Button>
        </div>
      }
    >
      {!isBonusWithdrawalLevelUnlocked(profileLevel) && (
        <p className="mb-4 rounded-xl border border-[#abd1c6]/25 bg-white/[0.04] px-3 py-2.5 text-sm text-[#abd1c6]">
          {bonusWithdrawalLevelMessage()}
        </p>
      )}

      {(withdrawalBlocked || hasPendingWithdrawal) && (
        <p className="mb-4 rounded-xl border border-amber-500/35 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-100">
          {withdrawalBlocked
            ? BONUS_WITHDRAWAL_BLOCKED_MESSAGE
            : 'У вас уже есть запрос на вывод гонорара на проверке.'}
        </p>
      )}

      <form id="bonus-withdraw-form" className="space-y-4" onSubmit={submit}>
        <SbpPaymentNotice variant="bonus" />

        <div>
          <Label htmlFor="bonus-wd-amount" className="text-[#abd1c6]">
            Сумма (бонусы)
          </Label>
          <input
            id="bonus-wd-amount"
            type="number"
            min={minWithdrawalBonuses}
            max={availableBonuses}
            value={amountBonuses}
            onChange={(e) => setAmountBonuses(e.target.value)}
            disabled={submitting}
            className="mt-1.5 w-full rounded-xl border border-[#abd1c6]/30 bg-[#001e1d]/60 px-3 py-2.5 text-[#fffffe] outline-none focus:border-[#f9bc60]/50"
            required
          />
          <p className="mt-1 text-xs text-[#94a1b2]">
            Доступно: {availableBonuses} бонусов · {formatWithdrawalCommissionHint(profileLevel)}
          </p>
          {payoutPreview && (
            <div className="mt-3">
              <WithdrawalPayoutBreakdown
                amountBonuses={payoutPreview.amountBonuses}
                profileLevel={profileLevel}
              />
            </div>
          )}
        </div>

        <SbpPhoneField
          value={phone}
          onChange={setPhone}
          onCountryChange={setPhoneCountryId}
          required
          disabled={submitting}
        />

        <RussianBankSelect
          value={bankName}
          onChange={setBankName}
          countryId={phoneCountryId}
          required
          disabled={submitting}
        />
      </form>
    </GlassModal>
  );
}
