// API сервисы для игры

import type { UserProfile, LeaderboardEntry } from "../_types";

export type CoinCatchStatus =
  | { canPlay: true; mode: "test"; testAttemptsLeft: number }
  | { canPlay: true; mode: "real"; testAttemptsLeft: 0 }
  | { canPlay: false; mode: "banned"; bannedUntil: string };

export async function getGameStatus(): Promise<CoinCatchStatus | null> {
  try {
    const response = await fetch("/api/games/coin-catch/status", {
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data as CoinCatchStatus;
  } catch (error) {
    console.error("Error fetching game status:", error);
    return null;
  }
}

export async function getMe(): Promise<UserProfile | null> {
  try {
    const response = await fetch("/api/profile/me", { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (!data?.user) {
      return null;
    }
    const user = data.user;
    return {
      id: user.id,
      displayName: user.name || user.username || "Игрок",
      username: user.username,
      name: user.name,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export type SubmitScoreResult =
  | { success: true; isTest: boolean; status?: CoinCatchStatus }
  | { success: false; error?: string };

export async function submitScore(score: number): Promise<SubmitScoreResult> {
  try {
    const response = await fetch("/api/games/coin-catch/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { success: false, error: (data as { error?: string }).error };
    }
    const d = data as { isTest?: boolean; status?: CoinCatchStatus };
    return {
      success: true,
      isTest: d.isTest ?? false,
      status: d.status,
    };
  } catch (error) {
    console.error("Error submitting score:", error);
    return { success: false };
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch("/api/games/coin-catch/leaderboard", {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.leaderboard || [];
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}
