// components/layout/Header.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import NavAuth from "@/components/layout/NavAuth";import HeaderLogo from "./HeaderLogo";
import HeaderNavigation from "./HeaderNavigation";
import HeaderMobileButton from "./HeaderMobileButton";
import HeaderMobileDrawer from "./HeaderMobileDrawer";
import NotificationBell from "./NotificationBell";
import DonateButton from "./DonateButton";

export default function Header() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Синхронизация Header с TopBanner при скролле (только на десктопе)
  // Важно: не привязываемся к querySelector('[data-top-banner]') на маунте,
  // потому что TopBanner может появляться позже (после загрузки рекламы).
  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId = 0;

    const updateTop = () => {
      rafId = 0;
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

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateTop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateTop();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Закрываем мобильное меню при изменении размера экрана (>=1200px)
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.matchMedia("(min-width: 1200px)").matches;
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
          height: "var(--header-offset)",
        }}
      />

      <header
        ref={headerRef}
        className="fixed left-0 right-0 z-50 backdrop-blur-md border-b border-[#abd1c6]/15 shadow-lg bg-[#001e1d]/82 header-component overflow-hidden"
        style={{
          top: "var(--top-banner-height)",
          height: "var(--header-height)",
        }}
      >
        {/* Две размытые подсветки в углах (ослабленные) */}
        <div className="pointer-events-none absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#f9bc60]/10 to-transparent rounded-full blur-[52px]"></div>
        <div className="pointer-events-none absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#e16162]/10 to-transparent rounded-full blur-[52px]"></div>

        {/* Тонкая светящаяся линия сверху (мягче) */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#f9bc60]/45 to-transparent shadow-[0_0_8px_rgba(249,188,96,0.35)]"></div>

        <div className="container-p mx-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 h-full relative">
          {/* Левая часть: логотип (flex-shrink-0) */}
          <div className="flex-shrink-0">
            <HeaderLogo />
          </div>

          {/* Центр: навигация (абсолютно по центру) */}
          <div className="hidden min-[1200px]:flex absolute left-1/2 transform -translate-x-1/2 max-w-[100vw]">
            <HeaderNavigation className="flex-wrap justify-center gap-2 px-2 max-w-[1100px]" />
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

            {/* Мобильные/планшетные кнопки: burger (поддержка — в нижней навигации) */}
            <div className="min-[1200px]:hidden flex items-center gap-2">
              <HeaderMobileButton
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                isOpen={mobileMenuOpen}
              />
            </div>
          </div>
        </div>
      </header>

      <HeaderMobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        showNotifications={Boolean(isAuthenticated && !authLoading)}
      />
    </>
  );
}
