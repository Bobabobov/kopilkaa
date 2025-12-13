// components/layout/Header.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import NavAuth from "@/app/components/NavAuth";
import HeaderLogo from "./HeaderLogo";
import HeaderNavigation from "./HeaderNavigation";
import HeaderMobileButton from "./HeaderMobileButton";
import NotificationBell from "./NotificationBell";
import DonateButton from "./DonateButton";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topBannerHeight, setTopBannerHeight] = useState(0);
  const [menuTop, setMenuTop] = useState(64);
  const [headerHeight, setHeaderHeight] = useState(64);
  const pathname = usePathname();

  // Проверяем авторизацию (не блокируем навигацию)
  useEffect(() => {
    let cancelled = false;
    
    const checkAuth = async () => {
      try {
        // Используем AbortController для отмены при размонтировании
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000); // Таймаут 1 секунда
        
        const response = await fetch("/api/profile/me", {
          signal: controller.signal,
          cache: "no-store",
        });
        
        clearTimeout(timeoutId);
        
        if (!cancelled) {
          const isAuth = response.ok;
          setIsAuthenticated(isAuth);
        }
      } catch (error) {
        if (!cancelled) {
          setIsAuthenticated(false);
        }
      } finally {
        if (!cancelled) {
          setAuthLoading(false);
        }
      }
    };

    checkAuth();
    
    return () => {
      cancelled = true;
    };
  }, []);

  // Слушаем глобальные изменения статуса авторизации
  useEffect(() => {
    const handleAuthChange = (event: Event) => {
      const detail = (event as CustomEvent<{ isAuthenticated?: boolean }>).detail;
      if (typeof detail?.isAuthenticated === "boolean") {
        setIsAuthenticated(detail.isAuthenticated);
        setAuthLoading(false);
      }
    };

    window.addEventListener("auth-status-change", handleAuthChange);
    return () => {
      window.removeEventListener("auth-status-change", handleAuthChange);
    };
  }, []);

  // Определяем высоту TopBanner при загрузке
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.innerWidth < 768;
    const topBanner = document.querySelector('[data-top-banner]') as HTMLElement | null;

    // На мобильных не двигаем шапку вместе с баннером, чтобы избежать дёрганий
    if (isMobile) {
      setTopBannerHeight(0);
      const header = document.querySelector('header') as HTMLElement | null;
      if (header) {
        header.style.top = "0px";
      }
      return;
    }

    if (topBanner) {
      const bannerHeight = topBanner.offsetHeight;
      setTopBannerHeight(bannerHeight);

      const header = document.querySelector('header') as HTMLElement | null;
      if (header) {
        header.style.top = `${bannerHeight}px`;
      }
    }
    
    // На десктопе отслеживаем скролл, чтобы Header двигался синхронно с баннером
    const handleScroll = () => {
      if (!topBanner) return;
      
      const scrollY = window.scrollY;
      const bannerHeight = topBanner.offsetHeight;
      
      // Рассчитываем на сколько скрыт баннер
      const hideProgress = Math.min(scrollY / bannerHeight, 1);
      
      // Header двигается вверх по мере скрытия баннера
      const header = document.querySelector('header') as HTMLElement;
      if (header) {
        const newTop = bannerHeight * (1 - hideProgress);
        header.style.top = `${newTop}px`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Вызываем сразу для начального состояния
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Отдельно вычисляем позицию нижней границы header,
  // чтобы мобильное меню всегда открывалось сразу под ним
  useEffect(() => {
    const updateHeaderHeight = () => {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
      setHeaderHeight(isMobile ? 56 : 64);
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  // Позиция меню на мобильных — сразу под хедером
  useEffect(() => {
    const updateMenuTop = () => {
      const header = document.querySelector('header') as HTMLElement | null;
      if (header) {
        const rect = header.getBoundingClientRect();
        setMenuTop(rect.bottom);
      }
    };

    updateMenuTop();
    window.addEventListener("scroll", updateMenuTop, { passive: true });
    window.addEventListener("resize", updateMenuTop);

    return () => {
      window.removeEventListener("scroll", updateMenuTop);
      window.removeEventListener("resize", updateMenuTop);
    };
  }, []);

  // Закрываем мобильное меню при изменении размера экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Закрываем мобильное меню при изменении маршрута
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
              {/* Spacer для Header + TopBanner */}
              <div 
                style={{ 
          height: `${headerHeight + topBannerHeight}px`
                }} 
              />

              <header
                className="fixed left-0 right-0 z-50 backdrop-blur-sm border-b shadow-lg"
                style={{ 
                  backgroundColor: "#004643", 
                  borderColor: "#abd1c6",
          top: `${topBannerHeight}px`,
          height: `${headerHeight}px`
                }}
              >
        <div className="container-p mx-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 h-full">
          {/* Логотип слева */}
          <HeaderLogo />

          {/* Промежуточная навигация для планшетов */}
          <div className="hidden lg:flex xl:hidden">
            <HeaderNavigation />
          </div>

          {/* Полная навигация для больших экранов */}
          <div className="hidden xl:flex flex-1 justify-center">
            <HeaderNavigation />
          </div>

          {/* Правая часть - показываем на средних и больших экранах */}
          <div className="hidden sm:flex items-center gap-2 w-[260px] sm:w-[280px] justify-end flex-shrink-0">
            <DonateButton />
            {isAuthenticated && !authLoading && <NotificationBell />}
            <NavAuth />
          </div>

          {/* Кнопка мобильного меню */}
          <HeaderMobileButton
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            isOpen={mobileMenuOpen}
          />
        </div>
      </header>

      {/* Мобильное меню */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Подложка для затемнения */}
            <motion.div
              className="fixed inset-0 z-30 lg:hidden bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed left-0 right-0 z-40 border-t backdrop-blur-sm shadow-2xl rounded-b-3xl"
              style={{ 
                backgroundColor: "#004643", 
                borderColor: "#abd1c6",
                top: `${menuTop}px`,
                maxHeight: `calc(100vh - ${menuTop + 12}px)`,
              }}
            >
              <div className="container-p py-4 space-y-3 overflow-y-auto">
                {/* Навигационные ссылки */}
                <div className="space-y-2">
                  <HeaderNavigation
                    className="flex-col space-y-1 text-base"
                    onLinkClick={() => setMobileMenuOpen(false)}
                  />
                </div>

                {/* Уведомления и авторизация для мобильных */}
                <div className="pt-3 border-t border-white/15">
                  <div className="px-2 sm:px-4 space-y-3">
                    <NavAuth isMobile onLinkClick={() => setMobileMenuOpen(false)} />
                    <DonateButton isMobile={true} onLinkClick={() => setMobileMenuOpen(false)} />
                    {isAuthenticated && !authLoading && (
                      <div className="flex justify-center">
                        <NotificationBell />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}