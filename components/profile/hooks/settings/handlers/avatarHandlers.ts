"use client";

import { useCallback } from "react";
import { postAvatarApi, deleteAvatarApi } from "../api";
import { submitPendingApplicationIfNeeded } from "@/lib/applications/pendingSubmission";
import type { SettingsUser } from "../types";

type ShowNotification = (
  type: "success" | "error" | "info",
  title: string,
  message: string,
) => void;

export function useAvatarHandlers(
  user: SettingsUser | null,
  setUser: (u: SettingsUser | null) => void,
  setSaving: (s: boolean) => void,
  showLocalNotification: ShowNotification,
) {
  const handleAvatarChange = useCallback(
    (avatarUrl: string | null) => {
      if (user) setUser({ ...user, avatar: avatarUrl });
    },
    [user, setUser],
  );

  const handleAvatarUpload = useCallback(
    async (file: File) => {
      try {
        setSaving(true);
        const { avatar } = await postAvatarApi(file);
        if (user) setUser({ ...user, avatar });
        showLocalNotification("success", "Успешно!", "Аватарка обновлена");
        const submitted = await submitPendingApplicationIfNeeded();
        if (submitted && typeof window !== "undefined") {
          window.location.href = "/applications";
          return;
        }
      } catch (e) {
        showLocalNotification(
          "error",
          "Ошибка",
          e instanceof Error ? e.message : "Не удалось загрузить аватарку",
        );
      } finally {
        setSaving(false);
      }
    },
    [user, setUser, setSaving, showLocalNotification],
  );

  const handleAvatarDelete = useCallback(async () => {
    try {
      setSaving(true);
      await deleteAvatarApi();
      if (user) setUser({ ...user, avatar: null });
      showLocalNotification("success", "Успешно!", "Аватарка удалена");
    } catch (e) {
      showLocalNotification(
        "error",
        "Ошибка",
        e instanceof Error ? e.message : "Не удалось удалить аватарку",
      );
    } finally {
      setSaving(false);
    }
  }, [user, setUser, setSaving, showLocalNotification]);

  return {
    handleAvatarChange,
    handleAvatarUpload,
    handleAvatarDelete,
  };
}
