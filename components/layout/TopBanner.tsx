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
  const [adContent, setAdContent] = useState<string | null>(null);
  const [adLink, setAdLink] = useState<string | null>(null);
  const [adImageUrl, setAdImageUrl] = useState<string | null>(null);
  const [desktopImageUrl, setDesktopImageUrl] = useState<string | null>(null);
  const [mobileImageUrl, setMobileImageUrl] = useState<string | null>(null);


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

  // Загружаем рекламный баннер (тип размещения home_banner)
  useEffect(() => {
    const fetchBannerAd = async () => {
      try {
        const response = await fetch("/api/ads/banner");
        if (!response.ok) return;

        const data = await response.json();
        const ad = data.ad as
          | {
              title?: string;
              content?: string;
              linkUrl?: string | null;
              imageUrl?: string | null;
              config?: {
                bannerMobileImageUrl?: string | null;
              } | null;
            }
          | null;

        if (ad) {
          setAdContent(ad.content || ad.title || null);
          setAdLink(ad.linkUrl ?? null);

          // Базовое изображение (десктоп)
          const fallbackImage = "/gabriel-cardinal-goosebumps-patreon.gif";
          const desktop =
            (ad.imageUrl && ad.imageUrl.trim()) || fallbackImage;

          // Мобильное — отдельное поле или тот же баннер
          const mobile =
            (ad.config?.bannerMobileImageUrl &&
              ad.config.bannerMobileImageUrl.trim()) ||
            desktop;

          setDesktopImageUrl(desktop);
          setMobileImageUrl(mobile);
        } else {
          setDesktopImageUrl(null);
          setMobileImageUrl(null);
        }
      } catch (error) {
        console.error("Error loading top banner ad:", error);
      }
    };

    fetchBannerAd();
  }, []);

  // Выбираем подходящее изображение в зависимости от ширины экрана
  useEffect(() => {
    const chooseImage = () => {
      if (!desktopImageUrl && !mobileImageUrl) {
        setAdImageUrl(null);
        return;
      }

      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setAdImageUrl(mobileImageUrl || desktopImageUrl);
      } else {
        setAdImageUrl(desktopImageUrl || mobileImageUrl);
      }
    };

    chooseImage();

    window.addEventListener("resize", chooseImage);
    return () => window.removeEventListener("resize", chooseImage);
  }, [desktopImageUrl, mobileImageUrl]);

  // Отслеживаем скролл для постепенного скрытия баннера
  // Для баннера с картинкой анимацию скрытия отключаем, чтобы не было "просветов" зелёного фона
  useEffect(() => {
    if (adImageUrl) {
      return;
    }

    const banner = document.querySelector("[data-top-banner]") as HTMLElement;
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

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Вызываем сразу для начального состояния
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [adImageUrl]);

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

  const finalContent = adContent || content;
  const finalLinkUrl = adLink || linkUrl;
  const hasImage = !!adImageUrl;

  if (!isVisible) return null;

  return (
    <div
      data-top-banner
      className={`fixed top-0 left-0 right-0 z-[60] ${styles.bg} ${styles.border} border-b shadow-lg relative overflow-hidden ${
        isAnimating ? "" : 
        isHidden ? "" : 
        ""
      }`}
      style={{
        background:
          variant === "default" && !hasImage
            ? "linear-gradient(135deg, #004643 0%, #001e1d 100%)"
            : "#001e1d",
        transform: isAnimating ? "translateY(-100%)" : undefined,
        transition: isAnimating ? "transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)" : "none",
        willChange: "transform"
      }}
    >
      {/* Фоновое изображение рекламного баннера, если есть */}
      {hasImage && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src={adImageUrl}
            alt="Рекламный баннер"
            className="w-full h-full object-cover object-center"
          />
          {/* Лёгкий затемняющий градиент только для читаемости текста */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
        </div>
      )}

      <div
        className="container-p mx-auto px-4 py-4 relative z-10"
        style={{ height: "250px" }}
      >
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
              {finalContent}
            </div>
          </div>

          {/* Правая часть - кнопки */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Ссылка / кнопка действия */}
            {finalLinkUrl && (
              <a
                href={finalLinkUrl}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
                  variant === "default"
                    ? "bg-[#f9bc60] text-[#001e1d] hover:bg-[#f9bc60]/90"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {adLink ? "Перейти на сайт" : "Разместить рекламу"}
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
                {finalContent}
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
          {finalLinkUrl && (
            <div className="flex justify-center">
              <a
                href={finalLinkUrl}
                className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105 ${
                  variant === "default"
                    ? "bg-[#f9bc60] text-[#001e1d] hover:bg-[#f9bc60]/90"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
                >
                {adLink ? "Перейти на сайт" : "Разместить рекламу"}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
