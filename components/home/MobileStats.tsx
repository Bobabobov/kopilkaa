"use client";
import { motion } from "framer-motion";

type Stats = {
  collected: number;
  requests: number;
  approved: number;
  people: number;
};

interface MobileStatsProps {
  stats: Stats;
  loading: boolean;
}

export default function MobileStats({ stats, loading }: MobileStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="xl:hidden order-3"
    >
      <h2 className="text-2xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
        Сейчас в «Копилке»
      </h2>

      <div className="grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="text-3xl lg:text-4xl font-bold text-[#6B9071] dark:text-[#AEC3B0] mb-2">
            ₽ {loading ? "0" : stats.collected.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Собрано</div>
        </div>

        <div className="text-center">
          <div className="text-3xl lg:text-4xl font-bold text-[#6B9071] dark:text-[#AEC3B0] mb-2">
            {loading ? "0" : stats.requests}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Заявок</div>
        </div>

        <div className="text-center">
          <div className="text-3xl lg:text-4xl font-bold text-[#6B9071] dark:text-[#AEC3B0] mb-2">
            {loading ? "0" : stats.approved}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Одобрено</div>
        </div>

        <div className="text-center">
          <div className="text-3xl lg:text-4xl font-bold text-[#6B9071] dark:text-[#AEC3B0] mb-2">
            {loading ? "0" : stats.people}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Поддержано</div>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
        Данные обновляются в реальном времени
      </p>
    </motion.div>
  );
}














