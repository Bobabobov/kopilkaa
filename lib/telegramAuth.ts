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
  [key: string]: any;
}

export function verifyTelegramAuth(data: TelegramAuthData): {
  ok: boolean;
  error?: string;
} {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return { ok: false, error: "TELEGRAM_BOT_TOKEN не настроен на сервере" };
  }

  const { hash, ...rest } = data;

  const checkData = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join("\n");

  // секретный ключ = SHA256(bot_token)
  const secretKey = crypto.createHash("sha256").update(botToken).digest();

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(checkData)
    .digest("hex");

  if (hmac !== hash) {
    return { ok: false, error: "Неверная подпись данных Telegram" };
  }

  // проверяем актуальность (по умолчанию 5 минут)
  const nowSec = Math.floor(Date.now() / 1000);
  if (nowSec - data.auth_date > 5 * 60) {
    return { ok: false, error: "Ссылка авторизации Telegram устарела" };
  }

  return { ok: true };
}
