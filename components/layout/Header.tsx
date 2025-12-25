// components/layout/Header.tsx
"use client";
import { useState, useEffect, useRef } from "react";
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
  const [menuTop, setMenuTop] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Проверяем авторизацию (не блокируем навигацию)
  useEffect(() => {
    let cancelled = false;
    
    const checkAuth = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);
        
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

  // Синхронизация Header с TopBanner при скролле (только на десктопе)
  // Важно: не привязываемся к querySelector('[data-top-banner]') на маунте,
  // потому что TopBanner может появляться позже (после загрузки рекламы).
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      // Используем CSS media query через matchMedia вместо window.innerWidth
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      
      if (!isDesktop) return;

      const scrollY = window.scrollY;
      const cssValue = getComputedStyle(document.documentElement)
        .getPropertyValue("--top-banner-height")
        .trim();
      const bannerHeight = Number.parseFloat(cssValue || "0") || 0;
      const hideProgress =
        bannerHeight > 0 ? Math.min(scrollY / bannerHeight, 1) : 1;
      
      if (headerRef.current) {
        const newTop = bannerHeight * (1 - hideProgress);
        headerRef.current.style.top = `${newTop}px`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Вычисляем позицию мобильного меню один раз при открытии
  useEffect(() => {
    if (!mobileMenuOpen || !headerRef.current) return;

    const updateMenuTop = () => {
      const rect = headerRef.current?.getBoundingClientRect();
      if (rect) {
        setMenuTop(rect.bottom);
      }
    };

    updateMenuTop();
  }, [mobileMenuOpen]);

  // Закрываем мобильное меню при изменении размера экрана (lg+)
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (isDesktop) {
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
      {/* Spacer для Header + TopBanner через CSS-переменную */}
      <div 
        className="header-spacer"
        style={{ 
          height: "var(--header-offset)"
        }} 
      />

      <header
        ref={headerRef}
        className="fixed left-0 right-0 z-50 backdrop-blur-sm border-b shadow-lg header-component"
        style={{ 
          backgroundColor: "#004643", 
          borderColor: "#abd1c6",
          top: "var(--top-banner-height)",
          height: "var(--header-height)"
        }}
      >
        <div className="container-p mx-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 h-full relative">
          {/* Левая часть: логотип (flex-shrink-0) */}
          <div className="flex-shrink-0">
            <HeaderLogo />
          </div>

          {/* Центр: навигация (абсолютно по центру) */}
          <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
            <HeaderNavigation />
          </div>

          {/* Правая часть: кнопки (flex-shrink-0, без ml-auto) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* DonateButton - скрыт на мобильных */}
            <div className="hidden sm:block">
              <DonateButton />
            </div>
            
            {/* NotificationBell - виден всегда (если авторизован) */}
            {isAuthenticated && !authLoading && <NotificationBell />}
            
            {/* NavAuth - скрыт на мобильных */}
            <div className="hidden sm:block">
              <NavAuth />
            </div>
            
            {/* HeaderMobileButton - виден только на мобильных */}
            <div className="sm:hidden">
              <HeaderMobileButton
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                isOpen={mobileMenuOpen}
              />
            </div>
          </div>
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

                {/* Авторизация для мобильных */}
                <div className="pt-3 border-t border-white/15">
                  <div className="px-2 sm:px-4 space-y-3">
                    <NavAuth isMobile onLinkClick={() => setMobileMenuOpen(false)} />
                    <DonateButton isMobile={true} onLinkClick={() => setMobileMenuOpen(false)} />
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
