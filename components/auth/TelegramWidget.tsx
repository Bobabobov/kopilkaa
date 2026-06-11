"use client";

import { useEffect, useRef, useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface TelegramWidgetProps {
  onAuth: (user: unknown) => Promise<void>;
  checkingAuth: boolean;
}

const TELEGRAM_NETWORK_HINT =
  "Не загружается? Попробуйте сменить регион сети или войдите по почте.";

function TelegramNetworkHint({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border border-[#f9bc60]/35 bg-[#f9bc60]/10 px-3.5 py-3 ${className}`}
      role="note"
    >
      <LucideIcons.Info
        size="sm"
        className="mt-0.5 flex-shrink-0 text-[#f9bc60]"
      />
      <p className="text-xs sm:text-sm text-[#fffffe] leading-snug font-medium">
        {TELEGRAM_NETWORK_HINT}
      </p>
    </div>
  );
}

/**
 * Telegram Login Widget (legacy).
 * @see https://core.telegram.org/widgets/login-legacy
 * data-onauth → колбэк с полным объектом (включая photo_url) → POST /api/auth/telegram
 */
export function TelegramWidget({ onAuth, checkingAuth }: TelegramWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (window as Window & { onTelegramAuth?: (user: unknown) => void }).onTelegramAuth =
      (user: unknown) => {
        void onAuth(user);
      };

    return () => {
      delete (window as Window & { onTelegramAuth?: unknown }).onTelegramAuth;
    };
  }, [onAuth]);

  useEffect(() => {
    if (checkingAuth) return;

    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
    if (!botUsername) {
      setError("Telegram авторизация недоступна");
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const cleanBotUsername = botUsername.replace(/^@/, "");
    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", cleanBotUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-lang", "ru");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    script.onerror = () => {
      setError(
        "Не удалось загрузить Telegram. Смените регион сети или войдите через Google или по почте.",
      );
      if (timeoutId) clearTimeout(timeoutId);
    };

    script.onload = () => {
      setError(null);
      if (timeoutId) clearTimeout(timeoutId);
    };

    timeoutId = setTimeout(() => {
      if (!container.querySelector("iframe")) {
        setError(
          "Таймаут загрузки Telegram. Смените регион сети или войдите через Google или по почте.",
        );
      }
    }, 12_000);

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [checkingAuth]);

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
      {error ? (
        <div className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#1f2937] to-[#374151] text-[#abd1c6] flex items-center justify-center gap-2.5 border border-[#1f2937]/50 text-center">
          <LucideIcons.AlertCircle size="sm" className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex min-h-[44px] w-full items-center justify-center"
        />
      )}
      <TelegramNetworkHint className="mt-3" />
    </div>
  );
}
