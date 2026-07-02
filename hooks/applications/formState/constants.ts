"use client";

import {
  formatUploadMegabytes,
  getUploadSizeLimitLabel,
  UPLOAD_ALLOWED_IMAGE_MIMES,
  UPLOAD_MAX_IMAGE_BYTES,
  UPLOAD_PHOTO_ACCEPT,
} from "@/lib/uploads/limits";

export const SAVE_KEY_BASE = "application_form_data";
export const RULES_ACK_KEY_BASE = "application_rules_ack";
export const POLICY_ACK_KEY_BASE = "application_policy_ack";
export const FORM_START_KEY_BASE = "application_form_started_at";

export const LIMITS = {
  titleMax: 40,
  summaryMax: 60,
  storyMin: 100,
  storyMax: 3000,
  amountMin: 1,
  amountMax: 5000,
  paymentMin: 10,
  paymentMax: 200,
  maxPhotos: 5,
} as const;

export const UPLOAD_LIMITS = {
  maxFileBytes: UPLOAD_MAX_IMAGE_BYTES,
  maxTotalBytes: UPLOAD_MAX_IMAGE_BYTES * LIMITS.maxPhotos,
  allowedMimeTypes: UPLOAD_ALLOWED_IMAGE_MIMES,
  allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"],
} as const;

export const ACCEPTED_PHOTO_TYPES = UPLOAD_PHOTO_ACCEPT;

export function formatUploadMb(bytes: number): string {
  return `${formatUploadMegabytes(bytes)} МБ`;
}

export function getApplicationPhotoUploadHint(maxPhotos: number): string {
  const totalMb = formatUploadMegabytes(
    UPLOAD_MAX_IMAGE_BYTES * maxPhotos,
  );
  return `JPG, PNG, WebP, HEIC · ${getUploadSizeLimitLabel("photo")} на фото, до ${totalMb} МБ суммарно`;
}

export function hasAllowedPhotoType(file: File): boolean {
  const type = file.type.trim().toLowerCase();
  if (type === "image/jpg" || type === "image/pjpeg") return true;
  if (
    type &&
    type !== "application/octet-stream" &&
    (UPLOAD_LIMITS.allowedMimeTypes as readonly string[]).includes(type)
  ) {
    return true;
  }

  const name = file.name.toLowerCase();
  return UPLOAD_LIMITS.allowedExtensions.some((ext) => name.endsWith(ext));
}

export const TOTAL_FIELDS = 7;
