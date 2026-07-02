"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminUserCard } from "./AdminUserCard";
import type { AdminUser } from "./types";

interface AdminUsersListProps {
  users: AdminUser[];
  loading: boolean;
  searchQuery: string;
  deletingUserId: string | null;
  onDelete: (userId: string, userName: string) => void;
  showToast: (type: "success" | "error", title: string, desc?: string) => void;
  onClearSearch: () => void;
}

function UserRowSkeleton() {
  return (
    <div className="rounded-xl border border-[#abd1c6]/15 bg-[#004643]/30 p-4">
      <div className="flex gap-3">
        <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
          <Skeleton className="h-3 w-full max-w-sm" />
        </div>
      </div>
    </div>
  );
}

export function AdminUsersList({
  users,
  loading,
  searchQuery,
  deletingUserId,
  onDelete,
  showToast,
  onClearSearch,
}: AdminUsersListProps) {
  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Загрузка пользователей">
        {Array.from({ length: 8 }).map((_, i) => (
          <UserRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    const hasQuery = Boolean(searchQuery.trim());
    return (
      <Card
        variant="glass"
        padding="lg"
        className="border-[#abd1c6]/20 text-center"
      >
        <div className="mx-auto flex max-w-md flex-col items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#abd1c6]/10 text-[#abd1c6] ring-1 ring-[#abd1c6]/20">
            <LucideIcons.Users className="h-7 w-7" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[#fffffe]">
              {hasQuery ? "Никого не нашли" : "Пользователей пока нет"}
            </h2>
            <p className="mt-2 text-sm text-[#abd1c6]">
              {hasQuery
                ? "Попробуйте другой запрос или сбросьте поиск."
                : "Когда появятся регистрации, они отобразятся здесь."}
            </p>
          </div>
          {hasQuery ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-[#abd1c6]/35 text-[#fffffe] hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
              onClick={onClearSearch}
            >
              Сбросить поиск
            </Button>
          ) : null}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <AdminUserCard
          key={user.id}
          user={user}
          deletingUserId={deletingUserId}
          onDelete={onDelete}
          showToast={showToast}
        />
      ))}
    </div>
  );
}
