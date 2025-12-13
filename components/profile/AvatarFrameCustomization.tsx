// components/profile/AvatarFrameCustomization.tsx
"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { getAllAvatarFrames, getAvatarFrame } from "@/lib/header-customization";
import ColorWheel from "./ColorWheel";

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

  const appliedAvatarFallback =
    user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "A";
  const selectedColorValue = selectedFrame?.startsWith("color:")
    ? selectedFrame.replace("color:", "")
    : null;

  const resolveFrameConfig = (frameKey: string) => {
    const base = getAvatarFrame(frameKey);
    if (frameKey.startsWith("color:")) {
      return {
        ...base,
        colorValue: selectedColorValue || frameKey.replace("color:", ""),
        type: "color",
      };
    }
    return base;
  };

  const renderAvatarPreview = (frameConfig: any) => {
    if (frameConfig.type === "image") {
      return (
        <div className="w-16 h-16 rounded-lg overflow-hidden relative bg-gray-900/20">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat rounded-lg"
            style={{ backgroundImage: `url(${frameConfig.imageUrl})` }}
          />
          <div className="absolute inset-2 rounded-md overflow-hidden">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="Аватар" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Скрываем изображение при ошибке и показываем fallback
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = "flex";
                  }
                }}
              />
            ) : null}
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600 text-white font-bold text-xl ${user.avatar ? "hidden" : ""}`}>
              {appliedAvatarFallback}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg ${frameConfig.className || ""} ${
          user.avatar ? "bg-gray-100 dark:bg-gray-700" : "bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600"
        }`}
        style={
          frameConfig.colorValue
            ? {
                boxShadow: `0 0 0 3px ${frameConfig.colorValue}`,
                background: user.avatar ? undefined : frameConfig.colorValue,
              }
            : undefined
        }
      >
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt="Аватар" 
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              // Скрываем изображение при ошибке и показываем fallback
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) {
                fallback.style.display = "flex";
              }
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center ${user.avatar ? "hidden" : ""}`}>
          {appliedAvatarFallback}
        </div>
      </div>
    );
  };

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

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-[#053c3a] via-[#043231] to-[#011e1d] border border-[#1d8a78]/30 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
          >
          {/* Header */}
          <div className="p-6 border-b border-[#1d8a78]/25 flex items-center justify-between">
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
                    d="M3 7h18M5 7V5a2 2 0 012-2h10a2 2 0 012 2v2m-2 4v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 4h2m-6 0h2"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#fffffe]">
                  Рамка аватарки
                </h2>
                <p className="text-[#9fc9bd]">
                  Выберите рамку или создайте свою
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

          {/* Content */}
          {/* Content */}
          <div className="p-6 max-h-[72vh] overflow-y-auto space-y-6">
            {/* Превью текущего выбора */}
            <div className="rounded-2xl border border-[#1d8a78]/25 bg-[#001e1d]/60 p-4 flex items-center gap-4 shadow-lg">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-[#0f2f2a] flex items-center justify-center">
                {renderAvatarPreview(resolveFrameConfig(selectedFrame))}
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#9fc9bd]">Предпросмотр</p>
                <h4 className="text-lg font-semibold text-[#fffffe]">
                  {frames.find((f) => f.key === selectedFrame)?.name || "Без рамки"}
                </h4>
                <p className="text-sm text-[#9fc9bd]">
                  {frames.find((f) => f.key === selectedFrame)?.description || "Рамка не выбрана"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 text-[#abd1c6] hover:text-[#fffffe] transition-colors"
              >
                Закрыть
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-[#f9bc60] hover:bg-[#e8a545] disabled:bg-[#abd1c6]/30 text-[#001e1d] font-semibold rounded-lg transition-colors"
              >
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>

            {/* Готовые рамки */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#fffffe]">Готовые рамки</h3>
                <span className="text-sm text-[#9fc9bd]">{frames.length} вариантов</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {frames.map((frame, index) => {
                  const isSelected = selectedFrame === frame.key;
                  const frameConfig = resolveFrameConfig(frame.key);

                  return (
                    <motion.div
                      key={frame.key || `frame-${index}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedFrame(frame.key)}
                      className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        isSelected
                          ? "border-[#f9bc60] shadow-lg shadow-[#f9bc60]/20"
                          : "border-[#1d8a78]/25 hover:border-[#f9bc60]/50"
                      } bg-[#0f2f2a]/60 backdrop-blur-sm`}
                    >
                      <div className="p-4 flex justify-center">
                        {renderAvatarPreview(frameConfig)}
                      </div>

                      <div className="p-3 bg-[#001e1d]/80 backdrop-blur-sm">
                        <h4 className="font-semibold text-[#fffffe]">{frame.name}</h4>
                        <p className="text-sm text-[#9fc9bd]">{frame.description}</p>
                      </div>

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

            {/* Своя рамка (цвет) */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#fffffe]">Своя рамка</h3>
              <div className="flex justify-center bg-[#001e1d]/50 rounded-xl p-6 border border-[#1d8a78]/25">
                <ColorWheel
                  selectedColor={selectedColorValue || null}
                  onColorChange={(color) => setSelectedFrame(`color:${color}`)}
                />
              </div>
              {selectedColorValue && (
                <div className="flex items-center gap-3 rounded-xl border border-[#1d8a78]/25 bg-[#0f2f2a]/70 px-4 py-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 bg-[#0f2f2a] flex items-center justify-center">
                    {renderAvatarPreview({
                      type: "color",
                      className: "",
                      colorValue: selectedColorValue,
                    })}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#9fc9bd]">Предпросмотр</p>
                    <p className="text-sm text-[#fffffe] font-semibold">
                      Свой цвет: {selectedColorValue}
                    </p>
                  </div>
                </div>
              )}
              <p className="text-sm text-[#9fc9bd]">
                Выберите свой цвет рамки или продолжайте использовать готовые варианты.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#1d8a78]/25 flex justify-end gap-3">
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
      )}
    </AnimatePresence>
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
