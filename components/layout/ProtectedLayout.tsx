// components/layout/ProtectedLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import TopBanner from "./TopBanner";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { Suspense } from "react";
import AuthModalRoot from "@/components/auth/AuthModalRoot";
import UniversalBackground from "@/components/ui/UniversalBackground";
import ApplicationStatusModalGate from "@/components/notifications/ApplicationStatusModalGate";
import YandexRTBAd from "@/components/advertising/YandexRTBAd";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const pathname = usePathname();

  // На странице /banned не показываем Header и Footer
  if (pathname === "/banned") {
    return (
      <>
        <UniversalBackground />
        {children}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <UniversalBackground />
      <ApplicationStatusModalGate />
      <TopBanner />
      <Header />
      <main className="flex-1 container-p mx-auto">{children}</main>
      {/* Реклама для мобильных устройств (touch) */}
      <div className="md:hidden">
        <YandexRTBAd
          blockId="R-A-18382388-3"
          type="floorAd"
          platform="touch"
          className="w-full py-4"
        />
      </div>
      {/* Реклама для десктопов */}
      <div className="hidden md:block">
        <YandexRTBAd
          blockId="R-A-18382388-4"
          type="floorAd"
          platform="desktop"
          className="w-full py-4"
        />
      </div>
      <Footer />
      <ScrollToTop />
      <Suspense fallback={null}>
        <AuthModalRoot />
      </Suspense>
    </div>
  );
}


