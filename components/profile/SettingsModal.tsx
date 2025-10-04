// components/profile/SettingsModal.tsx
"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "./hooks/useSettings";
import SettingsHeader from "./settings/SettingsHeader";
import AvatarUpload from "./AvatarUpload";
import AvatarFrameCustomization from "./AvatarFrameCustomization";
import NameEditor from "./settings/NameEditor";
import EmailEditor from "./settings/EmailEditor";
import EmailVisibilityToggle from "./settings/EmailVisibilityToggle";
import PasswordChangeForm from "./PasswordChangeForm";
import DataManagementSection from "./DataManagementSection";
import SettingsSection, { ReadOnlyField } from "./SettingsSection";
import { SettingsLoading, SettingsUnauthorized } from "./settings/LoadingStates";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { ToastComponent } = useBeautifulToast();
  
  const {
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
    
    // Локальные уведомления
    localNotification,
    
    // Действия
    handleNameChange,
    handleEmailChange,
    handleEmailVisibilityChange,
    handleAvatarChange,
    handleFrameChange,
    handlePasswordSubmit,
    cancelPasswordChange,
    handleExportData,
    handleDeleteAccount,
  } = useSettings();

  // Управление клавишами
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Сохраняем текущую прокрутку
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    
    // Блокируем прокрутку плавно
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Восстанавливаем прокрутку плавно
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="settings-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="settings-modal-content"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="rounded-3xl shadow-2xl max-w-4xl w-full h-[90vh] overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] border border-[#abd1c6]/30 mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок модалки */}
          <div className="relative p-6 bg-gradient-to-r from-[#f9bc60] via-[#f9bc60] to-[#e8a545]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#f9bc60]/95 via-[#f9bc60]/95 to-[#e8a545]/95 backdrop-blur-sm"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#001e1d]/20 backdrop-blur-sm flex items-center justify-center border border-[#001e1d]/30">
                  <LucideIcons.Settings size="lg" className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#001e1d]">Настройки профиля</h2>
                  <p className="text-[#001e1d]/80 text-sm">Управление вашим аккаунтом</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-2xl bg-[#001e1d]/10 hover:bg-[#001e1d]/20 backdrop-blur-sm border border-[#001e1d]/20 transition-all duration-200 group"
              >
                <svg className="w-5 h-5 text-[#001e1d] group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Локальное уведомление */}
          <AnimatePresence>
            {localNotification.show && (
              <motion.div
                key="local-notification"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mx-6 mb-4 p-4 rounded-xl shadow-lg"
                style={{ background: 'linear-gradient(to right, #abd1c6/20, #f9bc60/20)', borderColor: '#abd1c6' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f9bc60' }}>
                    <span className="text-white text-sm">
                      {localNotification.type === 'success' ? '✓' : 
                       localNotification.type === 'error' ? '✗' : 'ℹ'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: '#001e1d' }}>{localNotification.title}</div>
                    <div className="text-sm" style={{ color: '#abd1c6' }}>{localNotification.message}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Контент */}
          <div className="p-6 h-[calc(90vh-200px)] overflow-y-auto bg-gradient-to-b from-[#004643]/30 to-[#001e1d]/40">
            {loading ? (
              <SettingsLoading />
            ) : !user ? (
              <SettingsUnauthorized />
            ) : (
              <div className="space-y-8">
                {/* Аватарка */}
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <AvatarUpload
                      currentAvatar={user.avatar}
                      userName={user.name || user.email || 'Пользователь'}
                      avatarFrame={user.avatarFrame}
                      onAvatarChange={handleAvatarChange}
                      onFrameChange={() => {/* Открыть модалку рамок */}}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Аватарка</h3>
                    <p className="text-gray-600 dark:text-gray-400">Загрузите изображение для вашего профиля</p>
                  </div>
                </div>

                {/* Имя */}
                <SettingsSection title="Имя">
                  <NameEditor
                    currentName={user.name || ""}
                    onSave={handleNameChange}
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
                <EmailVisibilityToggle
                  hideEmail={user.hideEmail ?? true}
                  onToggle={handleEmailVisibilityChange}
                  disabled={saving}
                />

                {/* Дата регистрации */}
                <ReadOnlyField
                  label="Дата регистрации"
                  value={new Date(user.createdAt).toLocaleDateString("ru-RU")}
                />

                {/* Последний вход */}
                <ReadOnlyField
                  label="Последний вход"
                  value={new Date(user.lastSeen || user.createdAt).toLocaleString("ru-RU")}
                />

                {/* Пароль */}
                <SettingsSection title="Пароль">
                  <PasswordChangeForm
                    isChangingPassword={isChangingPassword}
                    passwordData={passwordData}
                    passwordError={passwordError}
                    onPasswordDataChange={setPasswordData}
                    onSubmit={handlePasswordSubmit}
                    onCancel={cancelPasswordChange}
                    onStartChange={() => setIsChangingPassword(true)}
                  />
                </SettingsSection>

                {/* Управление данными */}
                <DataManagementSection
                  onExportData={handleExportData}
                  onDeleteAccount={handleDeleteAccount}
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Toast */}
      <ToastComponent />
    </AnimatePresence>
  );
}