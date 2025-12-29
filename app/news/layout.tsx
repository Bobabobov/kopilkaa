import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Новости проекта",
  description: "Обновления, фичи, важные объявления и изменения на платформе Копилка",
  keywords: ["новости", "обновления", "фичи", "анонсы", "копилка"],
  alternates: {
    canonical: "/news",
  },
  openGraph: {
    title: "Новости проекта | Копилка",
    description: "Обновления, фичи, важные объявления и изменения на платформе Копилка",
    url: "/news",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Новости проекта Копилка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Новости проекта | Копилка",
    description: "Обновления, фичи, важные объявления и изменения на платформе Копилка",
    images: ["/logo.png"],
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

