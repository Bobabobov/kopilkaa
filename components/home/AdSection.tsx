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
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-br from-[#6B9071] via-[#AEC3B0] to-[#375534] rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-md rounded-xl p-4 border border-[#abd1c6]/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
            <div className="relative space-y-3 text-center">
              <div className="w-10 h-10 mx-auto bg-gradient-to-br from-[#f9bc60] to-[#f9bc60] rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <LucideIcons.Megaphone size="sm" className="text-[#001e1d]" />
              </div>
              <div className="text-[#abd1c6] text-sm">Загрузка...</div>
            </div>
          </div>
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
      <div
        className="group relative"
        data-sal="slide-right"
        data-sal-delay="300"
      >
        <div className="absolute -inset-1 bg-gradient-to-br from-[#6B9071] via-[#AEC3B0] to-[#375534] rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
        <div className="relative w-80 p-4 rounded-xl bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-md border border-[#abd1c6]/30 hover:border-[#abd1c6]/50 hover:scale-105 hover:-translate-y-2 transition-all duration-500 shadow-2xl hover:shadow-3xl">
          <div className="relative space-y-3 text-center">
            {/* Иконка */}
            <div className="w-10 h-10 mx-auto bg-gradient-to-br from-[#f9bc60] to-[#f9bc60] rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <LucideIcons.Megaphone size="sm" className="text-[#001e1d]" />
            </div>

            {/* Заголовок */}
            <h3 className="text-base font-bold text-[#fffffe]">
              {displayAd.title}
            </h3>

            {/* Описание */}
            <p className="text-xs text-[#abd1c6] leading-relaxed">
              {displayAd.content}
            </p>

            {/* Изображение если есть */}
            {displayAd.imageUrl && (
              <div className="mt-3">
                <img
                  src={displayAd.imageUrl}
                  alt={displayAd.title}
                  className="w-full h-28 object-cover rounded-lg border border-[#abd1c6]/20"
                />
              </div>
            )}

            {/* Ссылка если есть */}
            {displayAd.linkUrl && (
              <div className="p-2 bg-[#001e1d]/40 rounded-lg border border-[#abd1c6]/30">
                <a
                  href={displayAd.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[#f9bc60] hover:text-[#f9bc60]/80 transition-colors"
                >
                  Перейти к рекламе →
                </a>
              </div>
            )}

            {/* Контакт для размещения рекламы */}
            <div className="p-2 bg-[#001e1d]/40 rounded-lg border border-[#abd1c6]/30">
              <div className="text-xs font-medium text-[#abd1c6] mb-1">
                Разместить рекламу
              </div>
              <div className="text-xs text-[#abd1c6]/70">
                📧 ads@kopilka.ru
              </div>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-[#001e1d]/40 rounded-lg">
                <div className="font-bold text-[#fffffe]">
                  1000+
                </div>
                <div className="text-[#abd1c6]/70">
                  посетителей
                </div>
              </div>
              <div className="p-2 bg-[#001e1d]/40 rounded-lg">
                <div className="font-bold text-[#fffffe]">
                  24/7
                </div>
                <div className="text-[#abd1c6]/70">показы</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
