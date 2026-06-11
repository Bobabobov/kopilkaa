"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassModal } from "@/components/ui/GlassModal";
import type { Notification } from "@/components/notifications/types";
import { ApplicationStatusModal } from "@/components/notifications/ApplicationStatusModal";
import {
  getNotificationHref,
  getStatusModalActionLabel,
  getStatusModalStatusLine,
} from "@/lib/notifications/navigation";

async function dismissNotificationOnServer(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/notifications/${id}/dismiss`, {
      method: "POST",
      cache: "no-store",
      keepalive: true,
    });
    return response.ok;
  } catch {
    return false;
  }
}

export default function ApplicationStatusModalGate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const openRef = useRef(false);
  const fetchingRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const check = useCallback(async () => {
    if (fetchingRef.current || openRef.current) return;
    fetchingRef.current = true;
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 5000);

      const response = await fetch("/api/notifications", {
        cache: "no-store",
        signal: controller.signal,
      }).finally(() => window.clearTimeout(timeout));

      if (!response.ok) return;

      const data = await response.json();
      const pending = (data?.pendingStatusModal ?? null) as Notification | null;
      if (!pending?.id || openRef.current) return;

      setNotification(pending);
      setOpen(true);
    } catch {
      // тихий fallback — повторим при следующем poll
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  const closeModal = useCallback(async () => {
    const current = notification;
    setOpen(false);
    setNotification(null);

    if (current?.id) {
      await dismissNotificationOnServer(current.id);
    }
  }, [notification]);

  const handleAction = useCallback(async () => {
    const current = notification;
    if (!current) return;

    const href = getNotificationHref(current);
    setOpen(false);
    setNotification(null);

    if (current.id) {
      await dismissNotificationOnServer(current.id);
    }

    if (href) router.push(href);
  }, [notification, router]);

  const title = notification?.title ?? "Обновление";
  const message = notification?.message ?? "";
  const timeAgo = notification?.timestamp ?? "";
  const adminComment =
    typeof notification?.adminComment === "string"
      ? notification.adminComment.trim()
      : "";

  const isApproved = notification?.status === "APPROVED";
  const isRejected = notification?.status === "REJECTED";

  const actionButtonLabel = notification
    ? getStatusModalActionLabel(notification)
    : "Открыть";
  const statusLine = notification
    ? getStatusModalStatusLine(notification)
    : "Уведомление";

  useEffect(() => {
    void check();
    const interval = window.setInterval(() => void check(), 15000);
    const onFocus = () => void check();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void check();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [check]);

  return (
    <GlassModal
      open={open && Boolean(notification)}
      onClose={() => void closeModal()}
      size="lg"
      zIndex={80}
      panelClassName="max-w-[480px]"
      hideHeader
      showCloseButton={false}
      bodyClassName="p-0 overflow-hidden"
      ariaLabelledBy="application-status-modal-title"
    >
      {notification ? (
        <ApplicationStatusModal
          title={title}
          message={message}
          timeAgo={timeAgo}
          adminComment={adminComment}
          statusLine={statusLine}
          status={notification.status}
          isApproved={isApproved}
          isRejected={isRejected}
          linkedAccounts={notification.linkedAccounts}
          actionButtonLabel={actionButtonLabel}
          showActionButton
          onClose={() => void closeModal()}
          onAction={() => void handleAction()}
        />
      ) : null}
    </GlassModal>
  );
}
