// components/profile/AvatarFrameCustomization.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { getAllAvatarFrames, getAvatarFrame } from "@/lib/header-customization";

interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
  headerTheme?: string | null;
  avatarFrame?: string | null;
}

interface AvatarFrameCustomizationProps {
  user: User;
  onFrameChange: (frame: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AvatarFrameCustomization({
  user,
  onFrameChange,
  isOpen,
  onClose,
}: AvatarFrameCustomizationProps) {
  const [selectedFrame, setSelectedFrame] = useState(
    user.avatarFrame || "none",
  );
  const [saving, setSaving] = useState(false);
  const { showToast, ToastComponent } = useBeautifulToast();

  const frames = getAllAvatarFrames();

  const handleSave = async () => {
    if (selectedFrame === user.avatarFrame) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/profile/avatar-frame", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarFrame: selectedFrame }),
      });

      if (response.ok) {
        onFrameChange(selectedFrame);
        showToast(
          "success",
          "Рамка обновлена!",
          "Рамка аватарки успешно изменена",
        );
        onClose();
      } else {
        const data = await response.json();
        showToast(
          "error",
          "Ошибка сохранения",
          data.error || "Не удалось сохранить рамку",
        );
      }
    } catch (error) {
      console.error("Error saving avatar frame:", error);
      showToast("error", "Ошибка сохранения", "Не удалось сохранить рамку");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
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
                Рамка аватарки
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
              Выберите рамку для вашей аватарки
            </p>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {frames.map((frame, index) => {
                const isSelected = selectedFrame === frame.key;
                const frameConfig = getAvatarFrame(frame.key);

                return (
                  <motion.div
                    key={frame.key || `frame-${index}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedFrame(frame.key)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                    }`}
                  >
                    {/* Preview */}
                    <div className="p-6 flex justify-center">
                      {frameConfig.type === "image" ? (
                        // Рамка-картинка
                        <div className="w-16 h-16 rounded-lg overflow-hidden relative">
                          {/* Рамка как фон */}
                          <div
                            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat rounded-lg"
                            style={{
                              backgroundImage: `url(${frameConfig.imageUrl})`,
                            }}
                          />
                          {/* Аватар поверх рамки */}
                          <div className="absolute inset-2 rounded-md overflow-hidden">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt="Аватар"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600 text-white font-bold text-xl">
                                {user.name
                                  ? user.name[0].toUpperCase()
                                  : user.email[0].toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        // CSS рамка
                        <div
                          className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg ${frameConfig.className} ${
                            user.avatar
                              ? "bg-gray-100 dark:bg-gray-700"
                              : "bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600"
                          }`}
                        >
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt="Аватар"
                              className={`w-full h-full object-cover rounded-lg ${frame.key === "rainbow" ? "rounded-lg" : ""}`}
                            />
                          ) : (
                            <div
                              className={`w-full h-full flex items-center justify-center rounded-lg ${frame.key === "rainbow" ? "rounded-lg" : ""}`}
                            >
                              {user.name
                                ? user.name[0].toUpperCase()
                                : user.email[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Frame info */}
                    <div className="p-3 bg-white dark:bg-gray-800">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {frame.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {frame.description}
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
