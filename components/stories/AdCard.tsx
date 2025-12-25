"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useRouter } from "next/navigation";

interface AdCardProps {
  index: number;
}

interface StoriesAdConfig {
  storyTitle?: string;
  storyText?: string;
  storyImageUrls?: string[];
}

interface StoriesAd {
  title?: string;
  content?: string;
  imageUrl?: string | null;
  linkUrl?: string | null;
  config?: StoriesAdConfig | null;
}

// Функция для извлечения чистого текста из HTML
const stripHTML = (html: string): string => {
  if (!html) return "";
  // Простой способ: убираем все HTML теги через регулярное выражение
  return html.replace(/<[^>]*>/g, "").trim();
};

export function AdCard({ index }: AdCardProps) {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [cardTitle, setCardTitle] = useState("Разместите свою рекламу здесь!");
  const [cardText, setCardText] = useState(
    "Привлекайте новых клиентов с помощью рекламы в разделе историй!"
  );
  const [ctaLink, setCtaLink] = useState<string | null>(null);
  const [hasActiveAd, setHasActiveAd] = useState(false);

  useEffect(() => {
    const loadPreviewImage = async () => {
      try {
        const response = await fetch("/api/ads/stories", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();
        const ad: StoriesAd | null = data.ad;
        if (!ad) {
          setHasActiveAd(false);
          return;
        }

        setHasActiveAd(true);

        const config = ad.config || {};

        // Картинка для превью: сначала берём imageUrl (поле "Картинка для превью"),
        // а картинки истории остаются только для самой страницы истории
        setPreviewImage(ad.imageUrl ?? null);

        // Ссылка для кнопки
        setCtaLink(ad.linkUrl ?? null);

        // Текст для карточки
        const titleFromAd = config.storyTitle || ad.title;
        const textFromAd = ad.content || config.storyText || "";

        if (titleFromAd) {
          // Извлекаем чистый текст из HTML для заголовка
          setCardTitle(stripHTML(titleFromAd));
        }

        if (textFromAd) {
          // Извлекаем чистый текст из HTML для превью
          setCardText(stripHTML(textFromAd));
        }
      } catch (error) {
        console.error("Error loading stories ad preview:", error);
      }
    };

    loadPreviewImage();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group"
      onClick={() => router.push("/stories/ad")}
    >
      <div
        className="bg-gradient-to-br from-[#004643]/95 to-[#001e1d]/95 backdrop-blur-xl rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-[#f9bc60]/40 hover:-translate-y-2 hover:scale-[1.02] h-full max-w-full overflow-hidden flex flex-col group-hover:border-[#f9bc60]/60 cursor-pointer"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,70,67,0.95) 0%, rgba(0,30,29,0.95) 50%, rgba(249,188,96,0.1) 100%)",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Рекламная метка */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-[#f9bc60] text-[#001e1d] px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-[#f9bc60]/20">
            РЕКЛАМА
          </div>
        </div>

        {/* Изображение */}
        <div className="relative mb-4 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg h-52">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Превью рекламной истории"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Если изображение не загрузилось, показываем placeholder
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  const placeholder = parent.querySelector(".image-placeholder") as HTMLElement;
                  if (placeholder) {
                    placeholder.style.display = "flex";
                  }
                }
              }}
            />
          ) : (
            <div className="image-placeholder w-full h-full bg-gradient-to-br from-[#f9bc60]/20 to-[#e8a545]/20 flex items-center justify-center border-2 border-[#f9bc60]/30 rounded-2xl">
              <div className="text-center">
                <LucideIcons.Megaphone
                  size="lg"
                  className="text-[#f9bc60] mb-2 mx-auto"
                />
                <p className="text-[#f9bc60] font-semibold text-sm">
                  Превью рекламной истории
                </p>
                <p className="text-[#abd1c6] text-xs mt-1">Рекомендуем 16:9</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/20 transition-all duration-500"></div>
          {/* Акцентная полоса */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#f9bc60] via-[#e8a545] to-[#f9bc60] group-hover:h-2 transition-all duration-500"></div>
          {/* Overlay эффект */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#004643]/0 to-[#004643]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Контент */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Заголовок */}
          <h3 className="text-xl font-bold transition-all duration-300 line-clamp-2 break-words overflow-hidden mb-3 h-16 group-hover:text-[#f9bc60] group-hover:scale-[1.02] text-[#fffffe]">
            {cardTitle}
          </h3>

          {/* Описание */}
          <p className="text-sm leading-relaxed line-clamp-3 break-words overflow-hidden flex-1 mb-4 h-20 transition-all duration-300 group-hover:text-[#abd1c6] group-hover:scale-[1.01] text-[#abd1c6]">
            {cardText}
          </p>

          {/* Метаданные */}
          <div className="bg-gradient-to-r from-[#abd1c6]/80 to-[#94c4b8]/70 rounded-2xl p-3 border-2 border-[#abd1c6]/60 shadow-lg flex-shrink-0 transition-all duration-300 group-hover:shadow-xl group-hover:border-[#f9bc60]/40 group-hover:bg-gradient-to-r group-hover:from-[#abd1c6]/90 group-hover:to-[#94c4b8]/80">
            <div className="flex items-center justify-between text-xs">
              {!hasActiveAd && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-gradient-to-r from-[#f9bc60]/20 to-[#e8a545]/20 rounded-lg px-2 py-1 shadow-md border border-[#f9bc60]/40 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-[#f9bc60]/60">
                  <span className="font-bold text-[#001e1d] text-xs">
                    от 2тыс
                  </span>
                </div>
              </div>
              )}

              <div className="flex items-center gap-1 bg-white/90 rounded-lg px-2 py-1 shadow-md border border-[#abd1c6]/40 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-[#f9bc60]/60">
                <LucideIcons.ArrowRight size="sm" className="text-[#004643]" />
                <a
                  href={ctaLink || "/advertising"}
                  target={ctaLink ? "_blank" : undefined}
                  rel={ctaLink ? "noopener noreferrer" : undefined}
                  className="font-medium text-[#001e1d] text-xs hover:text-[#f9bc60] transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {ctaLink ? "Перейти на сайт" : "Разместить"}
                </a>
              </div>
            </div>
          </div>

          {/* Дата */}
          <div className="pt-3 border-t mt-4 flex-shrink-0 transition-all duration-300 group-hover:border-[#f9bc60]/40 border-[#abd1c6]/50">
            <span className="text-xs font-medium transition-colors duration-300 group-hover:text-[#f9bc60] text-[#abd1c6]">
              Всегда первая позиция
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
