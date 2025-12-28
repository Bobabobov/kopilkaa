"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

type Stats = {
  collected: number;
  requests: number;
  approved: number;
  people: number;
  supporters: number;
  balance: number;
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
    supporters: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем статистику
    Promise.all([
      fetch("/api/stats", { cache: "no-store" }).then((res) => res.json()),
      fetch("/api/heroes", { cache: "no-store" }).then((res) => res.json()),
    ])
      .then(([statsData, heroesData]) => {
        if (statsData && statsData.stats) {
          const newStats = {
            collected: statsData.stats.donations?.totalIn || 0,
            requests: statsData.stats.applications.total || 0,
            approved: statsData.stats.applications.approved || 0,
            people: statsData.stats.users.total || 0,
            supporters: heroesData?.total || 0,
            balance: statsData.stats.donations?.balance || 0,
          };
          setStats(newStats);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return (
    <section className="py-8 sm:py-10 px-3 sm:px-4 relative">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 sm:mb-5 leading-tight"
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
            💫 Поддержите проект
            <br />
            <span style={{ color: "#f9bc60" }}>«Копилка»</span>
          </motion.h1>
          
          <p
            className="text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-2"
            style={{ color: "#abd1c6" }}
          >
            Если вам близка идея проекта, вы можете добровольно поддержать работу платформы и её развитие.
            {" "}
            Поддержка помогает «Копилке» существовать, развиваться и самостоятельно принимать решения о финансовой поддержке пользователей.
            {" "}
            <span className="text-[#f9bc60] font-medium">
              Вы можете привязать свои социальные сети — в этом случае они будут отображаться рядом с вашим именем в разделе благодарности.
            </span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              className="bg-[#004643]/20 backdrop-blur-sm border border-[#abd1c6]/20 rounded-xl p-4 sm:p-5 shadow-md hover:shadow-lg hover:border-[#abd1c6]/30 transition-all duration-300"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: "#f9bc60" }}>
                {loading ? "0" : <AnimatedNumber value={stats.approved} />}
              </div>
              <div className="text-sm sm:text-base opacity-80" style={{ color: "#abd1c6" }}>Поддержано историй</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              className="bg-[#004643]/20 backdrop-blur-sm border border-[#abd1c6]/20 rounded-xl p-4 sm:p-5 shadow-md hover:shadow-lg hover:border-[#abd1c6]/30 transition-all duration-300"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: "#f9bc60" }}>
                {loading ? "0" : <AnimatedNumber value={stats.supporters} />}
              </div>
              <div className="text-sm sm:text-base opacity-80" style={{ color: "#abd1c6" }}>Активных донатеров</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              className="bg-[#f9bc60]/10 backdrop-blur-sm border border-[#f9bc60]/30 rounded-xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all duration-300 sm:col-span-2 md:col-span-1"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: "#f9bc60" }}>
                {loading ? "0" : (
                  <span>
                    <AnimatedNumber value={Math.floor(stats.balance / 1000)} />
                    <span className="text-xl sm:text-2xl">К</span>
                  </span>
                )}
              </div>
              <div className="text-sm sm:text-base opacity-80" style={{ color: "#abd1c6" }}>Баланс копилки</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
