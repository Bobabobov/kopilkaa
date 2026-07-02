"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AdminPanel,
  adminCtaButtonClass,
  adminFieldClass,
  adminListRowClass,
  adminListRowPendingClass,
  AdminStatusPill,
} from "@/app/admin/_components/admin-ui";
import Pagination from "@/app/admin/_components/Pagination";
import type { BonusReportUserRow } from "./types";

const PAGE_SIZE = 20;

interface BonusUsersListProps {
  users: BonusReportUserRow[];
  userAvatarSrc: (avatar?: string | null) => string;
}

export function BonusUsersList({ users, userAvatarSrc }: BonusUsersListProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((row) => {
      const hay = [
        row.user.name,
        row.user.username ?? "",
        row.user.email ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [users, query]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <AdminPanel
        title="Поиск"
        subtitle={`${users.length} в истории бонусов${
          query.trim() ? ` · найдено ${filtered.length}` : ""
        }`}
        accent="neutral"
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Имя, @username, email…"
          className={adminFieldClass}
        />
        <p className="mt-3 text-xs text-[#abd1c6]/70">
          Начисление, списание и уровень — в{" "}
          <span className="text-[#f9bc60]">досье пользователя</span>.
        </p>
      </AdminPanel>

      {filtered.length === 0 ? (
        <AdminPanel title="Пусто" accent="neutral">
          <p className="text-[#abd1c6]">Пользователи не найдены.</p>
        </AdminPanel>
      ) : (
        <>
          {pageItems.length > 0 ? (
            <p className="text-sm text-[#abd1c6]/80">
              Показано {pageItems.length} из {filtered.length}
              {totalPages > 1 ? ` · стр. ${page} / ${totalPages}` : ""}
            </p>
          ) : null}

          <div className="space-y-2">
            {pageItems.map((row) => {
              const highlight =
                row.withdrawalBlocked || row.pendingWithdrawalBonuses > 0;
              return (
                <article
                  key={row.user.id}
                  className={`p-3 ${
                    highlight ? adminListRowPendingClass : adminListRowClass
                  }`}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar className="h-12 w-12 shrink-0 border-2 border-[#abd1c6]/20">
                        <AvatarImage
                          src={userAvatarSrc(row.user.avatar)}
                          alt={row.user.name}
                        />
                        <AvatarFallback className="bg-[#004643] text-[#abd1c6]">
                          {(row.user.name || "?").slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-[#fffffe]">
                            {row.user.name}
                            {row.user.username ? ` (@${row.user.username})` : ""}
                          </h3>
                          <AdminStatusPill
                            tone="pending"
                            className="!px-2 !py-0.5 !text-[10px] !normal-case !tracking-normal"
                          >
                            Ур. {row.level}
                          </AdminStatusPill>
                          {row.withdrawalBlocked ? (
                            <AdminStatusPill
                              tone="danger"
                              className="!px-2 !py-0.5 !text-[10px] !normal-case !tracking-normal"
                            >
                              Вывод закрыт
                            </AdminStatusPill>
                          ) : null}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-[#abd1c6]/85">
                          {row.user.email || "Без email"}
                        </p>
                        <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-[#94a1b2]">
                          <span>
                            На балансе:{" "}
                            <span className="font-bold text-[#f9bc60]">
                              {row.availableBonuses}
                            </span>
                          </span>
                          <span>Всего: {row.totalEarnedBonuses}</span>
                          {row.pendingWithdrawalBonuses > 0 ? (
                            <span className="text-amber-200">
                              В выводе: {row.pendingWithdrawalBonuses}
                            </span>
                          ) : null}
                          {row.currentStreak > 0 ? (
                            <span>Серия: {row.currentStreak} дн.</span>
                          ) : null}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/admin/users/${row.user.id}`}
                      className={adminCtaButtonClass}
                    >
                      Досье
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
