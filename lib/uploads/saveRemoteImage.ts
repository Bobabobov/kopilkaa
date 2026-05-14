import { randomUUID } from "crypto";
import dns from "node:dns";
import { writeFile, mkdir } from "fs/promises";
import { extname } from "path";
import { getUploadDir, getUploadFilePath } from "./paths";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const DOWNLOAD_ATTEMPTS = 3;
const ATTEMPT_TIMEOUT_MS = 45_000;

/** На части VPS IPv6 «висит», а Node пробует оба стека — уменьшает ETIMEDOUT при fetch к CDN. */
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientNetworkFailure(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  if (err.name === "AbortError") return true;

  const codes = new Set<string>();
  const pushCode = (v: unknown) => {
    if (
      v &&
      typeof v === "object" &&
      "code" in v &&
      typeof (v as { code?: unknown }).code === "string"
    ) {
      codes.add((v as { code: string }).code);
    }
  };
  pushCode(err);
  const { cause } = err;
  if (cause instanceof Error) {
    pushCode(cause);
    if (cause.name === "AbortError") return true;
  }
  if (cause && typeof cause === "object" && "errors" in cause) {
    const agg = cause as AggregateError;
    if (Array.isArray(agg.errors)) {
      for (const sub of agg.errors) pushCode(sub);
    }
  }

  for (const code of codes) {
    if (
      [
        "ETIMEDOUT",
        "ECONNRESET",
        "ECONNREFUSED",
        "ENOTFOUND",
        "EAI_AGAIN",
        "UND_ERR_CONNECT_TIMEOUT",
      ].includes(code)
    ) {
      return true;
    }
  }

  const msg = err.message.toLowerCase();
  return msg.includes("fetch failed") || msg.includes("network");
}

/**
 * Скачивает внешний аватар и сохраняет локально, возвращает публичный URL `/api/uploads/<file>`
 * Если что-то пошло не так — возвращает null, чтобы можно было fallback на исходный url.
 */
export async function saveRemoteImageAsAvatar(
  url: string,
  userId: string,
): Promise<string | null> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return null;
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return null;
  }

  for (let attempt = 1; attempt <= DOWNLOAD_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const killTimer = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: `${ALLOWED_TYPES.join(", ")}, */*;q=0.8`,
          "User-Agent":
            "KopilkaAvatar/1.0 (+https://kopilka.online; profile image download)",
        },
      });

      if (!res.ok) return null;

      const contentType =
        res.headers.get("content-type")?.split(";")[0]?.trim() || "";
      if (!ALLOWED_TYPES.includes(contentType)) return null;

      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length === 0 || buf.length > MAX_SIZE_BYTES) return null;

      const uploadDir = getUploadDir();
      await mkdir(uploadDir, { recursive: true });

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

      const extFromUrl = extname(parsedUrl.pathname || "") || "";
      const ext = (extFromType || extFromUrl || ".jpg").split("?")[0];

      const filename = `avatar_${userId}_${randomUUID().replace(/-/g, "")}${ext}`;
      const filepath = getUploadFilePath(filename);

      await writeFile(filepath, buf);

      return `/api/uploads/${filename}`;
    } catch (error) {
      if (isTransientNetworkFailure(error) && attempt < DOWNLOAD_ATTEMPTS) {
        await sleep(500 * attempt * attempt);
        continue;
      }
      const reason = error instanceof Error ? error.message : String(error);
      console.warn(
        `[avatar-download] не удалось сохранить аватар после ${attempt} попыток:`,
        reason,
      );
      return null;
    } finally {
      clearTimeout(killTimer);
    }
  }

  return null;
}
