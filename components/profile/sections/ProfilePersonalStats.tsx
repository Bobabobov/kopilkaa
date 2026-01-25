"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { usePersonalStats } from "../hooks/usePersonalStats";
import { PersonalStatsLoading } from "./PersonalStatsLoading";
import { PersonalStatsError } from "./PersonalStatsError";

export default function ProfilePersonalStats() {
  const { loading, error, calculated } = usePersonalStats();

  if (loading) return <PersonalStatsLoading />;
  if (error) return <PersonalStatsError message={error} />;
  if (!calculated) return null;

  const {
    totalApplications,
    approvedPercent,
    rejectedPercent,
    pendingPercent,
  } = calculated;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#004643]/60 backdrop-blur-sm rounded-2xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6 relative overflow-hidden shadow-lg"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#f9bc60]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#e16162]/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="p-4 sm:p-5 rounded-xl bg-[#001e1d]/40 border border-[#abd1c6]/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <LucideIcons.FileText className="w-4 h-4 text-[#f9bc60]" />
                <p className="text-sm font-semibold text-[#fffffe]">
                  Распределение заявок
                </p>
              </div>
              <p className="text-xs text-[#abd1c6]">
                Всего:{" "}
                <span className="text-[#fffffe] font-semibold">
                  {totalApplications}
                </span>
              </p>
            </div>
            <div className="space-y-2">
              {[
                { label: "Одобрено", value: approvedPercent, color: "#22c55e" },
                {
                  label: "В процессе",
                  value: pendingPercent,
                  color: "#f59e0b",
                },
                {
                  label: "Отклонено",
                  value: rejectedPercent,
                  color: "#ef4444",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-[#abd1c6] mb-1">
                    <span>{item.label}</span>
                    <span className="text-[#fffffe] font-semibold">
                      {item.value}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#abd1c6]/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: item.color,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
