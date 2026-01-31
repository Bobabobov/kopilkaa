import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Пользовательское соглашение",
  description:
    "Пользовательское соглашение платформы Копилка. Условия использования сервиса взаимной помощи.",
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
