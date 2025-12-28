"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useBulldog } from "@/lib/useBulldog";
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
  const { state, handleClick, getMessage } = useBulldog();

  return (
    <div className="flex items-start justify-center px-4 pt-8 pb-8 relative">
      <div className="text-center max-w-4xl mx-auto">
        {/* Основной заголовок */}
        <h1
          className="text-5xl md:text-7xl font-bold mb-6"
          style={{ color: "#fffffe" }}
        >
          Нужны деньги и неоткуда взять?
          <br />
          <span style={{ color: "#f9bc60" }}>Расскажите свою историю</span>
        </h1>

        {/* Описание */}
        <p
          className="text-xl md:text-2xl mb-8 leading-relaxed"
          style={{ color: "#abd1c6" }}
        >
          Копилка — платформа, которая самостоятельно оказывает финансовую поддержку пользователям
        </p>

        {/* Кнопки действий */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/support" className="inline-block">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(249, 188, 96, 0.3)",
                    "0 0 30px rgba(249, 188, 96, 0.6)", 
                    "0 0 20px rgba(249, 188, 96, 0.3)"
                  ] 
                }}
                transition={{ 
                  boxShadow: { 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  } 
                }}
                className="inline-flex items-center justify-center px-12 py-4 text-xl font-bold rounded-2xl border-2 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(249, 188, 96, 0.1) 0%, rgba(249, 188, 96, 0.2) 100%)",
                  borderColor: "#f9bc60",
                  color: "#f9bc60",
                  backdropFilter: "blur(10px)",
                }}
              >
                <motion.span
                  animate={{ 
                    textShadow: [
                      "0 0 10px rgba(249, 188, 96, 0.5)",
                      "0 0 20px rgba(249, 188, 96, 0.8)",
                      "0 0 10px rgba(249, 188, 96, 0.5)"
                    ]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  💫 Стань частью истории
                </motion.span>
              </motion.span>
            </Link>
            <DonateButton variant="large" />
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-4 text-base" 
            style={{ color: "#abd1c6" }}
          >
            В знак благодарности поддержавшие могут быть отмечены в рейтинге сообщества "Герои"
          </motion.p>
        </motion.div>

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/applications"
            className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "#f9bc60",
              color: "#001e1d",
            }}
          >
            Рассказать историю
          </Link>

          <Link
            href="/stories"
            className="px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-all duration-200 hover:scale-105"
            style={{
              borderColor: "#abd1c6",
              color: "#abd1c6",
            }}
          >
            Смотреть истории
          </Link>
        </div>

        {/* Рекламная карточка для мобильных — между кнопками и Telegram каналом */}
        <div className="mb-10 md:hidden">
          <AdSection variant="feed" />
        </div>

        {/* Рекламный блок
            Показываем только на средних и больших экранах */}
        <div className="mb-10 hidden md:flex justify-center">
          <div className="w-full" style={{ maxWidth: '900px' }}>
            <AdSection variant="sidebar" />
          </div>
        </div>

        {/* Telegram канал */}
        <div className="mb-10">
          <TelegramChannel />
        </div>

        {/* Статистика платформы */}
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-8" style={{ color: "#fffffe" }}>
            Статистика платформы
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
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
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
  );
}
