import type { Metadata } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Монеткосбор 90-х | Игры",
  description:
    "Собирай монеты за 30 секунд! Клик по монете — очки, клик мимо — минус жизнь. У тебя 3 жизни. Попади в топ недели.",
  keywords: ["монеткосбор", "игра", "копилка", "топ недели", "90-х"],
  alternates: {
    canonical: "/games/coin-catch",
  },
  openGraph: {
    title: "Монеткосбор 90-х | Копилка",
    description:
      "Собирай монеты за 30 секунд. 3 жизни. Таблица лидеров недели.",
    url: `${siteUrl}/games/coin-catch`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/game.png`,
        width: 1200,
        height: 630,
        alt: "Монеткосбор 90-х",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Монеткосбор 90-х | Копилка",
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
  return children;
}
