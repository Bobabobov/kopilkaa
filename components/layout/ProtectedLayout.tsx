// components/layout/ProtectedLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import TopBanner from "./TopBanner";
import Header from "./Header";
import Footer from "./Footer";
import UniversalBackground from "@/components/ui/UniversalBackground";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { shouldShowMobileBottomNav } from "@/lib/navigation/mobileBottomNav";
import { cn } from "@/lib/utils";

const ScrollToTop = dynamic(() => import("@/components/ui/ScrollToTop"), {
  ssr: false,
});

const KopiExperience = dynamic(
  () => import("@/components/kopi/KopiExperience"),
  { ssr: false },
);

const ApplicationStatusModalGate = dynamic(
  () => import("@/components/notifications/ApplicationStatusModalGate"),
  { ssr: false },
);

const AuthModalRoot = dynamic(() => import("@/components/auth/AuthModalRoot"), {
  ssr: false,
});

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const pathname = usePathname();

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
      <main className="flex-1 container-p mx-auto w-full min-w-0 overflow-x-hidden">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      <ScrollToTop />
      <KopiExperience />
      <Suspense fallback={null}>
        <AuthModalRoot />
      </Suspense>
    </div>
  );
}
