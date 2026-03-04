"use client";

import React, { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";

interface Advertisement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  expiresAt?: string;
  isActive: boolean;
  placement?: string;
  config?: {
    sidebarMobileImageUrl?: string;
    sidebarMobileTitle?: string;
    sidebarMobileContent?: string;
  } | null;
}

interface AdSectionProps {
  /**
   * sidebar – компактный блок для боковой колонки (десктоп)
   * feed – карточка внутри ленты
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
          <div className="w-11 h-11 rounded-2xl bg-[#f9bc60] flex items-center justify-center text-[#001e1d]">
            <Megaphone className="w-5 h-5" />
          </div>
          <p className="text-sm text-[#abd1c6]">Загружаем рекламный блок…</p>
        </div>
      </div>
    );
  }

  // Если нет активной рекламы, используем дефолтные данные
  const defaultAd = {
    title: "",
    content:
      "Ваша реклама здесь поможет поддержать проект и достичь целевой аудитории",
    imageUrl: null,
    linkUrl: null,
  };

  const displayAd = ad || defaultAd;

  // Вариант карточки в ленте — лёгкая светлая карточка
  if (variant === "feed") {
    // Используем мобильные данные, если они указаны, иначе fallback на десктопные
    const mobileImageUrl =
      ad?.config?.sidebarMobileImageUrl &&
      ad.config.sidebarMobileImageUrl.trim() !== ""
        ? ad.config.sidebarMobileImageUrl
        : displayAd.imageUrl;
    const mobileTitle =
      ad?.config?.sidebarMobileTitle &&
      ad.config.sidebarMobileTitle.trim() !== ""
        ? ad.config.sidebarMobileTitle
        : displayAd.title || "Реклама";
    const mobileContent =
      ad?.config?.sidebarMobileContent &&
      ad.config.sidebarMobileContent.trim() !== ""
        ? ad.config.sidebarMobileContent
        : displayAd.content;

    return (
      <div className="w-full">
        <div className="rounded-3xl bg-[#001e1d] text-[#fffffe] shadow-lg border border-[#abd1c6]/30 px-4 py-4">
          {/* Верхняя строка: метка «Реклама» и ссылка «Разместить» */}
          <div className="flex items-center justify-between text-[11px] mb-3">
            <div className="flex items-center gap-1 font-semibold tracking-[0.16em] uppercase text-[#abd1c6]/80">
              <span>Реклама</span>
            </div>
            <a
              href="mailto:support@kopilka-online.ru"
              className="text-[11px] font-semibold text-[#f9bc60] hover:text-[#ffd27f] transition-colors"
            >
              Разместить
            </a>
          </div>

          {/* Основной контент: мини‑картинка + текст */}
          <div className="flex items-start gap-3 mb-3">
            {mobileImageUrl && (
              <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-black/20">
                <img
                  src={mobileImageUrl}
                  alt={mobileTitle}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
            <div className="flex-1 text-left min-w-0">
              <h3 className="text-sm font-semibold mb-1 line-clamp-2 break-words">
                {mobileTitle}
              </h3>
              <p className="text-xs text-[#abd1c6] leading-snug line-clamp-3 break-words">
                {mobileContent}
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

  // Вариант для горизонтального баннера (ДЕСКТОПНАЯ ВЕРСИЯ, используется под кнопками на главной)
  // ВАЖНО: здесь используем ТОЛЬКО десктопные данные (imageUrl, title, content)
  // Для десктопной версии используем только десктопные данные (не мобильные)
  const desktopImageUrl = displayAd.imageUrl;
  const desktopTitle = displayAd.title || "";
  const desktopContent = displayAd.content;

  const handleBlockClick = (e: React.MouseEvent) => {
    // Проверяем, что клик не был по ссылке внутри
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) {
      return;
    }
    if (displayAd.linkUrl) {
      window.open(displayAd.linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  const cardStyle = {
    background: "linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.08)",
  };

  return (
    <div className="w-full">
      <div
        className={`block w-full ${displayAd.linkUrl ? "cursor-pointer" : ""}`}
        onClick={displayAd.linkUrl ? handleBlockClick : undefined}
      >
        <div
          className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
            displayAd.linkUrl
              ? "hover:shadow-[0 8px 32px rgba(0,0,0,0.25)]"
              : ""
          }`}
          style={{
            ...cardStyle,
            height: "260px",
          }}
        >
          {desktopImageUrl && (
            <img
              src={desktopImageUrl}
              alt={desktopTitle}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              loading="lazy"
              decoding="async"
            />
          )}
          {desktopImageUrl && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
          )}

          <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <span
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider"
                style={{ background: "rgba(249, 188, 96, 0.15)", color: "#f9bc60" }}
              >
                <Megaphone className="w-3.5 h-3.5" />
                Реклама
              </span>
              <div className="min-w-0">
                {desktopTitle && (
                  <h3 className="text-base font-semibold text-[#fffffe] mb-0.5 line-clamp-2">
                    {desktopTitle}
                  </h3>
                )}
                <p className="text-sm text-[#abd1c6] leading-snug line-clamp-2 max-w-xl">
                  {desktopContent}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-3">
              <div
                className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                  displayAd.linkUrl
                    ? "bg-[#f9bc60] text-[#001e1d] hover:opacity-90"
                    : "border-2 border-[#f9bc60]/50 text-[#f9bc60] hover:bg-[#f9bc60]/10"
                }`}
              >
                {displayAd.linkUrl
                  ? "Перейти"
                  : "Скоро здесь может быть ваша реклама"}
              </div>
              <a
                href="mailto:support@kopilka-online.ru"
                className="text-xs text-[#abd1c6] hover:text-[#f9bc60] transition-colors underline underline-offset-2"
                onClick={(e) => e.stopPropagation()}
              >
                Написать: support@kopilka-online.ru
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
