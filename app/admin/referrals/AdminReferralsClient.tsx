"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "../_components/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { LucideIcons } from "@/components/ui/LucideIcons";

type SortKey = "registrations" | "clicks" | "bonuses";

interface ReferralRow {
  userId: string;
  displayName: string;
  email: string | null;
  username: string | null;
  referralCode: string | null;
  userCreatedAt: string | null;
  clicksCount: number;
  registrationsCount: number;
  bonusesGrantedCount: number;
  bonusesGrantedSum: number;
}

interface Summary {
  totalClicks: number;
  totalRegistrations: number;
  referrersCount: number;
  totalBonusGrants: number;
  totalBonusesSum: number;
}

export default function AdminReferralsClient() {
  const [qInput, setQInput] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortKey>("registrations");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [items, setItems] = useState<ReferralRow[]>([]);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 25;

  useEffect(() => {
    const t = window.setTimeout(() => setQ(qInput.trim()), 400);
    return () => window.clearTimeout(t);
  }, [qInput]);

  useEffect(() => {
    setPage(1);
  }, [q]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        sort,
        limit: String(limit),
      });
      if (q) params.set("q", q);
      const res = await fetch(`/api/admin/referrals?${params}`, {
        cache: "no-store",
        credentials: "include",
      });
      const raw = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(raw?.error || "Ошибка загрузки");
      }
      setSummary(raw.summary as Summary);
      setItems(raw.items as ReferralRow[]);
      setPages(raw.pages ?? 1);
      setTotal(raw.total ?? 0);
      if (typeof raw.page === "number") setPage(raw.page);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
      setSummary(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, q, sort, limit]);

  useEffect(() => {
    void load();
  }, [load]);

  const siteBase =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "";

  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12">
          <AdminHeader />

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-[#fffffe] sm:text-2xl">
                Реферальная программа
              </h2>
              <p className="mt-1 text-sm text-[#abd1c6] sm:text-base">
                Кто сколько пригласил: переходы по ссылке, регистрации и
                начисленные бонусы рефереру.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:max-w-md sm:flex-row sm:items-center">
              <Input
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                placeholder="Поиск: email, имя, @username"
                className="h-11 border-[#abd1c6]/25 bg-[#001e1d]/80 text-[#fffffe]"
              />
              <Button
                type="button"
                variant="secondary"
                className="h-11 shrink-0"
                onClick={() => void load()}
              >
                Обновить
              </Button>
            </div>
          </div>

          {loading && !summary ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner className="h-10 w-10 text-[#f9bc60]" />
            </div>
          ) : null}

          {error ? (
            <Card
              variant="glass"
              padding="md"
              className="mb-6 border-red-500/30 text-red-200"
            >
              {error}
            </Card>
          ) : null}

          {summary ? (
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
              <Card
                variant="glass"
                padding="md"
                className="border-[#abd1c6]/15"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-[#667a73]">
                  Переходов всего
                </p>
                <p className="mt-1 text-2xl font-black tabular-nums text-[#fffffe]">
                  {summary.totalClicks}
                </p>
              </Card>
              <Card
                variant="glass"
                padding="md"
                className="border-[#abd1c6]/15"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-[#667a73]">
                  Регистраций
                </p>
                <p className="mt-1 text-2xl font-black tabular-nums text-[#fffffe]">
                  {summary.totalRegistrations}
                </p>
              </Card>
              <Card
                variant="glass"
                padding="md"
                className="border-[#abd1c6]/15"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-[#667a73]">
                  Рефереров
                </p>
                <p className="mt-1 text-2xl font-black tabular-nums text-[#f9bc60]">
                  {summary.referrersCount}
                </p>
              </Card>
              <Card
                variant="glass"
                padding="md"
                className="border-[#abd1c6]/15"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-[#667a73]">
                  Выплат бонусов
                </p>
                <p className="mt-1 text-2xl font-black tabular-nums text-[#fffffe]">
                  {summary.totalBonusGrants}
                </p>
              </Card>
              <Card
                variant="glass"
                padding="md"
                className="border-[#abd1c6]/15"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-[#667a73]">
                  Сумма бонусов
                </p>
                <p className="mt-1 text-2xl font-black tabular-nums text-[#22c55e]">
                  {summary.totalBonusesSum}
                </p>
              </Card>
            </div>
          ) : null}

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#abd1c6] sm:text-sm">
              Сортировка:
            </span>
            {(
              [
                ["registrations", "По регистрациям"],
                ["clicks", "По переходам"],
                ["bonuses", "По сумме бонусов"],
              ] as const
            ).map(([key, label]) => (
              <Button
                key={key}
                type="button"
                size="sm"
                variant={sort === key ? "secondary" : "outline"}
                className={
                  sort === key
                    ? "bg-[#f9bc60] text-[#001e1d] hover:bg-[#e8a545]"
                    : "border-[#abd1c6]/25 text-[#abd1c6] hover:text-[#fffffe]"
                }
                onClick={() => {
                  setSort(key);
                  setPage(1);
                }}
              >
                {label}
              </Button>
            ))}
          </div>

          <Card
            variant="glass"
            padding="none"
            className="overflow-hidden border-[#abd1c6]/15"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#abd1c6]/15 bg-[#001e1d]/50">
                    <th className="px-4 py-3 font-bold text-[#abd1c6]">
                      Пользователь
                    </th>
                    <th className="px-4 py-3 font-bold text-[#abd1c6]">Код</th>
                    <th className="px-4 py-3 text-right font-bold text-[#abd1c6]">
                      Переходы
                    </th>
                    <th className="px-4 py-3 text-right font-bold text-[#abd1c6]">
                      Регистрации
                    </th>
                    <th className="px-4 py-3 text-right font-bold text-[#abd1c6]">
                      Бонусов (шт.)
                    </th>
                    <th className="px-4 py-3 text-right font-bold text-[#abd1c6]">
                      Сумма
                    </th>
                    <th className="px-4 py-3 text-right font-bold text-[#abd1c6]">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-10 text-center text-[#abd1c6]"
                      >
                        Нет данных по рефералам (или ничего не найдено по
                        запросу).
                      </td>
                    </tr>
                  ) : null}
                  {!loading &&
                    items.map((row) => (
                      <tr
                        key={row.userId}
                        className="border-b border-[#abd1c6]/10 hover:bg-[#001e1d]/40"
                      >
                        <td className="px-4 py-3 align-top">
                          <Link
                            href={`/profile/${row.userId}`}
                            className="font-semibold text-[#38bdf8] hover:underline"
                          >
                            {row.displayName}
                          </Link>
                          <div className="mt-0.5 text-xs text-[#94a1b2]">
                            {row.email ?? "—"}
                          </div>
                          <div className="mt-1 font-mono text-[10px] text-[#667a73]">
                            {row.userId}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top">
                          {row.referralCode ? (
                            <div className="flex flex-col gap-1">
                              <code className="rounded bg-[#001e1d]/80 px-2 py-1 text-xs text-[#f9bc60]">
                                {row.referralCode}
                              </code>
                              {siteBase ? (
                                <Link
                                  href={`${siteBase}/ref/${row.referralCode}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-[#38bdf8] hover:underline"
                                >
                                  <LucideIcons.ExternalLink className="h-3 w-3" />
                                  Ссылка
                                </Link>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-[#667a73]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-[#fffffe]">
                          {row.clicksCount}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-[#fffffe]">
                          {row.registrationsCount}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-[#abd1c6]">
                          {row.bonusesGrantedCount}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-semibold text-[#22c55e]">
                          {row.bonusesGrantedSum}
                        </td>
                        <td className="px-4 py-3 text-right align-top">
                          <div className="flex flex-col items-end gap-1.5">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              asChild
                              className="h-8 border-[#abd1c6]/25 px-2 text-xs text-[#fffffe]"
                            >
                              <Link href={`/profile/${row.userId}`}>
                                Профиль
                              </Link>
                            </Button>
                            <Link
                              href={`/admin/referrals/${row.userId}`}
                              className="text-xs font-semibold text-[#f9bc60] hover:underline"
                            >
                              Приглашённые ({row.registrationsCount})
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>

          {total > 0 ? (
            <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-sm text-[#abd1c6]">
                Показано {items.length} из {total} · стр. {page} / {pages}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || loading}
                  className="border-[#abd1c6]/25"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Назад
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= pages || loading}
                  className="border-[#abd1c6]/25"
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                >
                  Вперёд
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
