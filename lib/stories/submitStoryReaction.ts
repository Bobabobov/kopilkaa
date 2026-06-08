import type { StoryReactionApiPayload } from "@/lib/stories/reactionToggle";
import type { StoryReactionType } from "@/lib/stories/reactions";

export async function submitStoryReaction(
  storyId: string,
  method: "POST" | "DELETE",
  type: StoryReactionType,
): Promise<{ ok: true; data: StoryReactionApiPayload } | { ok: false; status: number; error?: string }> {
  const response = await fetch(`/api/stories/${storyId}/like`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(method === "POST" ? { body: JSON.stringify({ type }) } : {}),
  });

  const data = (await response.json().catch(() => null)) as
    | (StoryReactionApiPayload & { error?: string; message?: string })
    | null;

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error:
        typeof data?.error === "string"
          ? data.error
          : typeof data?.message === "string"
            ? data.message
            : undefined,
    };
  }

  return { ok: true, data: data ?? {} };
}
