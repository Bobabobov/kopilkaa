// app/admin/reports/hooks/useUserActions.ts
import { useCallback, useRef, useEffect } from "react";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { useBeautifulNotifications } from "@/components/ui/BeautifulNotificationsProvider";

export function useUserActions(onSuccess?: () => void) {
  const { showToast } = useBeautifulToast();
  const { confirm } = useBeautifulNotifications();
  const onSuccessRef = useRef(onSuccess);

  // Обновляем ref при изменении onSuccess
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  const banUser = useCallback(
    async (userId: string, days?: number) => {
      const confirmText = days
        ? `Заблокировать пользователя на ${days} дней?`
        : "Заблокировать пользователя навсегда?";

      const agreed = await confirm(confirmText, "Блокировка пользователя");
      if (!agreed) return false;

      const reason = days
        ? `Блокировка на ${days} дней по жалобе`
        : "Блокировка по жалобе";

      try {
        const response = await fetch(`/api/admin/users/${userId}/ban`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason, days }),
        });

        const data = await response.json();

        if (response.ok) {
          const updatedCount = data.updatedReports || 0;
          showToast(
            "success",
            "Пользователь заблокирован",
            days
              ? `На ${days} дней${updatedCount > 0 ? `. Обновлено жалоб: ${updatedCount}` : ""}`
              : `Навсегда${updatedCount > 0 ? `. Обновлено жалоб: ${updatedCount}` : ""}`
          );
          onSuccessRef.current?.();
          return true;
        } else {
          showToast("error", "Ошибка", data.message || "Не удалось заблокировать");
          return false;
        }
      } catch (error) {
        console.error("Ban user error:", error);
        showToast("error", "Ошибка", "Не удалось заблокировать пользователя");
        return false;
      }
    },
    [confirm, showToast]
  );

  const unbanUser = useCallback(
    async (userId: string) => {
      const agreed = await confirm(
        "Вы уверены, что хотите разблокировать этого пользователя?",
        "Разблокировка пользователя"
      );
      if (!agreed) return false;

      try {
        const response = await fetch(`/api/admin/users/${userId}/ban`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (response.ok) {
          const deletedCount = data.deletedReports || 0;
          showToast(
            "success",
            "Блокировка снята",
            deletedCount > 0
              ? `Пользователь разблокирован. Удалено жалоб: ${deletedCount}`
              : "Пользователь разблокирован"
          );
          onSuccessRef.current?.();
          return true;
        } else {
          showToast("error", "Ошибка", data.message || "Не удалось снять блокировку");
          return false;
        }
      } catch (error) {
        console.error("Unban user error:", error);
        showToast("error", "Ошибка", "Не удалось снять блокировку");
        return false;
      }
    },
    [confirm, showToast]
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      const agreed = await confirm(
        "Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить.",
        "Удаление пользователя"
      );
      if (!agreed) return false;

      try {
        const response = await fetch(`/api/admin/users/${userId}/delete`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (response.ok) {
          showToast("success", "Пользователь удалён", "Аккаунт удалён из системы");
          onSuccessRef.current?.();
          return true;
        } else {
          showToast("error", "Ошибка", data.message || "Не удалось удалить");
          return false;
        }
      } catch (error) {
        console.error("Delete user error:", error);
        showToast("error", "Ошибка", "Не удалось удалить пользователя");
        return false;
      }
    },
    [confirm, showToast]
  );

  return {
    banUser,
    unbanUser,
    deleteUser,
  };
}

