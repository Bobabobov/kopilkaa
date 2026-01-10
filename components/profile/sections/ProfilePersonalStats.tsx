"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { usePersonalStats } from "../hooks/usePersonalStats";
import { PersonalStatsLoading } from "./PersonalStatsLoading";
import { PersonalStatsError } from "./PersonalStatsError";
import { PersonalStatsTabs } from "./PersonalStatsTabs";
import { PersonalStatsOverview } from "./PersonalStatsOverview";
import { PersonalStatsApplications } from "./PersonalStatsApplications";
import { PersonalStatsSocial } from "./PersonalStatsSocial";
import { PersonalStatsAchievements } from "./PersonalStatsAchievements";

export default function ProfilePersonalStats() {
  const { loading, error, activeTab, setActiveTab, calculated } = usePersonalStats();

  if (loading) return <PersonalStatsLoading />;
  if (error) return <PersonalStatsError message={error} />;
  if (!calculated) return null;

  const { tabs } = calculated;

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
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#f9bc60]/12 rounded-xl flex items-center justify-center flex-shrink-0">
              <LucideIcons.BarChart3 className="w-4.5 h-4.5 text-[#f9bc60]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#fffffe] leading-tight">Подробная статистика</h2>
              <p className="text-xs sm:text-sm text-[#abd1c6]/80">Вкладки переключают набор карточек</p>
            </div>
          </div>

          <PersonalStatsTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {activeTab === "overview" && <PersonalStatsOverview vm={calculated} />}
              {activeTab === "applications" && <PersonalStatsApplications vm={calculated} />}
              {activeTab === "social" && <PersonalStatsSocial vm={calculated} />}
              {activeTab === "achievements" && <PersonalStatsAchievements vm={calculated} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
