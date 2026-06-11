import { describe, expect, it } from "vitest";
import {
  DEFAULT_AVATAR,
  isDefaultAvatarUrl,
  isRestrictedTelegramAvatarUrl,
  isUsableTelegramPhotoUrl,
  resolveAvatarUrl,
  shouldSyncAvatarFromTelegram,
} from "@/lib/avatar";

describe("isRestrictedTelegramAvatarUrl", () => {
  it("определяет заглушку userpic Telegram", () => {
    expect(
      isRestrictedTelegramAvatarUrl(
        "https://t.me/i/userpic/320/abc.jpg",
      ),
    ).toBe(true);
  });

  it("не считает обычный CDN-URL ограниченным", () => {
    expect(
      isUsableTelegramPhotoUrl(
        "https://cdn4.telesco.pe/file/abc/photo.jpg",
      ),
    ).toBe(true);
  });
});

describe("shouldSyncAvatarFromTelegram", () => {
  it("разрешает синхронизацию при пустом аватаре", () => {
    expect(shouldSyncAvatarFromTelegram(null, null)).toBe(true);
  });

  it("разрешает синхронизацию при дефолтном аватаре", () => {
    expect(shouldSyncAvatarFromTelegram(DEFAULT_AVATAR, null)).toBe(true);
  });

  it("разрешает синхронизацию при ограниченном userpic в БД", () => {
    expect(
      shouldSyncAvatarFromTelegram("https://t.me/i/userpic/1/x.jpg", null),
    ).toBe(true);
  });

  it("разрешает обновление ранее синхронизированного Telegram-аватара", () => {
    expect(
      shouldSyncAvatarFromTelegram("/api/uploads/avatar_123_abc.jpg", null),
    ).toBe(true);
  });

  it("не перезаписывает аватар после ручной загрузки", () => {
    expect(
      shouldSyncAvatarFromTelegram("/api/uploads/avatar_123_abc.jpg", new Date()),
    ).toBe(false);
  });

  it("разрешает синхронизацию после удаления аватара", () => {
    expect(shouldSyncAvatarFromTelegram(null, new Date())).toBe(true);
  });

  it("разрешает обновление внешнего CDN-аватара Telegram", () => {
    expect(
      shouldSyncAvatarFromTelegram(
        "https://cdn4.telesco.pe/file/abc/photo.jpg",
        null,
      ),
    ).toBe(true);
  });
});

describe("resolveAvatarUrl", () => {
  it("подставляет дефолт для ограниченного userpic", () => {
    expect(
      resolveAvatarUrl("https://t.me/i/userpic/320/abc.jpg"),
    ).toBe(DEFAULT_AVATAR);
  });
});
