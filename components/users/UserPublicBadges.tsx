"use client";

import type { MouseEvent, PointerEvent } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DECEIVER_BADGE,
  type UserPublicBadgeFields,
} from "@/lib/userPublicBadges";
import { cn } from "@/lib/utils";

export type UserPublicBadgesProps = UserPublicBadgeFields & {
  className?: string;
};

function stopBubble(
  e: MouseEvent<HTMLElement> | PointerEvent<HTMLElement>,
): void {
  e.stopPropagation();
}

export function UserPublicBadges({
  markedAsDeceiver,
  className,
}: UserPublicBadgesProps) {
  if (!markedAsDeceiver) return null;

  return (
    <span
      className="inline-flex shrink-0"
      onClick={stopBubble}
      onPointerDown={stopBubble}
      onMouseDown={stopBubble}
    >
      <Tooltip disableHoverableContent delayDuration={200}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex rounded-full border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
            aria-label={`${DECEIVER_BADGE.label}: ${DECEIVER_BADGE.tooltip}`}
            onClick={stopBubble}
            onPointerDown={stopBubble}
          >
            <Badge
              variant="outline"
              className={cn(
                "pointer-events-none shrink-0 border-red-500/60 bg-red-500/15 text-[0.65rem] font-semibold uppercase tracking-wide text-red-300",
                className,
              )}
            >
              {DECEIVER_BADGE.label}
            </Badge>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" className="text-center text-xs">
          {DECEIVER_BADGE.tooltip}
        </TooltipContent>
      </Tooltip>
    </span>
  );
}
