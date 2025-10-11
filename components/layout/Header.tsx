// components/layout/Header.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavAuth from "@/app/_parts/NavAuth";
import HeaderLogo from "./HeaderLogo";
import HeaderNavigation from "./HeaderNavigation";
import HeaderMobileButton from "./HeaderMobileButton";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topBannerHeight, setTopBannerHeight] = useState(0);

  // Проверяем авторизацию
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/profile/me");
        const isAuth = response.ok;
        setIsAuthenticated(isAuth);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Определяем высоту TopBanner при загрузке
  useEffect(() => {
    const topBanner = document.querySelector('[data-top-banner]') as HTMLElement;
    if (topBanner) {
      setTopBannerHeight(topBanner.offsetHeight);
    }
    
    // Отслеживаем скролл, чтобы Header двигался синхронно с баннером
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

  return (
    <>
              {/* Spacer для Header + TopBanner */}
              <div 
                style={{ 
                  height: `${64 + topBannerHeight}px`
                }} 
              />

              <header
                className="fixed left-0 right-0 z-50 backdrop-blur-sm border-b shadow-lg"
                style={{ 
                  backgroundColor: "#004643", 
                  borderColor: "#abd1c6",
                  top: `${topBannerHeight}px`
                }}
              >
        <div className="container-p mx-auto flex h-16 items-center justify-between gap-4">
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
          <div className="hidden sm:flex items-center gap-3 w-[180px] justify-end flex-shrink-0">
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
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t backdrop-blur-sm shadow-lg"
            style={{ 
              backgroundColor: "#004643", 
              borderColor: "#abd1c6"
            }}
          >
            <div className="container-p py-4 space-y-2">
              {/* Навигационные ссылки */}
              <div className="space-y-1">
                <HeaderNavigation
                  className="flex-col space-y-1"
                  onLinkClick={() => setMobileMenuOpen(false)}
                />
              </div>

              {/* Авторизация для мобильных */}
              <div className="pt-2 border-t border-white/20">
                <div className="px-4">
                  <NavAuth />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}