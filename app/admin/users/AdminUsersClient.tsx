"use client";

import { AdminHeader } from "../_components/AdminHeader";
import { AdminUsersHeader } from "./_components/AdminUsersHeader";
import { AdminUsersList } from "./_components/AdminUsersList";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";

export default function AdminUsersClient() {
  const {
    users,
    loading,
    loadingMore,
    hasMore,
    searchQuery,
    setSearchQuery,
    observerTarget,
    deletingUserId,
    handleDeleteUser,
    trustDeltaSaving,
    setTrustDeltaSaving,
    updateUserTrust,
    showToast,
  } = useAdminUsers();

  const handleTrustUpdated = (userId: string, nextDelta: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      updateUserTrust(
        userId,
        nextDelta,
        user.effectiveApprovedApplications ?? 0,
      );
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12">
          <AdminHeader />

          <AdminUsersHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            usersCount={users.length}
            hasMore={hasMore}
          />

          <AdminUsersList
            users={users}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            searchQuery={searchQuery}
            observerTarget={observerTarget}
            deletingUserId={deletingUserId}
            trustDeltaSaving={trustDeltaSaving}
            setTrustDeltaSaving={setTrustDeltaSaving}
            onTrustUpdated={handleTrustUpdated}
            onDelete={handleDeleteUser}
            showToast={showToast}
          />
        </div>
      </div>
    </div>
  );
}
