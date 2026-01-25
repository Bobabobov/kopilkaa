import { useEffect, useState } from "react";
import { useAutoHideScrollbar } from "@/lib/useAutoHideScrollbar";

interface AchievementData {
  id: string;
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: string;
    type: string;
    isExclusive: boolean;
  };
  unlockedAt: string;
}

export interface AchievementProgress {
  achievement: any;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progressPercentage: number;
}

interface AchievementStats {
  unlockedAchievements: number;
  totalAchievements: number;
  completionPercentage: number;
}

export function useAchievementsData(isOpen: boolean) {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [allAchievements, setAllAchievements] = useState<AchievementProgress[]>(
    [],
  );
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useAutoHideScrollbar();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && mounted) {
      setLoading(true);
      setError(null);
      fetch("/api/achievements/user")
        .then((r) => r.json())
        .then((data) => {
          if (data && data.success) {
            setAchievements(data.data.achievements || []);
            setAllAchievements(data.data.progress || []);
            setStats(data.data.stats || null);
          } else {
            setError("Не удалось загрузить достижения");
          }
        })
        .catch(() => setError("Ошибка загрузки достижений"))
        .finally(() => setLoading(false));
    }
  }, [isOpen, mounted]);

  return { achievements, allAchievements, stats, loading, error, mounted };
}
