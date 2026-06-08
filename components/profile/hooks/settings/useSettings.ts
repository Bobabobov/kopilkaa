"use client";

import { useState, useEffect, useCallback } from "react";
import { loadUserApi } from "./api";
import { useLocalNotification } from "./useLocalNotification";
import { useProfileHandlers } from "./handlers/profileHandlers";
import { useSocialHandler } from "./handlers/socialHandler";
import { useAvatarHandlers } from "./handlers/avatarHandlers";
import { usePasswordHandlers } from "./handlers/passwordHandlers";
import { useDeleteAccountHandler } from "./handlers/deleteAccountHandler";
import type { UseSettingsReturn, SettingsUser } from "./types";

export function useSettings(): UseSettingsReturn {
  const [user, setUser] = useState<SettingsUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordDataState, setPasswordDataState] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const setPasswordData = useCallback(
    (data: Partial<typeof passwordDataState>) => {
      setPasswordDataState((prev) => ({ ...prev, ...data }));
    },
    [],
  );
  const [passwordError, setPasswordError] = useState("");

  const { localNotification, showLocalNotification } = useLocalNotification();

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const { user: u } = await loadUserApi();
      setUser(u);
    } catch (error) {
      setUser(null);
      setLoadError(
        error instanceof Error
          ? error.message
          : "Не удалось загрузить данные профиля",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const {
    handleNameChange,
    handleUsernameChange,
    handleEmailChange,
    handleEmailVisibilityChange,
  } = useProfileHandlers(setUser, setSaving, showLocalNotification);

  const { handleSocialLinkChange } = useSocialHandler(
    setUser,
    setSaving,
    showLocalNotification,
  );

  const { handleAvatarChange, handleAvatarUpload, handleAvatarDelete } =
    useAvatarHandlers(user, setUser, setSaving, showLocalNotification);

  const { handlePasswordChange, handlePasswordSubmit, cancelPasswordChange } =
    usePasswordHandlers(
      setPasswordError,
      showLocalNotification,
      passwordDataState,
      setPasswordData,
      setIsChangingPassword,
      setSaving,
    );

  const { handleDeleteAccount } = useDeleteAccountHandler(showLocalNotification);

  return {
    user,
    loading,
    loadError,
    saving,
    isChangingPassword,
    setIsChangingPassword,
    passwordData: passwordDataState,
    setPasswordData,
    passwordError,
    setPasswordError,
    localNotification,
    loadUser,
    handleUsernameChange,
    handleNameChange,
    handleEmailChange,
    handleEmailVisibilityChange,
    handleSocialLinkChange,
    handleAvatarChange,
    handleAvatarUpload,
    handleAvatarDelete,
    handlePasswordChange,
    handlePasswordSubmit,
    cancelPasswordChange,
    handleDeleteAccount,
    showLocalNotification,
  };
}
