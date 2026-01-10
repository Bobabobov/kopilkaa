// components/profile/SettingsModal.tsx
"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../hooks/useSettings";
import { EmailEditor, NameEditor, UsernameEditor, EmailVisibilityToggle } from "../settings/ProfileEditors";
import {
  SettingsLoading,
  SettingsUnauthorized,
} from "../settings/ProfileStates";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { SettingsSection } from "./SettingsFields";
import { useSettingsModalLifecycle } from "./hooks/useSettingsModalLifecycle";
import { SettingsModalHeader } from "./SettingsModalHeader";
import { SettingsLocalNotification } from "./SettingsLocalNotification";
import { SettingsAvatarSection } from "./SettingsAvatarSection";
import { SettingsSocialLinksSection } from "./SettingsSocialLinksSection";
import { SettingsMetaInfo } from "./SettingsMetaInfo";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { ToastComponent } = useBeautifulToast();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const { mounted } = useSettingsModalLifecycle({ isOpen, onClose, dialogRef });

  const {
    // Состояние
    user,
    loading,
    saving,

    // Локальные уведомления
    localNotification,

    // Действия
    handleUsernameChange,
    handleNameChange,
    handleEmailChange,
    handleEmailVisibilityChange,
    handleSocialLinkChange,
    handleAvatarUpload,
    handleAvatarDelete,
    showLocalNotification,
  } = useSettings();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showLocalNotification("success", "Скопировано", "Данные скопированы в буфер обмена");
    } catch {
      showLocalNotification("error", "Ошибка", "Не удалось скопировать");
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        key="settings-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-end sm:items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          key="settings-modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92dvh] sm:max-h-[85vh] overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] mx-2 sm:mx-4 flex flex-col custom-scrollbar"
          style={{
            border: '1px solid transparent',
            background: 'linear-gradient(to right, #004643, #001e1d) border-box, linear-gradient(135deg, #004643, #001e1d) padding-box',
            backgroundClip: 'border-box, padding-box',
            boxShadow: '0 0 0 1px rgba(171, 209, 198, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
          onClick={(e) => e.stopPropagation()}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-settings-title"
          aria-describedby="profile-settings-desc"
          tabIndex={-1}
        >
          <SettingsModalHeader onClose={onClose} />
          <SettingsLocalNotification notification={localNotification} />

          {/* Контент */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto overscroll-contain">
            {loading ? (
              <SettingsLoading />
            ) : !user ? (
              <SettingsUnauthorized />
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {/* Аватарка */}
                <SettingsAvatarSection
                  user={user}
                  saving={saving}
                  avatarInputRef={avatarInputRef}
                  onUpload={handleAvatarUpload}
                  onDelete={handleAvatarDelete}
                />

                {/* Имя */}
                <SettingsSection title="Имя">
                  <NameEditor
                    currentName={user.name || ""}
                    onSave={handleNameChange}
                    disabled={saving}
                  />
                </SettingsSection>

                {/* Логин */}
                <SettingsSection title="Логин">
                  <UsernameEditor
                    currentUsername={user.username ?? null}
                    onSave={handleUsernameChange}
                    disabled={saving}
                  />
                </SettingsSection>

                {/* Email */}
                <SettingsSection title="Email">
                  <EmailEditor
                    currentEmail={user.email}
                    onSave={handleEmailChange}
                    disabled={saving}
                  />
                </SettingsSection>

                {/* Видимость email */}
                <EmailVisibilityToggle hideEmail={user.hideEmail ?? true} onToggle={handleEmailVisibilityChange} disabled={saving} />

                <SettingsSocialLinksSection user={user} saving={saving} onChange={handleSocialLinkChange} />

                <SettingsMetaInfo user={user} saving={saving} onCopy={handleCopy} />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Toast */}
      <ToastComponent />
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
