import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import { BeautifulNotificationsProvider } from "@/components/ui/BeautifulNotificationsProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProfilePreloadInitializer from "@/components/performance/ProfilePreloadInitializer";
import BanCheck from "@/components/auth/BanCheck";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import CookieConsentBanner from "@/components/layout/CookieConsentBanner";
import MetrikaSpaTracker from "@/components/analytics/MetrikaSpaTracker";
import YandexMetrikaCounter from "@/components/analytics/YandexMetrikaCounter";
import GlobalClickSpark from "@/components/ui/GlobalClickSpark";

const inter = Inter({ subsets: ["latin", "cyrillic"], preload: false });

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru"
).replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Копилка — платформа взаимной помощи",
    template: "%s | Копилка",
  },
  description:
    "Платформа для оказания взаимной помощи людям в трудной жизненной ситуации",
  keywords: [
    "копилка",
    "взаимопомощь",
    "благотворительность",
    "помощь",
    "платформа помощи",
  ],
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
    description:
      "Платформа для оказания взаимной помощи людям в трудной жизненной ситуации",
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
    description:
      "Платформа для оказания взаимной помощи людям в трудной жизненной ситуации",
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Копилка",
    description:
      "Платформа для оказания взаимной помощи людям в трудной жизненной ситуации",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: ["https://t.me/kkopilka", "https://kick.com/koponline"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Поддержка",
      email: "support@kopilka-online.ru",
    },
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Копилка",
    url: siteUrl,
    description:
      "Платформа для оказания взаимной помощи людям в трудной жизненной ситуации",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/stories?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="ru" suppressHydrationWarning className="dark">
      <head></head>
      <body className={inter.className} suppressHydrationWarning>
        <Script
          id="polyfill-findLast"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `if (typeof Array.prototype.findLast !== "function") { Array.prototype.findLast = function(predicate) { for (var i = this.length - 1; i >= 0; i--) { if (predicate(this[i], i, this)) return this[i]; } return undefined; }; }`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <YandexMetrikaCounter />
        <Suspense fallback={null}>
          <MetrikaSpaTracker />
        </Suspense>
        <BeautifulNotificationsProvider>
          <TooltipProvider delayDuration={300} skipDelayDuration={100}>
            <GlobalClickSpark />
            <ProfilePreloadInitializer />
            <BanCheck>
              <ProtectedLayout>{children}</ProtectedLayout>
            </BanCheck>
            <CookieConsentBanner />
          </TooltipProvider>
        </BeautifulNotificationsProvider>
      </body>
    </html>
  );
}
