"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
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

  useEffect(() => {
    if (checkingAuth || initializedRef.current) return;
    setLoading(true);
    setError(null);

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn(
        "NEXT_PUBLIC_GOOGLE_CLIENT_ID не задан — кнопка Google не будет отображена",
      );
      return;
    }

    if (!containerRef.current) {
      console.warn("Контейнер для Google-кнопки не найден");
      return;
    }

    // Проверяем, загружен ли Google уже
    if (window.google?.accounts?.id) {
      // Google уже загружен, инициализируем сразу
      initializeGoogle(clientId);
    } else {
      // Ждем загрузки скрипта (он загружается через Script компонент)
      const checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkInterval);
          initializeGoogle(clientId);
        }
      }, 100);
      
      // Таймаут на 10 секунд
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.google?.accounts?.id) {
          setError("Таймаут загрузки Google Identity Services");
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

      if (!containerRef.current) {
        setError("Контейнер для кнопки не найден");
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
        });

        // Рендерим кнопку
        window.google.accounts.id.renderButton(containerRef.current!, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: "100%",
        });

        initializedRef.current = true;
        setLoading(false);
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
            setError("Не удалось загрузить Google Identity Services");
            setLoading(false);
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
      <div
        ref={containerRef}
        className="flex justify-center min-h-[44px] relative w-full"
      />
    </div>
  );
}

