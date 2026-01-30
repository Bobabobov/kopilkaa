"use client";

import { useState, useEffect, useCallback } from "react";
import { loadUserApi } from "./api";
import { useLocalNotification } from "./useLocalNotification";
import { useProfileHandlers } from "./handlers/profileHandlers";
import { usePhoneHandler } from "./handlers/phoneHandler";
import { useSocialHandler } from "./handlers/socialHandler";
import { useAvatarHandlers } from "./handlers/avatarHandlers";
import { usePasswordHandlers } from "./handlers/passwordHandlers";
import { useExportDeleteHandlers } from "./handlers/exportDeleteHandlers";
import type { UseSettingsReturn, SettingsUser } from "./types";

export function useSettings(): UseSettingsReturn {
  const [user, setUser] = useState<SettingsUser | null>(null);
  const [loading, setLoading] = useState(true);
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
      const { user: u } = await loadUserApi();
      setUser(u);
    } catch {
      // keep user null on error
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

  const { handlePhoneChange } = usePhoneHandler(
    loadUser,
    setSaving,
    showLocalNotification,
  );

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
    );

  const { handleExportData, handleDeleteAccount } = useExportDeleteHandlers(
    showLocalNotification,
  );

  return {
    user,
    loading,
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
