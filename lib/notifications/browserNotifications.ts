import type { Notification } from "@/components/notifications/types";
import { getNotificationHref } from "@/lib/notifications/navigation";

export const PUSH_PROMPT_DISMISSED_AT_KEY = "kopilka_push_prompt_dismissed_at";
export const PUSH_PROMPT_ENABLED_KEY = "kopilka_push_prompt_enabled";
export const PUSH_NOTIFICATIONS_DISABLED_KEY = "kopilka_push_notifications_disabled";
export const BROWSER_NOTIFICATIONS_BASELINE_KEY =
  "kopilka_browser_notifications_baseline";
export const BROWSER_NOTIFICATIONS_DELIVERED_KEY =
  "kopilka_browser_notifications_delivered_ids";

export const BROWSER_NOTIFICATIONS_CHANGED_EVENT =
  "kopilka-browser-notifications-changed";

export const PUSH_PROMPT_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

export const PUSH_PROMPT_FEATURES = [
  {
    id: "messages",
    title: "Новые сообщения",
    description:
      "Заявки в друзья и личные события, которые касаются вашего аккаунта",
  },
  {
    id: "activity",
    title: "Реакции и комментарии",
    description:
      "Узнавайте о новых реакциях на вашу историю и комментариях под ней",
  },
  {
    id: "updates",
    title: "Важные обновления",
    description:
      "Статус истории, выплаты гонораров, добрые дела и другие важные события платформы",
  },
] as const;

const MAX_STORED_DELIVERED_IDS = 200;

function dispatchPreferenceChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(BROWSER_NOTIFICATIONS_CHANGED_EVENT));
}

export function isBrowserNotificationSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    typeof Notification.requestPermission === "function"
  );
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isBrowserNotificationSupported()) return "unsupported";
  return Notification.permission;
}

/** Включены ли уведомления на сайте: разрешение браузера + нет явного отключения */
export function areBrowserNotificationsEnabled(): boolean {
  if (!isBrowserNotificationSupported()) return false;
  if (Notification.permission !== "granted") return false;
  if (typeof window === "undefined") return false;
  return (
    window.localStorage.getItem(PUSH_NOTIFICATIONS_DISABLED_KEY) !== "1"
  );
}

export function getBrowserNotificationsPreference(): {
  supported: boolean;
  permission: NotificationPermission | "unsupported";
  enabled: boolean;
} {
  const permission = getNotificationPermission();
  return {
    supported: permission !== "unsupported",
    permission,
    enabled: areBrowserNotificationsEnabled(),
  };
}

export function setBrowserNotificationsEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;

  if (enabled) {
    window.localStorage.removeItem(PUSH_NOTIFICATIONS_DISABLED_KEY);
    window.localStorage.setItem(PUSH_PROMPT_ENABLED_KEY, "1");
    window.localStorage.removeItem(PUSH_PROMPT_DISMISSED_AT_KEY);
    markBrowserNotificationsBaseline();
  } else {
    window.localStorage.setItem(PUSH_NOTIFICATIONS_DISABLED_KEY, "1");
    window.localStorage.removeItem(PUSH_PROMPT_ENABLED_KEY);
  }

  dispatchPreferenceChanged();
}

export function markBrowserNotificationsBaseline(now = Date.now()): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BROWSER_NOTIFICATIONS_BASELINE_KEY, String(now));
  clearDeliveredNotificationIds();
}

function getBrowserNotificationsBaseline(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(BROWSER_NOTIFICATIONS_BASELINE_KEY);
  if (!raw) return null;
  const value = Number.parseInt(raw, 10);
  return Number.isNaN(value) ? null : value;
}

function getDeliveredNotificationIds(): Set<string> {
  if (typeof window === "undefined") return new Set();

  try {
    const raw = window.sessionStorage.getItem(BROWSER_NOTIFICATIONS_DELIVERED_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set();
  }
}

function markNotificationDelivered(id: string): void {
  if (typeof window === "undefined") return;

  const ids = getDeliveredNotificationIds();
  ids.add(id);
  const trimmed = Array.from(ids).slice(-MAX_STORED_DELIVERED_IDS);
  window.sessionStorage.setItem(
    BROWSER_NOTIFICATIONS_DELIVERED_KEY,
    JSON.stringify(trimmed),
  );
}

export function clearDeliveredNotificationIds(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(BROWSER_NOTIFICATIONS_DELIVERED_KEY);
}

export function shouldShowPushNotificationPrompt(now = Date.now()): boolean {
  if (!isBrowserNotificationSupported()) return false;
  if (Notification.permission !== "default") return false;
  if (typeof window === "undefined") return false;

  const dismissedRaw = window.localStorage.getItem(PUSH_PROMPT_DISMISSED_AT_KEY);
  if (!dismissedRaw) return true;

  const dismissedAt = Number.parseInt(dismissedRaw, 10);
  if (Number.isNaN(dismissedAt)) return true;

  return now - dismissedAt >= PUSH_PROMPT_COOLDOWN_MS;
}

export function markPushPromptDismissed(now = Date.now()): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PUSH_PROMPT_DISMISSED_AT_KEY, String(now));
}

export function markPushPromptEnabled(): void {
  setBrowserNotificationsEnabled(true);
}

export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (!isBrowserNotificationSupported()) {
    return "denied";
  }

  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

export async function enableBrowserNotifications(): Promise<{
  success: boolean;
  permission: NotificationPermission | "unsupported";
  message?: string;
}> {
  if (!isBrowserNotificationSupported()) {
    return {
      success: false,
      permission: "unsupported",
      message: "Браузер не поддерживает уведомления",
    };
  }

  let permission = Notification.permission;

  if (permission === "default") {
    permission = await requestBrowserNotificationPermission();
  }

  if (permission === "granted") {
    setBrowserNotificationsEnabled(true);
    return { success: true, permission };
  }

  setBrowserNotificationsEnabled(false);
  markPushPromptDismissed();

  return {
    success: false,
    permission,
    message:
      permission === "denied"
        ? "Разрешение отклонено в браузере. Включите уведомления в настройках сайта браузера."
        : "Не удалось получить разрешение на уведомления",
  };
}

export function disableBrowserNotifications(): void {
  setBrowserNotificationsEnabled(false);
  markPushPromptDismissed();
}

export function showBrowserNotification(
  title: string,
  body: string,
  options?: {
    tag?: string;
    onClickHref?: string | null;
  },
): void {
  if (!areBrowserNotificationsEnabled()) return;

  try {
    const instance = new Notification(title, {
      body,
      icon: "/favicon.ico",
      tag: options?.tag,
    });

    if (options?.onClickHref) {
      const href = options.onClickHref;
      instance.onclick = () => {
        window.focus();
        window.location.assign(href);
        instance.close();
      };
    }
  } catch {
    // Safari / ограничения окружения
  }
}

export function showWelcomeBrowserNotification(): void {
  showBrowserNotification(
    "Уведомления включены",
    "Теперь вы будете получать важные обновления от «Копилки».",
    { tag: "kopilka-push-welcome" },
  );
}

function isPendingStatusNotification(notification: Notification): boolean {
  return (
    (notification.type === "application_status" ||
      notification.type === "withdrawal_status" ||
      notification.type === "good_deed_submission_status") &&
    !notification.isRead
  );
}

function shouldDeliverBrowserNotification(
  notification: Notification,
  deliveredIds: Set<string>,
  baseline: number | null,
): boolean {
  if (deliveredIds.has(notification.id)) return false;

  // Решения по заявкам/выплатам — важные, доставляем пока модалка не закрыта
  if (isPendingStatusNotification(notification)) return true;

  if (baseline === null) return false;

  const eventAt = new Date(notification.createdAt).getTime();
  return eventAt > baseline;
}

/** Собирает уникальный список для доставки в браузер */
export function collectNotificationsForBrowserDelivery(
  notifications: Notification[],
  pendingStatusModal?: Notification | null,
): Notification[] {
  const byId = new Map<string, Notification>();

  for (const notification of notifications) {
    byId.set(notification.id, notification);
  }

  if (pendingStatusModal) {
    byId.set(pendingStatusModal.id, pendingStatusModal);
  }

  return Array.from(byId.values()).sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/** Показывает браузерные уведомления для новых событий с API */
export function deliverBrowserNotifications(
  notifications: Notification[],
  pendingStatusModal?: Notification | null,
): number {
  if (!areBrowserNotificationsEnabled()) return 0;
  if (typeof document !== "undefined" && document.visibilityState === "visible") {
    return 0;
  }

  const items = collectNotificationsForBrowserDelivery(
    notifications,
    pendingStatusModal,
  );
  const deliveredIds = getDeliveredNotificationIds();
  const baseline = getBrowserNotificationsBaseline();
  let delivered = 0;

  for (const notification of items) {
    if (!shouldDeliverBrowserNotification(notification, deliveredIds, baseline)) {
      continue;
    }

    showBrowserNotification(notification.title, notification.message, {
      tag: notification.id,
      onClickHref: getNotificationHref(notification),
    });
    markNotificationDelivered(notification.id);
    delivered += 1;
  }

  return delivered;
}

/** Миграция: если разрешение уже выдано, считаем уведомления включёнными */
export function migrateBrowserNotificationsPreference(): void {
  if (typeof window === "undefined") return;
  if (!isBrowserNotificationSupported()) return;
  if (Notification.permission !== "granted") return;

  const explicitlyDisabled =
    window.localStorage.getItem(PUSH_NOTIFICATIONS_DISABLED_KEY) === "1";
  if (explicitlyDisabled) return;

  window.localStorage.setItem(PUSH_PROMPT_ENABLED_KEY, "1");

  if (!window.localStorage.getItem(BROWSER_NOTIFICATIONS_BASELINE_KEY)) {
    markBrowserNotificationsBaseline();
  }
}
