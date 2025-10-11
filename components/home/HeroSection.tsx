"use client";
import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Image from "next/image";
import { useBulldog } from "@/lib/useBulldog";
import { useEffect } from "react";
import AdSection from "./AdSection";
import TopDonors from "./TopDonors";

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

// Компонент для анимированного числа
function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 2,
      ease: "easeOut",
    });

    return controls.stop;
  }, [motionValue, value]);

  return (
    <motion.span>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}

export default function HeroSection({ stats, loading }: HeroSectionProps) {
  const { state, handleClick, getMessage } = useBulldog();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative">
      {/* Блок рекламы слева вверху */}
      <div className="fixed left-4 z-20 hidden xl:block max-w-sm" style={{ top: '360px' }}>
        <AdSection />
      </div>
      
      {/* Блок топ донатеров справа вверху */}
      <div className="fixed right-4 z-20 hidden xl:block max-w-sm" style={{ top: '360px' }}>
        <TopDonors />
      </div>
      
      <div className="text-center max-w-4xl mx-auto">
        {/* Основной заголовок */}
        <h1
          className="text-5xl md:text-7xl font-bold mb-6"
          style={{ color: "#fffffe" }}
        >
          Помогаем людям
          <br />
          <span style={{ color: "#f9bc60" }}>найти поддержку</span>
        </h1>

        {/* Описание */}
        <p
          className="text-xl md:text-2xl mb-8 leading-relaxed"
          style={{ color: "#abd1c6" }}
        >
          Безопасная платформа для сбора помощи. Создавайте заявки, делитесь
          историями и находите поддержку сообщества.
        </p>
        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/applications"
            className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "#f9bc60",
              color: "#001e1d",
            }}
          >
            Создать заявку
          </Link>

          <Link
            href="/stories"
            className="px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-all duration-200 hover:scale-105"
            style={{
              borderColor: "#abd1c6",
              color: "#abd1c6",
            }}
          >
            Читать истории
          </Link>
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
              Собрано для помощи
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
                Заявок
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
                Одобрено
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
                Помогли
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
