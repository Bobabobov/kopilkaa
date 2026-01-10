// components/profile/hooks/useSettings.ts
"use client";

import { useState, useEffect, useCallback } from "react";

export type SettingsUser = {
  id: string;
  email: string;
  username?: string | null;
  role: "USER" | "ADMIN";
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
  hideEmail?: boolean;
  phone?: string | null;
  phoneVerified?: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  lastSeen?: string;
};
type User = SettingsUser;

export interface UseSettingsReturn {
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
  handleUsernameChange: (newUsername: string) => Promise<void>;
  handleNameChange: (newName: string) => Promise<void>;
  handleEmailChange: (newEmail: string) => Promise<void>;
  handleEmailVisibilityChange: (hideEmail: boolean) => Promise<void>;
  // Телефон
  handlePhoneChange: (phone: string) => Promise<void>;
  handleSocialLinkChange: (
    field: "vkLink" | "telegramLink" | "youtubeLink",
    link: string,
  ) => Promise<void>;
  handleAvatarChange: (avatarUrl: string | null) => void;
  handleAvatarUpload: (file: File) => Promise<void>;
  handleAvatarDelete: () => Promise<void>;
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

  // Изменение username
  const handleUsernameChange = useCallback(
    async (newUsername: string) => {
      try {
        setSaving(true);
        const response = await fetch("/api/profile/me", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: newUsername }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          showLocalNotification("success", "Успешно!", "Логин обновлён");
        } else {
          const errorData = await response.json().catch(() => ({}));
          showLocalNotification(
            "error",
            "Ошибка",
            errorData.error || errorData.message || "Не удалось обновить логин",
          );
        }
      } catch (error) {
        console.error("Error updating username:", error);
        showLocalNotification(
          "error",
          "Ошибка",
          "Произошла ошибка при обновлении логина",
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

  // Изменение / привязка телефона
  const handlePhoneChange = useCallback(
    async (phone: string) => {
      try {
        setSaving(true);
        const response = await fetch("/api/profile/phone", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone }),
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data?.success) {
          // Перезагружаем пользователя, чтобы обновить phone / phoneVerified
          await loadUser();
          showLocalNotification(
            "success",
            "Телефон обновлён",
            "Код подтверждения отправлен (в тестовом режиме он показан на экране).",
          );
        } else {
          showLocalNotification(
            "error",
            "Ошибка",
            data?.error || "Не удалось обновить телефон",
          );
        }
      } catch (error) {
        console.error("Error updating phone:", error);
        showLocalNotification(
          "error",
          "Ошибка",
          "Произошла ошибка при обновлении телефона",
        );
      } finally {
        setSaving(false);
      }
    },
    [loadUser, showLocalNotification],
  );

  const handleSocialLinkChange = useCallback(
    async (field: "vkLink" | "telegramLink" | "youtubeLink", link: string) => {
      try {
        setSaving(true);
        const response = await fetch("/api/profile/me", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [field]: link }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          showLocalNotification(
            "success",
            "Успешно!",
            field === "vkLink"
              ? "Ссылка VK обновлена"
              : field === "telegramLink"
                ? "Ссылка Telegram обновлена"
                : "Ссылка YouTube обновлена",
          );
        } else {
          const errorData = await response.json().catch(() => ({}));
          showLocalNotification(
            "error",
            "Ошибка",
            errorData.error ||
              errorData.message ||
              "Не удалось обновить ссылку",
          );
        }
      } catch (error) {
        console.error("Error updating social link:", error);
        showLocalNotification(
          "error",
          "Ошибка",
          "Произошла ошибка при обновлении ссылки",
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

  // Загрузка аватарки (multipart)
  const handleAvatarUpload = useCallback(
    async (file: File) => {
      try {
        setSaving(true);
        const form = new FormData();
        form.append("avatar", file);

        const response = await fetch("/api/profile/avatar", {
          method: "POST",
          body: form,
        });
        const data = await response.json().catch(() => null);
        if (!response.ok || !data?.ok) {
          showLocalNotification(
            "error",
            "Ошибка",
            data?.error || "Не удалось загрузить аватарку",
          );
          return;
        }
        const avatarUrl = data.avatar as string;
        if (user) setUser({ ...user, avatar: avatarUrl });
        showLocalNotification("success", "Успешно!", "Аватарка обновлена");
      } catch (error) {
        console.error("Error uploading avatar:", error);
        showLocalNotification("error", "Ошибка", "Произошла ошибка при загрузке аватарки");
      } finally {
        setSaving(false);
      }
    },
    [showLocalNotification, user],
  );

  const handleAvatarDelete = useCallback(async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/profile/avatar", { method: "DELETE" });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        showLocalNotification(
          "error",
          "Ошибка",
          data?.error || "Не удалось удалить аватарку",
        );
        return;
      }
      if (user) setUser({ ...user, avatar: null });
      showLocalNotification("success", "Успешно!", "Аватарка удалена");
    } catch (error) {
      console.error("Error deleting avatar:", error);
      showLocalNotification("error", "Ошибка", "Произошла ошибка при удалении аватарки");
    } finally {
      setSaving(false);
    }
  }, [showLocalNotification, user]);


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
    handleUsernameChange,
    handleNameChange,
    handleEmailChange,
    handleEmailVisibilityChange,
    handlePhoneChange,
    handleSocialLinkChange,
    handleAvatarChange,
    handleAvatarUpload,
    handleAvatarDelete,
    handlePasswordChange,
    handlePasswordSubmit,
    cancelPasswordChange,
    handleExportData,
    handleDeleteAccount,
    showLocalNotification,
  };
}
