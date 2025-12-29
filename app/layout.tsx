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

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Копилка — платформа взаимной помощи",
    template: "%s | Копилка",
  },
  description:
    "Платформа для оказания взаимной помощи людям в трудной жизненной ситуации",
  keywords: ["копилка", "взаимопомощь", "благотворительность", "помощь", "платформа помощи"],
  authors: [{ name: "Копилка" }],
  creator: "Копилка",
  publisher: "Копилка",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Копилка",
    title: "Копилка — платформа взаимной помощи",
    description: "Платформа для оказания взаимной помощи людям в трудной жизненной ситуации",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Копилка — платформа взаимной помощи",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Копилка — платформа взаимной помощи",
    description: "Платформа для оказания взаимной помощи людям в трудной жизненной ситуации",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
