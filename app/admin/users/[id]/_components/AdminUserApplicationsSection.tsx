"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminCollapsiblePanel } from "@/app/admin/applications/[id]/_components/AdminCollapsiblePanel";
import { Button } from "@/components/ui/button";
import { AdminStatusPill } from "@/app/admin/_components/admin-ui";
import { formatDateShort } from "@/lib/time";
import type { AdminUserApplicationRef } from "../types";

const VISIBLE_DEFAULT = 3;

const STATUS_LABELS: Record<AdminUserApplicationRef["status"], string> = {
  PENDING: "В обработке",
  APPROVED: "Одобрено",
  REJECTED: "Отказано",
};

const STATUS_TONE: Record<
  AdminUserApplicationRef["status"],
  "pending" | "success" | "danger"
> = {
  PENDING: "pending",
  APPROVED: "success",
  REJECTED: "danger",
};

interface AdminUserApplicationsSectionProps {
  applications: AdminUserApplicationRef[];
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  };
}

export function AdminUserApplicationsSection({
  applications,
  stats,
}: AdminUserApplicationsSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = applications.length > VISIBLE_DEFAULT;
  const visibleApps = expanded
    ? applications
    : applications.slice(0, VISIBLE_DEFAULT);

  return (
    <div id="section-applications" className="scroll-mt-24">
      <AdminCollapsiblePanel
        title="Заявки на поддержку"
        badge={
          <span className="text-[11px] text-[#abd1c6]/70">
            {stats.total} всего
          </span>
        }
        defaultOpen
      >
        <p className="mb-3 text-xs text-[#abd1c6]/80">
          {stats.pending} в работе · {stats.approved} одобрено · {stats.rejected}{" "}
          отказано
        </p>

        {applications.length === 0 ? (
          <p className="text-sm text-[#abd1c6]/70">Заявок пока нет.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead>
                <tr className="border-b border-[#abd1c6]/15 text-[#abd1c6]/60">
                  <th className="pb-2 pr-2 font-medium">История</th>
                  <th className="pb-2 pr-2 font-medium">Сумма</th>
                  <th className="pb-2 pr-2 font-medium">Статус</th>
                  <th className="pb-2 pr-2 font-medium">IP / устройство</th>
                  <th className="pb-2 font-medium">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#abd1c6]/8">
                {visibleApps.map((app) => (
                  <tr key={app.id} className="align-top">
                    <td className="py-2 pr-2">
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="font-medium text-[#fffffe] hover:text-[#f9bc60] line-clamp-2"
                      >
                        {app.title}
                      </Link>
                      {app.isFirstFree ? (
                        <span className="mt-0.5 block text-[10px] text-[#10B981]">
                          первая бесплатная
                        </span>
                      ) : app.submitBonusCost > 0 ? (
                        <span className="mt-0.5 block text-[10px] text-[#abd1c6]/60">
                          −{app.submitBonusCost} бонусов
                        </span>
                      ) : null}
                    </td>
                    <td className="py-2 pr-2 tabular-nums text-[#f9bc60]">
                      {app.amount.toLocaleString("ru-RU")} ₽
                    </td>
                    <td className="py-2 pr-2">
                      <AdminStatusPill
                        tone={STATUS_TONE[app.status]}
                        className="!px-2 !py-0.5 !text-[10px] !normal-case !tracking-normal"
                      >
                        {STATUS_LABELS[app.status]}
                      </AdminStatusPill>
                    </td>
                    <td className="py-2 pr-2 font-mono text-[10px] text-[#abd1c6]/80">
                      {app.submitterIp ?? "—"}
                      {app.clientDevice ? (
                        <span className="block text-[#abd1c6]/55">
                          {app.clientDevice}
                          {app.clientTimezone ? ` · ${app.clientTimezone}` : ""}
                        </span>
                      ) : null}
                      {app.deviceFingerprintShort ? (
                        <span className="block text-[#abd1c6]/45">
                          {app.deviceFingerprintShort}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-2 text-[#abd1c6]/80 whitespace-nowrap">
                      {formatDateShort(app.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {hasMore ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-3 w-full text-xs text-[#abd1c6] hover:text-[#f9bc60]"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded
              ? "Свернуть"
              : `Показать ещё ${applications.length - VISIBLE_DEFAULT} заявок`}
          </Button>
        ) : null}

        {stats.total > applications.length ? (
          <p className="mt-3 text-xs text-[#abd1c6]/60">
            Показаны последние {applications.length} из {stats.total}
          </p>
        ) : null}
      </AdminCollapsiblePanel>
    </div>
  );
}
