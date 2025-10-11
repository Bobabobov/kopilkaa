"use client";
import { useState, useEffect } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface TopBannerProps {
  content?: string;
  linkUrl?: string;
  isDismissible?: boolean;
  variant?: "default" | "success" | "warning" | "info";
}

export default function TopBanner({
  content = "🎉 Добро пожаловать на Копилку! Разместите свою рекламу и получите больше клиентов",
  linkUrl = "/advertising",
  isDismissible = true,
  variant = "default"
}: TopBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHidden, setIsHidden] = useState(false);


  // Проверяем, был ли баннер уже закрыт пользователем
  useEffect(() => {
    const dismissed = localStorage.getItem("topBannerDismissed");
    if (dismissed === "true") {
      // Временно показываем баннер для тестирования
      setIsVisible(true);
      // Убираем флаг закрытия для тестирования
      localStorage.removeItem("topBannerDismissed");
    }
  }, []);

  // Отслеживаем скролл для постепенного скрытия баннера
  useEffect(() => {
    const banner = document.querySelector('[data-top-banner]') as HTMLElement;
    if (!banner) return;
    
    const bannerHeight = banner.offsetHeight;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Рассчитываем процент скрытия баннера
      // Баннер начинает скрываться сразу и полностью скрывается когда прокрутили на его высоту
      const hideProgress = Math.min(scrollY / bannerHeight, 1);
      
      // Применяем transform для плавного скрытия
      const translateY = -(hideProgress * 100);
      banner.style.transform = `translateY(${translateY}%)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Вызываем сразу для начального состояния
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClose = () => {
    if (!isDismissible) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem("topBannerDismissed", "true");
      setIsAnimating(false);
    }, 200);
  };

  // Определяем стили в зависимости от варианта
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-600 to-green-700",
          border: "border-green-500",
          text: "text-green-50",
          icon: "text-green-200"
        };
      case "warning":
        return {
          bg: "bg-gradient-to-r from-yellow-600 to-orange-600",
          border: "border-yellow-500",
          text: "text-yellow-50",
          icon: "text-yellow-200"
        };
      case "info":
        return {
          bg: "bg-gradient-to-r from-blue-600 to-blue-700",
          border: "border-blue-500",
          text: "text-blue-50",
          icon: "text-blue-200"
        };
      default:
        return {
          bg: "bg-gradient-to-r from-[#004643] to-[#001e1d]",
          border: "border-[#abd1c6]/30",
          text: "text-[#abd1c6]",
          icon: "text-[#f9bc60]"
        };
    }
  };

  const styles = getVariantStyles();

  if (!isVisible) return null;

  return (
    <div
      data-top-banner
      className={`fixed top-0 left-0 right-0 z-[60] ${styles.bg} ${styles.border} border-b shadow-lg ${
        isAnimating ? "" : 
        isHidden ? "" : 
        ""
      }`}
      style={{ 
        background: variant === "default" 
          ? "linear-gradient(135deg, #004643 0%, #001e1d 100%)"
          : undefined,
        transform: isAnimating ? "translateY(-100%)" : undefined,
        transition: isAnimating ? "transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)" : "none",
        willChange: "transform"
      }}
    >
      <div className="container-p mx-auto px-4 py-4" style={{ minHeight: '250px' }}>
        {/* Десктопная версия */}
        <div className="hidden md:flex items-center justify-between gap-4 h-full">
          {/* Левая часть - контент */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Иконка */}
            <div className={`flex-shrink-0 ${styles.icon}`}>
              <LucideIcons.Megaphone size="md" />
            </div>
            
            {/* Текст */}
            <div className={`text-base font-medium ${styles.text}`}>
              {content}
            </div>
          </div>

          {/* Правая часть - кнопки */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Ссылка на рекламу */}
            {linkUrl && (
              <a
                href={linkUrl}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
                  variant === "default"
                    ? "bg-[#f9bc60] text-[#001e1d] hover:bg-[#f9bc60]/90"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                Разместить рекламу
              </a>
            )}

            {/* Кнопка закрытия */}
            {isDismissible && (
              <button
                onClick={handleClose}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  variant === "default"
                    ? "hover:bg-[#abd1c6]/20"
                    : "hover:bg-white/20"
                }`}
                aria-label="Закрыть баннер"
              >
                <LucideIcons.X 
                  size="sm" 
                  className={styles.text} 
                />
              </button>
            )}
          </div>
        </div>

        {/* Мобильная версия */}
        <div className="md:hidden flex flex-col gap-4 h-full justify-center">
          {/* Верхняя часть - текст и кнопка закрытия */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Иконка */}
              <div className={`flex-shrink-0 ${styles.icon}`}>
                <LucideIcons.Megaphone size="sm" />
              </div>
              
              {/* Текст */}
              <div className={`text-sm font-medium ${styles.text} leading-relaxed`}>
                {content}
              </div>
            </div>

            {/* Кнопка закрытия */}
            {isDismissible && (
              <button
                onClick={handleClose}
                className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0 ${
                  variant === "default"
                    ? "hover:bg-[#abd1c6]/20"
                    : "hover:bg-white/20"
                }`}
                aria-label="Закрыть баннер"
              >
                <LucideIcons.X 
                  size="sm" 
                  className={styles.text} 
                />
              </button>
            )}
          </div>

          {/* Нижняя часть - кнопка действия */}
          {linkUrl && (
            <div className="flex justify-center">
              <a
                href={linkUrl}
                className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
                  variant === "default"
                    ? "bg-[#f9bc60] text-[#001e1d] hover:bg-[#f9bc60]/90"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                Разместить рекламу
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
