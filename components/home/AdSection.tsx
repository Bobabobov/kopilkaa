"use client";
import React, { useState, useEffect } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface Advertisement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  expiresAt?: string;
  isActive: boolean;
}

export default function AdSection() {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveAd();
  }, []);

  const fetchActiveAd = async () => {
    try {
      const response = await fetch("/api/ads/active");
      if (response.ok) {
        const data = await response.json();
        setAd(data.ad);
      }
    } catch (error) {
      console.error("Error fetching active ad:", error);
    } finally {
      setLoading(false);
    }
  };

  // Если нет активной рекламы, показываем дефолтный блок
  if (loading) {
    return (
      <div className="xl:order-4 order-4">
        <div className="rounded-3xl border border-[#abd1c6]/25 bg-[#001e1d]/60 px-5 py-5 shadow-xl shadow-black/30 flex flex-col items-center justify-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#f9bc60] flex items-center justify-center text-sm text-[#001e1d] shadow-md shadow-[#f9bc60]/50">
            <LucideIcons.Megaphone size="sm" />
          </div>
          <p className="text-sm text-[#abd1c6]">Загружаем рекламный блок…</p>
        </div>
      </div>
    );
  }

  // Если нет активной рекламы, используем дефолтные данные
  const defaultAd = {
    title: "Реклама",
    content: "Ваша реклама здесь поможет поддержать проект и достичь целевой аудитории",
    imageUrl: null,
    linkUrl: null,
  };
  
  const displayAd = ad || defaultAd;
  return (
    <div className="xl:order-4 order-4">
      <div className="rounded-3xl border border-[#abd1c6]/30 bg-gradient-to-br from-[#004643] via-[#003131] to-[#001e1d] px-5 py-5 sm:px-6 sm:py-6 shadow-2xl shadow-black/40">
        {/* Верх: иконка и заголовок */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#f9bc60] flex items-center justify-center text-sm text-[#001e1d] shadow-md shadow-[#f9bc60]/50 mb-3">
            <LucideIcons.Megaphone size="sm" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-[#fffffe] uppercase tracking-wide">
            {displayAd.title || "Реклама"}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#abd1c6] leading-relaxed max-w-xs">
            {displayAd.content}
          </p>
        </div>

        {/* Изображение */}
        {displayAd.imageUrl && (
          <div className="mt-3 mb-4">
            <img
              src={displayAd.imageUrl}
              alt={displayAd.title}
              className="w-full h-32 sm:h-40 object-cover rounded-2xl border border-[#abd1c6]/25"
            />
          </div>
        )}

        {/* Кнопка перехода к рекламе */}
        <div className="mt-3">
          <a
            href={displayAd.linkUrl || undefined}
            target={displayAd.linkUrl ? "_blank" : undefined}
            rel={displayAd.linkUrl ? "noopener noreferrer" : undefined}
            className={`block w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
              displayAd.linkUrl
                ? "bg-[#f9bc60] text-[#001e1d] hover:bg-[#e8a545] border-transparent"
                : "bg-transparent text-[#abd1c6]/70 border-[#abd1c6]/40 cursor-default"
            }`}
          >
            {displayAd.linkUrl ? "Перейти к рекламе →" : "Скоро здесь может быть ваша реклама"}
          </a>
        </div>

        {/* Контакт для размещения рекламы */}
        <div className="mt-3 rounded-xl border border-[#abd1c6]/35 bg-[#001e1d]/40 px-4 py-3 text-left">
          <div className="text-xs font-semibold text-[#fffffe] mb-1.5">
            Разместить рекламу
          </div>
          <p className="text-[11px] text-[#abd1c6]/80 mb-1">
            Расскажите о своём проекте нашей аудитории.
          </p>
          <div className="text-[11px] text-[#abd1c6] flex items-center gap-1">
            <span>📧</span>
            <a
              href="mailto:ads@kopilka.ru"
              className="hover:text-[#f9bc60] transition-colors"
            >
              ads@kopilka.ru
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
