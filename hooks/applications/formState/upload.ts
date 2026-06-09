"use client";

import { throwIfApiFailed } from "@/lib/api/parseApiError";
import {
  formatUploadMb,
  UPLOAD_LIMITS,
  hasAllowedPhotoType,
} from "./constants";
import type { LocalImage } from "./types";

/** Таймаут загрузки фото: в браузере Telegram и на мобильном интернете может быть медленно */
const UPLOAD_TIMEOUT_MS = 120_000; // 2 минуты

function getFilesFromPhotos(photos: LocalImage[]): File[] {
  const files: File[] = [];
  photos.forEach((item) => {
    let file: File;
    if (item instanceof File) {
      file = item;
    } else if (item?.file instanceof File) {
      file = item.file;
    } else {
      return;
    }
    files.push(file);
  });
  return files;
}

export async function uploadApplicationPhotos(
  photos: LocalImage[],
): Promise<string[]> {
  if (!photos.length) return [];
  const filesToUpload = getFilesFromPhotos(photos);
  if (!filesToUpload.length) return [];

  const tooBig = filesToUpload.find((f) => f.size > UPLOAD_LIMITS.maxFileBytes);
  if (tooBig) {
    throw new Error(
      `Файл "${tooBig.name}" слишком большой. Максимум ${formatUploadMb(UPLOAD_LIMITS.maxFileBytes)} на фото.`,
    );
  }
  const wrongType = filesToUpload.find((f) => !hasAllowedPhotoType(f));
  if (wrongType) {
    throw new Error(
      `Файл "${wrongType.name || "без названия"}" не похож на фото. Загрузите JPG, PNG, WebP или HEIC. Если файл из Telegram не принимается, сохраните его в галерею и отправьте как фото, не как документ.`,
    );
  }
  const totalBytes = filesToUpload.reduce((sum, f) => sum + f.size, 0);
  if (totalBytes > UPLOAD_LIMITS.maxTotalBytes) {
    throw new Error(
      `Слишком большой общий размер фото. Максимум ${formatUploadMb(UPLOAD_LIMITS.maxTotalBytes)} на все фото вместе. Уменьшите или замените фото.`,
    );
  }

  const fd = new FormData();
  filesToUpload.forEach((file) => fd.append("files", file));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
  let r: Response;
  try {
    r = await fetch("/api/uploads", {
      method: "POST",
      body: fd,
      signal: controller.signal,
    });
  } catch (e) {
    clearTimeout(timeoutId);
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error(
        "Загрузка заняла слишком много времени. Проверьте интернет и попробуйте снова. Либо откройте сайт в обычном браузере.",
      );
    }
    throw e;
  }
  clearTimeout(timeoutId);

  const contentType = r.headers.get("content-type") || "";

  if (r.status === 413) {
    throw new Error(
      "Фото слишком большие для загрузки. Уменьшите размер фото и попробуйте снова.",
    );
  }

  const d = contentType.includes("application/json")
    ? await r.json().catch(() => null)
    : null;
  throwIfApiFailed(r, d, "Ошибка загрузки фото");
  return ((d?.files as { url: string }[]) || []).map((f) => f.url);
}
