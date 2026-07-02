"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import { Button } from "@/components/ui/button";
import {
  AdminPanel,
  adminFieldClass,
} from "@/app/admin/_components/admin-ui";

interface AdminUsersHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  isSearchPending: boolean;
}

export function AdminUsersHeader({
  searchQuery,
  onSearchChange,
  total,
  page,
  totalPages,
  loading,
  isSearchPending,
}: AdminUsersHeaderProps) {
  const summary = loading
    ? "Загрузка…"
    : isSearchPending
      ? "Поиск…"
      : total === 0
        ? "Никого не найдено"
        : totalPages > 1
          ? `${total} ${pluralUsers(total)} · стр. ${page} / ${totalPages}`
          : `${total} ${pluralUsers(total)}`;

  return (
    <AdminPanel
      title="Поиск пользователей"
      subtitle={summary}
      className="mb-4"
      accent="neutral"
    >
      <div className="relative">
        <label htmlFor="admin-users-search" className="sr-only">
          Поиск пользователей
        </label>
        <LucideIcons.Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#abd1c6]/60"
          aria-hidden
        />
        <input
          id="admin-users-search"
          type="search"
          placeholder="Имя или email…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
          className={`${adminFieldClass} pl-10 pr-10`}
        />
        {searchQuery ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-[#abd1c6] hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
            onClick={() => onSearchChange("")}
            aria-label="Очистить поиск"
          >
            <LucideIcons.X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </AdminPanel>
  );
}

function pluralUsers(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m100 >= 11 && m100 <= 14) return "пользователей";
  if (m10 === 1) return "пользователь";
  if (m10 >= 2 && m10 <= 4) return "пользователя";
  return "пользователей";
}
