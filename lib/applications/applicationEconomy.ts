import type { Prisma } from '@prisma/client';
import {
  formatCooldownError,
  formatCooldownIntervalLabel,
  formatMaxAmountError,
  getApplicationCooldownHours,
  getApplicationCost,
  getLevelRules,
  getMaxApplicationAmount,
  INSUFFICIENT_BONUSES_ERROR,
} from '@/lib/level-config';
import { computeGoodDeedBonusWalletInTx } from '@/lib/goodDeedBonusWallet';
import { resolveApplicationSubmitCost } from '@/lib/applications/publicationPricing';
import { loadUserEconomyContext } from '@/lib/applications/userEconomyContext';
const HOUR_MS = 60 * 60 * 1000;

export type ApplicationEligibility = {
  userLevel: number;
  maxApplicationAmount: number;
  submitCost: number;
  /** Базовая стоимость без скидок (для отображения зачёркнутой цены) */
  standardSubmitCost: number;
  publishDiscountLabel: string | null;
  isFirstApplication: boolean;  cooldownHours: number;
  cooldownLabel: string;
  cooldownRemainingMs: number | null;
  canSubmit: boolean;
  availableBonuses: number;
  blockReason: string | null;
  tierInDevelopment: boolean;
};

export type ApplicationEligibilityInput = {
  userId: string;
  userLevel: number;
  priorApplicationCount: number;
  lastApplicationCreatedAt: Date | null;
  availableBonuses: number;
  /** Админ / whitelist — без ограничений экономики */
  bypassEconomy?: boolean;
};

function computeCooldownRemainingMs(
  lastCreatedAt: Date | null,
  cooldownHours: number,
  isFirstApplication: boolean,
): number | null {
  if (isFirstApplication || !lastCreatedAt) return null;
  const cooldownMs = cooldownHours * HOUR_MS;
  const elapsed = Date.now() - lastCreatedAt.getTime();
  const remaining = cooldownMs - elapsed;
  return remaining > 0 ? remaining : null;
}

export function buildApplicationEligibility(
  input: ApplicationEligibilityInput,
): ApplicationEligibility {
  const {
    userLevel,
    priorApplicationCount,
    lastApplicationCreatedAt,
    availableBonuses,
    bypassEconomy = false,
  } = input;

  const isFirstApplication = priorApplicationCount === 0;
  const rules = getLevelRules(userLevel);
  const maxApplicationAmount = rules.maxApplicationAmount;
  const pricing = resolveApplicationSubmitCost({
    userLevel,
    priorApplicationCount,
    baseCost: rules.applicationCost,
  });
  const submitCost = pricing.submitCost;  const cooldownHours = isFirstApplication ? 0 : rules.cooldownHours;
  const cooldownLabel =
    cooldownHours > 0
      ? formatCooldownIntervalLabel(cooldownHours)
      : 'не требуется';

  const cooldownRemainingMs = bypassEconomy
    ? null
    : computeCooldownRemainingMs(
        lastApplicationCreatedAt,
        cooldownHours,
        isFirstApplication,
      );

  let blockReason: string | null = null;

  if (!bypassEconomy) {
    if (cooldownRemainingMs != null && cooldownRemainingMs > 0) {
      blockReason = formatCooldownError(cooldownRemainingMs);
    } else if (submitCost > availableBonuses) {
      blockReason = INSUFFICIENT_BONUSES_ERROR;
    }
  }

  return {
    userLevel,
    maxApplicationAmount,
    submitCost,
    standardSubmitCost: pricing.standardCost,
    publishDiscountLabel: pricing.discountLabel,
    isFirstApplication,    cooldownHours,
    cooldownLabel,
    cooldownRemainingMs,
    canSubmit: blockReason == null,
    availableBonuses,
    blockReason,
    tierInDevelopment: rules.inDevelopment,
  };
}

export type ApplicationEconomyValidation =
  | {
      ok: true;
      eligibility: ApplicationEligibility;
      submitBonusCost: number;
      isFirstFree: boolean;
      userLevel: number;
    }
  | {
      ok: false;
      error: string;
      status: number;
      leftMs?: number;
    };

export async function validateApplicationEconomy(
  tx: Prisma.TransactionClient,
  params: {
    userId: string;
    amount: number;
    isAdmin: boolean;
    isWhitelisted: boolean;
  },
): Promise<ApplicationEconomyValidation> {
  const { userId, amount, isAdmin, isWhitelisted } = params;
  const bypassEconomy = isAdmin || isWhitelisted;

  const economy = await loadUserEconomyContext(tx, userId);
  if (!economy) {
    return { ok: false, error: 'Пользователь не найден', status: 404 };
  }

  const wallet = await computeGoodDeedBonusWalletInTx(tx, userId);
  const eligibility = buildApplicationEligibility({
    userId,
    userLevel: economy.profileLevel,
    priorApplicationCount: economy.priorApplicationCount,
    lastApplicationCreatedAt: economy.lastApplicationCreatedAt,
    availableBonuses: wallet.availableBonuses,
    bypassEconomy,
  });

  if (!bypassEconomy) {
    const maxAmount = getMaxApplicationAmount(economy.profileLevel);
    if (amount > maxAmount) {
      return {
        ok: false,
        error: formatMaxAmountError(maxAmount),
        status: 400,
      };
    }

    if (
      eligibility.cooldownRemainingMs != null &&
      eligibility.cooldownRemainingMs > 0
    ) {
      return {
        ok: false,
        error: formatCooldownError(eligibility.cooldownRemainingMs),
        status: 429,
        leftMs: eligibility.cooldownRemainingMs,
      };
    }

    if (eligibility.submitCost > wallet.availableBonuses) {
      return {
        ok: false,
        error: INSUFFICIENT_BONUSES_ERROR,
        status: 400,
      };
    }
  }

  return {
    ok: true,
    eligibility,
    submitBonusCost: eligibility.submitCost,
    isFirstFree: eligibility.submitCost === 0,
    userLevel: economy.profileLevel,
  };
}

/** Для админки: время с прошлой заявки пользователя */
export function formatHoursSinceLastApplication(
  previousCreatedAt: Date | null,
  currentCreatedAt: Date,
): string | null {
  if (!previousCreatedAt) return null;
  const diffMs = currentCreatedAt.getTime() - previousCreatedAt.getTime();
  if (diffMs < 0) return null;
  const totalHours = Math.floor(diffMs / HOUR_MS);
  const minutes = Math.floor((diffMs % HOUR_MS) / 60_000);
  if (totalHours === 0) return `${minutes} мин.`;
  if (minutes === 0) return `${totalHours} ч.`;
  return `${totalHours} ч. ${minutes} мин.`;
}

export {
  getApplicationCost,
  getMaxApplicationAmount,
  getApplicationCooldownHours,
};

/** Текст кнопки отправки на шаге «Фото» */
export function getApplicationSubmitButtonLabel(params: {
  submitCost: number;
  isAdmin?: boolean;
}): string {
  if (params.isAdmin) return 'Отправить историю';
  if (params.submitCost <= 0) {
    return 'Отправить (бесплатно)';
  }
  return `Отправить за ${params.submitCost} бонусов`;
}

/** Блокировка формы из‑за нехватки бонусов (не админ) */
export function isApplicationBlockedByBonuses(
  eligibility: ApplicationEligibility | null | undefined,
  isAdmin = false,
): boolean {
  if (!eligibility || isAdmin) return false;
  return eligibility.submitCost > eligibility.availableBonuses;
}
