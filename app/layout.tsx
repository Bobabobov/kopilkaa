import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopBanner from "@/components/layout/TopBanner";
import { BeautifulNotificationsProvider } from "@/components/ui/BeautifulNotificationsProvider";
import ProfilePreloadInitializer from "@/components/performance/ProfilePreloadInitializer";
import BanCheck from "@/components/auth/BanCheck";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import MetrikaSpaTracker from "@/components/analytics/MetrikaSpaTracker";
import GlobalClickSpark from "@/components/ui/GlobalClickSpark";

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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Копилка",
    description: "Платформа для оказания взаимной помощи людям в трудной жизненной ситуации",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      "https://t.me/kkopilka",
      "https://kick.com/koponline",
    ],
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
    description: "Платформа для оказания взаимной помощи людям в трудной жизненной ситуации",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(m,e,t,r,i,k,a){
     m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
     m[i].l=1*new Date();
     for (var j = 0; j < document.scripts.length; j++) {
       if (document.scripts[j].src === r) { return; }
     }
     k=e.createElement(t),a=e.getElementsByTagName(t)[0],
     k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
   })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=106107046', 'ym');

   ym(106107046, 'init', {
     ssr:true,
     webvisor:true,
     clickmap:true,
     ecommerce:"dataLayer",
     accurateTrackBounce:true,
     trackLinks:true
   });`,
          }}
        />
        <Suspense fallback={null}>
          <MetrikaSpaTracker />
        </Suspense>
        <BeautifulNotificationsProvider>
          <GlobalClickSpark />
          <ProfilePreloadInitializer />
          <BanCheck>
            <ProtectedLayout>{children}</ProtectedLayout>
          </BanCheck>
        </BeautifulNotificationsProvider>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/106107046"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
