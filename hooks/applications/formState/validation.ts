"use client";

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
  title: string;
  summary: string;
  storyTextLen: number;
  amount: string;
  amountInt: number;
  bankName: string;
  payment: string;
  photosCount: number;
  isAdmin: boolean;
  withinTrustRange: boolean;
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
    withinTrustRange,
  } = input;
  return (
    title.length > 0 &&
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
    g(input.bankName) > 0,
    g(input.payment) >= LIMITS.paymentMin,
    input.photosCount > 0,
  ].filter(Boolean).length;
}

export function getProgressPercentage(filledFields: number): number {
  return Math.round((filledFields / TOTAL_FIELDS) * 100);
}
