"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Button } from "@/components/ui/button";
import { useBeautifulNotifications } from "@/components/ui/BeautifulNotificationsProvider";
import { ResetPasswordModal } from "../../_components/ResetPasswordModal";
import { BanUserModal } from "./BanUserModal";
import { AdminUserEconomyControls } from "./AdminUserEconomyControls";
import { AdminPanel } from "@/app/admin/_components/admin-ui";
import type { AdminUserDetail } from "../types";

interface AdminUserActionsPanelProps {
  user: AdminUserDetail;
  onUserUpdated: () => void;
  showToast: (type: "success" | "error", title: string, desc?: string) => void;
}

export function AdminUserActionsPanel({
  user,
  onUserUpdated,
  showToast,
}: AdminUserActionsPanelProps) {
  const router = useRouter();
  const { confirm } = useBeautifulNotifications();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [busy, setBusy] = useState<"unban" | "delete" | null>(null);

  const displayName = user.name || user.email || "Пользователь";
  const isAdmin = user.role === "ADMIN";

  const handleUnban = async () => {
    setBusy("unban");
    try {
      const response = await fetch(`/api/admin/users/${user.id}/ban`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Не удалось снять блокировку");
      }
      showToast("success", "Готово", data.message);
      onUserUpdated();
    } catch (error) {
      showToast(
        "error",
        "Ошибка",
        error instanceof Error ? error.message : "Не удалось снять блокировку",
      );
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async () => {
    const agreed = await confirm(
      `Удалить «${displayName}» навсегда? Восстановить нельзя.`,
      "Удаление аккаунта",
    );
    if (!agreed) return;

    setBusy("delete");
    try {
      const response = await fetch(`/api/admin/users/${user.id}/delete`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Не удалось удалить пользователя");
      }
      showToast("success", "Удалён", "Аккаунт удалён");
      router.push("/admin/users");
    } catch (error) {
      showToast(
        "error",
        "Ошибка",
        error instanceof Error ? error.message : "Не удалось удалить",
      );
      setBusy(null);
    }
  };

  return (
    <div className="space-y-3">
      <AdminUserEconomyControls
        user={user}
        onUserUpdated={onUserUpdated}
        showToast={showToast}
        disabled={isAdmin}
      />

      <AdminPanel title="Аккаунт" accent="neutral">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 w-full justify-center border-[#abd1c6]/30 text-sm text-[#abd1c6]"
          onClick={() => setShowResetPassword(true)}
        >
          <LucideIcons.Lock className="h-4 w-4" />
          Сбросить пароль
        </Button>

        {!isAdmin ? (
          <details className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5">
            <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-medium text-red-200/90 hover:text-red-100 [&::-webkit-details-marker]:hidden">
              Блокировка и удаление
            </summary>
            <div className="space-y-2 border-t border-red-500/15 px-3 py-3">
              <p className="text-[10px] leading-snug text-[#abd1c6]/60">
                Блокировка — пользователь не войдёт на сайт. Удаление — без
                восстановления.
              </p>

              {!user.isBanned ? (
                <Button
                  type="button"
                  size="sm"
                  className="h-9 w-full bg-[#e16162] hover:bg-[#dc2626] text-white text-xs"
                  onClick={() => setShowBanModal(true)}
                >
                  Заблокировать вход на сайт
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-9 w-full border-[#10B981]/40 text-xs text-[#10B981]"
                  disabled={busy === "unban"}
                  onClick={handleUnban}
                >
                  {busy === "unban" ? "Снятие…" : "Разблокировать вход"}
                </Button>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 w-full text-xs text-red-400 hover:bg-red-500/10"
                disabled={busy === "delete"}
                onClick={handleDelete}
              >
                {busy === "delete" ? (
                  <>
                    <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
                    Удаление…
                  </>
                ) : (
                  <>
                    <LucideIcons.Trash2 className="h-4 w-4" />
                    Удалить аккаунт
                  </>
                )}
              </Button>
            </div>
          </details>
        ) : (
          <p className="mt-2 text-xs text-[#abd1c6]/50">
            Администратора нельзя заблокировать или удалить.
          </p>
        )}
      </AdminPanel>

      {showResetPassword ? (
        <ResetPasswordModal
          userId={user.id}
          userName={displayName}
          onClose={() => setShowResetPassword(false)}
          onSuccess={onUserUpdated}
          showToast={showToast}
        />
      ) : null}

      {showBanModal ? (
        <BanUserModal
          userId={user.id}
          userName={displayName}
          onClose={() => setShowBanModal(false)}
          onSuccess={onUserUpdated}
          showToast={showToast}
        />
      ) : null}
    </div>
  );
}
