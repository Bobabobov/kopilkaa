"use client";

import { AdminUsersHeader } from "./_components/AdminUsersHeader";
import { AdminUsersList } from "./_components/AdminUsersList";
import { AdminPage } from "../_components/AdminPage";
import Pagination from "../_components/Pagination";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";

export default function AdminUsersClient() {
  const {
    users,
    total,
    totalPages,
    page,
    setPage,
    loading,
    isSearchPending,
    searchQuery,
    setSearchQuery,
    deletingUserId,
    handleDeleteUser,
    showToast,
  } = useAdminUsers();

  return (
    <AdminPage
      title="Пользователи"
      description="Поиск, просмотр профиля и управление аккаунтами"
    >
      <AdminUsersHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        total={total}
        page={page}
        totalPages={totalPages}
        loading={loading}
        isSearchPending={isSearchPending}
      />

      <AdminUsersList
        users={users}
        loading={loading || isSearchPending}
        searchQuery={searchQuery}
        deletingUserId={deletingUserId}
        onDelete={handleDeleteUser}
        showToast={showToast}
        onClearSearch={() => setSearchQuery("")}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </AdminPage>
  );
}
