"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface TelegramWidgetProps {
  onAuth: (user: any) => Promise<void>;
  checkingAuth: boolean;
}

export function TelegramWidget({ onAuth, checkingAuth }: TelegramWidgetProps) {
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWidget, setShowWidget] = useState(false);

  // Устанавливаем глобальный callback один раз
  useEffect(() => {
    (window as any).onTelegramAuth = async (user: any) => {
      await onAuth(user);
    };

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, [onAuth]);

  // Загружаем виджет когда модалка открыта
  useEffect(() => {
    if (!showWidget || checkingAuth) return;

    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
    if (!botUsername) {
      console.warn(
        "NEXT_PUBLIC_TELEGRAM_BOT_USERNAME не задан — виджет Telegram не будет отображён",
      );
      setError("Telegram авторизация недоступна");
      return;
    }

    // Убираем @ из username, если он есть (Telegram Widget требует username без @)
    const cleanBotUsername = botUsername.replace(/^@/, "");

    if (!modalContainerRef.current) {
      console.warn("Контейнер для Telegram-виджета не найден");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", cleanBotUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-lang", "ru");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");

    // Добавляем таймаут для случая, когда скрипт не загружается
    let timeoutId: NodeJS.Timeout | null = null;

    script.onerror = () => {
      console.error("Не удалось загрузить Telegram Login Widget");
      setError(
        "Не удалось загрузить Telegram. Возможно, блокировщик рекламы или настройки приватности браузера блокируют загрузку. Попробуйте войти через Google или по почте.",
      );
      setIsReady(false);
      if (timeoutId) clearTimeout(timeoutId);
    };

    script.onload = () => {
      setIsReady(true);
      if (timeoutId) clearTimeout(timeoutId);
    };

    // Устанавливаем таймаут
    timeoutId = setTimeout(() => {
      if (!isReady) {
        console.error("Таймаут загрузки Telegram Login Widget");
        setError(
          "Таймаут загрузки Telegram. Попробуйте войти через Google или по почте.",
        );
      }
    }, 10000);

    // Загружаем виджет напрямую в модальный контейнер
    const targetContainer = modalContainerRef.current;
    if (targetContainer) {
      targetContainer.innerHTML = "";
      targetContainer.appendChild(script);
    }

    return () => {
      if (modalContainerRef.current) {
        modalContainerRef.current.innerHTML = "";
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showWidget, checkingAuth]);

  // Если Telegram Bot Username не задан, показываем заглушку
  if (!process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME) {
    return (
      <div className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#1f2937] to-[#374151] text-[#6b7280] flex items-center justify-center gap-2.5 border border-[#1f2937]/50 cursor-not-allowed">
        <LucideIcons.AlertCircle size="sm" />
        <span>Telegram авторизация недоступна</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#1f2937] to-[#374151] text-[#6b7280] flex items-center justify-center gap-2.5 border border-[#1f2937]/50">
          <LucideIcons.AlertCircle size="sm" />
          <span>{error}</span>
        </div>
      )}

      {/* Кастомная красивая кнопка Telegram в стиле других кнопок */}
      {!error && (
        <>
          {/* Кастомная кнопка */}
          <motion.button
            onClick={() => setShowWidget(true)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#1f2937] to-[#374151] hover:from-[#374151] hover:to-[#4b5563] text-[#abd1c6] flex items-center justify-center gap-2.5 transition-all shadow-lg border border-[#1f2937]/50 relative z-10 group"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#f9bc60]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {/* Telegram логотип */}
            <svg
              className="w-5 h-5 relative z-10 flex-shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.17 1.858-.896 6.37-1.264 8.445-.15.85-.444 1.133-.73 1.16-.62.055-1.09-.41-1.69-.803-.93-.64-1.456-1.04-2.36-1.666-1.045-.71-.368-1.1.228-1.777.157-.177 2.848-2.616 2.9-2.84.007-.03.014-.15-.056-.212-.07-.057-.173-.037-.248-.022-.106.023-1.79 1.14-5.06 3.345-.48.33-.914.49-1.302.48-.428-.01-1.25-.24-1.86-.44-.75-.24-1.35-.37-1.3-.78.026-.2.4-.405 1.1-.615 4.33-1.89 7.22-3.14 8.66-3.75 4.2-1.8 5.07-2.11 5.64-2.13.13-.01.41-.03.6.034.18.06.3.2.34.33.04.13.07.43.03.66z" />
            </svg>
            <span className="relative z-10">Войти через Telegram</span>
          </motion.button>

          {/* Модальное окно с Telegram виджетом */}
          {showWidget && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowWidget(false)}
            >
              <div
                className="bg-[#0f1f1c] rounded-2xl p-6 max-w-md w-full border border-[#1d8a78]/45 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#fffffe]">
                    Вход через Telegram
                  </h3>
                  <button
                    onClick={() => setShowWidget(false)}
                    className="text-[#abd1c6] hover:text-[#fffffe] transition-colors"
                  >
                    <LucideIcons.X size="sm" />
                  </button>
                </div>
                {/* Контейнер для виджета в модальном окне */}
                <div
                  ref={modalContainerRef}
                  className="flex justify-center min-h-[44px]"
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
