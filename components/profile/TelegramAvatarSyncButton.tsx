"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";

interface TelegramAvatarSyncButtonProps {
  disabled?: boolean;
  onSynced: (avatarUrl: string) => void;
  onError: (message: string) => void;
}

export function TelegramAvatarSyncButton({
  disabled = false,
  onSynced,
  onError,
}: TelegramAvatarSyncButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleTelegramUser = useCallback(
    async (tgUser: { photo_url?: string }) => {
      try {
        setBusy(true);
        const r = await fetch("/api/profile/avatar/sync-telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ photoUrl: tgUser.photo_url || null }),
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok || !data?.ok) {
          onError(
            getMessageFromApiJson(data, "Не удалось обновить аватар из Telegram"),
          );
          return;
        }
        if (typeof data.avatar === "string") {
          onSynced(data.avatar);
        }
        setOpen(false);
      } catch (error) {
        onError(
          error instanceof Error ? error.message : "Ошибка сети при синхронизации",
        );
      } finally {
        setBusy(false);
      }
    },
    [onError, onSynced],
  );

  useEffect(() => {
    if (!open) return;

    (window as Window & { onTelegramAvatarSync?: (user: unknown) => void })
      .onTelegramAvatarSync = (user: unknown) => {
      void handleTelegramUser((user || {}) as { photo_url?: string });
    };

    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.replace(
      /^@/,
      "",
    );
    if (!botUsername || !containerRef.current) {
      onError("Синхронизация через Telegram недоступна");
      setOpen(false);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "medium");
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-lang", "ru");
    script.setAttribute("data-request-access", "write");
    script.setAttribute(
      "data-onauth",
      "onTelegramAvatarSync(user)",
    );

    const container = containerRef.current;
    container.innerHTML = "";
    container.appendChild(script);

    return () => {
      delete (window as Window & { onTelegramAvatarSync?: unknown })
        .onTelegramAvatarSync;
      if (container) container.innerHTML = "";
    };
  }, [open, handleTelegramUser, onError]);

  if (!process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => setOpen((v) => !v)}
        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 text-[#fffffe] font-semibold border border-white/10 transition-colors text-sm"
      >
        {busy ? "Обновляем…" : "Из Telegram"}
      </button>
      {open && (
        <div
          ref={containerRef}
          className="flex min-h-[40px] items-center justify-start rounded-xl border border-white/10 bg-[#001e1d]/40 px-3 py-2"
        />
      )}
    </div>
  );
}
