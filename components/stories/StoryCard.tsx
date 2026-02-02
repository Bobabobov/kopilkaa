"use client";

import { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { buildAuthModalUrl } from "@/lib/authModalUrl";
import { submitPendingApplicationIfNeeded } from "@/lib/applications/pendingSubmission";
import { StoryCardContent } from "./story-card/StoryCardContent";
import type { Story } from "./story-card/types";

interface StoryCardProps {
  story: Story;
  index: number;
  animate?: boolean;
  isAuthenticated: boolean;
  query?: string;
  isRead?: boolean;
}

function StoryCardInner({
  story,
  index,
  animate = true,
  isAuthenticated,
  query = "",
  isRead = false,
}: StoryCardProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(!!story.userLiked);
  const [likesCount, setLikesCount] = useState(story._count?.likes || 0);
  const [isLiking, setIsLiking] = useState(false);

  const authorName =
    story.user?.name ||
    (story.user?.email ? story.user.email.split("@")[0] : null) ||
    "Неизвестный автор";
  const mainImage = story.images?.[0]?.url || "/stories-preview.jpg";
  const amountText =
    typeof story.amount === "number"
      ? new Intl.NumberFormat("ru-RU").format(story.amount)
      : null;

  const handleCardClick = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("stories-scroll", String(window.scrollY));
    }
    router.push(`/stories/${story.id}`);
  }, [story.id, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleCardClick();
      }
    },
    [handleCardClick],
  );

  const handleLike = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiking) return;

    // Проверяем авторизацию
    if (!isAuthenticated) {
      router.push(
        buildAuthModalUrl({
          pathname: window.location.pathname,
          search: window.location.search,
          modal: "auth/signup",
        }),
      );
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
          router.push(
            buildAuthModalUrl({
              pathname: window.location.pathname,
              search: window.location.search,
              modal: "auth/signup",
            }),
          );
          return;
        }
        const errorData = await response.json();
        console.error("Ошибка лайка:", errorData.error || errorData.message);
        return;
      }

      // Обновляем локально для мгновенной реакции
      const newLikedState = !liked;
      setLiked(newLikedState);
      setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

      if (method === "POST") {
        const submitted = await submitPendingApplicationIfNeeded();
        if (submitted && typeof window !== "undefined") {
          window.location.href = "/applications";
        }
      }
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setIsLiking(false);
    }
  }, [story.id, isAuthenticated, liked, router]);

  const renderCardContent = () => (
    <StoryCardContent
      story={story}
      isRead={isRead}
      liked={liked}
      likesCount={likesCount}
      isLiking={isLiking}
      isAuthenticated={isAuthenticated}
      query={query}
      authorName={authorName}
      mainImage={mainImage}
      amountText={amountText}
      onCardClick={handleCardClick}
      onCardKeyDown={handleKeyDown}
      onLike={handleLike}
    />
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

// Мемоизация по рекомендации React: меньше ререндеров при обновлении родителя
export const StoryCard = memo(StoryCardInner, (prev, next) => {
  return (
    prev.story.id === next.story.id &&
    prev.index === next.index &&
    prev.animate === next.animate &&
    prev.isAuthenticated === next.isAuthenticated &&
    prev.query === next.query &&
    prev.isRead === next.isRead
  );
});
