"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import AdSection from "./AdSection";
import DonateButton from "@/components/donate/DonateButton";
import TelegramChannel from "./TelegramChannel";
import AnimatedNumber from "./AnimatedNumber";

type Stats = {
  collected: number;
  requests: number;
  approved: number;
  people: number;
};

interface HeroSectionProps {
  stats: Stats;
  loading: boolean;
}

export default function HeroSection({ stats, loading }: HeroSectionProps) {
  return (
    <section className="relative px-4 pt-12 pb-14 sm:pt-16 sm:pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-4xl mx-auto">
        {/* Основной заголовок */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 text-[#fffffe]"
        >
          Расскажи свою историю —{" "}
          <span className="text-[#f9bc60]">получи шанс на поддержку</span>
        </h1>

        {/* Описание */}
        <p className="text-lg sm:text-xl md:text-2xl mb-9 leading-relaxed text-[#abd1c6]">
          «Копилка» — независимая платформа: мы читаем истории и принимаем решения самостоятельно.
        </p>

        {/* Кнопки действий */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center mb-10"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <Link
              href="/applications"
              className="inline-flex items-center justify-center px-10 py-4 text-lg sm:text-xl font-black rounded-2xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d]"
            >
              Рассказать историю
            </Link>
            <DonateButton variant="large" className="w-full sm:w-auto" />
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2 items-center justify-center text-sm sm:text-base text-[#abd1c6]">
            <Link href="/stories" className="underline underline-offset-4 hover:text-[#fffffe] transition-colors">
              Смотреть истории →
            </Link>
            <span className="hidden sm:inline text-[#abd1c6]/60">•</span>
            <a href="#how-it-works" className="underline underline-offset-4 hover:text-[#fffffe] transition-colors">
              Как это работает
            </a>
          </div>
          <p className="mt-4 text-sm text-[#94a1b2] max-w-2xl mx-auto leading-relaxed">
            Решение не гарантировано. Мы стараемся помогать честно и по возможности.
          </p>
        </motion.div>

        {/* Рекламная карточка для мобильных — между кнопками и Telegram каналом */}
        <div className="mb-12 md:hidden">
          <AdSection variant="feed" />
        </div>

        {/* Рекламный блок
            Показываем только на средних и больших экранах */}
        <div className="mb-12 hidden md:flex justify-center">
          <div className="w-full" style={{ maxWidth: '900px' }}>
            <AdSection variant="sidebar" />
          </div>
        </div>

        {/* Telegram канал */}
        <div className="mb-12">
          <TelegramChannel />
        </div>

        {/* Статистика платформы */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-7 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#fffffe]">
              Статистика
            </h2>

          {/* Основная сумма */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div
              className="text-4xl md:text-5xl font-bold mb-2"
              style={{ color: "#f9bc60" }}
            >
              {loading ? (
                "₽ 0"
              ) : (
                <>
                  ₽ <AnimatedNumber value={stats.collected} />
                </>
              )}
            </div>
            <p className="text-lg" style={{ color: "#abd1c6" }}>
              Всего в копилке
            </p>
          </motion.div>

          {/* Компактная статистика */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: "#fffffe" }}
              >
                {loading ? "0" : <AnimatedNumber value={stats.requests} />}
              </div>
              <div className="text-sm" style={{ color: "#abd1c6" }}>
                Историй
              </div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: "#fffffe" }}
              >
                {loading ? "0" : <AnimatedNumber value={stats.approved} />}
              </div>
              <div className="text-sm" style={{ color: "#abd1c6" }}>
                Выплачено
              </div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div
                className="text-2xl font-bold mb-1"
                style={{ color: "#fffffe" }}
              >
                {loading ? "0" : <AnimatedNumber value={stats.people} />}
              </div>
              <div className="text-sm" style={{ color: "#abd1c6" }}>
                Участников
              </div>
            </motion.div>
          </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
