// components/profile/OtherUserLoadingStates.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface OtherUserLoadingStatesProps {
  state: "checking" | "unauthorized" | "loading" | "not-found";
}

export default function OtherUserLoadingStates({
  state,
}: OtherUserLoadingStatesProps) {
  const getContent = () => {
    switch (state) {
      case "checking":
        return {
          icon: "⏳",
          title: "Проверка авторизации...",
          description: "",
          button: null,
        };
      case "unauthorized":
        return {
          icon: "🔒",
          title: "Доступ ограничен",
          description:
            "Войдите в аккаунт или зарегистрируйтесь, чтобы просмотреть профили",
          buttons: [
            {
              href: "/?modal=auth",
              text: "Войти в аккаунт",
              variant: "primary",
            },
            {
              href: "/?modal=auth/signup",
              text: "Зарегистрироваться",
              variant: "secondary",
            },
          ],
        };
      case "loading":
        return {
          icon: "⏳",
          title: "Загрузка профиля...",
          description: "",
          button: null,
        };
      case "not-found":
        return {
          icon: "🚫",
          title: "Пользователь удалён",
          description: "Этот аккаунт был удалён из системы",
          button: {
            href: "/friends?tab=search",
            text: "Вернуться к поиску",
            onClick: undefined,
          },
        };
      default:
        return {
          icon: "❓",
          title: "Неизвестная ошибка",
          description: "",
          button: null,
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-xl text-center bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] rounded-3xl px-8 py-10 shadow-2xl border border-[#abd1c6]/20"
      >
        <div className="text-6xl mb-4">{content.icon}</div>
        <h1 className="text-2xl md:text-3xl font-semibold text-[#fffffe] mb-4">
          {content.title}
        </h1>
        {content.description && (
          <p className="text-[#abd1c6] mb-8 text-base md:text-lg">
            {content.description}
          </p>
        )}
        {content.button &&
          (content.button.onClick ? (
            <button
              onClick={content.button.onClick}
              className="inline-flex items-center justify-center px-8 py-4 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/40 focus:ring-offset-2 focus:ring-offset-[#004643]"
            >
              {content.button.text}
            </button>
          ) : (
            <Link
              href={content.button.href as any}
              className="inline-flex items-center justify-center px-8 py-4 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/40 focus:ring-offset-2 focus:ring-offset-[#004643]"
            >
              {content.button.text}
            </Link>
          ))}
        {content.buttons && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {content.buttons.map((button, index) => (
              <Link
                key={button.text || `button-${index}`}
                href={button.href as any}
                className={`inline-flex items-center justify-center px-6 py-3 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/40 focus:ring-offset-2 focus:ring-offset-[#004643] ${
                  button.variant === "primary"
                    ? "bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] shadow-lg hover:shadow-xl"
                    : "bg-[#001e1d]/40 hover:bg-[#001e1d]/60 text-[#fffffe] border border-[#abd1c6]/30"
                }`}
              >
                {button.text}
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
