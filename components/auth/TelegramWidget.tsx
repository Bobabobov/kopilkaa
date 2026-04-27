"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface TelegramWidgetProps {
  onAuth: (user: any) => Promise<void>;
  checkingAuth: boolean;
}

export function TelegramWidget({ onAuth, checkingAuth }: TelegramWidgetProps) {
  void onAuth;

  // Если Telegram Bot Username не задан, показываем заглушку
  if (!process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME) {
    return (
      <div className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#1f2937] to-[#374151] text-[#6b7280] flex items-center justify-center gap-2.5 border border-[#1f2937]/50 cursor-not-allowed">
        <LucideIcons.AlertCircle size="sm" />
        <span>Telegram авторизация недоступна</span>
      </div>
    );
  }

  const handleTelegramRedirectLogin = () => {
    if (checkingAuth) return;
    const next = encodeURIComponent(
      `${window.location.pathname}${window.location.search}`,
    );
    window.location.href = `/api/auth/telegram/start?next=${next}`;
  };

  return (
    <div className="w-full">
      <motion.button
        onClick={handleTelegramRedirectLogin}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm border border-white/20 text-[#fffffe] hover:border-[#f9bc60]/50 hover:text-[#f9bc60] flex items-center justify-center gap-2.5 transition-all relative z-10"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        <svg
          className="w-5 h-5 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.17 1.858-.896 6.37-1.264 8.445-.15.85-.444 1.133-.73 1.16-.62.055-1.09-.41-1.69-.803-.93-.64-1.456-1.04-2.36-1.666-1.045-.71-.368-1.1.228-1.777.157-.177 2.848-2.616 2.9-2.84.007-.03.014-.15-.056-.212-.07-.057-.173-.037-.248-.022-.106.023-1.79 1.14-5.06 3.345-.48.33-.914.49-1.302.48-.428-.01-1.25-.24-1.86-.44-.75-.24-1.35-.37-1.3-.78.026-.2.4-.405 1.1-.615 4.33-1.89 7.22-3.14 8.66-3.75 4.2-1.8 5.07-2.11 5.64-2.13.13-.01.41-.03.6.034.18.06.3.2.34.33.04.13.07.43.03.66z" />
        </svg>
        <span>Войти через Telegram</span>
      </motion.button>

      <p className="text-xs text-[#abd1c6]/80 mt-2 text-center">
        Откроется официальный Telegram Login с QR/подтверждением.
      </p>
    </div>
  );
}
