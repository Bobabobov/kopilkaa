import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  PUSH_PROMPT_COOLDOWN_MS,
  PUSH_PROMPT_DISMISSED_AT_KEY,
  PUSH_PROMPT_ENABLED_KEY,
  PUSH_NOTIFICATIONS_DISABLED_KEY,
  areBrowserNotificationsEnabled,
  disableBrowserNotifications,
  markPushPromptDismissed,
  markPushPromptEnabled,
  migrateBrowserNotificationsPreference,
  shouldShowPushNotificationPrompt,
  deliverBrowserNotifications,
} from "@/lib/notifications/browserNotifications";

describe("browserNotifications", () => {
  const storage = new Map<string, string>();
  let notificationStub: {
    permission: NotificationPermission;
    requestPermission: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    storage.clear();
    notificationStub = {
      permission: "default",
      requestPermission: vi.fn().mockResolvedValue("granted"),
    };
    vi.stubGlobal("Notification", notificationStub);
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
        removeItem: (key: string) => {
          storage.delete(key);
        },
      },
      sessionStorage: {
        getItem: () => null,
        setItem: () => undefined,
        removeItem: () => undefined,
      },
      Notification: notificationStub,
      dispatchEvent: vi.fn(),
    });
  });

  it("должно показать промпт когда разрешение default и нет отметок", () => {
    expect(shouldShowPushNotificationPrompt()).toBe(true);
  });

  it("не должно показать промпт после включения с разрешением браузера", () => {
    notificationStub.permission = "granted";
    markPushPromptEnabled();
    expect(shouldShowPushNotificationPrompt()).toBe(false);
  });

  it("не должно показать промпт в период cooldown после «Позже»", () => {
    const now = 1_700_000_000_000;
    markPushPromptDismissed(now);
    expect(shouldShowPushNotificationPrompt(now + 1000)).toBe(false);
  });

  it("должно снова показать промпт после истечения cooldown", () => {
    const now = 1_700_000_000_000;
    storage.set(PUSH_PROMPT_DISMISSED_AT_KEY, String(now));
    expect(
      shouldShowPushNotificationPrompt(now + PUSH_PROMPT_COOLDOWN_MS),
    ).toBe(true);
  });

  it("не должно показать промпт если браузер уже отказал", () => {
    notificationStub.permission = "denied";
    expect(shouldShowPushNotificationPrompt()).toBe(false);
  });

  it("должно считать уведомления включёнными при granted без явного отключения", () => {
    notificationStub.permission = "granted";
    expect(areBrowserNotificationsEnabled()).toBe(true);
  });

  it("должно считать уведомления выключенными после disable", () => {
    notificationStub.permission = "granted";
    markPushPromptEnabled();
    disableBrowserNotifications();
    expect(areBrowserNotificationsEnabled()).toBe(false);
    expect(storage.get(PUSH_NOTIFICATIONS_DISABLED_KEY)).toBe("1");
  });

  it("должно мигрировать состояние при уже выданном разрешении браузера", () => {
    notificationStub.permission = "granted";
    migrateBrowserNotificationsPreference();
    expect(storage.get(PUSH_PROMPT_ENABLED_KEY)).toBe("1");
    expect(areBrowserNotificationsEnabled()).toBe(true);
  });

  it("должно сохранить enabled и убрать dismissed", () => {
    storage.set(PUSH_PROMPT_DISMISSED_AT_KEY, "123");
    notificationStub.permission = "granted";
    markPushPromptEnabled();
    expect(storage.get(PUSH_PROMPT_ENABLED_KEY)).toBe("1");
    expect(storage.has(PUSH_PROMPT_DISMISSED_AT_KEY)).toBe(false);
  });

  it("должно доставить pending status даже если событие старше baseline", () => {
    notificationStub.permission = "granted";
    storage.set("kopilka_browser_notifications_baseline", String(Date.now()));

    const notificationCtor = vi.fn() as unknown as typeof Notification;
    notificationCtor.permission = "granted";
    notificationCtor.requestPermission = vi
      .fn()
      .mockResolvedValue("granted") as typeof Notification.requestPermission;
    vi.stubGlobal("Notification", notificationCtor);
    vi.stubGlobal("window", {
      ...window,
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
        removeItem: (key: string) => {
          storage.delete(key);
        },
      },
      sessionStorage: {
        getItem: () => null,
        setItem: () => undefined,
        removeItem: () => undefined,
      },
      Notification: notificationCtor,
      dispatchEvent: vi.fn(),
    });
    vi.stubGlobal("document", { visibilityState: "hidden" });

    const notification = {
      id: "status-1",
      type: "application_status" as const,
      title: "Заявка отклонена",
      message: "Отклонена",
      timestamp: "сейчас",
      createdAt: "2020-01-01T00:00:00.000Z",
      isRead: false,
      status: "REJECTED" as const,
      applicationId: "app-1",
    };

    const delivered = deliverBrowserNotifications([], notification);
    expect(delivered).toBe(1);
    expect(notificationCtor).toHaveBeenCalledOnce();
  });
});
