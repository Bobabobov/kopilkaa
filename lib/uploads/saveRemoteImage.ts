import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import { extname } from "path";
import { getUploadDir, getUploadFilePath } from "./paths";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Скачивает внешний аватар и сохраняет локально, возвращает публичный URL `/api/uploads/<file>`
 * Если что-то пошло не так — возвращает null, чтобы можно было fallback на исходный url.
 */
export async function saveRemoteImageAsAvatar(
  url: string,
  userId: string,
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const contentType =
      res.headers.get("content-type")?.split(";")[0]?.trim() || "";
    if (!ALLOWED_TYPES.includes(contentType)) return null;

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0 || buf.length > MAX_SIZE_BYTES) return null;

    const uploadDir = getUploadDir();
    await mkdir(uploadDir, { recursive: true });

    // Определяем расширение: либо из content-type, либо из исходного url.
    const extFromType = (() => {
      switch (contentType) {
        case "image/jpeg":
          return ".jpg";
        case "image/png":
          return ".png";
        case "image/gif":
          return ".gif";
        case "image/webp":
          return ".webp";
        default:
          return "";
      }
    })();

    const extFromUrl = extname(new URL(url).pathname || "") || "";
    const ext = (extFromType || extFromUrl || ".jpg").split("?")[0];

    const filename = `avatar_${userId}_${randomUUID().replace(/-/g, "")}${ext}`;
    const filepath = getUploadFilePath(filename);

    await writeFile(filepath, buf);

    return `/api/uploads/${filename}`;
  } catch (error) {
    console.error("saveRemoteImageAsAvatar error:", error);
    return null;
  }
}
