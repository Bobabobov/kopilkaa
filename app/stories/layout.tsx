import type { Metadata } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Истории",
  description:
    "Читайте реальные истории людей, которые получили помощь на платформе Копилка. Вдохновляйтесь и помогайте другим",
  keywords: [
    "истории",
    "помощь",
    "реальные истории",
    "благотворительность",
    "копилка",
  ],
  alternates: {
    canonical: "/stories",
  },
  openGraph: {
    title: "Истории | Копилка",
    description:
      "Читайте реальные истории людей, которые получили помощь на платформе Копилка. Вдохновляйтесь и помогайте другим",
    url: "/stories",
    type: "website",
    images: [
      {
        url: "/stories-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Истории на Копилка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Истории | Копилка",
    description:
      "Читайте реальные истории людей, которые получили помощь на платформе Копилка. Вдохновляйтесь и помогайте другим",
    images: ["/stories-preview.jpg"],
  },
};

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
