import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Реклама",
  description: "Разместите рекламу на платформе Копилка. Достигните целевой аудитории и поддержите проект",
  keywords: ["реклама", "размещение", "маркетинг", "копилка"],
  alternates: {
    canonical: "/advertising",
  },
  openGraph: {
    title: "Реклама | Копилка",
    description: "Разместите рекламу на платформе Копилка. Достигните целевой аудитории и поддержите проект",
    url: "/advertising",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Реклама на Копилка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Реклама | Копилка",
    description: "Разместите рекламу на платформе Копилка. Достигните целевой аудитории и поддержите проект",
    images: ["/logo.png"],
  },
};

export default function AdvertisingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

