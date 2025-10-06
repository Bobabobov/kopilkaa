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
              href: "/login",
              text: "Войти в аккаунт",
              variant: "primary",
            },
            {
              href: "/register",
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
          icon: "👤",
          title: "Пользователь не найден",
          description: "Пользователь с таким ID не существует",
          button: {
            href: "#",
            text: "Вернуться к поиску",
            onClick: () => {
              // Открываем модальное окно друзей с вкладкой поиска
              const event = new CustomEvent("open-friends-modal", {
                detail: { tab: "search" },
              });
              window.dispatchEvent(event);
            },
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
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-gray-700/20"
      >
        <div className="text-6xl mb-4">{content.icon}</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {content.title}
        </h1>
        {content.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            {content.description}
          </p>
        )}
        {content.button &&
          (content.button.onClick ? (
            <button
              onClick={content.button.onClick}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {content.button.text}
            </button>
          ) : (
            <Link
              href={content.button.href as any}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
                className={`inline-flex items-center px-6 py-3 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                  button.variant === "primary"
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
                    : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
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
