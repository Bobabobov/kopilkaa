"use client";

import { useState, useCallback } from "react";

export type NotificationType = "success" | "error" | "info";

export interface LocalNotificationState {
  show: boolean;
  type: NotificationType;
  title: string;
  message: string;
}

export function useLocalNotification() {
  const [localNotification, setLocalNotification] =
    useState<LocalNotificationState>({
      show: false,
      type: "info",
      title: "",
      message: "",
    });

  const showLocalNotification = useCallback(
    (type: NotificationType, title: string, message: string) => {
      setLocalNotification({ show: true, type, title, message });
      setTimeout(() => {
        setLocalNotification((prev) => ({ ...prev, show: false }));
      }, 4000);
    },
    [],
  );

  return { localNotification, showLocalNotification };
}
