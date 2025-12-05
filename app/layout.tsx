import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopBanner from "@/components/layout/TopBanner";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { BeautifulNotificationsProvider } from "@/components/ui/BeautifulNotificationsProvider";
import ProfilePreloadInitializer from "@/components/performance/ProfilePreloadInitializer";
import AuthModalRoot from "@/components/auth/AuthModalRoot";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Копилка — платформа взаимной помощи",
  description:
    "Платформа для оказания взаимной помощи людям в трудной жизненной ситуации",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning className="dark">
      <body className={inter.className} suppressHydrationWarning>
        <BeautifulNotificationsProvider>
          <ProfilePreloadInitializer />
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
        </BeautifulNotificationsProvider>
      </body>
    </html>
  );
}
