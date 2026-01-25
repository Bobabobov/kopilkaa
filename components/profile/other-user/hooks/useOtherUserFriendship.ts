import { useCallback, useEffect, useState } from "react";
import type { ToastType } from "@/components/ui/BeautifulToast";

type Friendship = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "BLOCKED";
  requesterId: string;
  receiverId: string;
};

type UserLite = { id: string } | null;

interface UseOtherUserFriendshipParams {
  resolvedUserId: string | null;
  isAuthenticated: boolean | null;
  currentUserId: string | null;
  user: UserLite;
  emitFriendEvents: () => void;
  showToast: (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number,
  ) => void;
}

export type FriendshipStatus = "none" | "requested" | "incoming" | "friends";

export function useOtherUserFriendship({
  resolvedUserId,
  isAuthenticated,
  currentUserId,
  user,
  emitFriendEvents,
  showToast,
}: UseOtherUserFriendshipParams) {
  const [friendship, setFriendship] = useState<Friendship | null>(null);

  const fetchFriendshipStatus = useCallback(async () => {
    try {
      if (!resolvedUserId) return;
      const friendshipResponse = await fetch(`/api/profile/friends?type=all`, {
        cache: "no-store",
      });
      if (friendshipResponse.ok) {
        const friendshipData = await friendshipResponse.json();
        const userFriendship = friendshipData.friendships.find(
          (f: Friendship) =>
            f.requesterId === resolvedUserId || f.receiverId === resolvedUserId,
        );
        setFriendship(userFriendship || null);
      }
    } catch (error) {
      console.error("Load friendship data error:", error);
    }
  }, [resolvedUserId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!resolvedUserId) return;
    fetchFriendshipStatus();
  }, [isAuthenticated, resolvedUserId, fetchFriendshipStatus]);

  const sendFriendRequest = useCallback(async () => {
    if (!user) return;

    if (!isAuthenticated) {
      showToast(
        "warning",
        "Требуется авторизация",
        "Необходимо войти в аккаунт для добавления в друзья",
      );
      return;
    }

    try {
      const response = await fetch("/api/profile/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: user.id }),
      });

      const data = await response.json();

      if (response.ok) {
        setFriendship(data.friendship);
        emitFriendEvents();
        showToast(
          "success",
          "Заявка отправлена!",
          "Заявка в друзья успешно отправлена",
        );
      } else {
        showToast(
          "error",
          "Ошибка отправки",
          data.message || "Не удалось отправить заявку в друзья",
        );
      }
    } catch (error) {
      console.error("Friend request error:", error);
      showToast(
        "error",
        "Ошибка отправки",
        "Не удалось отправить заявку в друзья",
      );
    }
  }, [user, isAuthenticated, emitFriendEvents, showToast]);

  const acceptFriendRequest = useCallback(async () => {
    if (!friendship) return;
    try {
      const response = await fetch(`/api/profile/friends/${friendship.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACCEPTED" }),
      });

      if (response.ok) {
        await fetchFriendshipStatus();
        emitFriendEvents();
        showToast(
          "success",
          "Заявка принята!",
          "Пользователь добавлен в друзья",
        );
      } else {
        showToast(
          "error",
          "Ошибка принятия",
          "Не удалось принять заявку в друзья",
        );
      }
    } catch (error) {
      showToast(
        "error",
        "Ошибка принятия",
        "Не удалось принять заявку в друзья",
      );
    }
  }, [friendship, fetchFriendshipStatus, emitFriendEvents, showToast]);

  const declineFriendRequest = useCallback(async () => {
    if (!friendship) return;
    try {
      const response = await fetch(`/api/profile/friends/${friendship.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DECLINED" }),
      });

      if (response.ok) {
        await fetchFriendshipStatus();
        emitFriendEvents();
        showToast("info", "Заявка отклонена", "Заявка в друзья отклонена");
      } else {
        showToast(
          "error",
          "Ошибка отклонения",
          "Не удалось отклонить заявку в друзья",
        );
      }
    } catch (error) {
      showToast(
        "error",
        "Ошибка отклонения",
        "Не удалось отклонить заявку в друзья",
      );
    }
  }, [friendship, fetchFriendshipStatus, emitFriendEvents, showToast]);

  const handleRemoveFriend = useCallback(async () => {
    if (!friendship?.id) return;
    try {
      const response = await fetch(`/api/profile/friends/${friendship.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchFriendshipStatus();
        emitFriendEvents();
        showToast("success", "Пользователь удалён из друзей");
      } else {
        showToast("error", "Ошибка", "Не удалось удалить из друзей");
      }
    } catch (error) {
      showToast("error", "Ошибка", "Не удалось удалить из друзей");
    }
  }, [friendship?.id, fetchFriendshipStatus, emitFriendEvents, showToast]);

  const friendshipStatus: FriendshipStatus = !friendship
    ? "none"
    : friendship.status === "ACCEPTED"
      ? "friends"
      : friendship.requesterId === currentUserId
        ? "requested"
        : "incoming";

  return {
    friendship,
    friendshipStatus,
    fetchFriendshipStatus,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    handleRemoveFriend,
  };
}
