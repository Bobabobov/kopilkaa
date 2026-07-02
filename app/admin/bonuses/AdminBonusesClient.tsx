"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { AdminPage } from "../_components/AdminPage";
import { AdminPanel, AdminTabBar } from "../_components/admin-ui";
import { cn } from "@/lib/utils";
import { BonusLedgerSection } from "./BonusLedgerSection";
import { BonusesOverviewSection } from "./_components/BonusesOverviewSection";
import { BonusUsersList } from "./_components/BonusUsersList";
import { BonusWithdrawalsSection } from "./_components/BonusWithdrawalsSection";
import type { BonusReport } from "./_components/types";
import { throwIfApiFailed } from "@/lib/api/parseApiError";
import { resolveAvatarUrl } from "@/lib/avatar";
import { buildUploadUrl } from "@/lib/uploads/url";

type TabKey = "overview" | "users" | "withdrawals" | "ledger";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Обзор" },
  { key: "users", label: "Пользователи" },
  { key: "withdrawals", label: "Вывод" },
  { key: "ledger", label: "Журнал" },
];

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
  const [commentById, setCommentById] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bonuses/report", {
        cache: "no-store",
      });
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

  const userAvatarSrc = (avatar?: string | null) =>
    buildUploadUrl(resolveAvatarUrl(avatar), { variant: "thumb" });

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

  const { pendingWithdrawals, processedWithdrawals } = useMemo(() => {
    if (!report) {
      return { pendingWithdrawals: [], processedWithdrawals: [] };
    }
    return {
      pendingWithdrawals: report.withdrawals.filter(
        (x) => x.status === "PENDING",
      ),
      processedWithdrawals: report.withdrawals.filter(
        (x) => x.status !== "PENDING",
      ),
    };
  }, [report]);

  return (
    <AdminPage
      title="Бонусы"
      description="Оборот бонусов, балансы пользователей и заявки на вывод."
      actions={
        <button
          type="button"
          onClick={() => load().catch(console.error)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-[#abd1c6]/25 px-3 py-2 text-sm font-medium text-[#abd1c6] transition-colors hover:border-[#f9bc60]/45 hover:bg-[#f9bc60]/10 hover:text-[#fffffe] disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Обновить
        </button>
      }
    >
      <AdminTabBar
        tabs={TABS.map((item) => ({
          id: item.key,
          label: item.label,
          badge:
            item.key === "withdrawals"
              ? report?.summary.pendingWithdrawalsCount
              : null,
        }))}
        activeId={tab}
        onChange={(id) => setTab(id as TabKey)}
      />

      {loading ? (
        <AdminPanel title="Загрузка данных" accent="neutral">
          <p className="text-[#abd1c6]">Загрузка…</p>
        </AdminPanel>
      ) : !report ? (
        <AdminPanel title="Ошибка" accent="neutral">
          <p className="text-[#abd1c6]">Не удалось загрузить данные.</p>
        </AdminPanel>
      ) : (
        <>
          {tab === "overview" && (
            <BonusesOverviewSection
              summary={report.summary}
              onOpenWithdrawals={() => setTab("withdrawals")}
            />
          )}

          {tab === "users" && (
            <BonusUsersList
              users={report.users}
              userAvatarSrc={userAvatarSrc}
            />
          )}

          {tab === "ledger" && (
            <BonusLedgerSection
              ledgerUsers={report.ledgerUsers}
              profileHref={profileHref}
            />
          )}

          {tab === "withdrawals" && (
            <BonusWithdrawalsSection
              pending={pendingWithdrawals}
              processed={processedWithdrawals}
              busyId={busyId}
              commentById={commentById}
              onCommentChange={(id, value) =>
                setCommentById((prev) => ({ ...prev, [id]: value }))
              }
              onPatch={patchWithdrawal}
              userAvatarSrc={userAvatarSrc}
            />
          )}
        </>
      )}
    </AdminPage>
  );
}
