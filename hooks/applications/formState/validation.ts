"use client";

import { LIMITS, TOTAL_FIELDS } from "./constants";
import {
  applicationPlainTextContainsLink,
  applicationStoryHtmlContainsLink,
  getApplicationNoLinksError,
} from "@/lib/applications/validateContent";
import { getSbpBankErrorForPhone } from '@/lib/sbp/sbpBanks';
import {
  getSbpPhoneError,
  isValidSbpPhone,
} from '@/lib/sbp/validatePhone';

export function getStoryTextLen(story: string): number {
  if (!story) return 0;
  if (typeof document === "undefined") return 0;
  const div = document.createElement("div");
  div.innerHTML = story;
  return (div.textContent || div.innerText || "").replace(/\s/g, "").length;
}

export function getCharCount(text: string): number {
  return text.replace(/\s/g, "").length;
}

export interface FormValidationInput {
  title: string;
  summary: string;
  story?: string;
  storyTextLen: number;
  amount: string;
  amountInt: number;
  desiredAmount?: string;
  desiredAmountInt?: number;
  bankName: string;
  payment: string;
  photosCount: number;
  isAdmin: boolean;
  /** Динамический лимит суммы по уровню (если не задан — LIMITS.amountMax) */
  amountMax?: number;
  /** Показывать и валидировать поле «Желаемая сумма» */
  showsDesiredAmount?: boolean;
}

export function isApplicationFormValid(input: FormValidationInput): boolean {
  const {
    title,
    summary,
    storyTextLen,
    amount,
    amountInt,
    bankName,
    payment,
    photosCount,
    isAdmin,
  } = input;
  const amountMax = input.amountMax ?? LIMITS.amountMax;
  const desiredOk =
    !input.showsDesiredAmount ||
    !input.desiredAmount ||
    input.desiredAmount.length === 0 ||
    (typeof input.desiredAmountInt === "number" &&
      input.desiredAmountInt > amountInt);

  return (
    title.length <= LIMITS.titleMax &&
    !applicationPlainTextContainsLink(title) &&
    summary.length > 0 &&
    summary.length <= LIMITS.summaryMax &&
    !applicationPlainTextContainsLink(summary) &&
    !(input.story && applicationStoryHtmlContainsLink(input.story)) &&
    storyTextLen >= LIMITS.storyMin &&
    storyTextLen <= LIMITS.storyMax &&
    amount.length > 0 &&
    amountInt >= LIMITS.amountMin &&
    (isAdmin || amountInt <= amountMax) &&
    desiredOk &&
    getSbpBankErrorForPhone(bankName, payment) === null &&
    !applicationPlainTextContainsLink(bankName) &&
    isValidSbpPhone(payment) &&
    !applicationPlainTextContainsLink(payment) &&
    photosCount > 0 &&
    photosCount <= LIMITS.maxPhotos
  );
}

export function getFilledFieldsCount(input: {
  title: string;
  summary: string;
  storyTextLen: number;
  amount: string;
  amountInt: number;
  bankName: string;
  payment: string;
  photosCount: number;
}): number {
  const g = getCharCount;
  return [
    g(input.title) > 0,
    g(input.summary) > 0,
    input.storyTextLen >= LIMITS.storyMin,
    input.amount.length > 0 && input.amountInt >= LIMITS.amountMin,
    getSbpBankErrorForPhone(input.bankName, input.payment) === null,
    isValidSbpPhone(input.payment),
    input.photosCount > 0,
  ].filter(Boolean).length;
}

export function getProgressPercentage(filledFields: number): number {
  return Math.round((filledFields / TOTAL_FIELDS) * 100);
}

/** Ключи полей формы для скролла и подсветки */
export type ApplicationFieldKey =
  | "title"
  | "summary"
  | "story"
  | "amount"
  | "desiredAmount"
  | "bankName"
  | "payment"
  | "photos";

/** Ошибки по полям: ключ — id поля, значение — текст подсказки */
export function getApplicationFormErrors(
  input: FormValidationInput
): Partial<Record<ApplicationFieldKey, string>> {
  const {
    title,
    summary,
    storyTextLen,
    amount,
    amountInt,
    bankName,
    payment,
    photosCount,
    isAdmin,
  } = input;
  const errors: Partial<Record<ApplicationFieldKey, string>> = {};

  if (title.length === 0) {
    errors.title = "Введите заголовок истории";
  } else if (applicationPlainTextContainsLink(title)) {
    errors.title = getApplicationNoLinksError("title");
  } else if (title.length > LIMITS.titleMax) {
    errors.title = `Заголовок: максимум ${LIMITS.titleMax} символов`;
  }

  if (summary.length === 0) {
    errors.summary = "Введите краткое описание";
  } else if (applicationPlainTextContainsLink(summary)) {
    errors.summary = getApplicationNoLinksError("summary");
  } else if (summary.length > LIMITS.summaryMax) {
    errors.summary = `Краткое описание: максимум ${LIMITS.summaryMax} символов`;
  }

  if (input.story && applicationStoryHtmlContainsLink(input.story)) {
    errors.story = getApplicationNoLinksError("story");
  } else if (storyTextLen < LIMITS.storyMin) {
    errors.story =
      storyTextLen === 0
        ? "Напишите подробную историю"
        : `История: минимум ${LIMITS.storyMin} символов (сейчас ${storyTextLen})`;
  } else if (storyTextLen > LIMITS.storyMax) {
    errors.story = `История: максимум ${LIMITS.storyMax} символов`;
  }

  const amountMax = input.amountMax ?? LIMITS.amountMax;
  if (amount.length === 0) {
    errors.amount = "Укажите сумму в рублях";
  } else if (amountInt < LIMITS.amountMin) {
    errors.amount = `Минимальная сумма — ${LIMITS.amountMin} ₽`;
  } else if (!isAdmin && amountInt > amountMax) {
    errors.amount = `На вашем уровне доступен гонорар до ${amountMax} ₽.`;
  }

  if (input.showsDesiredAmount && input.desiredAmount && input.desiredAmount.length > 0) {
    const desiredInt = input.desiredAmountInt ?? 0;
    if (desiredInt <= amountInt) {
      errors.desiredAmount =
        "Желаемая сумма должна быть больше суммы гонорара";
    }
  }

  const bankError = getSbpBankErrorForPhone(bankName, payment);
  if (bankError) {
    errors.bankName = bankError;
  } else if (applicationPlainTextContainsLink(bankName)) {
    errors.bankName = getApplicationNoLinksError("bankName");
  }

  const phoneError = getSbpPhoneError(payment);
  if (phoneError) {
    errors.payment = phoneError;
  } else if (applicationPlainTextContainsLink(payment)) {
    errors.payment = getApplicationNoLinksError("payment");
  }

  if (photosCount === 0) {
    errors.photos = "Добавьте хотя бы одну фотографию";
  } else if (photosCount > LIMITS.maxPhotos) {
    errors.photos = `Максимум ${LIMITS.maxPhotos} фото`;
  }

  return errors;
}
