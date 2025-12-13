"use client";

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    if (checkingAuth || initializedRef.current) return;

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

    // Загружаем Google Identity Services скрипт
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (!window.google?.accounts?.id) {
        console.error("Google Identity Services не загружен");
        return;
      }

      if (!containerRef.current) return;

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            if (!response.credential) {
              console.error("Google не вернул credential");
              return;
            }

            // Декодируем JWT токен (базовая декодировка без проверки подписи на клиенте)
            try {
              const payload = JSON.parse(
                atob(response.credential.split(".")[1])
              );

              await onAuth({
                credential: response.credential,
                email: payload.email,
                name: payload.name || null,
                picture: payload.picture || null,
                sub: payload.sub,
              });
            } catch (error) {
              console.error("Ошибка декодирования Google токена:", error);
            }
          },
        });

        // Рендерим кнопку
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: "100%",
        });

        initializedRef.current = true;
      } catch (error) {
        console.error("Ошибка инициализации Google:", error);
      }
    };

    script.onerror = () => {
      console.error("Не удалось загрузить Google Identity Services");
    };

    document.head.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      initializedRef.current = false;
    };
  }, [checkingAuth, onAuth]);

  // Если Google Client ID не задан, показываем заглушку
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="flex justify-center min-h-[44px] relative w-full"
    />
  );
}

