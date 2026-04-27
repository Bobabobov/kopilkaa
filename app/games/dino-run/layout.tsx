import type { Metadata } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Dino Run | Игры",
  description:
    "Мини-игра в стиле динозавра: прыгай через препятствия, набирай очки и бей личный рекорд.",
  keywords: ["dino run", "игры", "копилка", "мини-игра"],
  alternates: {
    canonical: "/games/dino-run",
  },
  openGraph: {
    title: "Dino Run | Копилка",
    description:
      "Прыгайте через препятствия и попробуйте побить свой рекорд в Dino Run.",
    url: `${siteUrl}/games/dino-run`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/game.png`,
        width: 1200,
        height: 630,
        alt: "Dino Run",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dino Run | Копилка",
    description: "Прыгайте через препятствия и набирайте очки.",
    images: [`${siteUrl}/game.png`],
  },
  robots: "index, follow",
};

export default function DinoRunLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
