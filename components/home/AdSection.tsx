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
  placement?: string;
}

interface AdSectionProps {
  /** 
   * sidebar – компактный блок для боковой колонки (десктоп)
   * feed – карточка внутри ленты (мобильный вариант в стиле vc.ru)
   */
  variant?: "sidebar" | "feed";
}

export default function AdSection({ variant = "sidebar" }: AdSectionProps) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveAd();
  }, []);

  const fetchActiveAd = async () => {
    try {
      const response = await fetch("/api/ads/active", {
        cache: "no-store",
      });
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
    if (variant === "feed") {
      return (
        <div className="w-full">
          <div className="rounded-2xl bg-[#fffffe] text-[#111827] shadow-md border border-black/5 px-4 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e5e7eb]" />
              <div className="space-y-1">
                <div className="h-3 w-32 rounded-full bg-[#e5e7eb]" />
                <div className="h-3 w-40 rounded-full bg-[#e5e7eb]" />
              </div>
            </div>
            <div className="h-8 w-24 rounded-full bg-[#d1d5db]" />
          </div>
        </div>
      );
    }

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
    content:
      "Ваша реклама здесь поможет поддержать проект и достичь целевой аудитории",
    imageUrl: null,
    linkUrl: null,
  };

  const displayAd = ad || defaultAd;

  // Вариант карточки в ленте — лёгкая светлая карточка в стиле vc.ru
  if (variant === "feed") {
    return (
      <div className="w-full">
        <div className="rounded-3xl bg-[#001e1d] text-[#fffffe] shadow-lg border border-[#abd1c6]/30 px-4 py-4">
          {/* Верхняя строка: метка «Реклама» и ссылка «Разместить» */}
          <div className="flex items-center justify-between text-[11px] mb-3">
            <div className="flex items-center gap-1 font-semibold tracking-[0.16em] uppercase text-[#abd1c6]/80">
              <span>Реклама</span>
            </div>
            <a
              href="mailto:ads@kopilka.ru"
              className="text-[11px] font-semibold text-[#f9bc60] hover:text-[#ffd27f] transition-colors"
            >
              Разместить
            </a>
          </div>

          {/* Основной контент: мини‑картинка + текст */}
          <div className="flex items-start gap-3 mb-3">
            {displayAd.imageUrl && (
              <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-black/20">
                <img
                  src={displayAd.imageUrl}
                  alt={displayAd.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 text-left">
              <h3 className="text-sm font-semibold mb-1">
                {displayAd.title || "Реклама"}
              </h3>
              <p className="text-xs text-[#abd1c6] leading-snug">
                {displayAd.content}
              </p>
            </div>
          </div>

          {/* Кнопка действия */}
          <a
            href={displayAd.linkUrl || undefined}
            target={displayAd.linkUrl ? "_blank" : undefined}
            rel={displayAd.linkUrl ? "noopener noreferrer" : undefined}
            className={`mt-1 inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
              displayAd.linkUrl
                ? "bg-[#f9bc60] text-[#001e1d] hover:bg-[#e8a545]"
                : "bg-transparent text-[#abd1c6]/50 border border-[#abd1c6]/40 cursor-default"
            }`}
          >
            Перейти
          </a>
        </div>
      </div>
    );
  }

  // Вариант для боковой колонки (десктоп)
  return (
    <div className="xl:order-4 order-4" style={{ maxWidth: 300 }}>
      <div className="rounded-3xl border border-[#abd1c6]/30 bg-[#001e1d]/90 shadow-2xl shadow-black/40 overflow-hidden">
        {/* Верх: метка «Реклама» */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1 text-[11px] text-[#abd1c6]/80">
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#004643] border border-[#0b3b33]/60">
            <LucideIcons.Megaphone size="xs" />
            <span>Реклама</span>
          </div>
        </div>

        {/* Основная зона баннера */}
        <div className="px-3 pb-3">
          <div className="w-full rounded-2xl border border-[#abd1c6]/30 bg-[#001e1d] overflow-hidden">
            {/* Картинка (кликабельная, если есть ссылка) */}
            {displayAd.imageUrl && (
              <div className="w-full bg-black/10">
                {displayAd.linkUrl ? (
                  <a
                    href={displayAd.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={displayAd.imageUrl}
                      alt={displayAd.title}
                      className="w-full h-auto object-cover cursor-pointer"
                    />
                  </a>
                ) : (
                  <img
                    src={displayAd.imageUrl}
                    alt={displayAd.title}
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            )}

            {/* Текст + кнопка */}
            <div className="p-3">
              <h3 className="text-sm font-semibold text-[#fffffe] mb-1 line-clamp-2">
                {displayAd.title || "Реклама"}
              </h3>
              <p className="text-[11px] text-[#abd1c6] leading-snug mb-3 line-clamp-4">
                {displayAd.content}
              </p>

              <a
                href={displayAd.linkUrl || undefined}
                target={displayAd.linkUrl ? "_blank" : undefined}
                rel={displayAd.linkUrl ? "noopener noreferrer" : undefined}
                className={`block w-full rounded-lg px-3 py-2 text-xs font-semibold text-center transition-colors ${
                  displayAd.linkUrl
                    ? "bg-[#f9bc60] text-[#001e1d] hover:bg-[#e8a545]"
                    : "bg-transparent text-[#abd1c6]/70 border border-[#abd1c6]/40 cursor-default"
                }`}
              >
                {displayAd.linkUrl
                  ? "Перейти на сайт"
                  : "Скоро здесь может быть ваша реклама"}
              </a>
            </div>
          </div>
        </div>

        {/* Контакт для размещения рекламы */}
        <div className="px-4 pb-3 pt-2 border-t border-[#0b3b33]/80 bg-[#001e1d]/95">
          <div className="text-[11px] font-semibold text-[#fffffe] mb-1">
            Разместить рекламу на этом месте
          </div>
          <div className="text-[11px] text-[#abd1c6]/80">
            Напишите на{" "}
            <a
              href="mailto:ads@kopilka.ru"
              className="underline hover:text-[#f9bc60] transition-colors"
            >
              ads@kopilka.ru
            </a>
            , указав ссылку на ваш сайт и желаемые даты.
          </div>
        </div>
      </div>
    </div>
  );
}
