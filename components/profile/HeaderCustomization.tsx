// components/profile/HeaderCustomization.tsx
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { useAutoHideScrollbar } from "@/hooks/ui/useAutoHideScrollbar";
import { getAllHeaderThemes, getHeaderTheme } from "@/lib/header-customization";
import { submitPendingApplicationIfNeeded } from "@/lib/applications/pendingSubmission";
import ColorWheel from "./ColorWheel";

interface User {
  id: string;
  email: string | null;
  role: "USER" | "ADMIN";
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
  headerTheme?: string | null;
}

interface HeaderCustomizationProps {
  user: User;
  onThemeChange: (theme: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function HeaderCustomization({
  user,
  onThemeChange,
  isOpen,
  onClose,
}: HeaderCustomizationProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(
    user.headerTheme || "default",
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    user.headerTheme?.startsWith("color:") ? user.headerTheme : null,
  );
  const [saving, setSaving] = useState(false);
  const { showToast, ToastComponent } = useBeautifulToast();
  const selectedThemeKey = selectedColor ? selectedColor : selectedTheme;
  const selectedThemeConfig = selectedColor
    ? {
        background: "color",
        color: selectedColor.replace("color:", ""),
        textColor: "text-[#fffffe]",
        accentColor: "text-[#f9bc60]",
      }
    : getHeaderTheme(selectedThemeKey || "default");

  // Автоскрытие скроллбаров
  useAutoHideScrollbar();

  const themes = getAllHeaderThemes();

  const themeName = selectedColor
    ? "Своя палитра"
    : themes.find((t) => t.key === selectedThemeKey)?.name || "Default";
  const selectedColorValue = selectedColor
    ? selectedColor.replace("color:", "")
    : null;

  // Монтирование для Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Блокировка прокрутки и Escape
  useEffect(() => {
    if (!isOpen) return;

    // Сохраняем текущую позицию прокрутки
    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    // Блокируем прокрутку
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Восстанавливаем прокрутку
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      // Восстанавливаем позицию прокрутки
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, onClose]);

  const handleSave = async () => {
    const themeToSave = selectedColor || selectedTheme;
    if (themeToSave === user.headerTheme) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/profile/header-theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headerTheme: themeToSave }),
      });

      if (response.ok) {
        onThemeChange(themeToSave);
        showToast(
          "success",
          "Тема обновлена!",
          "Заголовок профиля успешно изменен",
        );
        const submitted = await submitPendingApplicationIfNeeded();
        if (submitted && typeof window !== "undefined") {
          window.location.href = "/applications";
          return;
        }
        onClose();
      } else {
        const data = await response.json();
        showToast(
          "error",
          "Ошибка сохранения",
          data.error || "Не удалось сохранить тему",
        );
      }
    } catch (error) {
      console.error("Error saving header theme:", error);
      showToast("error", "Ошибка сохранения", "Не удалось сохранить тему");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <motion.div
      key="header-theme-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        key="header-theme-modal-content"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl shadow-2xl max-w-5xl w-full max-h-[88vh] overflow-hidden bg-gradient-to-br from-[#053c3a] via-[#043231] to-[#011e1d] border border-[#1d8a78]/30 mx-4 flex flex-col custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#1d8a78]/25 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#f9bc60] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(249,188,96,0.35)]">
                <svg
                  className="w-6 h-6 text-[#001e1d]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#fffffe]">
                  Тема заголовка
                </h2>
                <p className="text-[#9fc9bd]">
                  Выберите тему для заголовка вашего профиля
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/15 rounded-xl flex items-center justify-center transition-colors"
            >
              <svg
                className="w-5 h-5 text-[#fffffe]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Preview */}
          <div className="rounded-2xl border border-[#abd1c6]/20 bg-[#001e1d]/60 overflow-hidden shadow-lg">
            <div
              className="h-36 sm:h-40 w-full relative"
              style={
                selectedThemeConfig.background === "image"
                  ? {
                      backgroundImage: `url(${(selectedThemeConfig as any).image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center center",
                      backgroundRepeat: "no-repeat",
                    }
                  : selectedThemeConfig.background === "gradient"
                    ? { backgroundImage: (selectedThemeConfig as any).gradient }
                    : selectedThemeConfig.background === "color"
                      ? {
                          background:
                            (selectedThemeConfig as any).color || "#004643",
                        }
                      : {
                          background: "linear-gradient(135deg,#1fe0ba,#0a4c43)",
                        }
              }
            >
              <div className="absolute inset-0 bg-black/12" />
              <div className="absolute inset-0 px-6 sm:px-8 py-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 text-xs font-semibold text-white">
                    Предпросмотр
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                    Мой профиль
                  </h3>
                  <p className="text-sm text-white/90 drop-shadow">
                    Добро пожаловать,{" "}
                    <span className="font-semibold text-[#f9bc60]">
                      Пользователь
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-white">
                    {selectedColor ? "Своя палитра" : themeName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Цветовой круг */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#fffffe]">
                  Цветовой круг Иттена
                </h3>
                <p className="text-sm text-[#abd1c6]">
                  Создайте собственный цвет заголовка
                </p>
              </div>
              {selectedColor && (
                <button
                  onClick={() => {
                    setSelectedColor(null);
                    setSelectedTheme("default");
                  }}
                  className="text-xs text-[#abd1c6] hover:text-[#fffffe] transition-colors"
                >
                  Сбросить цвет
                </button>
              )}
            </div>
            <div className="flex justify-center bg-[#001e1d]/40 rounded-xl p-6 border border-[#abd1c6]/20">
              <ColorWheel
                selectedColor={selectedColorValue || null}
                onColorChange={(color) => {
                  setSelectedColor(`color:${color}`);
                  setSelectedTheme(""); // Сбрасываем выбор готовой темы
                }}
              />
            </div>
          </div>

          {/* Готовые темы */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#fffffe]">
                  Готовые темы
                </h3>
                <p className="text-sm text-[#abd1c6]">
                  Подборка готовых пресетов с превью
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {themes.map((theme, index) => {
                const isSelected =
                  !selectedColor && selectedTheme === theme.key;
                const themeConfig = getHeaderTheme(theme.key);

                return (
                  <motion.div
                    key={theme.key || `theme-${index}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedTheme(theme.key);
                      setSelectedColor(null); // Сбрасываем выбор цвета
                    }}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-[#f9bc60] shadow-lg shadow-[#f9bc60]/20"
                        : "border-[#abd1c6]/20 hover:border-[#f9bc60]/50"
                    }`}
                  >
                    {/* Preview */}
                    <div
                      className={`h-32 w-full ${
                        themeConfig.background === "gradient"
                          ? `bg-gradient-to-r ${(themeConfig as any).gradient}`
                          : themeConfig.background === "color"
                            ? ""
                            : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
                      }`}
                      style={
                        themeConfig.background === "image"
                          ? {
                              backgroundImage: `url(${(themeConfig as any).image})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center center",
                              backgroundRepeat: "no-repeat",
                            }
                          : themeConfig.background === "color"
                            ? {
                                backgroundColor:
                                  (themeConfig as any).color || "#004643",
                              }
                            : {}
                      }
                    >
                      {/* Overlay for better text visibility */}
                      <div className="absolute inset-0 bg-black/15"></div>

                      {/* Sample content */}
                      <div className="absolute inset-0 p-4 flex flex-col justify-center">
                        <h3
                          className={`text-lg font-bold ${themeConfig.textColor} mb-1`}
                        >
                          Мой профиль
                        </h3>
                        <p
                          className={`text-sm ${themeConfig.textColor} opacity-90`}
                        >
                          Добро пожаловать,{" "}
                          <span className={themeConfig.accentColor}>
                            Пользователь
                          </span>
                          !
                        </p>
                      </div>
                    </div>

                    {/* Theme info */}
                    <div className="p-3 bg-[#001e1d]/80 backdrop-blur-sm">
                      <h4 className="font-semibold text-[#fffffe]">
                        {theme.name}
                      </h4>
                      <p className="text-sm text-[#abd1c6]">
                        {theme.description}
                      </p>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[#f9bc60] rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-[#001e1d]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#abd1c6]/20 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#abd1c6] hover:text-[#fffffe] transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-[#f9bc60] hover:bg-[#e8a545] disabled:bg-[#abd1c6]/30 text-[#001e1d] font-semibold rounded-lg transition-colors"
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  // Рендерим модалку через Portal в body, чтобы она была поверх всего контента
  if (typeof window !== "undefined") {
    return (
      <>
        {createPortal(modalContent, document.body)}
        <ToastComponent />
      </>
    );
  }

  return null;
}
