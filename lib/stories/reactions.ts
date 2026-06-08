export type StoryReactionType = "HEART" | "THUMBS_UP" | "FIRE";

export type StoryReactionCounts = Record<StoryReactionType, number>;

export const STORY_REACTION_TYPES: StoryReactionType[] = [
  "HEART",
  "THUMBS_UP",
  "FIRE",
];

export const STORY_REACTION_META: Record<
  StoryReactionType,
  { label: string }
> = {
  HEART: { label: "Сердце" },
  THUMBS_UP: { label: "Нравится" },
  FIRE: { label: "Супер" },
};

export function createEmptyStoryReactionCounts(): StoryReactionCounts {
  return {
    HEART: 0,
    THUMBS_UP: 0,
    FIRE: 0,
  };
}

export function isStoryReactionType(
  value: unknown,
): value is StoryReactionType {
  return (
    typeof value === "string" &&
    STORY_REACTION_TYPES.includes(value as StoryReactionType)
  );
}

export function normalizeStoryReactionCounts(
  entries: Array<{ type: StoryReactionType; count: number }>,
): StoryReactionCounts {
  const counts = createEmptyStoryReactionCounts();

  for (const entry of entries) {
    counts[entry.type] = entry.count;
  }

  return counts;
}
