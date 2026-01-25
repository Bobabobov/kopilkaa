"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function ActionButtons() {
  return (
    <motion.section
      id="actions"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="text-center space-y-4"
    >
      {/* Кнопка возврата на /advertising */}
      <div className="flex justify-center px-4 mb-6">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/advertising"
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl transition-all hover:shadow-lg text-sm sm:text-base font-medium"
            style={{
              borderColor: "rgba(171, 209, 198, 0.4)",
              color: "#abd1c6",
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Назад к рекламе</span>
          </Link>
        </motion.div>
      </div>

      {/* Основные кнопки действий */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
        <motion.a
          href="/advertising"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#abd1c6] text-[#001e1d] font-bold rounded-lg sm:rounded-xl hover:bg-[#d0e3dd] transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          <span className="text-lg sm:text-xl">📝</span>
          <span className="whitespace-nowrap">Оставить заявку на сайте</span>
        </motion.a>
        <motion.a
          href="https://t.me/kopilka_advertising_bot"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#0088cc] to-[#0077b5] text-white font-bold rounded-lg sm:rounded-xl transition-all shadow-lg shadow-[#0088cc]/30 hover:shadow-[#0088cc]/50 text-sm sm:text-base"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
          </svg>
          <span className="whitespace-nowrap">Открыть бота в Telegram</span>
        </motion.a>
      </div>
    </motion.section>
  );
}
