// components/profile/OtherUserLoadingStates.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { buildAuthModalUrl } from "@/lib/authModalUrl";

interface OtherUserLoadingStatesProps {
  state: "checking" | "unauthorized" | "loading" | "not-found";
}

export default function OtherUserLoadingStates({
  state,
}: OtherUserLoadingStatesProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const loginHref = buildAuthModalUrl({ pathname, search, modal: "auth" });
  const signupHref = buildAuthModalUrl({
    pathname,
    search,
    modal: "auth/signup",
  });

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
              href: loginHref,
              text: "Войти в аккаунт",
              variant: "primary",
            },
            {
              href: signupHref,
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
  const isBusy =
    state === "checking" || state === "loading";

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      aria-label="Профиль пользователя"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        role="status"
        aria-live="polite"
        aria-busy={isBusy}
        className="relative w-full max-w-xl text-center bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] rounded-3xl px-8 py-10 shadow-2xl border border-[#abd1c6]/20"
      >
        <span className="sr-only">
          {state === "checking" && "Проверка авторизации"}
          {state === "loading" && "Загрузка профиля"}
          {state === "unauthorized" && "Требуется вход в аккаунт"}
          {state === "not-found" && "Пользователь не найден"}
        </span>
        <div className="text-6xl mb-4" aria-hidden="true">
          {content.icon}
        </div>
        <h1
          id="other-profile-state-title"
          className="text-2xl md:text-3xl font-semibold text-[#fffffe] mb-4"
        >
          {content.title}
        </h1>
        {content.description && (
          <p
            className="text-[#abd1c6] mb-8 text-base md:text-lg"
            role={
              state === "unauthorized" || state === "not-found"
                ? "alert"
                : undefined
            }
          >
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
    </main>
  );
}
