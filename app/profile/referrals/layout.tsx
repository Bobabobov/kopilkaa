import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Реферальная программа",
  description:
    "Статистика приглашений и бонусы реферальной программы в личном кабинете Копилка.",
  keywords: ["рефералы", "приглашения", "бонусы", "копилка", "профиль"],
  alternates: {
    canonical: "/profile/referrals",
  },
  openGraph: {
    title: "Реферальная программа | Копилка",
    description:
      "Статистика приглашений и бонусы реферальной программы в личном кабинете Копилка.",
    url: "/profile/referrals",
    siteName: "Копилка",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Реферальная программа Копилка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Реферальная программа | Копилка",
    description:
      "Статистика приглашений и бонусы реферальной программы в личном кабинете Копилка.",
    images: ["/logo.png"],
  },
};

export default function ProfileReferralsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
