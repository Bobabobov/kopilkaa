"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import type { StoryReactionType } from "@/lib/stories/reactions";
import { cn } from "@/lib/utils";

interface StoryReactionIconProps {
  type: StoryReactionType;
  size?: "xs" | "sm" | "md";
  className?: string;
  active?: boolean;
  /** Анимация при наведении (fine pointer) */
  hoverMotion?: boolean;
}

const REACTION_COLOR: Record<StoryReactionType, string> = {
  HEART: "text-[#e16162]",
  THUMBS_UP: "text-[#abd1c6]",
  FIRE: "text-[#f9bc60]",
};

const REACTION_COLOR_ACTIVE: Record<StoryReactionType, string> = {
  HEART: "text-[#9b1c1c] fill-[#9b1c1c]",
  THUMBS_UP: "text-[#001e1d]",
  FIRE: "text-[#001e1d]",
};

const REACTION_HOVER_COLOR: Record<StoryReactionType, string> = {
  HEART: "group-hover/reaction:text-[#e16162]",
  THUMBS_UP: "group-hover/reaction:text-[#abd1c6]",
  FIRE: "group-hover/reaction:text-[#f9bc60]",
};

const REACTION_HOVER_MOTION: Record<StoryReactionType, string> = {
  HEART:
    "reaction-icon-hover-motion motion-safe:group-hover/reaction:animate-reaction-heart-hover motion-safe:group-hover/reaction:scale-110",
  THUMBS_UP:
    "reaction-icon-hover-motion motion-safe:group-hover/reaction:animate-reaction-thumb-hover",
  FIRE:
    "reaction-icon-hover-motion motion-safe:group-hover/reaction:animate-reaction-flame-hover",
};

export function StoryReactionIcon({
  type,
  size = "sm",
  className,
  active = false,
  hoverMotion = false,
}: StoryReactionIconProps) {
  const iconClass = cn(
    "transition-colors duration-200",
    active ? REACTION_COLOR_ACTIVE[type] : REACTION_COLOR[type],
    hoverMotion && !active && REACTION_HOVER_COLOR[type],
    hoverMotion && !active && REACTION_HOVER_MOTION[type],
    className,
  );

  switch (type) {
    case "HEART":
      return <LucideIcons.Heart size={size} className={iconClass} />;
    case "THUMBS_UP":
      return <LucideIcons.ThumbsUp size={size} className={iconClass} />;
    case "FIRE":
      return <LucideIcons.Flame size={size} className={iconClass} />;
  }
}
