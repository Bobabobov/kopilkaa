"use client";

import { useCallback } from "react";
import { patchPasswordApi } from "../api";

type ShowNotification = (
  type: "success" | "error" | "info",
  title: string,
  message: string,
) => void;

export interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function usePasswordHandlers(
  setPasswordError: (e: string) => void,
  showLocalNotification: ShowNotification,
  passwordData: PasswordData,
  setPasswordData: (d: Partial<PasswordData>) => void,
  setIsChangingPassword: (v: boolean) => void,
) {
  const handlePasswordChange = useCallback(
    async (oldPassword: string, newPassword: string): Promise<boolean> => {
      try {
        await patchPasswordApi(oldPassword, newPassword);
        showLocalNotification("success", "Успешно!", "Пароль изменен");
        return true;
      } catch (e) {
        setPasswordError(
          e instanceof Error ? e.message : "Ошибка изменения пароля",
        );
        return false;
      }
    },
    [setPasswordError, showLocalNotification],
  );

  const handlePasswordSubmit = useCallback(async () => {
    setPasswordError("");

    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("Все поля обязательны для заполнения");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Пароли не совпадают");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Пароль должен содержать минимум 6 символов");
      return;
    }

    const success = await handlePasswordChange(
      passwordData.oldPassword,
      passwordData.newPassword,
    );
    if (success) {
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    }
  }, [
    passwordData,
    setPasswordData,
    setIsChangingPassword,
    handlePasswordChange,
    setPasswordError,
  ]);

  const cancelPasswordChange = useCallback(() => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setIsChangingPassword(false);
  }, [setPasswordData, setPasswordError, setIsChangingPassword]);

  return {
    handlePasswordChange,
    handlePasswordSubmit,
    cancelPasswordChange,
  };
}
