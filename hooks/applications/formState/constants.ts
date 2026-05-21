"use client";

export const SAVE_KEY_BASE = "application_form_data";
export const TRUST_ACK_KEY_BASE = "application_trust_ack";
export const POLICY_ACK_KEY_BASE = "application_policy_ack";
export const INTRO_ACK_KEY_BASE = "application_intro_ack";
export const FORM_START_KEY_BASE = "application_form_started_at";

export const LIMITS = {
  titleMax: 40,
  summaryMax: 60,
  storyMin: 100,
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
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ],
  allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"],
} as const;

export const ACCEPTED_PHOTO_TYPES = [
  ...UPLOAD_LIMITS.allowedMimeTypes,
  ...UPLOAD_LIMITS.allowedExtensions,
].join(",");

export function formatUploadMb(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))} МБ`;
}

export function hasAllowedPhotoType(file: File): boolean {
  const type = file.type.trim().toLowerCase();
  if (
    type &&
    (UPLOAD_LIMITS.allowedMimeTypes as readonly string[]).includes(type)
  ) {
    return true;
  }

  const name = file.name.toLowerCase();
  return UPLOAD_LIMITS.allowedExtensions.some((ext) => name.endsWith(ext));
}

export const TOTAL_FIELDS = 8;
