"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BROWSER_NOTIFICATIONS_CHANGED_EVENT,
  disableBrowserNotifications,
  enableBrowserNotifications,
  getBrowserNotificationsPreference,
  migrateBrowserNotificationsPreference,
} from "@/lib/notifications/browserNotifications";

export function useBrowserNotificationsPreference() {
  const [preference, setPreference] = useState(() =>
    getBrowserNotificationsPreference(),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    migrateBrowserNotificationsPreference();
    setPreference(getBrowserNotificationsPreference());
  }, []);

  useEffect(() => {
    refresh();

    const onChange = () => refresh();
    window.addEventListener(BROWSER_NOTIFICATIONS_CHANGED_EVENT, onChange);
    window.addEventListener("focus", onChange);

    return () => {
      window.removeEventListener(BROWSER_NOTIFICATIONS_CHANGED_EVENT, onChange);
      window.removeEventListener("focus", onChange);
    };
  }, [refresh]);

  const enable = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await enableBrowserNotifications();
      refresh();
      if (!result.success) {
        setError(result.message ?? "Не удалось включить уведомления");
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const disable = useCallback(() => {
    setError(null);
    disableBrowserNotifications();
    refresh();
  }, [refresh]);

  const toggle = useCallback(async () => {
    if (preference.enabled) {
      disable();
      return { success: true as const };
    }
    return enable();
  }, [disable, enable, preference.enabled]);

  return {
    ...preference,
    loading,
    error,
    refresh,
    enable,
    disable,
    toggle,
  };
}
