"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";

interface AdminUsersHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  usersCount: number;
  totalCount: number | null;
  hasMore: boolean;
  loading: boolean;
}

export function AdminUsersHeader({
  searchQuery,
  onSearchChange,
  usersCount,
  totalCount,
  hasMore,
  loading,
}: AdminUsersHeaderProps) {
  const summary =
    totalCount != null
      ? hasMore
        ? `Показано ${usersCount} из ${totalCount}`
        : usersCount === totalCount
          ? `${totalCount} ${pluralUsers(totalCount)}`
          : `Показано ${usersCount} из ${totalCount}`
      : loading
        ? "Загрузка списка…"
        : `${usersCount} в списке`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mb-6 sm:mb-8"
    >
      <Card
        variant="glass"
        padding="md"
        className="border-[#abd1c6]/20 shadow-lg shadow-black/10"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f9bc60]/15 text-[#f9bc60] ring-1 ring-[#f9bc60]/25">
                <LucideIcons.Users className="h-5 w-5" aria-hidden />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-[#fffffe] sm:text-2xl md:text-3xl">
                Пользователи
              </h1>
              <Badge variant="secondary" className="hidden xs:inline-flex">
                Админка
              </Badge>
            </div>
            <p className="text-pretty text-sm text-[#abd1c6] sm:text-base">
              Поиск по имени и email, карточки подгружаются при прокрутке.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-normal">
                {summary}
              </Badge>
              {hasMore && !loading && (
                <span className="text-xs text-[#94a1b2]">
                  Прокрутите вниз, чтобы догрузить
                </span>
              )}
            </div>
          </div>

          <div className="w-full shrink-0 lg:max-w-sm">
            <label htmlFor="admin-users-search" className="sr-only">
              Поиск пользователей
            </label>
            <div className="relative">
              <LucideIcons.Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#abd1c6]/60"
                aria-hidden
              />
              <Input
                id="admin-users-search"
                type="search"
                placeholder="Имя или email…"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoComplete="off"
                className="h-11 rounded-xl border-[#abd1c6]/20 bg-[#001e1d]/90 pl-10 pr-10"
              />
              {searchQuery ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-[#abd1c6] hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
                  onClick={() => onSearchChange("")}
                  aria-label="Очистить поиск"
                >
                  <LucideIcons.X className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
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
