"use client";

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  STORY_REACTION_META,
  STORY_REACTION_TYPES,
  createEmptyStoryReactionCounts,
  type StoryReactionCounts,
  type StoryReactionType,
} from "@/lib/stories/reactions";
import { StoryReactionIcon } from "@/components/stories/StoryReactionIcon";
import {
  ReactionTapEffect,
  getReactionTapIconAnimation,
} from "@/components/stories/ReactionTapEffect";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  liked: boolean;
  likesCount: number;
  selectedReaction?: StoryReactionType | null;
  reactionCounts?: StoryReactionCounts;
  onLike: (e?: React.MouseEvent, type?: StoryReactionType) => void;
  isAuthenticated?: boolean | null;
  /** @deprecated Загрузка не показывается — оставлено для совместимости */
  isLiking?: boolean;
  variant?: "dark" | "light";
}

interface TapBurst {
  type: StoryReactionType;
  removing: boolean;
  /** Переключение с одной реакции на другую — без тяжёлой вспышки (квадрат на ползунке) */
  switching: boolean;
}

interface PillLayout {
  x: number;
  width: number;
}

const TAP_MS = 560;

const EMPTY_PILL: PillLayout = { x: 0, width: 0 };

function LikeButtonComponent({
  liked,
  likesCount,
  selectedReaction,
  reactionCounts,
  onLike,
  isAuthenticated,
  variant = "dark",
}: LikeButtonProps) {
  const [burst, setBurst] = useState<TapBurst | null>(null);
  const [pill, setPill] = useState<PillLayout>(EMPTY_PILL);
  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Partial<Record<StoryReactionType, HTMLButtonElement>>>(
    {},
  );

  const activeReaction = selectedReaction ?? (liked ? "HEART" : null);
  const counts = reactionCounts ?? {
    ...createEmptyStoryReactionCounts(),
    HEART: likesCount,
  };

  const measurePill = useCallback(() => {
    const track = trackRef.current;
    if (!track || !activeReaction) {
      setPill(EMPTY_PILL);
      return;
    }

    const btn = buttonRefs.current[activeReaction];
    if (!btn) {
      setPill(EMPTY_PILL);
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setPill({
      x: btnRect.left - trackRect.left,
      width: btnRect.width,
    });
  }, [activeReaction]);

  useLayoutEffect(() => {
    measurePill();
  }, [measurePill, counts.HEART, counts.THUMBS_UP, counts.FIRE]);

  useEffect(() => {
    window.addEventListener("resize", measurePill);
    return () => window.removeEventListener("resize", measurePill);
  }, [measurePill]);

  const handleClick = useCallback(
    (e: React.MouseEvent, type: StoryReactionType) => {
      e.preventDefault();
      e.stopPropagation();
      const removing = activeReaction === type;
      const switching = Boolean(activeReaction) && activeReaction !== type;
      setBurst({ type, removing, switching });
      window.setTimeout(() => setBurst(null), TAP_MS);
      onLike(e, type);
    },
    [onLike, activeReaction],
  );

  const wrapperClasses =
    variant === "light"
      ? "border-[#abd1c6]/40 bg-white/55 shadow-sm"
      : "border-[#abd1c6]/25 bg-[#001e1d]/45";
  const inactiveClasses =
    variant === "light"
      ? "text-[#2d5a4e] hover:text-[#001e1d]"
      : "text-[#abd1c6] hover:text-[#fffffe]";
  const activeTextClasses = "text-[#001e1d]";

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-2xl border p-1 ${wrapperClasses}`}
      title={
        isAuthenticated === false
          ? "Войдите в систему, чтобы оставить реакцию"
          : "Реакции на историю"
      }
    >
      <div
        ref={trackRef}
        className="reaction-picker relative isolate inline-flex items-center gap-1 overflow-hidden rounded-xl"
      >
        {activeReaction && pill.width > 0 && (
          <span
            aria-hidden
            className="reaction-picker-pill pointer-events-none absolute top-0 bottom-0 z-0 rounded-xl bg-[#f9bc60] shadow-[0_6px_18px_rgba(249,188,96,0.28)]"
            style={{
              width: pill.width,
              transform: `translate3d(${pill.x}px, 0, 0)`,
            }}
          />
        )}

        {STORY_REACTION_TYPES.map((type) => {
          const meta = STORY_REACTION_META[type];
          const isActive = activeReaction === type;
          const count = counts[type];
          const isBurst = burst?.type === type;
          const tapRemoving = Boolean(isBurst && burst?.removing);
          const tapSwitching = Boolean(isBurst && burst?.switching);

          return (
            <button
              key={type}
              ref={(el) => {
                if (el) buttonRefs.current[type] = el;
                else delete buttonRefs.current[type];
              }}
              type="button"
              onClick={(e) => handleClick(e, type)}
              aria-pressed={isActive}
              aria-label={
                isActive
                  ? `Убрать реакцию: ${meta.label}`
                  : `Поставить реакцию: ${meta.label}`
              }
              className={cn(
                "group/reaction relative z-[1] inline-flex h-9 min-w-9 items-center justify-center gap-1 overflow-hidden rounded-xl bg-transparent px-2.5 text-sm font-bold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/60",
                variant === "light"
                  ? "focus-visible:ring-offset-white"
                  : "focus-visible:ring-offset-[#001e1d]",
                isActive ? activeTextClasses : inactiveClasses,
                "cursor-pointer motion-safe:active:scale-[0.92]",
                "motion-safe:hover:scale-105",
                isBurst && "reaction-btn-burst",
              )}
            >
              {isBurst && !tapRemoving && !tapSwitching && (
                <ReactionTapEffect type={type} removing={false} />
              )}

              <StoryReactionIcon
                type={type}
                size="sm"
                active={isActive}
                hoverMotion={!isBurst && !isActive}
                className={cn(
                  "relative z-[1] shrink-0",
                  getReactionTapIconAnimation(type, tapRemoving, isBurst),
                )}
              />

              {count > 0 && (
                <span
                  className={cn(
                    "relative z-[1] tabular-nums",
                    isBurst && "motion-safe:animate-reaction-count-pop",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(LikeButtonComponent);
