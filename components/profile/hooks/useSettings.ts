// components/profile/hooks/useSettings.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";

type User = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
  avatarFrame?: string | null;
  hideEmail?: boolean;
  lastSeen?: string;
};

interface UseSettingsReturn {
  // Состояние
  user: User | null;
  loading: boolean;
  saving: boolean;

  // Пароль
  isChangingPassword: boolean;
  setIsChangingPassword: (changing: boolean) => void;
  passwordData: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPasswordData: (data: any) => void;
  passwordError: string;
  setPasswordError: (error: string) => void;

  // Локальные уведомления
  localNotification: {
    show: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  };

  // Действия
  loadUser: () => Promise<void>;
  handleNameChange: (newName: string) => Promise<void>;
  handleEmailChange: (newEmail: string) => Promise<void>;
  handleEmailVisibilityChange: (hideEmail: boolean) => Promise<void>;
  handleAvatarChange: (avatarUrl: string | null) => void;
  handleFrameChange: (frame: string) => void;
  handlePasswordChange: (
    oldPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
  handlePasswordSubmit: () => Promise<void>;
  cancelPasswordChange: () => void;
  handleExportData: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  showLocalNotification: (
    type: "success" | "error" | "info",
    title: string,
    message: string,
  ) => void;
}

export function useSettings(): UseSettingsReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // Локальные уведомления
  const [localNotification, setLocalNotification] = useState<{
    show: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  }>({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const { showToast } = useBeautifulToast();

  // Показ локальных уведомлений
  const showLocalNotification = useCallback(
    (type: "success" | "error" | "info", title: string, message: string) => {
      setLocalNotification({ show: true, type, title, message });
      setTimeout(() => {
        setLocalNotification((prev) => ({ ...prev, show: false }));
      }, 4000);
    },
    [],
  );

  // Загрузка пользователя
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/profile/me", { cache: "no-store" });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // Исправлено: data.user вместо data
      } else {
        console.error("Failed to load user data");
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Изменение имени
  const handleNameChange = useCallback(
    async (newName: string) => {
      try {
        setSaving(true);
        const response = await fetch("/api/profile/me", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // Исправлено: data.user вместо data
          showLocalNotification("success", "Успешно!", "Имя обновлено");
        } else {
          const errorData = await response.json();
          showLocalNotification(
            "error",
            "Ошибка",
            errorData.message || "Не удалось обновить имя",
          );
        }
      } catch (error) {
        console.error("Error updating name:", error);
        showLocalNotification(
          "error",
          "Ошибка",
          "Произошла ошибка при обновлении имени",
        );
      } finally {
        setSaving(false);
      }
    },
    [showLocalNotification],
  );

  // Изменение email
  const handleEmailChange = useCallback(
    async (newEmail: string) => {
      try {
        setSaving(true);
        const response = await fetch("/api/profile/me", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: newEmail }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // Исправлено: data.user вместо data
          showLocalNotification("success", "Успешно!", "Email обновлен");
        } else {
          const errorData = await response.json();
          showLocalNotification(
            "error",
            "Ошибка",
            errorData.message || "Не удалось обновить email",
          );
        }
      } catch (error) {
        console.error("Error updating email:", error);
        showLocalNotification(
          "error",
          "Ошибка",
          "Произошла ошибка при обновлении email",
        );
      } finally {
        setSaving(false);
      }
    },
    [showLocalNotification],
  );

  // Изменение видимости email
  const handleEmailVisibilityChange = useCallback(
    async (hideEmail: boolean) => {
      try {
        setSaving(true);
        const response = await fetch("/api/profile/me", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hideEmail }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // Исправлено: data.user вместо data
          showLocalNotification(
            "success",
            "Успешно!",
            `Email ${hideEmail ? "скрыт" : "показывается"}`,
          );
        } else {
          const errorData = await response.json();
          showLocalNotification(
            "error",
            "Ошибка",
            errorData.message || "Не удалось изменить видимость email",
          );
        }
      } catch (error) {
        console.error("Error updating email visibility:", error);
        showLocalNotification(
          "error",
          "Ошибка",
          "Произошла ошибка при изменении видимости email",
        );
      } finally {
        setSaving(false);
      }
    },
    [showLocalNotification],
  );

  // Изменение аватарки
  const handleAvatarChange = useCallback(
    (avatarUrl: string | null) => {
      if (user) {
        setUser({ ...user, avatar: avatarUrl });
      }
    },
    [user],
  );

  // Изменение рамки аватарки
  const handleFrameChange = useCallback(
    (frame: string) => {
      if (user) {
        setUser({ ...user, avatarFrame: frame });
      }
    },
    [user],
  );

  // Изменение пароля
  const handlePasswordChange = async (
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        showLocalNotification("success", "Успешно!", "Пароль изменен");
        return true;
      } else {
        const errorData = await response.json();
        setPasswordError(errorData.message || "Ошибка изменения пароля");
        return false;
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError("Произошла ошибка при изменении пароля");
      return false;
    }
  };

  // Отправка формы пароля
  const handlePasswordSubmit = async () => {
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
  };

  // Отмена изменения пароля
  const cancelPasswordChange = () => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    setIsChangingPassword(false);
  };

  // Экспорт данных
  const handleExportData = async () => {
    try {
      const response = await fetch("/api/profile/export");
      if (response.ok) {
        const blob = await response.blob();
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
      } else {
        showLocalNotification(
          "error",
          "Ошибка",
          "Не удалось экспортировать данные",
        );
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      showLocalNotification(
        "error",
        "Ошибка",
        "Произошла ошибка при экспорте данных",
      );
    }
  };

  // Удаление аккаунта
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/profile/delete", {
        method: "DELETE",
      });

      if (response.ok) {
        showLocalNotification(
          "success",
          "Аккаунт удален",
          "Ваш аккаунт был успешно удален",
        );
        // Перенаправление будет обработано в компоненте
      } else {
        const errorData = await response.json();
        showLocalNotification(
          "error",
          "Ошибка",
          errorData.message || "Не удалось удалить аккаунт",
        );
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      showLocalNotification(
        "error",
        "Ошибка",
        "Произошла ошибка при удалении аккаунта",
      );
    }
  };

  // Загружаем пользователя при монтировании
  useEffect(() => {
    loadUser();
  }, []); // Убираем зависимость от loadUser, чтобы избежать бесконечного цикла

  return {
    // Состояние
    user,
    loading,
    saving,

    // Пароль
    isChangingPassword,
    setIsChangingPassword,
    passwordData,
    setPasswordData,
    passwordError,
    setPasswordError,

    // Локальные уведомления
    localNotification,

    // Действия
    loadUser,
    handleNameChange,
    handleEmailChange,
    handleEmailVisibilityChange,
    handleAvatarChange,
    handleFrameChange,
    handlePasswordChange,
    handlePasswordSubmit,
    cancelPasswordChange,
    handleExportData,
    handleDeleteAccount,
    showLocalNotification,
  };
}
