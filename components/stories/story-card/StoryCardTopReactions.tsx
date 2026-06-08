import {
  STORY_REACTION_TYPES,
  type StoryReactionCounts,
} from "@/lib/stories/reactions";
import { StoryReactionIcon } from "@/components/stories/StoryReactionIcon";
import { cn } from "@/lib/utils";

interface StoryCardTopReactionsProps {
  reactionCounts: StoryReactionCounts;
  isWinner: boolean;
}

export function StoryCardTopReactions({
  reactionCounts,
  isWinner,
}: StoryCardTopReactionsProps) {
  const items = STORY_REACTION_TYPES.filter(
    (type) => reactionCounts[type] > 0,
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute z-30 flex items-center gap-0.5 rounded-full",
        "border border-[#001e1d]/15 bg-[#f9bc60] px-1.5 py-1",
        "shadow-[0_4px_18px_rgba(0,0,0,0.4)] ring-1 ring-white/40",
        "transition-[transform,box-shadow] duration-300",
        "group-hover:scale-[1.04] group-hover:shadow-[0_6px_22px_rgba(249,188,96,0.55)]",
        isWinner ? "top-16 right-4" : "top-4 right-4",
      )}
      aria-label="Реакции на историю"
    >
      {items.map((type, index) => (
        <span
          key={type}
          className={cn(
            "inline-flex items-center gap-1 px-1.5 py-0.5 text-[#001e1d]",
            index > 0 && "border-l border-[#001e1d]/15",
          )}
        >
          <StoryReactionIcon type={type} size="xs" active className="shrink-0" />
          <span className="text-xs font-extrabold tabular-nums leading-none">
            {reactionCounts[type]}
          </span>
        </span>
      ))}
    </div>
  );
}
