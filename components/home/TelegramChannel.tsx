"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TelegramChannel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="max-w-xl mx-auto"
    >
      <Link
        href="https://t.me/kkopilka"
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div
          className="relative overflow-hidden rounded-2xl border transition-all duration-300 hover:border-[#0088cc]/50"
          style={{
            backgroundColor: "rgba(0, 30, 29, 0.6)",
            borderColor: "rgba(171, 209, 198, 0.2)",
          }}
        >
          <div className="p-4 sm:p-5 flex items-center gap-4">
            {/* Иконка Telegram */}
            <div
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: "#0088cc" }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: "#fffffe" }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
            </div>

            {/* Текст */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className="text-base sm:text-lg font-semibold transition-colors duration-300 group-hover:text-[#0088cc]"
                  style={{ color: "#fffffe" }}
                >
                  @kkopilka
                </h3>
                <svg
                  className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: "#0088cc" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <p
                className="text-sm transition-colors duration-300"
                style={{ color: "#abd1c6" }}
              >
                Подписывайся, чтобы быть в курсе всего
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

