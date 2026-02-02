"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
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
  onTrustUpdated: (userId: string, nextDelta: number) => void;
  onDelete: (userId: string, userName: string) => void;
  showToast: (type: "success" | "error", title: string, desc?: string) => void;
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
  onTrustUpdated,
  onDelete,
  showToast,
}: AdminUsersListProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-[#f9bc60] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-[#abd1c6]">Загрузка пользователей...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <LucideIcons.Users className="w-16 h-16 mx-auto mb-4 text-[#abd1c6]/50" />
        <p className="text-[#abd1c6]">
          {searchQuery ? "Пользователи не найдены" : "Нет пользователей"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user, index) => (
          <AdminUserCard
            key={user.id}
            user={user}
            index={index}
            deletingUserId={deletingUserId}
            trustDeltaSaving={trustDeltaSaving}
            setTrustDeltaSaving={setTrustDeltaSaving}
            onTrustUpdated={onTrustUpdated}
            onDelete={onDelete}
            showToast={showToast}
          />
        ))}
      </div>

      {loadingMore && (
        <div className="text-center py-8">
          <div className="inline-block w-6 h-6 border-3 border-[#f9bc60] border-t-transparent rounded-full animate-spin" />
          <p className="mt-2 text-[#abd1c6] text-sm">Загрузка...</p>
        </div>
      )}

      {hasMore && !loadingMore && <div ref={observerTarget} className="h-20" />}

      {!hasMore && users.length > 0 && (
        <div className="text-center py-8">
          <p className="text-[#abd1c6] text-sm">Все пользователи загружены</p>
        </div>
      )}
    </>
  );
}
