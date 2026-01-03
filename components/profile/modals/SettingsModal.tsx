// components/profile/SettingsModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../hooks/useSettings";
import { EmailEditor, NameEditor, UsernameEditor, EmailVisibilityToggle, SocialLinkEditor } from "../settings/ProfileEditors";
import {
  SettingsLoading,
  SettingsUnauthorized,
} from "../settings/ProfileStates";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { useAutoHideScrollbar } from "@/lib/useAutoHideScrollbar";
import { getPublicProfilePath } from "@/lib/profileUrl";

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
      <div className="px-3 py-2.5 sm:px-4 sm:py-3 bg-[#001e1d]/20 rounded-xl text-[#abd1c6] border border-[#abd1c6]/20">
        {value}
      </div>
    </div>
  );
}

function CopyField({
  label,
  value,
  copyValue,
  onCopy,
  disabled,
}: {
  label: string;
  value: string;
  copyValue: string;
  onCopy: (text: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#fffffe] uppercase tracking-wide">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#001e1d]/20 rounded-xl text-[#abd1c6] border border-[#abd1c6]/20 overflow-hidden">
          <span className="text-[#fffffe] break-all">{value}</span>
        </div>
        <button
          type="button"
          onClick={() => onCopy(copyValue)}
          disabled={disabled}
          className="w-full sm:w-auto shrink-0 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#f9bc60] hover:bg-[#e8a545] disabled:bg-[#6B7280] text-[#001e1d] font-semibold rounded-xl transition-colors inline-flex items-center justify-center gap-2"
        >
          <LucideIcons.Copy size="sm" />
          <span className="hidden sm:inline">Скопировать</span>
          <span className="sm:hidden">Копировать</span>
        </button>
      </div>
    </div>
  );
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [mounted, setMounted] = useState(false);
  const { ToastComponent } = useBeautifulToast();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  
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

    // Блокируем прокрутку фона (без запрета wheel внутри модалки)
    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Восстанавливаем прокрутку
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, onClose]);

  // Accessibility: focus trap + restore focus
  useEffect(() => {
    if (!isOpen) return;
    lastActiveElementRef.current = document.activeElement as HTMLElement | null;

    const dialog = dialogRef.current;
    const getFocusable = () => {
      if (!dialog) return [] as HTMLElement[];
      const nodes = dialog.querySelectorAll<HTMLElement>(
        [
          "a[href]",
          "button:not([disabled])",
          "textarea:not([disabled])",
          "input:not([disabled])",
          "select:not([disabled])",
          "[tabindex]:not([tabindex='-1'])",
        ].join(","),
      );
      return Array.from(nodes).filter((el) => {
        const style = window.getComputedStyle(el);
        const hidden =
          style.display === "none" ||
          style.visibility === "hidden" ||
          el.getAttribute("aria-hidden") === "true";
        return !hidden;
      });
    };

    const focusables = getFocusable();
    const initial = focusables[0] || dialog;
    if (initial) setTimeout(() => initial.focus(), 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (!dialog) return;
      const focusables = getFocusable();
      if (focusables.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = !!active && dialog.contains(active);

      if (e.shiftKey) {
        if (!inside || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (!inside || active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      try {
        lastActiveElementRef.current?.focus?.();
      } catch {
        // ignore
      }
    };
  }, [isOpen]);

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
          {/* Заголовок */}
          <div className="p-4 sm:p-6 border-b border-[#abd1c6]/20 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#f9bc60] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <LucideIcons.Settings size="md" className="text-[#001e1d]" />
                </div>
                <div>
                  <h2 id="profile-settings-title" className="text-xl sm:text-2xl font-bold text-[#fffffe]">
                    Настройки профиля
                  </h2>
                  <p id="profile-settings-desc" className="text-[#abd1c6]">
                    Управление вашим аккаунтом
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-[#abd1c6]/20 hover:bg-[#abd1c6]/30 rounded-xl flex items-center justify-center transition-colors"
                aria-label="Закрыть настройки"
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
                className={`mx-4 sm:mx-6 mb-4 p-3 sm:p-4 rounded-xl shadow-lg border ${
                  localNotification.type === "success"
                    ? "bg-emerald-500/15 border-emerald-400/30"
                    : localNotification.type === "error"
                      ? "bg-red-500/15 border-red-400/30"
                      : "bg-[#f9bc60]/15 border-[#f9bc60]/30"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: localNotification.type === "error" ? "#e16162" : "#f9bc60" }}
                  >
                    <span className="text-white text-xs sm:text-sm">
                      {localNotification.type === "success"
                        ? "✓"
                        : localNotification.type === "error"
                          ? "✗"
                          : "ℹ"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm sm:text-base break-words text-[#fffffe]">
                      {localNotification.title}
                    </div>
                    <div className="text-xs sm:text-sm break-words text-[#abd1c6]">
                      {localNotification.message}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Контент */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto overscroll-contain">
            {loading ? (
              <SettingsLoading />
            ) : !user ? (
              <SettingsUnauthorized />
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {/* Аватарка */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full border border-white/10 bg-[#001e1d]/30 overflow-hidden flex items-center justify-center">
                      {user.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatar}
                          alt="Аватар"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[#f9bc60] text-2xl font-bold">
                          {(user.name || user.email)[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-[#fffffe] mb-1">
                        Аватарка
                      </h3>
                      <p className="text-[#abd1c6] text-sm">
                        PNG/JPG/WEBP, до 5 МБ
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:ml-auto">
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        await handleAvatarUpload(file);
                        // allow re-upload same file
                        e.currentTarget.value = "";
                      }}
                      disabled={saving}
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={saving}
                      className="px-4 py-2 rounded-xl bg-[#f9bc60] hover:bg-[#e8a545] disabled:bg-[#6B7280] text-[#001e1d] font-semibold transition-colors"
                    >
                      {user.avatar ? "Заменить" : "Загрузить"}
                    </button>
                    {user.avatar && (
                      <button
                        type="button"
                        onClick={handleAvatarDelete}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:bg-[#6B7280] text-[#fffffe] font-semibold border border-white/10 transition-colors"
                      >
                        Удалить
                      </button>
                    )}
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
                <EmailVisibilityToggle
                  hideEmail={user.hideEmail ?? true}
                  onToggle={handleEmailVisibilityChange}
                  disabled={saving}
                />

              {/* Социальные сети */}
              <SettingsSection title="Социальные сети">
                <div className="space-y-4">
                  <SocialLinkEditor
                    label="Профиль VK"
                    placeholder="https://vk.com/username"
                    value={user.vkLink}
                    type="vk"
                    onSave={(link) => handleSocialLinkChange("vkLink", link)}
                    disabled={saving}
                  />
                  <SocialLinkEditor
                    label="Telegram"
                    placeholder="https://t.me/username"
                    value={user.telegramLink}
                    type="telegram"
                    onSave={(link) => handleSocialLinkChange("telegramLink", link)}
                    disabled={saving}
                  />
                  <SocialLinkEditor
                    label="YouTube"
                    placeholder="https://youtube.com/@username"
                    value={user.youtubeLink}
                    type="youtube"
                    onSave={(link) => handleSocialLinkChange("youtubeLink", link)}
                    disabled={saving}
                  />
                </div>
              </SettingsSection>

              {/* ID профиля */}
              <CopyField
                label="Технический ID"
                value={user.id}
                copyValue={user.id}
                onCopy={handleCopy}
                disabled={saving}
              />

              {/* Ссылка на профиль */}
              {(() => {
                const path = getPublicProfilePath(user);
                const url =
                  typeof window !== "undefined" && window.location?.origin
                    ? `${window.location.origin}${path}`
                    : `https://kopilka-online.ru${path}`;
                return (
              <CopyField
                label="Ссылка на профиль"
                value={url}
                copyValue={url}
                onCopy={handleCopy}
                disabled={saving}
              />
                );
              })()}

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
