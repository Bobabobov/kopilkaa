import type { Metadata } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Отзывы участников",
  description:
    "Читайте честные отзывы участников платформы Копилка. Реальные истории тех, кто оформил заявку и получил одобрение",
  keywords: [
    "отзывы",
    "отзывы участников",
    "реальные отзывы",
    "копилка",
    "взаимопомощь",
  ],
  alternates: {
    canonical: "/reviews",
  },
  openGraph: {
    title: "Отзывы участников | Копилка",
    description:
      "Читайте честные отзывы участников платформы Копилка. Реальные истории тех, кто оформил заявку и получил одобрение",
    url: "/reviews",
    type: "website",
    images: [
      {
        url: "/stories-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Отзывы участников Копилка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Отзывы участников | Копилка",
    description:
      "Читайте честные отзывы участников платформы Копилка. Реальные истории тех, кто оформил заявку и получил одобрение",
    images: ["/stories-preview.jpg"],
  },
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
