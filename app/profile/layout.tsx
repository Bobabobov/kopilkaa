import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Профиль",
  description:
    "Личный кабинет на платформе Копилка: доверие, друзья, истории и настройки профиля.",
  keywords: ["профиль", "личный кабинет", "копилка", "настройки"],
  alternates: {
    canonical: "/profile",
  },
  openGraph: {
    title: "Профиль | Копилка",
    description:
      "Личный кабинет на платформе Копилка: доверие, друзья, истории и настройки профиля.",
    url: "/profile",
    siteName: "Копилка",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Профиль Копилка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Профиль | Копилка",
    description:
      "Личный кабинет на платформе Копилка: доверие, друзья, истории и настройки профиля.",
    images: ["/logo.png"],
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
