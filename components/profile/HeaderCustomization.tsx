// components/profile/HeaderCustomization.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { getAllHeaderThemes, getHeaderTheme } from "@/lib/header-customization";

interface User {
  id: string;
  email: string;
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
  const [selectedTheme, setSelectedTheme] = useState(
    user.headerTheme || "default",
  );
  const [saving, setSaving] = useState(false);
  const { showToast, ToastComponent } = useBeautifulToast();

  const themes = getAllHeaderThemes();

  const handleSave = async () => {
    if (selectedTheme === user.headerTheme) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/profile/header-theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headerTheme: selectedTheme }),
      });

      if (response.ok) {
        onThemeChange(selectedTheme);
        showToast(
          "success",
          "Тема обновлена!",
          "Заголовок профиля успешно изменен",
        );
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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Кастомизация заголовка
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-6 h-6"
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
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Выберите тему для заголовка вашего профиля
            </p>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {themes.map((theme, index) => {
                const isSelected = selectedTheme === theme.key;
                const themeConfig = getHeaderTheme(theme.key);

                return (
                  <motion.div
                    key={theme.key || `theme-${index}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTheme(theme.key)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                    }`}
                  >
                    {/* Preview */}
                    <div
                      className={`h-32 w-full ${
                        themeConfig.background === "gradient"
                          ? `bg-gradient-to-r ${(themeConfig as any).gradient}`
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
                    <div className="p-3 bg-white dark:bg-gray-800">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {theme.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {theme.description}
                      </p>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
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

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </motion.div>
      </div>

      <ToastComponent />
    </>
  );
}
