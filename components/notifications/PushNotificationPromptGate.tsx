"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PushNotificationPromptModal } from "@/components/notifications/PushNotificationPromptModal";
import {
  enableBrowserNotifications,
  markPushPromptDismissed,
  shouldShowPushNotificationPrompt,
  showWelcomeBrowserNotification,
} from "@/lib/notifications/browserNotifications";

const OPEN_DELAY_MS = 4500;

const HIDDEN_PATH_PREFIXES = ["/login", "/banned", "/verify-email"];

function isHiddenPath(pathname: string): boolean {
  return HIDDEN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function PushNotificationPromptGate() {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [enabling, setEnabling] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setEnabling(false);
  }, []);

  const schedulePrompt = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (loading || !isAuthenticated || isHiddenPath(pathname)) return;
    if (!shouldShowPushNotificationPrompt()) return;

    timerRef.current = setTimeout(() => {
      if (!shouldShowPushNotificationPrompt()) return;
      setOpen(true);
    }, OPEN_DELAY_MS);
  }, [isAuthenticated, loading, pathname]);

  useEffect(() => {
    schedulePrompt();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [schedulePrompt]);

  const handleLater = useCallback(() => {
    markPushPromptDismissed();
    close();
  }, [close]);

  const handleClose = useCallback(() => {
    markPushPromptDismissed();
    close();
  }, [close]);

  const handleEnable = useCallback(async () => {
    setEnabling(true);
    try {
      const result = await enableBrowserNotifications();
      if (result.success) {
        showWelcomeBrowserNotification();
      }
    } finally {
      close();
    }
  }, [close]);

  return (
    <PushNotificationPromptModal
      open={open}
      enabling={enabling}
      onClose={handleClose}
      onLater={handleLater}
      onEnable={() => void handleEnable()}
    />
  );
}
