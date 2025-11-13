// components/profile/SettingsModal.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../hooks/useSettings";
import { EmailEditor, NameEditor, EmailVisibilityToggle } from "../settings/ProfileEditors";
import {
  SettingsLoading,
  SettingsUnauthorized,
} from "../settings/ProfileStates";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { useAutoHideScrollbar } from "@/lib/useAutoHideScrollbar";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Встроенные компоненты
function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[#fffffe] uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#fffffe] uppercase tracking-wide">
        {label}
      </label>
      <div className="px-4 py-3 bg-[#001e1d]/20 rounded-xl text-[#abd1c6] border border-[#abd1c6]/20">
        {value}
      </div>
    </div>
  );
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [mounted, setMounted] = useState(false);
  const { ToastComponent } = useBeautifulToast();
  
  // Автоскрытие скроллбаров
  useAutoHideScrollbar();

  const {
    // Состояние
    user,
    loading,
    saving,

    // Локальные уведомления
    localNotification,

    // Действия
    handleNameChange,
    handleEmailChange,
    handleEmailVisibilityChange,
  } = useSettings();

  // Монтирование для Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Управление клавишами
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Сохраняем текущую прокрутку
    const originalOverflow = document.body.style.overflow;

    // Блокируем прокрутку
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Восстанавливаем прокрутку
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        key="settings-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          key="settings-modal-content"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] mx-4 flex flex-col custom-scrollbar"
          style={{
            border: '1px solid transparent',
            background: 'linear-gradient(to right, #004643, #001e1d) border-box, linear-gradient(135deg, #004643, #001e1d) padding-box',
            backgroundClip: 'border-box, padding-box',
            boxShadow: '0 0 0 1px rgba(171, 209, 198, 0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="p-6 border-b border-[#abd1c6]/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f9bc60] rounded-2xl flex items-center justify-center">
                  <LucideIcons.Settings size="lg" className="text-[#001e1d]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#fffffe]">
                    Настройки профиля
                  </h2>
                  <p className="text-[#abd1c6]">
                    Управление вашим аккаунтом
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-[#abd1c6]/20 hover:bg-[#abd1c6]/30 rounded-xl flex items-center justify-center transition-colors"
              >
                <LucideIcons.X size="sm" className="text-[#fffffe]" />
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
                style={{
                  background:
                    "linear-gradient(to right, #abd1c6/20, #f9bc60/20)",
                  borderColor: "#abd1c6",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#f9bc60" }}
                  >
                    <span className="text-white text-sm">
                      {localNotification.type === "success"
                        ? "✓"
                        : localNotification.type === "error"
                          ? "✗"
                          : "ℹ"}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: "#001e1d" }}>
                      {localNotification.title}
                    </div>
                    <div className="text-sm" style={{ color: "#abd1c6" }}>
                      {localNotification.message}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Контент */}
          <div className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <SettingsLoading />
            ) : !user ? (
              <SettingsUnauthorized />
            ) : (
              <div className="space-y-8">
                {/* Аватарка */}
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-[#004643] rounded-full flex items-center justify-center">
                      <span className="text-[#f9bc60] text-2xl font-bold">
                        {(user.name || user.email)[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#fffffe] mb-2">
                      Аватарка
                    </h3>
                    <p className="text-[#abd1c6]">
                      Загрузите изображение для вашего профиля
                    </p>
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
                  value={new Date(
                    user.lastSeen || user.createdAt,
                  ).toLocaleString("ru-RU")}
                />

                {/* Пароль */}
                <SettingsSection title="Пароль">
                  <div className="p-4 bg-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20">
                    <p className="text-[#abd1c6]">Изменение пароля временно недоступно</p>
                  </div>
                </SettingsSection>

                {/* Управление данными */}
                <SettingsSection title="Управление данными">
                  <div className="p-4 bg-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20">
                    <p className="text-[#abd1c6]">Экспорт данных временно недоступен</p>
                  </div>
                </SettingsSection>
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
