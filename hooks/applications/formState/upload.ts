"use client";

import { UPLOAD_LIMITS } from "./constants";
import type { LocalImage } from "./types";

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
      `Файл "${tooBig.name}" слишком большой. Максимум: 5 МБ на фото.`,
    );
  }
  const totalBytes = filesToUpload.reduce((sum, f) => sum + f.size, 0);
  if (totalBytes > UPLOAD_LIMITS.maxTotalBytes) {
    const mb = (UPLOAD_LIMITS.maxTotalBytes / (1024 * 1024)).toFixed(0);
    throw new Error(
      `Слишком большой общий размер фото. Максимум: ${mb} МБ на все фото вместе. Уменьшите/замените фото.`,
    );
  }

  const fd = new FormData();
  filesToUpload.forEach((file) => fd.append("files", file));

  const r = await fetch("/api/uploads", { method: "POST", body: fd });
  const contentType = r.headers.get("content-type") || "";

  if (r.status === 413) {
    throw new Error(
      "Фото слишком большие для загрузки. Уменьшите размер фото и попробуйте снова.",
    );
  }

  const d = contentType.includes("application/json")
    ? await r.json().catch(() => null)
    : null;
  if (!r.ok) {
    const serverMsg = d?.error || d?.message;
    throw new Error(serverMsg || "Ошибка загрузки фото");
  }
  return ((d?.files as { url: string }[]) || []).map((f) => f.url);
}
