// API сервисы для игры

import type { UserProfile, LeaderboardEntry } from "../_types";

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

export async function submitScore(score: number): Promise<boolean> {
  try {
    const response = await fetch("/api/games/coin-catch/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ score }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error submitting score:", error);
    return false;
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
