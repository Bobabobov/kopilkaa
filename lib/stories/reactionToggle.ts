import {
  createEmptyStoryReactionCounts,
  type StoryReactionCounts,
  type StoryReactionType,
} from "@/lib/stories/reactions";

export interface StoryReactionState {
  selectedReaction: StoryReactionType | null;
  reactionCounts: StoryReactionCounts;
  likesCount: number;
}

export interface StoryReactionApiPayload {
  count?: number;
  userReaction?: StoryReactionType | null;
  reactionCounts?: StoryReactionCounts;
}

/** Мгновенное переключение реакции (до ответа сервера). */
export function applyOptimisticReactionToggle(
  state: StoryReactionState,
  type: StoryReactionType,
): { next: StoryReactionState; method: "POST" | "DELETE" } {
  const removing = state.selectedReaction === type;
  const method = removing ? "DELETE" : "POST";
  const reactionCounts = { ...state.reactionCounts };

  if (removing) {
    reactionCounts[type] = Math.max(0, reactionCounts[type] - 1);
    const likesCount = Math.max(0, state.likesCount - 1);
    return {
      method,
      next: {
        selectedReaction: null,
        reactionCounts,
        likesCount,
      },
    };
  }

  if (state.selectedReaction) {
    reactionCounts[state.selectedReaction] = Math.max(
      0,
      reactionCounts[state.selectedReaction] - 1,
    );
  }

  reactionCounts[type] += 1;
  const likesCount =
    state.selectedReaction === null ? state.likesCount + 1 : state.likesCount;

  return {
    method,
    next: {
      selectedReaction: type,
      reactionCounts,
      likesCount,
    },
  };
}

/** Подгонка состояния под ответ API после фонового запроса. */
export function syncReactionStateFromApi(
  payload: StoryReactionApiPayload | null,
  fallback: StoryReactionState,
): StoryReactionState {
  if (!payload) return fallback;

  const reactionCounts =
    payload.reactionCounts ?? fallback.reactionCounts;
  const selectedReaction =
    payload.userReaction !== undefined
      ? payload.userReaction
      : fallback.selectedReaction;
  const likesCount =
    typeof payload.count === "number"
      ? payload.count
      : Object.values(reactionCounts).reduce((sum, n) => sum + n, 0);

  return {
    selectedReaction,
    reactionCounts,
    likesCount,
  };
}

export function createReactionStateFromStory(story: {
  userReaction?: StoryReactionType | null;
  userLiked?: boolean;
  reactionCounts?: StoryReactionCounts;
  _count?: { likes?: number };
}): StoryReactionState {
  return {
    selectedReaction:
      story.userReaction ?? (story.userLiked ? "HEART" : null),
    reactionCounts:
      story.reactionCounts ?? createEmptyStoryReactionCounts(),
    likesCount: story._count?.likes ?? 0,
  };
}
