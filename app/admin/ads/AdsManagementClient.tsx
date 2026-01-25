"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import AdsPlacementsSection from "./components/AdsPlacementsSection";
import AdsRequestsSection from "./components/AdsRequestsSection";

type Tab = "placements" | "requests";

export default function AdsManagementClient() {
  const searchParams = useSearchParams();
  const initialTab: Tab =
    searchParams.get("tab") === "requests" ? "requests" : "placements";

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-8 px-4 sm:px-6 relative">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Заголовок с градиентом */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#fffffe] mb-2 bg-gradient-to-r from-[#fffffe] to-[#abd1c6] bg-clip-text text-transparent">
                Управление рекламой
              </h1>
              <p className="text-[#abd1c6] text-sm sm:text-base">
                Заявки рекламодателей и активные размещения в одном месте
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin"
                className="px-4 py-2 bg-[#001e1d] hover:bg-[#002724] text-[#abd1c6] font-medium rounded-xl border border-[#abd1c6]/20 hover:border-[#abd1c6]/40 transition-all duration-200 flex items-center gap-2 text-sm"
              >
                <LucideIcons.MessageCircle size="sm" />
                <span className="hidden sm:inline">Заявки на поддержку</span>
                <span className="sm:hidden">Поддержка</span>
              </Link>
              <Link
                href="/standards"
                className="px-4 py-2 bg-[#001e1d] hover:bg-[#002724] text-[#abd1c6] font-medium rounded-xl border border-[#abd1c6]/20 hover:border-[#abd1c6]/40 transition-all duration-200 flex items-center gap-2 text-sm"
              >
                <LucideIcons.FileText size="sm" />
                Стандарты
              </Link>
            </div>
          </div>

          {/* Улучшенные табы */}
          <div className="flex items-center gap-4 mb-6">
            <div className="inline-flex gap-1 rounded-2xl bg-[#001e1d]/60 p-1.5 border border-[#abd1c6]/10 shadow-lg">
              <button
                onClick={() => setActiveTab("placements")}
                className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeTab === "placements"
                    ? "bg-[#f9bc60] text-[#001e1d] shadow-lg shadow-[#f9bc60]/20"
                    : "text-[#abd1c6] hover:text-[#fffffe] hover:bg-[#002724]"
                }`}
              >
                <LucideIcons.LayoutGrid size="sm" />
                <span className="hidden sm:inline">Размещения</span>
                <span className="sm:hidden">Размещ.</span>
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                  activeTab === "requests"
                    ? "bg-[#f9bc60] text-[#001e1d] shadow-lg shadow-[#f9bc60]/20"
                    : "text-[#abd1c6] hover:text-[#fffffe] hover:bg-[#002724]"
                }`}
              >
                <LucideIcons.Mail size="sm" />
                <span className="hidden sm:inline">Заявки на рекламу</span>
                <span className="sm:hidden">Заявки</span>
              </button>
            </div>
          </div>

          {/* Подзаголовок */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#001e1d]/40 to-[#002724]/40 border border-[#abd1c6]/10">
            <p className="text-sm text-[#abd1c6] flex items-center gap-2">
              <LucideIcons.Info size="sm" className="flex-shrink-0" />
              <span>
                {activeTab === "placements"
                  ? "Управляйте активными баннерами и рекламными блоками на сайте. Создавайте, редактируйте и удаляйте размещения."
                  : "Обрабатывайте заявки от рекламодателей. Просматривайте детали, меняйте статусы и оставляйте комментарии."}
              </span>
            </p>
          </div>
        </motion.div>

        {/* Контент вкладок с анимацией */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-[#abd1c6]/10 bg-gradient-to-br from-[#001e1d]/80 to-[#002724]/60 p-4 sm:p-6 shadow-2xl shadow-black/30 backdrop-blur-sm"
          >
            {activeTab === "placements" ? (
              <AdsPlacementsSection />
            ) : (
              <AdsRequestsSection />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
