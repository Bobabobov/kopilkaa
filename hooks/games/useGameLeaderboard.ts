'use client';

import { useEffect, useState } from 'react';
import {
  getGameLeaderboardMeta,
  type GameLeaderboardEntry,
  type GameLeaderboardId,
  type GameLeaderboardMeta,
} from '@/lib/games/leaderboard';

interface LeaderboardApiResponse {
  success: boolean;
  data: GameLeaderboardEntry[];
}

export function useGameLeaderboard(gameId: GameLeaderboardId): {
  entries: GameLeaderboardEntry[];
  isLoading: boolean;
  meta: GameLeaderboardMeta;
} {
  const [entries, setEntries] = useState<GameLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const meta = getGameLeaderboardMeta(gameId);

  useEffect(() => {
    let cancelled = false;

    async function loadLeaderboard() {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/games/leaderboard?game=${gameId}`, {
          cache: 'no-store',
        });
        const payload = (await response.json()) as LeaderboardApiResponse;

        if (!cancelled && payload.success && Array.isArray(payload.data)) {
          setEntries(payload.data);
        }
      } catch {
        if (!cancelled) {
          setEntries([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadLeaderboard();

    return () => {
      cancelled = true;
    };
  }, [gameId]);

  return { entries, isLoading, meta };
}
