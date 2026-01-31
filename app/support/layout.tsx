import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Поддержать проект",
  description:
    "Поддержать платформу Копилка. Донаты на развитие проекта и помощь участникам.",
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
