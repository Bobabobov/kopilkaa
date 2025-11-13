"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

type Stats = {
  collected: number;
  requests: number;
  approved: number;
  people: number;
};

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

export default function SupportHero() {
  const [stats, setStats] = useState<Stats>({
    collected: 0,
    requests: 0,
    approved: 0,
    people: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем статистику
    fetch("/api/stats", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.stats) {
          const newStats = {
            collected: 0, // Пока нет системы донатов
            requests: data.stats.applications.total || 0,
            approved: data.stats.applications.approved || 0,
            people: data.stats.users.total || 0,
          };
          setStats(newStats);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            animate={{
              textShadow: [
                "0 0 20px rgba(249, 188, 96, 0.3)",
                "0 0 40px rgba(249, 188, 96, 0.6)",
                "0 0 20px rgba(249, 188, 96, 0.3)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ color: "#fffffe" }}
          >
            💫 Стань частью
            <br />
            <span style={{ color: "#f9bc60" }}>истории</span>
          </motion.h1>
          
          <p
            className="text-xl md:text-2xl mb-12 leading-relaxed max-w-4xl mx-auto"
            style={{ color: "#abd1c6" }}
          >
            Нравится проект? Помоги ему существовать. 
            Деньги идут на поддержку авторов.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#004643]/30 backdrop-blur-sm border border-[#abd1c6]/20 rounded-3xl p-6"
            >
              <div className="text-3xl font-bold mb-2" style={{ color: "#f9bc60" }}>
                {loading ? "0" : <AnimatedNumber value={stats.approved} />}
              </div>
              <div style={{ color: "#abd1c6" }}>Поддержано историй</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-[#004643]/30 backdrop-blur-sm border border-[#abd1c6]/20 rounded-3xl p-6"
            >
              <div className="text-3xl font-bold mb-2" style={{ color: "#f9bc60" }}>
                0
              </div>
              <div style={{ color: "#abd1c6" }}>Активных донатеров</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
