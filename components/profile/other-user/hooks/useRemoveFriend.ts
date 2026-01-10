import { useCallback } from "react";
import { useRouter } from "next/navigation";

interface UseRemoveFriendParams {
  friendshipId: string | null | undefined;
  confirm: (title: string, description?: string) => Promise<boolean>;
  showToast: (type: "success" | "error", title: string, description?: string) => void;
}

export function useRemoveFriend({ friendshipId, confirm, showToast }: UseRemoveFriendParams) {
  const router = useRouter();

  const handleRemoveFriend = useCallback(async () => {
    if (!friendshipId) return;
    const agreed = await confirm("Удалить этого пользователя из друзей?", "Удаление из друзей");
    if (!agreed) return;

    try {
      const res = await fetch(`/api/profile/friends/${friendshipId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("success", "Пользователь удалён из друзей");
        router.refresh();
        return;
      }

      const e = await res.json().catch(() => ({} as any));
      showToast("error", "Не удалось удалить", e.message || "Попробуйте ещё раз позднее");
    } catch {
      showToast("error", "Не удалось удалить", "Попробуйте ещё раз позднее");
    }
  }, [confirm, friendshipId, router, showToast]);

  return { handleRemoveFriend };
}
