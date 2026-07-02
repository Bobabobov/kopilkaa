// components/profile/SettingsModal.tsx
"use client";

import { useCallback, useRef } from "react";
import { GlassModal } from "@/components/ui/GlassModal";
import { useSettings } from "../hooks/useSettings";
import {
  EmailEditor,
  NameEditor,
  UsernameEditor,
  EmailVisibilityToggle,
} from "../settings/ProfileEditors";
import {
  SettingsLoading,
  SettingsUnauthorized,
  ErrorState,
} from "../settings/ProfileStates";
import { SettingsAccountSection } from "./SettingsAccountSection";
import { SettingsNotificationsSection } from "./SettingsNotificationsSection";
import { SettingsReviewSection } from "./SettingsReviewSection";
import { useSettingsModalLifecycle } from "./hooks/useSettingsModalLifecycle";
import { SettingsModalHeader } from "./SettingsModalHeader";
import { SettingsAvatarSection } from "./SettingsAvatarSection";
import { SettingsSocialLinksSection } from "./SettingsSocialLinksSection";
import { SettingsMetaInfo } from "./SettingsMetaInfo";
import { SettingsSection } from "./SettingsFields";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: () => void | Promise<void>;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onProfileUpdated,
}: SettingsModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const {
    user,
    loading,
    loadError,
    saving,
    isChangingPassword,
    setIsChangingPassword,
    passwordData,
    setPasswordData,
    passwordError,
    handlePasswordSubmit,
    cancelPasswordChange,
    loadUser,
    handleUsernameChange,
    handleNameChange,
    handleEmailChange,
    handleEmailVisibilityChange,
    handleSocialLinkChange,
    handleAvatarUpload,
    handleAvatarDelete,
    handleAvatarChange,
    handleDeleteAccount,
    showLocalNotification,
  } = useSettings();

  const handleClose = useCallback(() => {
    if (user) {
      void onProfileUpdated?.();
    }
    onClose();
  }, [user, onProfileUpdated, onClose]);

  useSettingsModalLifecycle({
    isOpen,
    dialogRef,
  });

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showLocalNotification(
        "success",
        "Скопировано",
        "Данные скопированы в буфер обмена",
      );
    } catch {
      showLocalNotification("error", "Ошибка", "Не удалось скопировать");
    }
  };

  return (
    <>
      <GlassModal
        open={isOpen}
        onClose={handleClose}
        size="4xl"
        zIndex={999}
        maxHeight="min(92dvh, 900px)"
        dialogRef={dialogRef}
        showCloseButton={false}
        header={<SettingsModalHeader onClose={handleClose} />}
        bodyClassName="p-4 sm:p-6"
        ariaLabelledBy="profile-settings-title"
        ariaDescribedBy="profile-settings-desc"
      >
        {loading ? (
          <SettingsLoading />
        ) : loadError ? (
          <ErrorState
            title="Не удалось загрузить настройки"
            message={loadError}
            onRetry={() => void loadUser()}
          />
        ) : !user ? (
          <SettingsUnauthorized />
        ) : (
          <div className="space-y-6 sm:space-y-8">
            <SettingsAvatarSection
              user={user}
              saving={saving}
              avatarInputRef={avatarInputRef}
              onUpload={handleAvatarUpload}
              onDelete={handleAvatarDelete}
              onTelegramAvatarSynced={(avatarUrl, message) => {
                if (avatarUrl) handleAvatarChange(avatarUrl);
                showLocalNotification("success", "Готово", message);
              }}
              onTelegramAvatarError={(message) => {
                showLocalNotification("error", "Telegram", message);
              }}
            />

            <SettingsSection title="Имя">
              <NameEditor
                currentName={user.name || ""}
                onSave={handleNameChange}
                disabled={saving}
              />
            </SettingsSection>

            <SettingsSection title="Логин">
              <UsernameEditor
                currentUsername={user.username ?? null}
                onSave={handleUsernameChange}
                disabled={saving}
              />
            </SettingsSection>

            <SettingsSection title="Email">
              <EmailEditor
                currentEmail={user.email}
                onSave={handleEmailChange}
                disabled={saving}
              />
            </SettingsSection>

            <EmailVisibilityToggle
              hideEmail={user.hideEmail ?? true}
              onToggle={handleEmailVisibilityChange}
              disabled={saving}
            />

            <SettingsSocialLinksSection
              user={user}
              saving={saving}
              onChange={handleSocialLinkChange}
            />

            <SettingsMetaInfo
              user={user}
              saving={saving}
              onCopy={handleCopy}
            />

            <SettingsNotificationsSection />

            <SettingsReviewSection
              userId={user.id}
              saving={saving}
              onNotify={showLocalNotification}
            />

            <SettingsAccountSection
              saving={saving}
              isChangingPassword={isChangingPassword}
              passwordData={passwordData}
              passwordError={passwordError}
              onStartPasswordChange={() => setIsChangingPassword(true)}
              onCancelPasswordChange={cancelPasswordChange}
              onPasswordSubmit={() => void handlePasswordSubmit()}
              onPasswordFieldChange={(field, value) =>
                setPasswordData({ [field]: value })
              }
              onDeleteAccount={handleDeleteAccount}
            />
          </div>
        )}
      </GlassModal>
    </>
  );
}
