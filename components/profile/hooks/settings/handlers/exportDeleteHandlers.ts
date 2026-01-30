"use client";

import { useCallback } from "react";
import { fetchExportBlob, deleteAccountApi } from "../api";

type ShowNotification = (
  type: "success" | "error" | "info",
  title: string,
  message: string,
) => void;

export function useExportDeleteHandlers(
  showLocalNotification: ShowNotification,
) {
  const handleExportData = useCallback(async () => {
    try {
      const blob = await fetchExportBlob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `profile-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showLocalNotification("success", "Успешно!", "Данные экспортированы");
    } catch (e) {
      showLocalNotification(
        "error",
        "Ошибка",
        e instanceof Error ? e.message : "Не удалось экспортировать данные",
      );
    }
  }, [showLocalNotification]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      await deleteAccountApi();
      showLocalNotification(
        "success",
        "Аккаунт удален",
        "Ваш аккаунт был успешно удален",
      );
    } catch (e) {
      showLocalNotification(
        "error",
        "Ошибка",
        e instanceof Error ? e.message : "Не удалось удалить аккаунт",
      );
    }
  }, [showLocalNotification]);

  return { handleExportData, handleDeleteAccount };
}
