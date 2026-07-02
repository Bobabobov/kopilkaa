"use client";

import Link from "next/link";
import {
  ChevronRight,
  Clock3,
  ImageIcon,
  Video,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import {
  adminCtaButtonClass,
  adminListRowClass,
  adminListRowPendingClass,
  AdminStatusPill,
} from "@/app/admin/_components/admin-ui";
import { STATUS_LABELS } from "../_lib/constants";
import type { GoodDeedSubmissionListItemDto } from "@/lib/admin/goodDeedSubmissions";

function hoursSince(dateString: string): number | null {
  const t = new Date(dateString).getTime();
  if (!Number.isFinite(t)) return null;
  return Math.max(0, Math.floor((Date.now() - t) / (1000 * 60 * 60)));
}

function formatWait(hours: number | null): string {
  if (hours == null) return "—";
  if (hours < 1) return "< 1 ч";
  if (hours < 24) return `${hours} ч`;
  const days = Math.floor(hours / 24);
  return `${days} д`;
}

interface GoodDeedsSubmissionsTableProps {
  items: GoodDeedSubmissionListItemDto[];
  loading: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

export function GoodDeedsSubmissionsTable({
  items,
  loading,
  selectedIds,
  onToggleSelect,
}: GoodDeedsSubmissionsTableProps) {
  if (loading && items.length === 0) {
    return (
      <Card variant="default">
        <p className="text-[#abd1c6]">Загрузка...</p>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card variant="default">
        <p className="text-[#abd1c6]">Нет отчётов по выбранным фильтрам.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const storyLen = item.storyText.trim().length;
        const waitHours =
          item.status === "PENDING" ? hoursSince(item.createdAt) : null;
        const isPending = item.status === "PENDING";

        return (
          <article
            key={item.id}
            className={`p-3 ${isPending ? adminListRowPendingClass : adminListRowClass}`}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {isPending ? (
                <label className="flex shrink-0 items-center gap-2 text-xs text-[#abd1c6] lg:w-24">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggleSelect(item.id)}
                    className="h-4 w-4 rounded border-[#abd1c6]/40 bg-[#003b3a] text-[#f9bc60]"
                  />
                  Выбрать
                </label>
              ) : (
                <div className="hidden w-24 shrink-0 lg:block" />
              )}

              <div className="flex min-w-0 flex-1 gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#abd1c6]/20 bg-black/20">
                  {item.firstMediaUrl ? (
                    item.firstMediaType === "VIDEO" ? (
                      <>
                        <video
                          src={item.firstMediaUrl}
                          className="h-full w-full object-cover"
                          muted
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                          <Video className="h-5 w-5 text-white" />
                        </span>
                      </>
                    ) : (
                      <img
                        src={item.firstMediaUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[#abd1c6]/40">
                      <ImageIcon className="h-5 w-5" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-[#fffffe]">
                      {item.taskTitle}
                    </h3>
                    <AdminStatusPill
                      tone={
                        item.status === "APPROVED"
                          ? "success"
                          : item.status === "REJECTED"
                            ? "danger"
                            : "pending"
                      }
                      className="!px-2 !py-0.5 !text-[10px] !normal-case !tracking-normal"
                    >
                      {STATUS_LABELS[item.status]}
                    </AdminStatusPill>
                    {isPending && waitHours != null && waitHours >= 24 ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-200">
                        <Clock3 className="h-3 w-3" />
                        {formatWait(waitHours)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-[#abd1c6]/85">
                    <Link
                      href={`/admin/users/${item.user.id}`}
                      className="hover:text-[#f9bc60] hover:underline"
                    >
                      {item.user.name}
                      {item.user.username ? ` (@${item.user.username})` : ""}
                    </Link>
                    {" · "}
                    неделя {item.weekKey}
                    {" · "}+{item.reward} бон.
                  </p>
                  <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-[#94a1b2]">
                    <span>{item.mediaCount} материал(ов)</span>
                    <span>{storyLen} симв. в рассказе</span>
                    <span>
                      {new Date(item.createdAt).toLocaleString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                </div>
              </div>

              <Link
                href={`/admin/good-deeds/${item.id}`}
                className={adminCtaButtonClass}
              >
                Проверить
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
