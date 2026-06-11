"use client";

import { memo, useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { buildAuthModalUrl } from "@/lib/authModalUrl";
import { submitPendingApplicationIfNeeded } from "@/lib/applications/pendingSubmission";
import { StoryCardContent } from "./story-card/StoryCardContent";
import type { Story } from "./story-card/types";
import { logRouteCatchError } from "@/lib/api/parseApiError";
import {
  createEmptyStoryReactionCounts,
  type StoryReactionCounts,
  type StoryReactionType,
} from "@/lib/stories/reactions";
import {
  applyOptimisticReactionToggle,
  createReactionStateFromStory,
  syncReactionStateFromApi,
  type StoryReactionState,
} from "@/lib/stories/reactionToggle";
import { submitStoryReaction } from "@/lib/stories/submitStoryReaction";

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
  const [selectedReaction, setSelectedReaction] =
    useState<StoryReactionType | null>(
      story.userReaction ?? (story.userLiked ? "HEART" : null),
    );
  const [likesCount, setLikesCount] = useState(story._count?.likes || 0);
  const [reactionCounts, setReactionCounts] = useState<StoryReactionCounts>(
    story.reactionCounts ?? createEmptyStoryReactionCounts(),
  );
  const liked = Boolean(selectedReaction);
  const reactionRequestSeq = useRef(0);

  const applyReactionState = useCallback((state: StoryReactionState) => {
    setSelectedReaction(state.selectedReaction);
    setReactionCounts(state.reactionCounts);
    setLikesCount(state.likesCount);
  }, []);

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

  const handleLike = useCallback(
    async (e?: React.MouseEvent, type: StoryReactionType = "HEART") => {
      e?.preventDefault();
      e?.stopPropagation();

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

      const before = createReactionStateFromStory({
        userReaction: selectedReaction,
        reactionCounts,
        _count: { likes: likesCount },
      });
      const { next, method } = applyOptimisticReactionToggle(before, type);
      applyReactionState(next);

      const requestId = ++reactionRequestSeq.current;

      try {
        const result = await submitStoryReaction(story.id, method, type);

        if (requestId !== reactionRequestSeq.current) return;

        if (!result.ok) {
          if (result.status === 401) {
            applyReactionState(before);
            router.push(
              buildAuthModalUrl({
                pathname: window.location.pathname,
                search: window.location.search,
                modal: "auth/signup",
              }),
            );
            return;
          }
          applyReactionState(before);
          logRouteCatchError(
            "[StoryCard] like",
            new Error(result.error ?? `Код ${result.status}`),
          );
          return;
        }

        applyReactionState(
          syncReactionStateFromApi(result.data, next),
        );

        if (method === "POST") {
          const submitted = await submitPendingApplicationIfNeeded();
          if (submitted && typeof window !== "undefined") {
            window.location.href = "/applications";
          }
        }
      } catch (error) {
        if (requestId === reactionRequestSeq.current) {
          applyReactionState(before);
        }
        logRouteCatchError("[StoryCard] handleLike", error);
      }
    },
    [
      story.id,
      isAuthenticated,
      selectedReaction,
      reactionCounts,
      likesCount,
      router,
      applyReactionState,
    ],
  );

  const renderCardContent = () => (
    <StoryCardContent
      story={story}
      isRead={isRead}
      liked={liked}
      likesCount={likesCount}
      selectedReaction={selectedReaction}
      reactionCounts={reactionCounts}
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
