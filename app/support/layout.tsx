import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Поддержать проект",
  description:
    "Поддержать платформу Копилка. Донаты на развитие проекта и фонд гонораров для авторов.",
  keywords: [
    "поддержка проекта",
    "донат",
    "копилка",
    "фонд гонораров",
  ],
  alternates: {
    canonical: "/support",
  },
  openGraph: {
    title: "Поддержать проект | Копилка",
    description:
      "Поддержать платформу Копилка. Донаты на развитие проекта и фонд гонораров для авторов.",
    url: "/support",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Поддержка проекта Копилка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Поддержать проект | Копилка",
    description:
      "Поддержать платформу Копилка. Донаты на развитие проекта и фонд гонораров для авторов.",
    images: ["/logo.png"],
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
