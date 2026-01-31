import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Стандарты рекламы",
  description:
    "Стандарты размещения рекламы на платформе Копилка. Форматы, требования и технические спецификации.",
};

export default function StandardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
