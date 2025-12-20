// components/layout/ProtectedLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import TopBanner from "./TopBanner";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { Suspense } from "react";
import AuthModalRoot from "@/components/auth/AuthModalRoot";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const pathname = usePathname();

  // На странице /banned не показываем Header и Footer
  if (pathname === "/banned") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBanner />
      <Header />
      <main className="flex-1 container-p mx-auto">{children}</main>
      <Footer />
      <ScrollToTop />
      <Suspense fallback={null}>
        <AuthModalRoot />
      </Suspense>
    </div>
  );
}


