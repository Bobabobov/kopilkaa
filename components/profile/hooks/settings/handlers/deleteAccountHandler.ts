"use client";

import { useCallback } from "react";
import { deleteAccountApi } from "../api";

type ShowNotification = (
  type: "success" | "error" | "info",
  title: string,
  message: string,
) => void;

async function logoutAfterAccountDelete() {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/";
}

export function useDeleteAccountHandler(showLocalNotification: ShowNotification) {
  const handleDeleteAccount = useCallback(async () => {
    try {
      await deleteAccountApi();
      showLocalNotification(
        "success",
        "Аккаунт удалён",
        "Вы будете перенаправлены на главную",
      );
      await logoutAfterAccountDelete();
    } catch (e) {
      showLocalNotification(
        "error",
        "Ошибка",
        e instanceof Error ? e.message : "Не удалось удалить аккаунт",
      );
    }
  }, [showLocalNotification]);

  return { handleDeleteAccount };
}
