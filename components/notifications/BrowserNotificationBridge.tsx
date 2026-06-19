"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Notification } from "@/components/notifications/types";
import {
  areBrowserNotificationsEnabled,
  deliverBrowserNotifications,
  migrateBrowserNotificationsPreference,
} from "@/lib/notifications/browserNotifications";

const POLL_INTERVAL_MS = 8_000;

export default function BrowserNotificationBridge() {
  const { isAuthenticated, loading } = useAuth();
  const fetchingRef = useRef(false);

  const poll = useCallback(async () => {
    if (fetchingRef.current) return;
    if (!isAuthenticated || !areBrowserNotificationsEnabled()) return;

    fetchingRef.current = true;
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 5000);

      const response = await fetch("/api/notifications", {
        cache: "no-store",
        signal: controller.signal,
      }).finally(() => window.clearTimeout(timeout));

      if (!response.ok) return;

      const data = (await response.json()) as {
        success?: boolean;
        notifications?: Notification[];
        pendingStatusModal?: Notification | null;
      };

      if (!data.success || !Array.isArray(data.notifications)) return;

      deliverBrowserNotifications(
        data.notifications,
        data.pendingStatusModal ?? null,
      );
    } catch {
      // тихий fallback — повторим при следующем poll
    } finally {
      fetchingRef.current = false;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (loading || !isAuthenticated) return;

    migrateBrowserNotificationsPreference();
    void poll();

    const interval = window.setInterval(() => void poll(), POLL_INTERVAL_MS);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        void poll();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isAuthenticated, loading, poll]);

  return null;
}
