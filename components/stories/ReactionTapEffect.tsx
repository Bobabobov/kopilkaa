"use client";

import type { StoryReactionType } from "@/lib/stories/reactions";
import { cn } from "@/lib/utils";

interface ReactionTapEffectProps {
  type: StoryReactionType;
  /** true — снятие реакции, false — постановка */
  removing: boolean;
}

const TAP_ANIMATION: Record<StoryReactionType, string> = {
  HEART: "animate-reaction-tap-heart",
  THUMBS_UP: "animate-reaction-tap-thumb",
  FIRE: "animate-reaction-tap-flame",
};

const REMOVE_ANIMATION: Record<StoryReactionType, string> = {
  HEART: "animate-reaction-remove-heart",
  THUMBS_UP: "animate-reaction-remove-thumb",
  FIRE: "animate-reaction-remove-flame",
};

/** Вспышка без заливки — только кольцо/свет, чтобы не было «квадрата» на жёлтом ползунке */
export function ReactionTapEffect({ removing }: ReactionTapEffectProps) {
  if (removing) {
    return null;
  }

  return (
    <span
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
      aria-hidden
    >
      <span
        className={cn(
          "absolute inset-[3px] rounded-[10px] border-2 border-[#001e1d]/25",
          "motion-safe:animate-reaction-ring-burst",
        )}
      />
      <span
        className={cn(
          "absolute inset-0 rounded-xl bg-gradient-to-t from-white/35 via-white/10 to-transparent",
          "motion-safe:animate-reaction-flash",
        )}
      />
      <span
        className={cn(
          "absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50",
          "motion-safe:animate-reaction-spark",
        )}
      />
    </span>
  );
}

export function getReactionTapIconAnimation(
  type: StoryReactionType,
  removing: boolean,
  playing: boolean,
): string | undefined {
  if (!playing) return undefined;
  return removing ? REMOVE_ANIMATION[type] : TAP_ANIMATION[type];
}
