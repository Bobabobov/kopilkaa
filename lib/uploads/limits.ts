/** Лимиты загрузки для обычных пользователей. */
export const UPLOAD_MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const UPLOAD_MAX_VIDEO_BYTES = 100 * 1024 * 1024;

/** Лимиты для администраторов. */
export const UPLOAD_MAX_IMAGE_BYTES_ADMIN = 20 * 1024 * 1024;
export const UPLOAD_MAX_VIDEO_BYTES_ADMIN = 200 * 1024 * 1024;

export const UPLOAD_ALLOWED_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export const UPLOAD_ALLOWED_VIDEO_MIMES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export const UPLOAD_PHOTO_ACCEPT =
  "image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif";

export const UPLOAD_VIDEO_ACCEPT =
  "video/mp4,video/webm,video/quicktime,.mp4,.mov,.webm";

export function isUploadImageMime(mime: string): boolean {
  return (UPLOAD_ALLOWED_IMAGE_MIMES as readonly string[]).includes(mime);
}

export function isUploadVideoMime(mime: string): boolean {
  return (UPLOAD_ALLOWED_VIDEO_MIMES as readonly string[]).includes(mime);
}

export function getMaxUploadBytesForMime(
  mime: string,
  isAdmin: boolean,
): number {
  if (isUploadVideoMime(mime)) {
    return isAdmin ? UPLOAD_MAX_VIDEO_BYTES_ADMIN : UPLOAD_MAX_VIDEO_BYTES;
  }
  if (isUploadImageMime(mime)) {
    return isAdmin ? UPLOAD_MAX_IMAGE_BYTES_ADMIN : UPLOAD_MAX_IMAGE_BYTES;
  }
  return isAdmin ? UPLOAD_MAX_IMAGE_BYTES_ADMIN : UPLOAD_MAX_IMAGE_BYTES;
}

export function formatUploadMegabytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return Number.isInteger(mb) ? `${mb}` : mb.toFixed(1);
}

export function getUploadSizeLimitLabel(kind: "photo" | "video"): string {
  const bytes =
    kind === "photo" ? UPLOAD_MAX_IMAGE_BYTES : UPLOAD_MAX_VIDEO_BYTES;
  return `до ${formatUploadMegabytes(bytes)} МБ`;
}

function inferClientMediaKind(file: File): "photo" | "video" | null {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (
    type.startsWith("image/") ||
    /\.(heic|heif|jpe?g|png|gif|webp)$/.test(name)
  ) {
    return "photo";
  }
  if (
    type.startsWith("video/") ||
    /\.(mp4|webm|mov)$/.test(name)
  ) {
    return "video";
  }
  return null;
}

/** Проверка файла доброго дела до отправки на сервер. */
export function validateGoodDeedMediaFile(
  file: File,
  expected: "photo" | "video",
): string | null {
  const kind = inferClientMediaKind(file);
  if (kind !== expected) {
    return expected === "photo"
      ? "Выберите фото (JPEG, PNG, WebP или HEIC с iPhone)"
      : "Выберите видео (MP4, MOV с iPhone или WebM)";
  }

  const maxBytes =
    expected === "photo" ? UPLOAD_MAX_IMAGE_BYTES : UPLOAD_MAX_VIDEO_BYTES;
  if (file.size > maxBytes) {
    return `Файл слишком большой. Максимум ${getUploadSizeLimitLabel(expected)}`;
  }

  return null;
}
