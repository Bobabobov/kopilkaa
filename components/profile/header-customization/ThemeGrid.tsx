"use client";

import { motion } from "framer-motion";
import { getHeaderTheme } from "@/lib/header-customization";

interface Theme {
  key: string;
  name: string;
}

interface ThemeGridProps {
  themes: Theme[];
  selectedTheme: string;
  selectedColor: string | null;
  onThemeSelect: (themeKey: string) => void;
}

export function ThemeGrid({
  themes,
  selectedTheme,
  selectedColor,
  onThemeSelect,
}: ThemeGridProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-[#fffffe]">Готовые темы</h3>
        <p className="text-sm text-[#abd1c6]">
          Выберите одну из предустановленных тем
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => {
          const isSelected =
            !selectedColor && selectedTheme === theme.key;
          const themeConfig = getHeaderTheme(theme.key);

          return (
            <motion.button
              key={theme.key}
              onClick={() => onThemeSelect(theme.key)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                isSelected
                  ? "border-[#f9bc60] shadow-[0_0_20px_rgba(249,188,96,0.3)]"
                  : "border-[#abd1c6]/20 hover:border-[#abd1c6]/40"
              }`}
            >
              {/* Preview */}
              <div
                className="h-24 sm:h-28 w-full relative"
                style={
                  themeConfig.background === "image"
                    ? {
                        backgroundImage: `url(${(themeConfig as any).image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : themeConfig.background === "gradient"
                      ? { backgroundImage: (themeConfig as any).gradient }
                      : themeConfig.background === "color"
                        ? {
                            backgroundColor:
                              (themeConfig as any).color || "#004643",
                          }
                        : {
                            background:
                              "linear-gradient(135deg,#1fe0ba,#0a4c43)",
                          }
                }
              >
                <div className="absolute inset-0 bg-black/12" />
                <div className="absolute inset-0 px-4 py-3 flex flex-col justify-center">
                  <div
                    className={`text-lg font-bold ${themeConfig.textColor} mb-1`}
                  >
                    Профиль
                  </div>
                  <div
                    className={`text-sm ${themeConfig.textColor} opacity-90`}
                  >
                    Привет,{" "}
                    <span className={themeConfig.accentColor}>
                      Пользователь
                    </span>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="bg-[#001e1d]/60 px-4 py-3 text-center">
                <div className="text-sm font-semibold text-[#fffffe]">
                  {theme.name}
                </div>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-7 h-7 bg-[#f9bc60] rounded-full flex items-center justify-center shadow-lg"
                >
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
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
