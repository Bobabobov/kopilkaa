"use client";

import LikeButton from "@/components/stories/LikeButton";
import { ShareStoryButton } from "@/components/stories/ShareStoryButton";
import type {
  StoryReactionCounts,
  StoryReactionType,
} from "@/lib/stories/reactions";

interface StoryPageReactionsProps {
  liked: boolean;
  likesCount: number;
  selectedReaction?: StoryReactionType | null;
  reactionCounts?: StoryReactionCounts;
  onLike: (type?: StoryReactionType) => void;
  isAuthenticated?: boolean | null;
  storyId: string;
  storyTitle?: string;
}

export function StoryPageReactions({
  liked,
  likesCount,
  selectedReaction,
  reactionCounts,
  onLike,
  isAuthenticated,
  storyId,
  storyTitle,
}: StoryPageReactionsProps) {
  return (
    <>
      <LikeButton
        liked={liked}
        likesCount={likesCount}
        selectedReaction={selectedReaction}
        reactionCounts={reactionCounts}
        onLike={(_, type) => onLike(type)}
        isAuthenticated={isAuthenticated}
      />
      <ShareStoryButton storyId={storyId} title={storyTitle} />
    </>
  );
}
