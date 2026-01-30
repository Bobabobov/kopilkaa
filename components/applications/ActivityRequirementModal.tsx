"use client";

import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect } from "react";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ActivityRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityType: "LIKE_STORY" | "CHANGE_AVATAR" | "CHANGE_HEADER";
  message: string;
}

export default function ActivityRequirementModal({
  isOpen,
  onClose,
  activityType,
  message,
}: ActivityRequirementModalProps) {
  const isBrowser = typeof window !== "undefined";

  // Правильная блокировка скролла
  useEffect(() => {
    if (!isOpen || !isBrowser) return;

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

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, onClose, isBrowser]);

  if (!isBrowser) return null;

  const getActivityConfig = () => {
    switch (activityType) {
      case "LIKE_STORY":
        return {
          icon: <LucideIcons.Heart className="w-8 h-8" />,
          title: "Лайк истории",
          description: "Поставьте лайк любой истории, которая вам понравится.",
          helperText: "Начиная с 3-й заявки — лайк нужен каждый раз.",
          buttonText: "Открыть истории",
          buttonLink: "/stories",
          buttonIcon: <LucideIcons.BookOpen className="w-5 h-5" />,
          accentColor: "bg-[#e16162]",
          accentGradient: "from-[#e16162] to-[#d14d4e]",
          onButtonClick: null,
        };
      case "CHANGE_AVATAR":
        return {
          icon: <LucideIcons.User className="w-8 h-8" />,
          title: "Смена аватара",
          description: "Установите аватар в профиле.",
          helperText: "Нужно сделать один раз.",
          buttonText: "Открыть профиль",
          buttonLink: "/profile?settings=avatar",
          buttonIcon: <LucideIcons.User className="w-5 h-5" />,
          accentColor: "bg-[#1f6a4d]",
          accentGradient: "from-[#1f6a4d] to-[#1a5a40]",
          onButtonClick: () => {
            onClose();
            window.location.href = "/profile?settings=avatar";
          },
        };
      case "CHANGE_HEADER":
        return {
          icon: <LucideIcons.Image className="w-8 h-8" />,
          title: "Смена обложки",
          description: "Установите обложку профиля.",
          helperText: "Нужно сделать один раз.",
          buttonText: "Выбрать обложку",
          buttonLink: "/profile",
          buttonIcon: <LucideIcons.Palette className="w-5 h-5" />,
          accentColor: "bg-[#f9bc60]",
          accentGradient: "from-[#f9bc60] to-[#e8a545]",
          onButtonClick: () => {
            onClose();
            window.location.href = "/profile?headerTheme=open";
          },
        };
    }
  };

  const config = getActivityConfig();

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
        >
          <div className="absolute inset-0 bg-black/65" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-2xl border border-[#2c4f45]/70 bg-[#0f2622] shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header с акцентом */}
            <div
              className={`${config.accentColor} p-6 flex items-center gap-4`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="bg-white/20 rounded-full p-3 backdrop-blur-sm"
              >
                <div className="text-white">{config.icon}</div>
              </motion.div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">
                  {config.title}
                </h3>
                <p className="text-white/90 text-sm mt-1">
                  {config.description}
                </p>
                {config.helperText && (
                  <p className="text-white/80 text-xs mt-1">
                    {config.helperText}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/20 rounded-lg"
              >
                <LucideIcons.X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 bg-[#0f2622]">
              <p className="text-sm text-[#cfdcd6] leading-relaxed">
                {message}
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {config.onButtonClick ? (
                  <button
                    onClick={config.onButtonClick}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${config.accentGradient} hover:opacity-90 text-[#0f1f1c] font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
                  >
                    {config.buttonIcon}
                    <span>{config.buttonText}</span>
                  </button>
                ) : (
                  <Link
                    href={config.buttonLink}
                    onClick={onClose}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${config.accentGradient} hover:opacity-90 text-[#0f1f1c] font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`}
                  >
                    {config.buttonIcon}
                    <span>{config.buttonText}</span>
                  </Link>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#1a3d35] hover:bg-[#1f4a40] text-[#e6f1ec] font-semibold rounded-xl transition-all duration-300 border border-[#2c4f45]/50"
                >
                  Позже
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
