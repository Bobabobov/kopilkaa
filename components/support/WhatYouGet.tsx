"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

const items = [
  {
    icon: "Trophy",
    title: "Участие в жизни проекта",
    description:
      "Поддержка помогает «Копилке» продолжать работу и развиваться как независимый проект.",
    color: "#f9bc60",
  },
  {
    icon: "Share",
    title: "Отображение в «Героях проекта» (по желанию)",
    description:
      "Публичная витрина благодарности: ваш профиль может быть показан в разделе «Герои проекта».",
    color: "#abd1c6",
  },
  {
    icon: "Infinity",
    title: "Без подписки и обязательств",
    description:
      "Разовая поддержка. Никаких автоматических списаний и продлений.",
    color: "#f9bc60",
  },
];

export default function WhatYouGet() {
  return (
    <section className="py-8 sm:py-10 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h3
            className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 sm:mb-4"
            style={{ color: "#fffffe" }}
          >
            🎁 Что даёт поддержка проекта
          </h3>
          <p
            className="text-sm sm:text-base max-w-2xl mx-auto px-2"
            style={{ color: "#abd1c6" }}
          >
            Это участие в развитии платформы и знак благодарности со стороны
            проекта.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((it, idx) => {
            const Icon =
              LucideIcons[it.icon as keyof typeof LucideIcons] ||
              LucideIcons.Star;
            return (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-[#004643]/20 backdrop-blur-sm border border-[#abd1c6]/15 rounded-2xl p-5 sm:p-6 hover:border-[#abd1c6]/30 transition-all duration-300"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: `${it.color}20`,
                    border: `2px solid ${it.color}`,
                  }}
                >
                  <span style={{ color: it.color }}>
                    <Icon className="w-6 h-6 text-current" />
                  </span>
                </div>
                <h4
                  className="text-base sm:text-lg font-semibold mb-2"
                  style={{ color: "#fffffe" }}
                >
                  {it.title}
                </h4>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#abd1c6" }}
                >
                  {it.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-7 sm:mt-9">
          <Link
            href="/heroes"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f9bc60] text-[#001e1d] font-semibold hover:bg-[#e8a545] transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            <LucideIcons.Trophy className="w-5 h-5" />
            Открыть раздел «Герои»
            <LucideIcons.ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
