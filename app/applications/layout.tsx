import type { Metadata } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka.ru"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Подать заявку",
  description:
    "Подайте заявку на получение помощи на платформе Копилка. Расскажите свою историю и получите поддержку от сообщества",
  keywords: ["заявка", "помощь", "поддержка", "пожертвование", "копилка"],
  alternates: {
    canonical: "/applications",
  },
  openGraph: {
    title: "Подать заявку | Копилка",
    description:
      "Подайте заявку на получение помощи на платформе Копилка. Расскажите свою историю и получите поддержку от сообщества",
    url: "/applications",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Подать заявку на Копилка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Подать заявку | Копилка",
    description:
      "Подайте заявку на получение помощи на платформе Копилка. Расскажите свою историю и получите поддержку от сообщества",
    images: ["/logo.png"],
  },
};

export default function ApplicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
