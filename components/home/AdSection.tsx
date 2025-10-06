"use client";
import React from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function AdSection() {
  return (
    <div className="xl:order-4 order-4">
      <div
        className="group relative"
        data-sal="slide-right"
        data-sal-delay="300"
      >
        <div className="absolute -inset-1 bg-gradient-to-br from-[#6B9071] via-[#AEC3B0] to-[#375534] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#E3EED4]/80 via-[#AEC3B0]/80 to-[#6B9071]/80 dark:from-[#0F2A1D]/80 dark:via-[#375534]/80 dark:to-[#6B9071]/80 backdrop-blur-md border border-white/20 dark:border-white/10 hover:border-white/30 dark:hover:border-white/20 hover:scale-105 hover:-translate-y-2 transition-all duration-500 shadow-2xl hover:shadow-3xl">
          <div className="relative space-y-4 text-center">
            {/* Иконка */}
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-[#6B9071] to-[#375534] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <LucideIcons.Megaphone size="lg" className="text-white" />
            </div>

            {/* Заголовок */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Реклама
            </h3>

            {/* Описание */}
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Ваша реклама здесь поможет поддержать проект и достичь целевой
              аудитории
            </p>

            {/* Контакт */}
            <div className="p-3 bg-white/60 dark:bg-[#0F2A1D]/30 rounded-xl border border-[#AEC3B0]/50 dark:border-[#6B9071]/50">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Разместить рекламу
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                📧 ads@kopilka.ru
              </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-white/40 dark:bg-[#0F2A1D]/20 rounded-lg">
                <div className="font-bold text-gray-900 dark:text-white">
                  1000+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  посетителей
                </div>
              </div>
              <div className="p-2 bg-white/40 dark:bg-[#0F2A1D]/20 rounded-lg">
                <div className="font-bold text-gray-900 dark:text-white">
                  24/7
                </div>
                <div className="text-gray-600 dark:text-gray-400">показы</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
