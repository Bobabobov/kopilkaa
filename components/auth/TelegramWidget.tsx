"use client";

import { useEffect, useRef } from "react";

interface TelegramWidgetProps {
  onAuth: (user: any) => Promise<void>;
  checkingAuth: boolean;
}

export function TelegramWidget({ onAuth, checkingAuth }: TelegramWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (checkingAuth) return;

    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
    if (!botUsername) {
      console.warn(
        "NEXT_PUBLIC_TELEGRAM_BOT_USERNAME не задан — виджет Telegram не будет отображён",
      );
      return;
    }

    if (!containerRef.current) {
      console.warn("Контейнер для Telegram-виджета не найден");
      return;
    }

    (window as any).onTelegramAuth = async (user: any) => {
      await onAuth(user);
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-lang", "ru");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");

    script.onerror = () => {
      console.error("Не удалось загрузить Telegram Login Widget");
    };

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [checkingAuth, onAuth]);

  return (
    <div
      ref={containerRef}
      className="flex justify-center min-h-[44px] relative"
    />
  );
}

