import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: false,
});

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Монетка | Игры",
  description:
    "Собирай монеты за 30 секунд! Клик по монете — очки, клик мимо — минус жизнь. У тебя 3 жизни. Попади в топ недели.",
  keywords: ["монетка", "игра", "копилка", "топ недели"],
  alternates: {
    canonical: "/games/coin-catch",
  },
  openGraph: {
    title: "Монетка | Копилка",
    description:
      "Собирай монеты за 30 секунд. 3 жизни. Таблица лидеров недели.",
    url: `${siteUrl}/games/coin-catch`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/game.png`,
        width: 1200,
        height: 630,
        alt: "Монетка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Монетка | Копилка",
    description: "Собирай монеты за 30 секунд. 3 жизни. Топ недели.",
    images: [`${siteUrl}/game.png`],
  },
  robots: "index, follow",
};

export default function CoinCatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={pressStart2P.className}>{children}</div>;
}
