// hooks/profile/useProfileUpdates.ts
// Обработка обновлений профиля (тема, аватар)
import { useCallback } from "react";

interface UseProfileUpdatesProps {
  refetch: () => Promise<void>;
}

interface UseProfileUpdatesReturn {
  handleThemeChange: (newTheme: string | null) => Promise<void>;
  handleAvatarChange: (avatarUrl: string | null) => Promise<void>;
}

export function useProfileUpdates({ refetch }: UseProfileUpdatesProps): UseProfileUpdatesReturn {
  const handleThemeChange = useCallback(
    async (_newTheme: string | null) => {
      await refetch();
    },
    [refetch]
  );

  const handleAvatarChange = useCallback(
    async (_avatarUrl: string | null) => {
      await refetch();
    },
    [refetch]
  );

  return {
    handleThemeChange,
    handleAvatarChange,
  };
}


