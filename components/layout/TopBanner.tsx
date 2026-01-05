"use client";
import { useEffect, useRef, useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Image from "next/image";

interface TopBannerProps {
  content?: string;
  linkUrl?: string;
  isDismissible?: boolean;
  variant?: "default" | "success" | "warning" | "info";
}

type ResolvedAsset = {
  type: "video" | "image" | null;
  url: string | null;
};

type ResolvedBannerResponse = {
  desktop: ResolvedAsset;
  mobile: ResolvedAsset;
  content: string | null;
  linkUrl: string | null;
} | null;

export default function TopBanner({
  content,
  linkUrl,
  isDismissible = true,
  variant = "default"
}: TopBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [adContent, setAdContent] = useState<string | null>(null);
  const [adLink, setAdLink] = useState<string | null>(null);
  const [hasActiveAd, setHasActiveAd] = useState(false);
  const [desktopAsset, setDesktopAsset] = useState<ResolvedAsset>({
    type: null,
    url: null,
  });
  const [mobileAsset, setMobileAsset] = useState<ResolvedAsset>({
    type: null,
    url: null,
  });
  const [isMobile, setIsMobile] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);


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

  // Загружаем рекламный баннер (тип размещения home_banner) — через универсальный API
  useEffect(() => {
    const fetchBannerAd = async () => {
      try {
        const response = await fetch("/api/ads?placement=home_banner", {
          cache: "no-store",
        });
        if (!response.ok) return;

        const data = (await response.json()) as ResolvedBannerResponse;

        if (!data) {
          setHasActiveAd(false);
          setDesktopAsset({ type: null, url: null });
          setMobileAsset({ type: null, url: null });
          setAdContent(null);
          setAdLink(null);
          return;
        }

        setHasActiveAd(true);
        setDesktopAsset(data.desktop);
        setMobileAsset(data.mobile);
        setAdContent(data.content);
        setAdLink(data.linkUrl);
      } catch (error) {
        console.error("Error loading top banner ad:", error);
        setHasActiveAd(false);
      }
    };

    fetchBannerAd();
  }, []);

  // Определяем mobile/desktop (767/768) и обновляем состояние
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateIsMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    };
    updateIsMobile();

    // Используем matchMedia для отслеживания изменений
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = () => updateIsMobile();
    
    // Современный способ через addEventListener
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", handleChange);
      return () => mobileQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback для старых браузеров
      mobileQuery.addListener(handleChange);
      return () => mobileQuery.removeListener(handleChange);
    }
  }, []);

  // Устанавливаем CSS-переменную для высоты TopBanner
  useEffect(() => {
    if (!bannerRef.current) return;

    const updateBannerHeight = () => {
      const height = bannerRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty("--top-banner-height", `${height}px`);
    };

    updateBannerHeight();

    // Обновляем при изменении размера окна
    window.addEventListener("resize", updateBannerHeight);
    
    // Используем ResizeObserver для отслеживания изменений размера элемента
    const resizeObserver = new ResizeObserver(updateBannerHeight);
    if (bannerRef.current) {
      resizeObserver.observe(bannerRef.current);
    }

      return () => {
        window.removeEventListener("resize", updateBannerHeight);
        resizeObserver.disconnect();
      };
  }, [isVisible, isMobile, desktopAsset.url, mobileAsset.url]);

  // Отслеживаем скролл для постепенного скрытия баннера (только на десктопе)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isVisible) return;
    if (!bannerRef.current) return;

    // Используем matchMedia вместо window.innerWidth
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    
    const handleScroll = () => {
      // Проверяем через matchMedia, а не через window.innerWidth
      if (!desktopQuery.matches) return;
      
      const banner = bannerRef.current;
      if (!banner) return;

      const bannerHeight = banner.offsetHeight;
      const scrollY = window.scrollY;
      
      // Рассчитываем процент скрытия баннера
      const hideProgress = Math.min(scrollY / bannerHeight, 1);
      
      // Применяем transform для плавного скрытия (как было до изменений)
      const translateY = -(hideProgress * 100);
      banner.style.transform = `translateY(${translateY}%)`;
    };

    // Слушаем изменения media query
    const handleMediaChange = () => {
      if (!desktopQuery.matches && bannerRef.current) {
        // На мобильных сбрасываем transform
        bannerRef.current.style.transform = "";
      }
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Современный способ через addEventListener
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", handleMediaChange);
    } else {
      desktopQuery.addListener(handleMediaChange);
    }
    
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (desktopQuery.removeEventListener) {
        desktopQuery.removeEventListener("change", handleMediaChange);
      } else {
        desktopQuery.removeListener(handleMediaChange);
      }
    };
  }, [isVisible]);

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

  const finalContent = adContent ?? content ?? null;
  const finalLinkUrl = adLink ?? linkUrl ?? null;
  const activeAsset = isMobile ? mobileAsset : desktopAsset;
  const hasVideo = activeAsset.type === "video" && !!activeAsset.url;
  const hasImage = activeAsset.type === "image" && !!activeAsset.url;
  const fallbackImageUrl = isMobile ? "/mobilefod.png" : "/fonnn.png";
  const hasMedia = hasVideo || hasImage;
  const shouldUseFallbackCreative = !hasMedia;
  const creativeIsVideo = hasVideo;
  const creativeUrl =
    (hasVideo ? activeAsset.url : hasImage ? activeAsset.url : fallbackImageUrl) ||
    fallbackImageUrl;

  // Ссылка клика:
  // - если активной рекламы нет => заглушка ведёт на /advertising
  // - если реклама есть => ведём только на ссылку из админки (если задана)
  const clickUrl = hasActiveAd ? (adLink ?? null) : "/advertising";

  const handleBannerClick = () => {
    if (!clickUrl) return;
    if (typeof window === "undefined") return;
    window.location.href = clickUrl;
  };

  if (!isVisible) return null;
  // Если нет активной рекламы — показываем фоновую картинку из /public (desktop: fonnn.png, mobile: mobilefod.png)
  // Если нет вообще ничего и fallback вдруг отсутствует — скрываем баннер
  if (!hasMedia && !finalContent && !finalLinkUrl && !fallbackImageUrl) return null;

  return (
    <div
      ref={bannerRef}
      data-top-banner
      data-has-image={hasImage ? "true" : "false"}
      className={`top-banner-component h-[300px] md:h-[250px] ${
        variant === "default" ? "bg-[#eef1f4]" : styles.bg
      } ${styles.border} border-b shadow-lg overflow-hidden ${
        isAnimating ? "" : 
        isHidden ? "" : 
        ""
      } ${clickUrl ? "cursor-pointer" : ""}`}
      style={{ 
        // Фон большого баннера (variant=default) всегда нейтральный, как на vc.ru
        backgroundColor: variant === "default" ? "#eef1f4" : "#001e1d",
        backgroundImage:
          variant === "default" ? "none" : undefined,
        transform: isAnimating ? "translateY(-100%)" : undefined,
        transition: isAnimating ? "transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)" : "none",
        willChange: "transform",
      }}
      onClick={handleBannerClick}
    >
      {/* CreativeLayer: креатив как на vc.ru — центрированный блок фикс. max-width, object-contain (без cover/кропа/зума) */}
      {creativeIsVideo ? (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-full h-full max-w-[1400px]">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-contain object-center bg-transparent"
              style={{ backgroundColor: "transparent" }}
              onError={(e) => {
                console.error("Error loading video:", activeAsset.url, e);
              }}
            >
              <source src={creativeUrl || undefined} />
            </video>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-full h-full max-w-[1400px]">
            {creativeUrl && creativeUrl.startsWith("/") ? (
              <div className="relative w-full h-full">
                <Image
                  src={creativeUrl}
                  alt=""
                  fill
                  // Баннер — почти всегда LCP на главной, просим загрузить приоритетно.
                  priority
                  sizes="(min-width: 768px) 1400px, 100vw"
                  quality={70}
                  className="object-contain object-center"
                  draggable={false}
                />
              </div>
            ) : (
              // Внешние креативы не всегда разрешены в remotePatterns → оставляем обычный img.
            <img
              src={creativeUrl || undefined}
              alt=""
              className="w-full h-full object-contain object-center"
              draggable={false}
            />
            )}
          </div>
        </div>
      )}

      {/* OverlayLayer убран по требованию: без затемнения/наложений */}

      <div
        className="container-p max-w-[1680px] mx-auto py-4 relative z-10 h-[300px] md:h-[250px]"
      >
        {/* Десктопная версия */}
        <div className="hidden md:flex items-center justify-between gap-4 h-full">
          {/* Левая часть - только текст без иконки */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {finalContent && (
              <div className={`text-base font-medium ${styles.text}`}>
                {finalContent}
              </div>
            )}
          </div>
        </div>

        {/* Мобильная версия */}
        <div className="md:hidden flex flex-col gap-4 h-full justify-center">
          {/* Верхняя часть - текст и кнопка закрытия */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Только текст без иконки */}
              {finalContent && (
                <div className={`text-sm font-medium ${styles.text} leading-relaxed`}>
                  {finalContent}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
