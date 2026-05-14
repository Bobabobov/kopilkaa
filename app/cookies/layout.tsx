import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Использование файлов cookie",
  description:
    "Объяснение, как платформа Копилка использует файлы cookie и как ими управлять в браузере.",
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
