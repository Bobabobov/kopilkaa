import type { LeaderboardEntry, SubmitDinoRunScorePayload } from "../_types";

export async function getDinoRunLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch("/api/games/dino-run/leaderboard", {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    const data = (await response.json()) as { leaderboard?: LeaderboardEntry[] };
    return Array.isArray(data.leaderboard) ? data.leaderboard : [];
  } catch {
    return [];
  }
}

export async function submitDinoRunScore(
  payload: SubmitDinoRunScorePayload,
): Promise<{ ok: boolean; status: number }> {
  try {
    const response = await fetch("/api/games/dino-run/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { ok: response.ok, status: response.status };
  } catch {
    return { ok: false, status: 0 };
  }
}
