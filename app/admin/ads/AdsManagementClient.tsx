"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AdsPlacementsSection from "./components/AdsPlacementsSection";
import AdsRequestsSection from "./components/AdsRequestsSection";

type Tab = "placements" | "requests";

export default function AdsManagementClient() {
  const searchParams = useSearchParams();
  const initialTab: Tab =
    searchParams.get("tab") === "requests" ? "requests" : "placements";

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  return (
    <div
      className="min-h-screen pt-24 pb-6 px-6"
      style={{ backgroundColor: "#004643" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#fffffe] mb-2">
              Управление рекламой
            </h1>
            <p className="text-[#abd1c6]">
              Заявки рекламодателей и активные размещения в одном месте
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex gap-2">
              <Link
                href="/admin"
                className="px-4 py-2 bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors"
              >
                Заявки на поддержку
              </Link>
              <Link
                href="/standards"
                className="px-4 py-2 bg-[#abd1c6] text-[#001e1d] font-semibold rounded-lg hover:bg-[#abd1c6]/90 transition-colors flex items-center gap-2"
              >
                📏 Стандарты
              </Link>
              <Link
                href="/ad-examples"
                className="px-4 py-2 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors flex items-center gap-2"
              >
                👀 Примеры
              </Link>
            </div>
          </div>
        </div>

        {/* Табы */}
        <div className="mb-4 border-b border-[#abd1c6]/20">
          <div className="inline-flex gap-2 rounded-2xl bg-[#001e1d]/40 p-1">
            <button
              onClick={() => setActiveTab("placements")}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                activeTab === "placements"
                  ? "bg-[#f9bc60] text-[#001e1d] shadow-md"
                  : "text-[#abd1c6] hover:text-[#fffffe]"
              }`}
            >
              Размещения
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                activeTab === "requests"
                  ? "bg-[#f9bc60] text-[#001e1d] shadow-md"
                  : "text-[#abd1c6] hover:text-[#fffffe]"
              }`}
            >
              Заявки на рекламу
            </button>
          </div>
        </div>

        {/* Подзаголовок для текущей вкладки */}
        <p className="mb-4 text-sm text-[#abd1c6]">
          {activeTab === "placements"
            ? "Здесь вы управляете активными баннерами и рекламными блоками на сайте."
            : "Здесь собираются заявки с формы рекламы. Обрабатывайте, одобряйте и удаляйте их."}
        </p>

        {/* Контент вкладок */}
        <div className="rounded-3xl border border-[#0b3b33]/40 bg-[#001e1d]/60 p-4 md:p-6 shadow-xl shadow-black/20">
          {activeTab === "placements" ? (
            <AdsPlacementsSection />
          ) : (
            <AdsRequestsSection />
          )}
        </div>
      </div>
    </div>
  );
}


