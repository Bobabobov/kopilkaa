import type { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://kopilka-online.ru/").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Поддержать проект",
  description: "Поддержите платформу Копилка. Ваша помощь позволяет нам помогать людям в трудной жизненной ситуации",
  keywords: ["поддержка", "донат", "пожертвование", "помощь проекту", "копилка"],
  alternates: {
    canonical: "/support",
  },
  openGraph: {
    title: "Поддержать проект | Копилка",
    description: "Поддержите платформу Копилка. Ваша помощь позволяет нам помогать людям в трудной жизненной ситуации",
    url: "/support",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Поддержать Копилка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Поддержать проект | Копилка",
    description: "Поддержите платформу Копилка. Ваша помощь позволяет нам помогать людям в трудной жизненной ситуации",
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

