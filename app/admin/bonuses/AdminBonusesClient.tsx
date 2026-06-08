"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ExternalLink,
  Gift,
  LogIn,
  Users,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminHeader } from "../_components/AdminHeader";
import { throwIfApiFailed } from "@/lib/api/parseApiError";
import { BONUS_SOURCE_LABELS, BonusSourceCategory } from "@/lib/admin/bonusGrantCategory";
import { resolveAvatarUrl } from "@/lib/avatar";
import { buildUploadUrl } from "@/lib/uploads/url";

type TabKey = "overview" | "users" | "withdrawals" | "ledger";

type BonusUserBreakdown = {
  goodDeeds: number;
  referrals: number;
  dailyBonus: number;
  adminManual: number;
  other: number;
};

type BonusReportUserRow = {
  user: {
    id: string;
    name: string;
    username?: string | null;
    email?: string | null;
    avatar?: string | null;
  };
  breakdown: BonusUserBreakdown;
  totalEarnedBonuses: number;
  availableBonuses: number;
  pendingWithdrawalBonuses: number;
  withdrawnBonuses: number;
  dailyClaimsCount: number;
  currentStreak: number;
  withdrawalBlocked: boolean;
};

type BonusLedgerEntry = {
  id: string;
  category: BonusSourceCategory;
  categoryLabel: string;
  amountBonuses: number;
  description: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username?: string | null;
    avatar?: string | null;
  };
};

type WithdrawItem = {
  id: string;
  amountBonuses: number;
  bankName: string;
  details: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminComment?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username?: string | null;
    email?: string | null;
    avatar?: string | null;
  };
};

type BonusReport = {
  summary: {
    bySource: BonusUserBreakdown;
    totalEarned: number;
    totalAvailable: number;
    totalPendingWithdrawals: number;
    totalWithdrawn: number;
    usersWithBonuses: number;
    dailyClaimsTotal: number;
    pendingWithdrawalsCount: number;
  };
  users: BonusReportUserRow[];
  ledger: BonusLedgerEntry[];
  withdrawals: WithdrawItem[];
};

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Обзор" },
  { key: "users", label: "Пользователи" },
  { key: "withdrawals", label: "Вывод" },
  { key: "ledger", label: "Журнал" },
];

const SOURCE_ORDER: BonusSourceCategory[] = [
  "goodDeeds",
  "referrals",
  "dailyBonus",
  "adminManual",
  "other",
];

function categoryBadgeClass(category: BonusSourceCategory): string {
  switch (category) {
    case "goodDeeds":
      return "border-emerald-400/40 bg-emerald-500/15 text-emerald-200";
    case "referrals":
      return "border-sky-400/40 bg-sky-500/15 text-sky-200";
    case "dailyBonus":
      return "border-violet-400/40 bg-violet-500/15 text-violet-200";
    case "adminManual":
      return "border-[#f9bc60]/40 bg-[#f9bc60]/15 text-[#f9bc60]";
    default:
      return "border-[#abd1c6]/30 bg-white/5 text-[#abd1c6]";
  }
}

export default function AdminBonusesClient() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [report, setReport] = useState<BonusReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>(() => {
    if (
      initialTab === "users" ||
      initialTab === "withdrawals" ||
      initialTab === "ledger" ||
      initialTab === "overview"
    ) {
      return initialTab;
    }
    return "overview";
  });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [bonusBusyUserId, setBonusBusyUserId] = useState<string | null>(null);
  const [blockBusyUserId, setBlockBusyUserId] = useState<string | null>(null);
  const [commentById, setCommentById] = useState<Record<string, string>>({});
  const [userQuery, setUserQuery] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bonuses/report", { cache: "no-store" });
      const json = await res.json();
      throwIfApiFailed(res, json, "Не удалось загрузить отчёт по бонусам");
      setReport(json?.data ?? null);
    } catch (e) {
      console.error(e);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const profileHref = (userId: string) => `/profile/${userId}`;

  const patchWithdrawal = async (id: string, action: "approve" | "reject") => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/good-deeds/withdrawals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          adminComment: commentById[id]?.trim() || "",
        }),
      });
      const json = await res.json().catch(() => ({}));
      throwIfApiFailed(res, json, "Не удалось обновить заявку");
      await load();
      setCommentById((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBusyId(null);
    }
  };

  const grantBonuses = async (userId: string, amountBonuses: number) => {
    setBonusBusyUserId(userId);
    try {
      const res = await fetch("/api/admin/good-deeds/bonuses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amountBonuses,
          action: "grant",
        }),
      });
      const json = await res.json().catch(() => ({}));
      throwIfApiFailed(res, json, "Не удалось начислить бонусы");
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBonusBusyUserId(null);
    }
  };

  const deductBonuses = async (userId: string, amountBonuses: number) => {
    setBonusBusyUserId(userId);
    try {
      const res = await fetch("/api/admin/good-deeds/bonuses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amountBonuses,
          action: "deduct",
        }),
      });
      const json = await res.json().catch(() => ({}));
      throwIfApiFailed(res, json, "Не удалось списать бонусы");
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBonusBusyUserId(null);
    }
  };

  const toggleWithdrawalBlock = async (
    userId: string,
    blocked: boolean,
  ) => {
    setBlockBusyUserId(userId);
    try {
      const res = await fetch(`/api/admin/bonuses/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withdrawalBlocked: blocked }),
      });
      const json = await res.json().catch(() => ({}));
      throwIfApiFailed(res, json, "Не удалось обновить блокировку вывода");
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setBlockBusyUserId(null);
    }
  };

  const userAvatarSrc = (avatar?: string | null) =>
    buildUploadUrl(resolveAvatarUrl(avatar), { variant: "thumb" });

  const renderWithdrawUser = (user: WithdrawItem["user"]) => (
    <Link
      href={profileHref(user.id)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 font-medium text-[#fffffe] hover:text-[#f9bc60] hover:underline"
    >
      <Avatar className="h-10 w-10 shrink-0 border border-white/15">
        <AvatarImage src={userAvatarSrc(user.avatar)} alt={user.name} />
        <AvatarFallback className="bg-[#004643] text-sm text-[#abd1c6]">
          {(user.name || "?").slice(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="min-w-0">
        <span className="block">
          {user.name}
          {user.username ? ` (@${user.username})` : ""}
        </span>
        {user.email && (
          <span className="block text-xs font-normal text-[#abd1c6]/90">
            {user.email}
          </span>
        )}
      </span>
      <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-70" />
    </Link>
  );

  const filteredUsers = useMemo(() => {
    if (!report) return [];
    const q = userQuery.trim().toLowerCase();
    if (!q) return report.users;
    return report.users.filter((row) => {
      const hay = [
        row.user.name,
        row.user.username ?? "",
        row.user.email ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [report, userQuery]);

  const pendingWithdrawals =
    report?.withdrawals.filter((x) => x.status === "PENDING") ?? [];
  const processedWithdrawals =
    report?.withdrawals.filter((x) => x.status !== "PENDING") ?? [];

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 container mx-auto px-4 pb-10 pt-16 sm:px-6 sm:pt-20 md:pt-24 lg:px-8">
        <AdminHeader />

        <Card variant="darkGlass" className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-[#fffffe]">Бонусы</h2>
          <p className="text-[#abd1c6]/90">
            Полный отчёт по обороту бонусов: начисления из добрых дел, рефералов
            и ежедневного входа, балансы пользователей и заявки на вывод (1
            бонус = 1 ₽).
          </p>
        </Card>

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((item) => {
            const isActive = tab === item.key;
            const badge =
              item.key === "withdrawals"
                ? report?.summary.pendingWithdrawalsCount
                : null;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                  isActive
                    ? "bg-[#f9bc60] text-[#001e1d] shadow-lg shadow-[#f9bc60]/30"
                    : "border border-[#abd1c6]/20 bg-[#001e1d]/60 text-[#abd1c6] hover:bg-[#001e1d]/80 hover:text-[#fffffe]"
                }`}
              >
                {item.label}
                {badge != null && badge > 0 ? (
                  <span className="ml-2 rounded-full bg-rose-500/90 px-2 py-0.5 text-xs text-white">
                    {badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {loading ? (
          <Card variant="default">
            <p className="text-[#abd1c6]">Загрузка...</p>
          </Card>
        ) : !report ? (
          <Card variant="default">
            <p className="text-[#abd1c6]">Не удалось загрузить данные.</p>
          </Card>
        ) : (
          <>
            {tab === "overview" && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <Card variant="darkGlass">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#94a1b2]">
                      Всего начислено
                    </p>
                    <p className="mt-2 text-3xl font-black text-[#f9bc60]">
                      {report.summary.totalEarned}
                    </p>
                    <p className="mt-1 text-xs text-[#abd1c6]">
                      {report.summary.usersWithBonuses} пользователей с бонусами
                    </p>
                  </Card>
                  <Card variant="darkGlass">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#94a1b2]">
                      На балансах
                    </p>
                    <p className="mt-2 text-3xl font-black text-emerald-300">
                      {report.summary.totalAvailable}
                    </p>
                    <p className="mt-1 text-xs text-[#abd1c6]">
                      Доступно к выводу
                    </p>
                  </Card>
                  <Card variant="darkGlass">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#94a1b2]">
                      В заявках на вывод
                    </p>
                    <p className="mt-2 text-3xl font-black text-amber-200">
                      {report.summary.totalPendingWithdrawals}
                    </p>
                    <p className="mt-1 text-xs text-[#abd1c6]">
                      {report.summary.pendingWithdrawalsCount} заявок на проверке
                    </p>
                  </Card>
                  <Card variant="darkGlass">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#94a1b2]">
                      Выведено
                    </p>
                    <p className="mt-2 text-3xl font-black text-[#fffffe]">
                      {report.summary.totalWithdrawn}
                    </p>
                    <p className="mt-1 text-xs text-[#abd1c6]">
                      Одобренные выплаты
                    </p>
                  </Card>
                </div>

                <Card variant="darkGlass">
                  <h3 className="mb-4 text-lg font-bold text-[#fffffe]">
                    Начисления по источникам
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {SOURCE_ORDER.map((source) => (
                      <div
                        key={source}
                        className="rounded-xl border border-white/[0.08] bg-black/20 p-4"
                      >
                        <div className="flex items-center gap-2">
                          {source === "goodDeeds" && (
                            <Gift className="h-4 w-4 text-emerald-300" />
                          )}
                          {source === "referrals" && (
                            <Users className="h-4 w-4 text-sky-300" />
                          )}
                          {source === "dailyBonus" && (
                            <LogIn className="h-4 w-4 text-violet-300" />
                          )}
                          <span className="text-sm font-semibold text-[#abd1c6]">
                            {BONUS_SOURCE_LABELS[source]}
                          </span>
                        </div>
                        <p className="mt-2 text-2xl font-black text-[#fffffe]">
                          {report.summary.bySource[source]}
                        </p>
                        {source === "dailyBonus" && (
                          <p className="mt-1 text-xs text-[#94a1b2]">
                            {report.summary.dailyClaimsTotal} получений за вход
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                <Card variant="darkGlass" className="overflow-x-auto p-0">
                  <div className="border-b border-white/[0.06] px-4 py-3">
                    <h3 className="text-lg font-bold text-[#fffffe]">
                      Контроль оборота
                    </h3>
                    <p className="text-sm text-[#abd1c6]/90">
                      Сколько начислено, выведено и заблокировано в заявках на вывод
                    </p>
                  </div>
                  <table className="min-w-full text-sm">
                    <tbody>
                      <tr className="border-t border-white/[0.06] text-[#fffffe]">
                        <td className="px-4 py-3 text-[#abd1c6]">
                          Всего начислено
                        </td>
                        <td className="px-4 py-3 text-right font-bold">
                          +{report.summary.totalEarned}
                        </td>
                      </tr>
                      <tr className="border-t border-white/[0.06] text-[#fffffe]">
                        <td className="px-4 py-3 text-[#abd1c6]">Выведено</td>
                        <td className="px-4 py-3 text-right font-bold text-rose-300">
                          −{report.summary.totalWithdrawn}
                        </td>
                      </tr>
                      <tr className="border-t border-white/[0.06] text-[#fffffe]">
                        <td className="px-4 py-3 text-[#abd1c6]">
                          Заблокировано в заявках
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-amber-200">
                          −{report.summary.totalPendingWithdrawals}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              </div>
            )}

            {tab === "users" && (
              <div className="space-y-4">
                <input
                  type="search"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Поиск: имя, @username, email"
                  className="h-11 w-full max-w-md rounded-xl border border-[#abd1c6]/25 bg-[#001e1d]/50 px-3 text-sm text-[#fffffe] outline-none placeholder:text-[#5c6d7a] focus:border-[#f9bc60]/45"
                />

                {filteredUsers.length === 0 ? (
                  <Card variant="default">
                    <p className="text-[#abd1c6]">Пользователи не найдены.</p>
                  </Card>
                ) : (
                  <Card variant="darkGlass" className="overflow-x-auto p-0">
                    <table className="min-w-[1280px] text-sm">
                      <thead className="bg-white/[0.04] text-[#94a1b2]">
                        <tr>
                          <th className="px-3 py-3 text-left font-semibold">
                            Пользователь
                          </th>
                          <th className="px-3 py-3 text-right font-semibold">
                            Добрые дела
                          </th>
                          <th className="px-3 py-3 text-right font-semibold">
                            Рефералы
                          </th>
                          <th className="px-3 py-3 text-right font-semibold">
                            Вход
                          </th>
                          <th className="px-3 py-3 text-right font-semibold">
                            Админ
                          </th>
                          <th className="px-3 py-3 text-right font-semibold">
                            Прочее
                          </th>
                          <th className="px-3 py-3 text-right font-semibold">
                            Всего
                          </th>
                          <th className="px-3 py-3 text-right font-semibold">
                            Доступно
                          </th>
                          <th className="px-3 py-3 text-right font-semibold">
                            Серия
                          </th>
                          <th className="px-3 py-3 text-right font-semibold">
                            Баланс
                          </th>
                          <th className="px-3 py-3 text-right font-semibold">
                            Вывод
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((row) => (
                          <tr
                            key={row.user.id}
                            className={`border-t border-white/[0.06] text-[#fffffe] ${
                              row.withdrawalBlocked ? "bg-rose-950/20" : ""
                            }`}
                          >
                            <td className="px-3 py-3">
                              <Link
                                href={profileHref(row.user.id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2.5 underline-offset-2 hover:text-[#f9bc60] hover:underline"
                              >
                                <Avatar className="h-9 w-9 shrink-0 border border-white/15">
                                  <AvatarImage
                                    src={userAvatarSrc(row.user.avatar)}
                                    alt={row.user.name}
                                  />
                                  <AvatarFallback className="bg-[#004643] text-xs text-[#abd1c6]">
                                    {(row.user.name || "?").slice(0, 1).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="min-w-0">
                                  <span className="block font-medium">
                                    {row.user.name}
                                    {row.user.username
                                      ? ` (@${row.user.username})`
                                      : ""}
                                  </span>
                                  {row.withdrawalBlocked && (
                                    <span className="text-xs text-rose-300">
                                      Вывод заблокирован
                                    </span>
                                  )}
                                </span>
                                <ExternalLink
                                  className="h-3.5 w-3.5 shrink-0 opacity-70"
                                  aria-hidden
                                />
                              </Link>
                            </td>
                            <td className="px-3 py-3 text-right text-emerald-200">
                              {row.breakdown.goodDeeds || "—"}
                            </td>
                            <td className="px-3 py-3 text-right text-sky-200">
                              {row.breakdown.referrals || "—"}
                            </td>
                            <td className="px-3 py-3 text-right text-violet-200">
                              {row.breakdown.dailyBonus || "—"}
                            </td>
                            <td className="px-3 py-3 text-right text-[#f9bc60]">
                              {row.breakdown.adminManual || "—"}
                            </td>
                            <td className="px-3 py-3 text-right text-[#abd1c6]">
                              {row.breakdown.other || "—"}
                            </td>
                            <td className="px-3 py-3 text-right font-semibold">
                              {row.totalEarnedBonuses}
                            </td>
                            <td className="px-3 py-3 text-right font-bold text-[#f9bc60]">
                              {row.availableBonuses}
                            </td>
                            <td className="px-3 py-3 text-right text-[#abd1c6]">
                              {row.currentStreak > 0
                                ? `${row.currentStreak} дн.`
                                : "—"}
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex flex-col items-end gap-1">
                                <div className="flex justify-end gap-1">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={bonusBusyUserId === row.user.id}
                                    onClick={() => grantBonuses(row.user.id, 10)}
                                    className="h-8 rounded-lg border-[#abd1c6]/35 px-2 text-xs text-[#abd1c6]"
                                  >
                                    +10
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={bonusBusyUserId === row.user.id}
                                    onClick={() => grantBonuses(row.user.id, 20)}
                                    className="h-8 rounded-lg border-[#abd1c6]/35 px-2 text-xs text-[#abd1c6]"
                                  >
                                    +20
                                  </Button>
                                </div>
                                <div className="flex justify-end gap-1">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={
                                      bonusBusyUserId === row.user.id ||
                                      row.availableBonuses <= 0
                                    }
                                    onClick={() => deductBonuses(row.user.id, 10)}
                                    className="h-8 rounded-lg border-rose-400/35 px-2 text-xs text-rose-200 hover:bg-rose-950/30"
                                  >
                                    −10
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={
                                      bonusBusyUserId === row.user.id ||
                                      row.availableBonuses <= 0
                                    }
                                    onClick={() => deductBonuses(row.user.id, 20)}
                                    className="h-8 rounded-lg border-rose-400/35 px-2 text-xs text-rose-200 hover:bg-rose-950/30"
                                  >
                                    −20
                                  </Button>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex justify-end">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  disabled={blockBusyUserId === row.user.id}
                                  onClick={() =>
                                    toggleWithdrawalBlock(
                                      row.user.id,
                                      !row.withdrawalBlocked,
                                    )
                                  }
                                  className={`h-8 rounded-lg px-2.5 text-xs ${
                                    row.withdrawalBlocked
                                      ? "border-emerald-400/40 text-emerald-200 hover:bg-emerald-950/30"
                                      : "border-rose-400/40 text-rose-200 hover:bg-rose-950/30"
                                  }`}
                                >
                                  {row.withdrawalBlocked
                                    ? "Разблокировать"
                                    : "Заблокировать"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                )}
              </div>
            )}

            {tab === "ledger" && (
              <Card variant="darkGlass" className="overflow-x-auto p-0">
                {report.ledger.length === 0 ? (
                  <p className="p-4 text-[#abd1c6]">Журнал пуст.</p>
                ) : (
                  <table className="min-w-full text-sm">
                    <thead className="bg-white/[0.04] text-[#94a1b2]">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">
                          Дата
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Пользователь
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Источник
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Описание
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          Сумма
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.ledger.map((entry) => (
                        <tr
                          key={entry.id}
                          className="border-t border-white/[0.06] text-[#fffffe]"
                        >
                          <td className="px-4 py-3 text-[#abd1c6]">
                            {new Date(entry.createdAt).toLocaleString("ru-RU")}
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              href={profileHref(entry.user.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2.5 hover:text-[#f9bc60] hover:underline"
                            >
                              <Avatar className="h-8 w-8 shrink-0 border border-white/15">
                                <AvatarImage
                                  src={userAvatarSrc(entry.user.avatar)}
                                  alt={entry.user.name}
                                />
                                <AvatarFallback className="bg-[#004643] text-xs text-[#abd1c6]">
                                  {(entry.user.name || "?")
                                    .slice(0, 1)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="min-w-0">
                                {entry.user.name}
                                {entry.user.username
                                  ? ` (@${entry.user.username})`
                                  : ""}
                              </span>
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryBadgeClass(entry.category)}`}
                            >
                              {entry.categoryLabel}
                            </span>
                          </td>
                          <td className="max-w-xs truncate px-4 py-3 text-[#abd1c6]">
                            {entry.description}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-[#f9bc60]">
                            {entry.amountBonuses > 0 ? "+" : ""}
                            {entry.amountBonuses}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>
            )}

            {tab === "withdrawals" && (
              <div className="space-y-8">
                <h3 className="text-lg font-bold text-[#fffffe]">
                  На проверке ({pendingWithdrawals.length})
                </h3>
                {pendingWithdrawals.length === 0 ? (
                  <Card variant="default">
                    <p className="text-[#abd1c6]">Нет активных заявок.</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pendingWithdrawals.map((item) => (
                      <Card key={item.id} variant="darkGlass" className="space-y-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-2xl font-black text-[#f9bc60]">
                              {item.amountBonuses}{" "}
                              <span className="text-base font-semibold text-[#abd1c6]">
                                бонусов (~{item.amountBonuses} ₽)
                              </span>
                            </p>
                            <p className="mt-1 text-sm text-[#abd1c6]">
                              {new Date(item.createdAt).toLocaleString("ru-RU")}
                            </p>
                          </div>
                          <span className="rounded-full border border-[#f9bc60]/40 bg-[#f9bc60]/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#f9bc60]">
                            На проверке
                          </span>
                        </div>

                        <div className="rounded-xl border border-[#abd1c6]/20 bg-black/15 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#94a1b2]">
                            Пользователь
                          </p>
                          <div className="mt-2">{renderWithdrawUser(item.user)}</div>
                        </div>

                        <div className="rounded-xl border border-[#abd1c6]/20 bg-black/15 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#94a1b2]">
                            Банк
                          </p>
                          <p className="mt-1 text-[#fffffe]">{item.bankName}</p>
                        </div>

                        <div className="rounded-xl border border-[#f9bc60]/25 bg-[#f9bc60]/8 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#f9bc60]">
                            Реквизиты
                          </p>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#fffffe]/95">
                            {item.details}
                          </p>
                        </div>

                        <textarea
                          value={commentById[item.id] || ""}
                          onChange={(e) =>
                            setCommentById((prev) => ({
                              ...prev,
                              [item.id]: e.target.value,
                            }))
                          }
                          placeholder="Комментарий к решению"
                          rows={2}
                          className="w-full resize-y rounded-xl border border-[#abd1c6]/25 bg-[#001e1d]/50 px-3 py-2 text-sm text-[#fffffe] outline-none placeholder:text-[#5c6d7a] focus:border-[#f9bc60]/45"
                        />

                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            disabled={busyId === item.id}
                            className="rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-500"
                            onClick={() => patchWithdrawal(item.id, "approve")}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Одобрить (выплачено)
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={busyId === item.id}
                            className="rounded-xl border-rose-400/50 text-rose-200 hover:bg-rose-950/40"
                            onClick={() => patchWithdrawal(item.id, "reject")}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Отклонить
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                <h3 className="text-lg font-bold text-[#fffffe]">
                  Обработанные ({processedWithdrawals.length})
                </h3>
                {processedWithdrawals.length === 0 ? (
                  <Card variant="default">
                    <p className="text-[#abd1c6]">Пока нет записей.</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {processedWithdrawals.map((item) => (
                      <Card
                        key={item.id}
                        variant="darkGlass"
                        className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <Avatar className="h-10 w-10 shrink-0 border border-white/15">
                            <AvatarImage
                              src={userAvatarSrc(item.user.avatar)}
                              alt={item.user.name}
                            />
                            <AvatarFallback className="bg-[#004643] text-sm text-[#abd1c6]">
                              {(item.user.name || "?").slice(0, 1).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-[#fffffe]">
                              {item.amountBonuses} бон. ·{" "}
                              <Link
                                href={profileHref(item.user.id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#f9bc60] hover:underline"
                              >
                                {item.user.name}
                              </Link>
                            </p>
                            <p className="text-xs text-[#94a1b2]">
                              {item.bankName} ·{" "}
                              {new Date(item.createdAt).toLocaleString("ru-RU")}
                            </p>
                            {item.adminComment && (
                              <p className="mt-1 text-xs text-[#abd1c6]">
                                {item.adminComment}
                              </p>
                            )}
                          </div>
                        </div>
                        <span
                          className={
                            item.status === "APPROVED"
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }
                        >
                          {item.status === "APPROVED" ? "Одобрено" : "Отклонено"}
                        </span>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
