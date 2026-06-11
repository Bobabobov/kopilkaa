import crypto from "crypto";
import { describe, expect, it } from "vitest";
import {
  parseTelegramAuthSearchParams,
  verifyTelegramAuth,
} from "@/lib/telegramAuth";

function signTelegramAuth(
  botToken: string,
  fields: Record<string, string | number>,
): string {
  const checkData = Object.entries(fields)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  return crypto.createHmac("sha256", secretKey).update(checkData).digest("hex");
}

describe("parseTelegramAuthSearchParams", () => {
  it("парсит параметры редиректа Login Widget", () => {
    const sp = new URLSearchParams(
      "id=42&first_name=Ivan&username=ivan&auth_date=1700000000&hash=abc",
    );
    const data = parseTelegramAuthSearchParams(sp);
    expect(data).toEqual({
      id: 42,
      first_name: "Ivan",
      username: "ivan",
      auth_date: 1700000000,
      hash: "abc",
    });
  });

  it("возвращает null без hash", () => {
    expect(
      parseTelegramAuthSearchParams(new URLSearchParams("id=42&auth_date=1")),
    ).toBeNull();
  });
});

describe("verifyTelegramAuth", () => {
  it("подтверждает подпись по алгоритму Telegram", () => {
    const botToken = "123456:TEST_TOKEN";
    const prev = process.env.TELEGRAM_BOT_TOKEN;
    process.env.TELEGRAM_BOT_TOKEN = botToken;

    const auth_date = Math.floor(Date.now() / 1000);
    const fields = {
      auth_date,
      first_name: "Ivan",
      id: 42,
      username: "ivan",
    };
    const hash = signTelegramAuth(botToken, fields);

    const result = verifyTelegramAuth({
      id: 42,
      first_name: "Ivan",
      username: "ivan",
      auth_date,
      hash,
    });

    process.env.TELEGRAM_BOT_TOKEN = prev;
    expect(result.ok).toBe(true);
  });
});
