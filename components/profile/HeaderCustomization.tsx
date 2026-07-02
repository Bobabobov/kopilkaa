// components/profile/HeaderCustomization.tsx
"use client";

import { useState, useEffect } from "react";
import { GlassModal } from "@/components/ui/GlassModal";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { useAutoHideScrollbar } from "@/hooks/ui/useAutoHideScrollbar";
import { getAllHeaderThemes, getHeaderTheme } from "@/lib/header-customization";
import { submitPendingApplicationIfNeeded } from "@/lib/applications/pendingSubmission";
import { getMessageFromApiJson, logRouteCatchError } from "@/lib/api/parseApiError";
import { HeaderPreview } from "./header-customization/HeaderPreview";
import { HeaderCoverSection } from "./header-customization/HeaderCoverSection";
import { ColorWheelSection } from "./header-customization/ColorWheelSection";
import { ThemeGrid } from "./header-customization/ThemeGrid";

interface User {
  id: string;
  email: string | null;
  role: "USER" | "ADMIN";
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
  headerTheme?: string | null;
  headerCover?: string | null;
}

interface HeaderCustomizationProps {
  user: User;
  onThemeChange: (theme: string) => void;
  onCoverChange: (coverUrl: string | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function HeaderCustomization({
  user,
  onThemeChange,
  onCoverChange,
  isOpen,
  onClose,
}: HeaderCustomizationProps) {
  const [selectedTheme, setSelectedTheme] = useState(
    user.headerTheme || "default",
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    user.headerTheme?.startsWith("color:") ? user.headerTheme : null,
  );
  const [currentHeaderCover, setCurrentHeaderCover] = useState<string | null>(
    user.headerCover ?? null,
  );
  const [saving, setSaving] = useState(false);
  const { showToast } = useBeautifulToast();
  const selectedThemeKey = selectedColor ? selectedColor : selectedTheme;
  const selectedThemeConfig = selectedColor
    ? {
        background: "color",
        color: selectedColor.replace("color:", ""),
        textColor: "text-[#fffffe]",
        accentColor: "text-[#f9bc60]",
      }
    : getHeaderTheme(selectedThemeKey || "default");

  useAutoHideScrollbar();

  const themes = getAllHeaderThemes();

  const themeName = selectedColor
    ? "Своя палитра"
    : themes.find((t) => t.key === selectedThemeKey)?.name || "Default";
  const selectedColorValue = selectedColor
    ? selectedColor.replace("color:", "")
    : null;

  useEffect(() => {
    if (isOpen) {
      setCurrentHeaderCover(user.headerCover ?? null);
    }
  }, [isOpen, user.headerCover]);

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
          getMessageFromApiJson(data, "Не удалось сохранить тему"),
        );
      }
    } catch (error) {
      logRouteCatchError("[HeaderCustomization] save", error);
      showToast("error", "Ошибка сохранения", "Не удалось сохранить тему");
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
        zIndex={999}
        maxHeight="min(88dvh, 900px)"
        bodyClassName="p-0"
        header={
          <div className="shrink-0 border-b border-[#1d8a78]/25 p-6">
            <div className="flex items-center justify-between">
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
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#fffffe]">
                    Обложка профиля
                  </h2>
                  <p className="text-[#9fc9bd]">
                    Загрузите своё изображение или выберите готовую тему
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
          <HeaderCoverSection
            headerCover={currentHeaderCover}
            onCoverChange={(coverUrl) => {
              setCurrentHeaderCover(coverUrl);
              onCoverChange(coverUrl);
            }}
          />

          <HeaderPreview
            selectedThemeConfig={selectedThemeConfig}
            themeName={themeName}
            selectedColor={selectedColor}
            headerCover={currentHeaderCover}
          />

          <ColorWheelSection
            selectedColor={selectedColor}
            selectedColorValue={selectedColorValue}
            onColorChange={(color) => {
              setSelectedColor(`color:${color}`);
              setSelectedTheme("");
            }}
            onResetColor={() => {
              setSelectedColor(null);
              setSelectedTheme("default");
            }}
          />

          <ThemeGrid
            themes={themes}
            selectedTheme={selectedTheme}
            selectedColor={selectedColor}
            onThemeSelect={(themeKey) => {
              setSelectedTheme(themeKey);
              setSelectedColor(null);
            }}
          />
        </div>
      </GlassModal>
    </>
  );
}
