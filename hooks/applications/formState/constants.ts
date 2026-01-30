"use client";

export const SAVE_KEY_BASE = "application_form_data";
export const TRUST_ACK_KEY_BASE = "application_trust_ack";
export const POLICY_ACK_KEY_BASE = "application_policy_ack";
export const INTRO_ACK_KEY_BASE = "application_intro_ack";
export const FORM_START_KEY_BASE = "application_form_started_at";

export const LIMITS = {
  titleMax: 40,
  summaryMax: 60,
  storyMin: 10,
  storyMax: 3000,
  amountMin: 50,
  amountMax: 5000,
  paymentMin: 10,
  paymentMax: 200,
  maxPhotos: 5,
} as const;

export const UPLOAD_LIMITS = {
  maxFileBytes: 5 * 1024 * 1024,
  maxTotalBytes: 10 * 1024 * 1024,
} as const;

export const TOTAL_FIELDS = 7;
