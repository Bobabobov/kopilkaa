import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string | null;
  username?: string | null;
  role: "USER" | "ADMIN";
  name?: string | null;
  createdAt: string;
  avatar?: string | null;
  headerTheme?: string | null;
  avatarFrame?: string | null;
  hideEmail?: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  lastSeen?: string | null;
  isBanned?: boolean;
  bannedUntil?: string | null;
  bannedReason?: string | null;
};

interface UseOtherUserDataParams {
  userId: string;
}

export function useOtherUserData({ userId }: UseOtherUserDataParams) {
  const [user, setUser] = useState<User | null>(null);
  const [resolvedUserId, setResolvedUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Проверка авторизации
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/profile/me", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setCurrentUserId(data.user.id);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Загрузка данных пользователя
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadUserData = async () => {
      try {
        setLoading(true);

        const userResponse = await fetch(`/api/users/${userId}`, {
          cache: "no-store",
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData.user);
          setResolvedUserId(userData?.user?.id ?? null);
        } else if (userResponse.status === 404) {
          setUser(null);
          return;
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Load user data error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, userId]);

  return {
    user,
    setUser,
    loading,
    isAuthenticated,
    currentUserId,
    resolvedUserId,
  };
}
