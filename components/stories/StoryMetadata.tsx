// components/stories/StoryMetadata.tsx
"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import LikeButton from "./LikeButton";
import { ShareStoryButton } from "./ShareStoryButton";
import type {
  StoryReactionCounts,
  StoryReactionType,
} from "@/lib/stories/reactions";

interface StoryMetadataProps {
  story: {
    user?: {
      name: string | null;
      email: string | null;
    };
    story?: string;
    createdAt?: string;
  };
  liked: boolean;
  likesCount: number;
  selectedReaction?: StoryReactionType | null;
  reactionCounts?: StoryReactionCounts;
  onLike: (type?: StoryReactionType) => void;
  isAuthenticated?: boolean | null;
  isAd?: boolean;
  storyId?: string;
  storyTitle?: string;
}

export default function StoryMetadata({
  story,
  liked,
  likesCount,
  selectedReaction,
  reactionCounts,
  onLike,
  isAuthenticated,
  isAd = false,
  storyId,
  storyTitle,
}: StoryMetadataProps) {
  const readTime = Math.max(1, Math.ceil((story.story?.length || 0) / 200));

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
      <span className="inline-flex items-center gap-2 rounded-xl border border-[#abd1c6]/30 bg-[#001e1d]/40 px-4 py-2.5 text-sm font-semibold text-[#abd1c6]">
        <LucideIcons.Clock size="sm" className="text-[#f9bc60]" />
        {readTime} мин чтения
      </span>

      {!isAd && (
        <LikeButton
          liked={liked}
          likesCount={likesCount}
          selectedReaction={selectedReaction}
          reactionCounts={reactionCounts}
          onLike={(_, type) => onLike(type)}
          isAuthenticated={isAuthenticated}
        />
      )}

      {storyId && <ShareStoryButton storyId={storyId} title={storyTitle} />}
    </div>
  );
}
