import type { Metadata } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Герои проекта",
  description:
    "Раздел с публичными профилями пользователей, оплативших цифровую услугу размещения в «Героях проекта».",
  keywords: ["герои проекта", "размещение профиля", "топ", "оплата", "копилка"],
  alternates: {
    canonical: "/heroes",
  },
  openGraph: {
    title: "Герои проекта | Копилка",
    description:
      "Раздел с публичными профилями пользователей, оплативших цифровую услугу размещения в «Героях проекта».",
    url: "/heroes",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Герои Копилка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Герои проекта | Копилка",
    description:
      "Раздел с публичными профилями пользователей, оплативших цифровую услугу размещения в «Героях проекта».",
    images: ["/logo.png"],
  },
};

export default function HeroesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
