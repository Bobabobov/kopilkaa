"use client";

import type { ApplicationCategory } from "@prisma/client";
import { isApplicationCategory, REPORT_PHOTOS_MIN } from "@/lib/applications/categories";
import { LIMITS, TOTAL_FIELDS } from "./constants";

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
  category: ApplicationCategory | "";
  title: string;
  summary: string;
  storyTextLen: number;
  amount: string;
  amountInt: number;
  bankName: string;
  payment: string;
  photosCount: number;
  reportPhotosCount: number;
  /** Нужен фото-отчёт по прошлой одобренной заявке */
  requiresReport: boolean;
  isAdmin: boolean;
  withinTrustRange: boolean;
}

export function isApplicationFormValid(input: FormValidationInput): boolean {
  const {
    category,
    title,
    summary,
    storyTextLen,
    amount,
    amountInt,
    bankName,
    payment,
    photosCount,
    reportPhotosCount,
    requiresReport,
    isAdmin,
    withinTrustRange,
  } = input;
  const reportOk =
    !requiresReport ||
    isAdmin ||
    reportPhotosCount >= REPORT_PHOTOS_MIN;
  return (
    isApplicationCategory(category) &&
    title.length <= LIMITS.titleMax &&
    summary.length > 0 &&
    summary.length <= LIMITS.summaryMax &&
    storyTextLen >= LIMITS.storyMin &&
    storyTextLen <= LIMITS.storyMax &&
    amount.length > 0 &&
    amountInt >= LIMITS.amountMin &&
    (isAdmin || amountInt <= LIMITS.amountMax) &&
    withinTrustRange &&
    bankName.trim().length > 0 &&
    payment.length >= LIMITS.paymentMin &&
    (isAdmin || payment.length <= LIMITS.paymentMax) &&
    photosCount > 0 &&
    photosCount <= LIMITS.maxPhotos &&
    reportOk
  );
}

export function getFilledFieldsCount(input: {
  category: ApplicationCategory | "";
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
    isApplicationCategory(input.category),
    g(input.title) > 0,
    g(input.summary) > 0,
    input.storyTextLen >= LIMITS.storyMin,
    input.amount.length > 0 && input.amountInt >= LIMITS.amountMin,
    g(input.bankName) > 0,
    g(input.payment) >= LIMITS.paymentMin,
    input.photosCount > 0,
  ].filter(Boolean).length;
}

export function getProgressPercentage(filledFields: number): number {
  return Math.round((filledFields / TOTAL_FIELDS) * 100);
}

/** Ключи полей формы для скролла и подсветки */
export type ApplicationFieldKey =
  | "category"
  | "title"
  | "summary"
  | "story"
  | "amount"
  | "bankName"
  | "payment"
  | "photos"
  | "reportPhotos";

/** Ошибки по полям: ключ — id поля, значение — текст подсказки */
export function getApplicationFormErrors(
  input: FormValidationInput
): Partial<Record<ApplicationFieldKey, string>> {
  const {
    category,
    title,
    summary,
    storyTextLen,
    amount,
    amountInt,
    bankName,
    payment,
    photosCount,
    reportPhotosCount,
    requiresReport,
    isAdmin,
    withinTrustRange,
  } = input;
  const errors: Partial<Record<ApplicationFieldKey, string>> = {};

  if (!isApplicationCategory(category)) {
    errors.category = "Выберите категорию помощи";
  }

  if (title.length === 0) {
    errors.title = "Введите заголовок заявки";
  } else if (title.length > LIMITS.titleMax) {
    errors.title = `Заголовок: максимум ${LIMITS.titleMax} символов`;
  }

  if (summary.length === 0) {
    errors.summary = "Введите краткое описание";
  } else if (summary.length > LIMITS.summaryMax) {
    errors.summary = `Краткое описание: максимум ${LIMITS.summaryMax} символов`;
  }

  if (storyTextLen < LIMITS.storyMin) {
    errors.story =
      storyTextLen === 0
        ? "Напишите подробную историю"
        : `История: минимум ${LIMITS.storyMin} символов (сейчас ${storyTextLen})`;
  } else if (storyTextLen > LIMITS.storyMax) {
    errors.story = `История: максимум ${LIMITS.storyMax} символов`;
  }

  if (amount.length === 0) {
    errors.amount = "Укажите сумму в рублях";
  } else if (amountInt < LIMITS.amountMin) {
    errors.amount = `Минимальная сумма — ${LIMITS.amountMin} ₽`;
  } else if (!isAdmin && amountInt > LIMITS.amountMax) {
    errors.amount = `Максимальная сумма — ${LIMITS.amountMax} ₽`;
  } else if (!withinTrustRange) {
    errors.amount = "Сумма превышает лимит для вашего уровня доверия";
  }

  if (bankName.trim().length === 0) {
    errors.bankName = "Укажите название банка";
  }

  if (payment.length < LIMITS.paymentMin) {
    errors.payment =
      payment.length === 0
        ? "Введите реквизиты для получения помощи"
        : `Реквизиты: минимум ${LIMITS.paymentMin} символов`;
  } else if (!isAdmin && payment.length > LIMITS.paymentMax) {
    errors.payment = `Реквизиты: максимум ${LIMITS.paymentMax} символов`;
  }

  if (photosCount === 0) {
    errors.photos = "Добавьте хотя бы одну фотографию";
  } else if (photosCount > LIMITS.maxPhotos) {
    errors.photos = `Максимум ${LIMITS.maxPhotos} фото`;
  }

  if (
    requiresReport &&
    !isAdmin &&
    reportPhotosCount < REPORT_PHOTOS_MIN
  ) {
    errors.reportPhotos = `Добавьте минимум ${REPORT_PHOTOS_MIN} фото отчёта по прошлой заявке`;
  }

  return errors;
}
