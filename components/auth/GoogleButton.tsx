"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface GoogleButtonProps {
  onAuth: (data: any) => Promise<void>;
  checkingAuth: boolean;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

export function GoogleButton({ onAuth, checkingAuth }: GoogleButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (checkingAuth || initializedRef.current) return;
    setLoading(true);
    setError(null);

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn(
        "NEXT_PUBLIC_GOOGLE_CLIENT_ID не задан — кнопка Google не будет отображена",
      );
      setLoading(false);
      return;
    }

    // Проверяем, загружен ли Google уже
    if (window.google?.accounts?.id) {
      // Google уже загружен, инициализируем сразу
      initializeGoogle(clientId);
    } else {
      // Ждем загрузки скрипта (он загружается через Script компонент)
      let timeoutId: NodeJS.Timeout | null = null;
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          if (timeoutId) clearTimeout(timeoutId);
          clearInterval(checkInterval);
          initializeGoogle(clientId);
        }
      }, 100);

      // Таймаут на 10 секунд
      timeoutId = setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.google?.accounts?.id) {
          setError(
            "Таймаут загрузки Google Identity Services. Возможно, блокировщик рекламы или настройки приватности браузера блокируют загрузку. Попробуйте войти через Telegram или по почте.",
          );
          setLoading(false);
        }
      }, 10000);
    }

    function initializeGoogle(clientId: string) {
      if (!window.google?.accounts?.id) {
        console.error("Google Identity Services не загружен");
        setError("Google Identity Services не загружен");
        setLoading(false);
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            if (!response.credential) {
              console.error("Google не вернул credential");
              return;
            }

            // Отправляем credential на сервер, где он будет правильно декодирован
            await onAuth({
              credential: response.credential,
            });
          },
          // Отключаем автоматический One Tap, используем только кнопку
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Не рендерим стандартную кнопку, используем кастомную

        initializedRef.current = true;
        setLoading(false);
        setIsReady(true);
      } catch (error) {
        console.error("Ошибка инициализации Google:", error);
        setError("Ошибка инициализации Google");
        setLoading(false);
      }
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      initializedRef.current = false;
      // Очистка таймаута будет выполнена в самом useEffect
    };
  }, [checkingAuth, onAuth]);

  // Если Google Client ID не задан, показываем заглушку с сообщением
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return (
      <div className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#1f2937] to-[#374151] text-[#6b7280] flex items-center justify-center gap-2.5 border border-[#1f2937]/50 cursor-not-allowed">
        <LucideIcons.AlertCircle size="sm" />
        <span>Google авторизация недоступна</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Загружаем скрипт Google через next/script для правильной обработки CORS */}
      {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="lazyOnload"
          onError={() => {
            setError(
              "Не удалось загрузить Google Identity Services. Возможно, блокировщик рекламы или настройки приватности браузера блокируют загрузку. Попробуйте войти через Telegram или по почте.",
            );
            setLoading(false);
          }}
          onLoad={() => {
            // Даем время на инициализацию
            setTimeout(() => {
              if (!window.google?.accounts?.id && !error) {
                setError(
                  "Google Identity Services не инициализирован. Попробуйте войти через Telegram или по почте.",
                );
                setLoading(false);
              }
            }, 2000);
          }}
        />
      )}

      {loading && !error && (
        <div className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#1f2937] to-[#374151] text-[#abd1c6] flex items-center justify-center gap-2.5 border border-[#1f2937]/50">
          <div className="w-4 h-4 border-2 border-[#abd1c6] border-t-transparent rounded-full animate-spin" />
          <span>Загрузка Google...</span>
        </div>
      )}
      {error && (
        <div className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#1f2937] to-[#374151] text-[#6b7280] flex items-center justify-center gap-2.5 border border-[#1f2937]/50">
          <LucideIcons.AlertCircle size="sm" />
          <span>{error}</span>
        </div>
      )}

      {/* Кастомная красивая кнопка Google в стиле других кнопок */}
      {!loading && !error && isReady && (
        <motion.button
          onClick={() => {
            // Создаем временную кнопку Google и кликаем по ней
            if (window.google?.accounts?.id && containerRef.current) {
              // Очищаем контейнер
              containerRef.current.innerHTML = "";

              // Рендерим стандартную кнопку Google
              // Получаем ширину контейнера для правильной ширины кнопки
              const containerWidth = containerRef.current.offsetWidth || 300;
              window.google.accounts.id.renderButton(containerRef.current, {
                type: "standard",
                theme: "outline",
                size: "large",
                text: "signin_with",
                shape: "rectangular",
                logo_alignment: "left",
                width: containerWidth,
              });

              // Кликаем по кнопке программно
              setTimeout(() => {
                const button = containerRef.current?.querySelector(
                  'div[role="button"]',
                ) as HTMLElement;
                if (button) {
                  button.click();
                }
              }, 50);
            }
          }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#1f2937] to-[#374151] hover:from-[#374151] hover:to-[#4b5563] text-[#abd1c6] flex items-center justify-center gap-2.5 transition-all shadow-lg border border-[#1f2937]/50 relative z-10 group"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#f9bc60]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {/* Google логотип */}
          <svg
            className="w-5 h-5 relative z-10 flex-shrink-0"
            viewBox="0 0 24 24"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="relative z-10">Войти через Google</span>
        </motion.button>
      )}

      {/* Скрытый контейнер для Google Identity Services (для программного клика) */}
      <div ref={containerRef} className="hidden" />
    </div>
  );
}
