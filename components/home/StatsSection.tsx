"use client";
import { motion } from "framer-motion";

type Stats = {
  collected: number;
  requests: number;
  approved: number;
  people: number;
};

interface StatsSectionProps {
  stats: Stats;
  loading: boolean;
}

export default function StatsSection({ stats, loading }: StatsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-16"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4" style={{ color: "#fffffe" }}>
          Статистика платформы
        </h2>

        {/* Основная сумма */}
        <div className="mb-8">
          <div
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{ color: "#f9bc60" }}
          >
            ₽ {loading ? "0" : stats.collected.toLocaleString()}
          </div>
          <p className="text-lg" style={{ color: "#abd1c6" }}>
            Собрано для помощи
          </p>
        </div>

        {/* Компактная статистика */}
        <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
          <div className="text-center">
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: "#fffffe" }}
            >
              {loading ? "0" : stats.requests}
            </div>
            <div className="text-sm" style={{ color: "#abd1c6" }}>
              Заявок
            </div>
          </div>

          <div className="text-center">
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: "#fffffe" }}
            >
              {loading ? "0" : stats.approved}
            </div>
            <div className="text-sm" style={{ color: "#abd1c6" }}>
              Одобрено
            </div>
          </div>

          <div className="text-center">
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: "#fffffe" }}
            >
              {loading ? "0" : stats.people}
            </div>
            <div className="text-sm" style={{ color: "#abd1c6" }}>
              Помогли
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
