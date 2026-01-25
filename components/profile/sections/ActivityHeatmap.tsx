"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface DayData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export default function ActivityHeatmap() {
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        // Генерируем данные за последние 52 недели (364 дня)
        const days: DayData[] = [];
        const today = new Date();

        for (let i = 363; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);

          // Симулируем активность (в реальности это будет из API)
          const count = Math.floor(Math.random() * 10);
          let level: 0 | 1 | 2 | 3 | 4 = 0;
          if (count === 0) level = 0;
          else if (count <= 2) level = 1;
          else if (count <= 5) level = 2;
          else if (count <= 7) level = 3;
          else level = 4;

          days.push({
            date: date.toISOString().split("T")[0],
            count,
            level,
          });
        }

        setData(days);
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const getColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-[#001e1d] border border-[#abd1c6]/10";
      case 1:
        return "bg-[#004643]/40 border border-[#abd1c6]/20";
      case 2:
        return "bg-[#f9bc60]/40 border border-[#f9bc60]/30";
      case 3:
        return "bg-[#f9bc60]/60 border border-[#f9bc60]/40";
      case 4:
        return "bg-[#f9bc60] border border-[#f9bc60]";
      default:
        return "bg-[#001e1d]";
    }
  };

  const weeks = [];
  for (let i = 0; i < 52; i++) {
    weeks.push(data.slice(i * 7, (i + 1) * 7));
  }

  const totalActivity = data.reduce((sum, day) => sum + day.count, 0);
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  if (loading) {
    return (
      <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#abd1c6]/20 rounded w-1/3"></div>
          <div className="h-32 bg-[#abd1c6]/10 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 bg-[#f9bc60]/20 rounded-lg flex items-center justify-center">
            <LucideIcons.Activity className="text-[#f9bc60]" size="sm" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-[#fffffe]">
            График активности
          </h3>
        </div>
        <div className="text-right">
          <div className="text-lg sm:text-xl font-bold text-[#f9bc60]">
            {totalActivity}
          </div>
          <div className="text-xs text-[#abd1c6]">действий за год</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={`${day.date}-${dayIndex}`}
                  whileHover={{ scale: 1.3, zIndex: 10 }}
                  onHoverStart={() => setSelectedDay(day)}
                  onHoverEnd={() => setSelectedDay(null)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded ${getColor(day.level)} cursor-pointer transition-all`}
                  title={`${day.count} действий ${new Date(day.date).toLocaleDateString("ru-RU")}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#abd1c6]">
        <span>Меньше</span>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded bg-[#001e1d] border border-[#abd1c6]/10"></div>
          <div className="w-2.5 h-2.5 rounded bg-[#004643]/40 border border-[#abd1c6]/20"></div>
          <div className="w-2.5 h-2.5 rounded bg-[#f9bc60]/40 border border-[#f9bc60]/30"></div>
          <div className="w-2.5 h-2.5 rounded bg-[#f9bc60]/60 border border-[#f9bc60]/40"></div>
          <div className="w-2.5 h-2.5 rounded bg-[#f9bc60] border border-[#f9bc60]"></div>
        </div>
        <span>Больше</span>
      </div>

      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-[#001e1d]/80 backdrop-blur-sm rounded-lg border border-[#abd1c6]/20"
        >
          <div className="text-sm text-[#fffffe] font-semibold">
            {selectedDay.count}{" "}
            {selectedDay.count === 1
              ? "действие"
              : selectedDay.count < 5
                ? "действия"
                : "действий"}
          </div>
          <div className="text-xs text-[#abd1c6]">
            {new Date(selectedDay.date).toLocaleDateString("ru-RU", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
