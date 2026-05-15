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
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { shouldShowMobileBottomNav } from "@/lib/navigation/mobileBottomNav";
import { cn } from "@/lib/utils";

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

  const showBottomNav = shouldShowMobileBottomNav(pathname);

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        showBottomNav && "max-[1199px]:pb-[var(--bottom-nav-offset)]",
      )}
    >
      <UniversalBackground />
      <ApplicationStatusModalGate />
      <TopBanner />
      <Header />
      <main className="flex-1 container-p mx-auto w-full min-w-0 overflow-x-hidden">{children}</main>
      <Footer />
      <MobileBottomNav />
      <ScrollToTop />
      <Suspense fallback={null}>
        <AuthModalRoot />
      </Suspense>
    </div>
  );
}
