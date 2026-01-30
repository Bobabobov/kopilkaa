"use client";

import { useCallback } from "react";
import { postPhoneApi } from "../api";

type ShowNotification = (
  type: "success" | "error" | "info",
  title: string,
  message: string,
) => void;

export function usePhoneHandler(
  loadUser: () => Promise<void>,
  setSaving: (s: boolean) => void,
  showLocalNotification: ShowNotification,
) {
  const handlePhoneChange = useCallback(
    async (phone: string) => {
      try {
        setSaving(true);
        await postPhoneApi(phone);
        await loadUser();
        showLocalNotification(
          "success",
          "Телефон обновлён",
          "Код подтверждения отправлен (в тестовом режиме он показан на экране).",
        );
      } catch (e) {
        showLocalNotification(
          "error",
          "Ошибка",
          e instanceof Error ? e.message : "Не удалось обновить телефон",
        );
      } finally {
        setSaving(false);
      }
    },
    [loadUser, setSaving, showLocalNotification],
  );

  return { handlePhoneChange };
}
