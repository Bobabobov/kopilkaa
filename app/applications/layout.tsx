import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Опубликовать историю",
  description:
    "Опубликуйте историю на платформе Копилка и получите гонорар за лучшие материалы. Расскажите свою историю — редакция рассмотрит публикацию",
  keywords: ["история", "гонорар", "грант", "публикация", "копилка"],
  alternates: {
    canonical: "/applications",
  },
  openGraph: {
    title: "Опубликовать историю | Копилка",
    description:
      "Опубликуйте историю на платформе Копилка и получите гонорар за лучшие материалы. Расскажите свою историю — редакция рассмотрит публикацию",
    url: "/applications",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Опубликовать историю на Копилка",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Опубликовать историю | Копилка",
    description:
      "Опубликуйте историю на платформе Копилка и получите гонорар за лучшие материалы. Расскажите свою историю — редакция рассмотрит публикацию",
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
