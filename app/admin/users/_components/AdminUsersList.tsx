"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminUserCard } from "./AdminUserCard";
import type { AdminUser } from "./types";

interface AdminUsersListProps {
  users: AdminUser[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  searchQuery: string;
  observerTarget: React.RefObject<HTMLDivElement | null>;
  deletingUserId: string | null;
  trustDeltaSaving: string | null;
  setTrustDeltaSaving: (id: string | null) => void;
  deceiverMarkSaving: string | null;
  setDeceiverMarkSaving: (id: string | null) => void;
  onTrustUpdated: (userId: string, nextDelta: number) => void;
  onDeceiverMarkUpdated: (userId: string, marked: boolean) => void;
  onDelete: (userId: string, userName: string) => void;
  showToast: (type: "success" | "error", title: string, desc?: string) => void;
  onClearSearch: () => void;
}

function UserCardSkeleton() {
  return (
    <Card variant="glass" padding="md" className="border-[#abd1c6]/15">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Skeleton className="mx-auto h-16 w-16 shrink-0 rounded-full sm:mx-0" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex w-full flex-col items-center gap-2 sm:items-start">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-full max-w-xs" />
            </div>
            <Skeleton className="h-8 w-28" />
          </div>
          <Skeleton className="h-16 w-full rounded-lg" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1 rounded-lg" />
            <Skeleton className="h-9 flex-1 rounded-lg" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function AdminUsersList({
  users,
  loading,
  loadingMore,
  hasMore,
  searchQuery,
  observerTarget,
  deletingUserId,
  trustDeltaSaving,
  setTrustDeltaSaving,
  deceiverMarkSaving,
  setDeceiverMarkSaving,
  onTrustUpdated,
  onDeceiverMarkUpdated,
  onDelete,
  showToast,
  onClearSearch,
}: AdminUsersListProps) {
  if (loading) {
    return (
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        aria-busy="true"
        aria-label="Загрузка пользователей"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <UserCardSkeleton key={i} />
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
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#abd1c6]/10 text-[#abd1c6] ring-1 ring-[#abd1c6]/20">
            <LucideIcons.Users className="h-8 w-8" aria-hidden />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[#fffffe] sm:text-xl">
              {hasQuery ? "Никого не нашли" : "Пользователей пока нет"}
            </h2>
            <p className="mt-2 text-sm text-[#abd1c6] sm:text-base">
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
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {users.map((user, index) => (
          <AdminUserCard
            key={user.id}
            user={user}
            index={index}
            deletingUserId={deletingUserId}
            trustDeltaSaving={trustDeltaSaving}
            setTrustDeltaSaving={setTrustDeltaSaving}
            deceiverMarkSaving={deceiverMarkSaving}
            setDeceiverMarkSaving={setDeceiverMarkSaving}
            onTrustUpdated={onTrustUpdated}
            onDeceiverMarkUpdated={onDeceiverMarkUpdated}
            onDelete={onDelete}
            showToast={showToast}
          />
        ))}
      </div>

      {loadingMore ? (
        <div className="py-10">
          <LoadingSpinner label="Подгружаем ещё карточки…" />
        </div>
      ) : null}

      {hasMore && !loadingMore ? (
        <div ref={observerTarget} className="h-16" aria-hidden />
      ) : null}

      {!hasMore && users.length > 0 ? (
        <p className="py-8 text-center text-sm text-[#94a1b2]">
          Конец списка — все совпадения загружены
        </p>
      ) : null}
    </>
  );
}
