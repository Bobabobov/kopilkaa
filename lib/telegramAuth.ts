// lib/telegramAuth.ts
import crypto from "crypto";

export interface TelegramAuthData {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

/** Парсит query-параметры после редиректа Login Widget (legacy). */
export function parseTelegramAuthSearchParams(
  sp: URLSearchParams,
): TelegramAuthData | null {
  const idRaw = sp.get("id");
  const hash = sp.get("hash")?.trim() || "";
  const authDateRaw = sp.get("auth_date");

  if (!idRaw || !hash || !authDateRaw) return null;

  const id = Number(idRaw);
  const auth_date = Number(authDateRaw);
  if (!Number.isFinite(id) || id <= 0 || !Number.isFinite(auth_date)) {
    return null;
  }

  const data: TelegramAuthData = { id, auth_date, hash };

  const first_name = sp.get("first_name");
  const last_name = sp.get("last_name");
  const username = sp.get("username");
  const photo_url = sp.get("photo_url");

  if (first_name) data.first_name = first_name;
  if (last_name) data.last_name = last_name;
  if (username) data.username = username;
  if (photo_url) data.photo_url = photo_url;

  return data;
}

/**
 * Проверка подписи по документации Telegram Login Widget:
 * https://core.telegram.org/widgets/login-legacy#checking-authorization
 */
export function verifyTelegramAuth(data: TelegramAuthData): {
  ok: boolean;
  error?: string;
} {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN не настроен на сервере" };
  }

  const { hash, ...fields } = data;

  const checkData = Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(checkData)
    .digest("hex");

  if (hmac !== hash) {
    return { ok: false, error: "Неверная подпись данных Telegram" };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (nowSec - data.auth_date > 5 * 60) {
    return { ok: false, error: "Ссылка авторизации Telegram устарела" };
  }

  return { ok: true };
}
