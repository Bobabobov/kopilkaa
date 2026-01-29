import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Игры",
  description:
    "Игровой раздел платформы Копилка. Развлекайтесь и получайте достижения",
  keywords: ["игры", "развлечения", "достижения", "копилка"],
  alternates: {
    canonical: "/games",
  },
  openGraph: {
    title: "Игры | Копилка",
    description:
      "Игровой раздел платформы Копилка. Развлекайтесь и получайте достижения",
    url: "/games",
    type: "website",
    images: [
      {
        url: "/game.png",
        width: 1200,
        height: 630,
        alt: "Игры на Копилка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Игры | Копилка",
    description:
      "Игровой раздел платформы Копилка. Развлекайтесь и получайте достижения",
    images: ["/game.png"],
  },
};

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={pressStart2P.className}>{children}</div>;
}
