"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface Story {
  id: string;
  title: string;
  summary: string;
  createdAt?: string;
  images?: Array<{ url: string; sort: number }>;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
    hideEmail?: boolean;
  };
  _count?: {
    likes: number;
  };
  userLiked?: boolean;
}

interface StoryCardProps {
  story: Story;
  index: number;
  animate?: boolean; // Опциональный проп для управления анимацией
  isAuthenticated: boolean;
}

export function StoryCard({ story, index, animate = true, isAuthenticated }: StoryCardProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(!!story.userLiked);
  const [likesCount, setLikesCount] = useState(story._count?.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  
  const authorName =
    story.user?.name ||
    (story.user?.email ? story.user.email.split("@")[0] : null) ||
    "Неизвестный автор";
  const mainImage = story.images?.[0]?.url || "/stories-preview.jpg";

  const handleCardClick = () => {
    router.push(`/stories/${story.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiking) return;

    // Проверяем авторизацию
    if (!isAuthenticated) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/?modal=auth/signup&next=${next}`);
      return;
    }

    try {
      setIsLiking(true);
      const method = liked ? "DELETE" : "POST";
      const response = await fetch(`/api/stories/${story.id}/like`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          const next = encodeURIComponent(window.location.pathname + window.location.search);
          router.push(`/?modal=auth/signup&next=${next}`);
          return;
        }
        const errorData = await response.json();
        console.error("Ошибка лайка:", errorData.message);
        return;
      }

      // Обновляем локально для мгновенной реакции
      const newLikedState = !liked;
      setLiked(newLikedState);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const renderCardContent = () => (
    <div
      role="link"
      tabIndex={0}
      aria-label={`Открыть историю: ${story.title}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="relative bg-gradient-to-br from-white/98 via-white/95 to-white/90 backdrop-blur-2xl rounded-3xl p-0 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-700 border border-[#abd1c6]/50 hover:border-[#f9bc60]/80 hover:-translate-y-3 hover:scale-[1.03] h-full max-w-full overflow-hidden flex flex-col group cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#f9bc60]/40"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 50%, rgba(249,188,96,0.15) 100%)",
        boxShadow:
          "0 20px 25px -5px rgba(0, 70, 67, 0.15), 0 10px 10px -5px rgba(0, 70, 67, 0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      {/* Декоративный градиент при hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f9bc60]/0 via-[#f9bc60]/0 to-[#f9bc60]/0 group-hover:from-[#f9bc60]/5 group-hover:via-[#f9bc60]/10 group-hover:to-[#f9bc60]/5 transition-all duration-700 rounded-3xl pointer-events-none"></div>
      
      {/* Изображение */}
      <div className="relative mb-5 rounded-t-3xl overflow-hidden flex-shrink-0 shadow-xl group-hover:shadow-2xl transition-all duration-700">
        <div className="relative w-full h-56 overflow-hidden">
          <img
            src={mainImage}
            alt={story.title}
            loading="lazy"
            width={800}
            height={320}
            className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-1000 ease-out"
          />
          {/* Градиентный overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 group-hover:via-black/10 transition-all duration-700"></div>
          
          {/* Акцентная полоса снизу */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#f9bc60] via-[#e8a545] to-[#f9bc60] group-hover:h-3 transition-all duration-700 shadow-lg shadow-[#f9bc60]/50"></div>
          
          {/* Блестящий эффект при hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/0 group-hover:via-white/20 group-hover:to-white/0 transition-all duration-1000 opacity-0 group-hover:opacity-100"></div>
          
          {/* Счетчик лайков поверх изображения - только если есть лайки */}
          {likesCount > 0 && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20 shadow-lg group-hover:bg-black/80 group-hover:scale-110 transition-all duration-300">
              <LucideIcons.Heart size="xs" className={`${liked ? "fill-red-400" : ""} text-red-400`} />
              <span className="text-white text-xs font-bold">{likesCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Контент */}
      <div className="flex flex-col flex-1 min-w-0 px-5 sm:px-6 pb-5 sm:pb-6 relative z-10">
        {/* Заголовок */}
        <div className="mb-3">
          <h3
            className="text-lg sm:text-xl md:text-2xl font-black leading-tight line-clamp-2 break-words overflow-hidden transition-all duration-500 group-hover:text-[#004643]"
            style={{ 
              color: "#001e1d",
              textShadow: "0 2px 4px rgba(0,0,0,0.08)"
            }}
          >
            {story.title}
          </h3>
        </div>

        {/* Описание */}
        <div className="mb-4 flex-1">
          <p
            className="text-sm sm:text-base leading-relaxed line-clamp-3 break-words overflow-hidden transition-all duration-500 group-hover:text-[#2d5a4e]"
            style={{ color: "#2d5a4e" }}
          >
            {story.summary}
          </p>
        </div>

        {/* Метаданные - новая верстка */}
        <div className="space-y-3 flex-shrink-0">
          {/* Верхняя строка: Автор и время чтения */}
          <div className="flex items-center gap-2 flex-wrap">
            {story.user?.id ? (
              <Link
                href={`/profile/${story.user.id}`}
                className="flex items-center gap-2 group/author bg-gradient-to-r from-[#abd1c6]/20 to-[#94c4b8]/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-[#abd1c6]/40 hover:border-[#f9bc60]/60 hover:from-[#abd1c6]/30 hover:to-[#94c4b8]/30 transition-all duration-300 hover:shadow-md hover:scale-[1.02] flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={story.user.avatar || "/default-avatar.png"}
                    alt={authorName}
                    className="w-7 h-7 rounded-full object-cover border-2 border-[#abd1c6]/60 group-hover/author:border-[#f9bc60] transition-all duration-300 shadow-sm"
                  />
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-[#f9bc60]/30 to-transparent opacity-0 group-hover/author:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
                <span className="text-sm font-bold text-[#001e1d] group-hover/author:text-[#004643] transition-colors duration-300 whitespace-nowrap">
                  {authorName}
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#abd1c6]/20 to-[#94c4b8]/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-[#abd1c6]/40 flex-shrink-0">
                <img
                  src={story.user?.avatar || "/default-avatar.png"}
                  alt={authorName}
                  className="w-7 h-7 rounded-full object-cover border-2 border-[#abd1c6]/60"
                />
                <span className="text-sm font-bold text-[#001e1d] whitespace-nowrap">
                  {authorName}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#abd1c6]/20 to-[#94c4b8]/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-[#abd1c6]/40 hover:border-[#f9bc60]/60 hover:from-[#abd1c6]/30 hover:to-[#94c4b8]/30 transition-all duration-300 hover:shadow-md hover:scale-[1.02] flex-shrink-0">
              <LucideIcons.Clock size="sm" className="text-[#004643]" />
              <span className="text-sm font-bold text-[#001e1d]">
                {Math.ceil(story.summary.length / 200)} мин
              </span>
            </div>
          </div>

          {/* Нижняя строка: Лайк и дата */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#abd1c6]/30 group-hover:border-[#f9bc60]/40 transition-colors duration-500">
            {/* Кнопка лайка */}
            <button
              onClick={handleLike}
              disabled={isLiking || isAuthenticated === false}
              className={`flex items-center gap-2 bg-gradient-to-r backdrop-blur-sm rounded-xl px-4 py-2.5 border transition-all duration-300 flex-shrink-0 ${
                isLiking || isAuthenticated === false
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95"
              } ${
                liked
                  ? "from-red-50/90 to-pink-50/90 border-[#e16162]/60 shadow-md shadow-red-200/30"
                  : "from-white/40 to-white/30 border-[#abd1c6]/40 hover:border-[#e16162]/60 hover:from-red-50/50 hover:to-pink-50/50"
              }`}
              title={isAuthenticated === false ? "Войдите в систему, чтобы ставить лайки" : liked ? "Убрать лайк" : "Поставить лайк"}
            >
              {isLiking ? (
                <LucideIcons.Loader2 size="sm" className="text-[#e16162] animate-spin" />
              ) : (
                <LucideIcons.Heart
                  size="sm"
                  className={`transition-all duration-300 ${
                    liked
                      ? "text-[#e16162] fill-[#e16162] scale-110"
                      : "text-[#e16162] group-hover:scale-125"
                  }`}
                />
              )}
              <span className={`text-sm font-bold transition-colors duration-300 ${
                liked ? "text-[#e16162]" : "text-[#e16162]"
              }`}>
                {likesCount}
              </span>
            </button>

            {/* Дата */}
            <div className="flex items-center gap-1.5 text-xs">
              <LucideIcons.Calendar size="xs" className="text-[#2d5a4e]/70" />
              <span
                className="font-semibold transition-colors duration-500 group-hover:text-[#004643] uppercase tracking-wide"
                style={{ color: "#2d5a4e" }}
              >
                {story.createdAt
                  ? new Date(story.createdAt).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Дата неизвестна"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Если анимация отключена, рендерим без motion
  if (!animate) {
    return <div className="group">{renderCardContent()}</div>;
  }

  // С анимацией (только при первой загрузке)
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
    >
      {renderCardContent()}
    </motion.div>
  );
}
