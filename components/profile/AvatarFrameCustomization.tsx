// components/profile/AvatarFrameCustomization.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassModal } from "@/components/ui/GlassModal";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { getAllAvatarFrames, getAvatarFrame } from "@/lib/header-customization";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import ColorWheel from "./ColorWheel";
import { getMessageFromApiJson, logRouteCatchError } from "@/lib/api/parseApiError";

interface User {
  id: string;
  email: string | null;
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
  const { showToast } = useBeautifulToast();

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
        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-900/20">
          <div
            className="absolute inset-0 h-full w-full rounded-lg bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${frameConfig.imageUrl})` }}
          />
          <div className="absolute inset-2 overflow-hidden rounded-md">
            {user.avatar ? (
              <img
                src={resolveAvatarUrl(user.avatar)}
                alt="Аватар"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
            ) : null}
            <div
              className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600 text-xl font-bold text-white ${user.avatar ? "hidden" : ""}`}
            >
              {appliedAvatarFallback}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-lg text-xl font-bold text-white shadow-lg ${frameConfig.className || ""} ${
          user.avatar
            ? "bg-gray-100 dark:bg-gray-700"
            : "bg-gradient-to-br from-emerald-500 via-green-500 to-lime-600"
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
            src={resolveAvatarUrl(user.avatar)}
            alt="Аватар"
            className="h-full w-full rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
          />
        ) : null}
        <div
          className={`flex h-full w-full items-center justify-center ${user.avatar ? "hidden" : ""}`}
        >
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
          getMessageFromApiJson(data, "Не удалось сохранить рамку"),
        );
      }
    } catch (error) {
      logRouteCatchError("[AvatarFrameCustomization] save", error);
      showToast("error", "Ошибка сохранения", "Не удалось сохранить рамку");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <GlassModal
        open={isOpen}
        onClose={onClose}
        hideHeader
        showCloseButton={false}
        size="4xl"
        panelClassName="max-w-5xl"
        zIndex={9999}
        maxHeight="min(90dvh, 900px)"
        bodyClassName="p-0"
        header={
          <div className="flex shrink-0 items-center justify-between border-b border-[#1d8a78]/25 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f9bc60] shadow-[0_10px_30px_rgba(249,188,96,0.35)]">
                <svg
                  className="h-6 w-6 text-[#001e1d]"
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
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-white/15"
              aria-label="Закрыть"
            >
              <svg
                className="h-5 w-5 text-[#fffffe]"
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
        }
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#abd1c6] transition-colors hover:text-[#fffffe]"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-[#f9bc60] px-6 py-2 font-semibold text-[#001e1d] transition-colors hover:bg-[#e8a545] disabled:bg-[#abd1c6]/30"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        }
      >
        <div className="space-y-6 p-6">
          <div className="flex items-center gap-4 rounded-2xl border border-[#1d8a78]/25 bg-[#001e1d]/60 p-4 shadow-lg">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0f2f2a]">
              {renderAvatarPreview(resolveFrameConfig(selectedFrame))}
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#9fc9bd]">Предпросмотр</p>
              <h4 className="text-lg font-semibold text-[#fffffe]">
                {frames.find((f) => f.key === selectedFrame)?.name ||
                  "Без рамки"}
              </h4>
              <p className="text-sm text-[#9fc9bd]">
                {frames.find((f) => f.key === selectedFrame)?.description ||
                  "Рамка не выбрана"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#fffffe]">
                Готовые рамки
              </h3>
              <span className="text-sm text-[#9fc9bd]">
                {frames.length} вариантов
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {frames.map((frame, index) => {
                const isSelected = selectedFrame === frame.key;
                const frameConfig = resolveFrameConfig(frame.key);

                return (
                  <motion.div
                    key={frame.key || `frame-${index}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedFrame(frame.key)}
                    className={`relative cursor-pointer overflow-hidden rounded-xl border-2 bg-[#0f2f2a]/60 backdrop-blur-sm transition-all duration-300 ${
                      isSelected
                        ? "border-[#f9bc60] shadow-lg shadow-[#f9bc60]/20"
                        : "border-[#1d8a78]/25 hover:border-[#f9bc60]/50"
                    }`}
                  >
                    <div className="flex justify-center p-4">
                      {renderAvatarPreview(frameConfig)}
                    </div>

                    <div className="bg-[#001e1d]/80 p-3 backdrop-blur-sm">
                      <h4 className="font-semibold text-[#fffffe]">
                        {frame.name}
                      </h4>
                      <p className="text-sm text-[#9fc9bd]">
                        {frame.description}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#f9bc60]">
                        <svg
                          className="h-4 w-4 text-[#001e1d]"
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

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-[#fffffe]">
              Своя рамка
            </h3>
            <div className="flex justify-center rounded-xl border border-[#1d8a78]/25 bg-[#001e1d]/50 p-6">
              <ColorWheel
                selectedColor={selectedColorValue || null}
                onColorChange={(color) => setSelectedFrame(`color:${color}`)}
              />
            </div>
            {selectedColorValue && (
              <div className="flex items-center gap-3 rounded-xl border border-[#1d8a78]/25 bg-[#0f2f2a]/70 px-4 py-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0f2f2a]">
                  {renderAvatarPreview({
                    type: "color",
                    className: "",
                    colorValue: selectedColorValue,
                  })}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#9fc9bd]">Предпросмотр</p>
                  <p className="text-sm font-semibold text-[#fffffe]">
                    Свой цвет: {selectedColorValue}
                  </p>
                </div>
              </div>
            )}
            <p className="text-sm text-[#9fc9bd]">
              Выберите свой цвет рамки или продолжайте использовать готовые
              варианты.
            </p>
          </div>
        </div>
      </GlassModal>
    </>
  );
}
