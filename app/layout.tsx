import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopBanner from "@/components/layout/TopBanner";
import { BeautifulNotificationsProvider } from "@/components/ui/BeautifulNotificationsProvider";
import ProfilePreloadInitializer from "@/components/performance/ProfilePreloadInitializer";
import BanCheck from "@/components/auth/BanCheck";
import ProtectedLayout from "@/components/layout/ProtectedLayout";

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
          <BanCheck>
            <ProtectedLayout>{children}</ProtectedLayout>
          </BanCheck>
        </BeautifulNotificationsProvider>
      </body>
    </html>
  );
}
