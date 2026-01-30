"use client";

import { useCallback } from "react";
import { patchProfileApi } from "../api";
import type { SettingsUser } from "../types";

type ShowNotification = (
  type: "success" | "error" | "info",
  title: string,
  message: string,
) => void;

export function useProfileHandlers(
  setUser: (u: SettingsUser | null) => void,
  setSaving: (s: boolean) => void,
  showLocalNotification: ShowNotification,
) {
  const handleNameChange = useCallback(
    async (newName: string) => {
      try {
        setSaving(true);
        const { user } = await patchProfileApi({ name: newName });
        setUser(user);
        showLocalNotification("success", "Успешно!", "Имя обновлено");
      } catch (e) {
        showLocalNotification(
          "error",
          "Ошибка",
          e instanceof Error ? e.message : "Не удалось обновить имя",
        );
      } finally {
        setSaving(false);
      }
    },
    [setUser, setSaving, showLocalNotification],
  );

  const handleUsernameChange = useCallback(
    async (newUsername: string) => {
      try {
        setSaving(true);
        const { user } = await patchProfileApi({ username: newUsername });
        setUser(user);
        showLocalNotification("success", "Успешно!", "Логин обновлён");
      } catch (e) {
        showLocalNotification(
          "error",
          "Ошибка",
          e instanceof Error ? e.message : "Не удалось обновить логин",
        );
      } finally {
        setSaving(false);
      }
    },
    [setUser, setSaving, showLocalNotification],
  );

  const handleEmailChange = useCallback(
    async (newEmail: string) => {
      try {
        setSaving(true);
        const { user } = await patchProfileApi({ email: newEmail });
        setUser(user);
        showLocalNotification("success", "Успешно!", "Email обновлен");
      } catch (e) {
        showLocalNotification(
          "error",
          "Ошибка",
          e instanceof Error ? e.message : "Не удалось обновить email",
        );
      } finally {
        setSaving(false);
      }
    },
    [setUser, setSaving, showLocalNotification],
  );

  const handleEmailVisibilityChange = useCallback(
    async (hideEmail: boolean) => {
      try {
        setSaving(true);
        const { user } = await patchProfileApi({ hideEmail });
        setUser(user);
        showLocalNotification(
          "success",
          "Успешно!",
          `Email ${hideEmail ? "скрыт" : "показывается"}`,
        );
      } catch (e) {
        showLocalNotification(
          "error",
          "Ошибка",
          e instanceof Error
            ? e.message
            : "Не удалось изменить видимость email",
        );
      } finally {
        setSaving(false);
      }
    },
    [setUser, setSaving, showLocalNotification],
  );

  return {
    handleNameChange,
    handleUsernameChange,
    handleEmailChange,
    handleEmailVisibilityChange,
  };
}
