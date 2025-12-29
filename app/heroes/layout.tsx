import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Герои",
  description: "Топ доноров платформы Копилка. Люди, которые помогают другим и делают мир лучше",
  keywords: ["герои", "доноры", "топ", "помощь", "благотворительность", "копилка"],
  alternates: {
    canonical: "/heroes",
  },
  openGraph: {
    title: "Герои | Копилка",
    description: "Топ доноров платформы Копилка. Люди, которые помогают другим и делают мир лучше",
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
    title: "Герои | Копилка",
    description: "Топ доноров платформы Копилка. Люди, которые помогают другим и делают мир лучше",
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

