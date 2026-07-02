"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { resolveAvatarUrl } from "@/lib/avatar";
import { buildUploadUrl } from "@/lib/uploads/url";
import {
  AdminPanel,
  adminCtaButtonClass,
  adminFieldClass,
  adminListRowClass,
} from "@/app/admin/_components/admin-ui";
import type {
  BonusLedgerEvent,
  BonusLedgerUserGroup,
} from "@/lib/admin/bonusLedger";

type Props = {
  ledgerUsers: BonusLedgerUserGroup[];
  profileHref: (userId: string) => string;
};

function userAvatarSrc(avatar?: string | null) {
  return buildUploadUrl(resolveAvatarUrl(avatar), { variant: "thumb" });
}

function categoryBadgeClass(
  category: BonusLedgerEvent["category"],
): string {
  switch (category) {
    case "goodDeeds":
      return "border-emerald-400/40 bg-emerald-500/15 text-emerald-200";
    case "referrals":
      return "border-sky-400/40 bg-sky-500/15 text-sky-200";
    case "dailyBonus":
      return "border-violet-400/40 bg-violet-500/15 text-violet-200";
    case "dailyChest":
      return "border-amber-400/40 bg-amber-500/15 text-amber-200";
    case "adminManual":
      return "border-[#f9bc60]/40 bg-[#f9bc60]/15 text-[#f9bc60]";
    case "application":
      return "border-orange-400/40 bg-orange-500/15 text-orange-200";
    case "withdrawal":
      return "border-rose-400/40 bg-rose-500/15 text-rose-200";
    default:
      return "border-[#abd1c6]/30 bg-white/5 text-[#abd1c6]";
  }
}

function amountClass(kind: BonusLedgerEvent["kind"]): string {
  if (kind === "earn") return "text-emerald-300";
  if (kind === "spend") return "text-rose-300";
  return "text-[#94a1b2]";
}

function formatAmount(amount: number): string {
  if (amount > 0) return `+${amount}`;
  if (amount < 0) return String(amount);
  return "0";
}

function LedgerUserRow({
  group,
  profileHref,
  expanded,
  onToggle,
}: {
  group: BonusLedgerUserGroup;
  profileHref: (userId: string) => string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { user, totals, lastEventAt, events } = group;

  return (
    <article className={cn(adminListRowClass, "overflow-hidden p-0")}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-[#f9bc60]/5 sm:items-center sm:gap-4 sm:px-5"
        aria-expanded={expanded}
      >
        <Avatar className="h-11 w-11 shrink-0 border-2 border-[#abd1c6]/20">
          <AvatarImage src={userAvatarSrc(user.avatar)} alt={user.name} />
          <AvatarFallback className="bg-[#004643] text-sm text-[#abd1c6]">
            {(user.name || "?").slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-[#fffffe]">{user.name}</span>
            {user.username ? (
              <span className="text-sm text-[#94a1b2]">@{user.username}</span>
            ) : null}
            <span className="text-xs text-[#6d7f78]">
              · {totals.eventCount}{" "}
              {totals.eventCount === 1
                ? "операция"
                : totals.eventCount < 5
                  ? "операции"
                  : "операций"}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border-2 border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-200">
              +{totals.earned} получено
            </span>
            <span className="rounded-full border-2 border-rose-400/30 bg-rose-500/10 px-2.5 py-1 text-rose-200">
              −{totals.spent} потрачено
            </span>
            <span className="rounded-full border-2 border-[#f9bc60]/35 bg-[#f9bc60]/10 px-2.5 py-1 font-bold text-[#f9bc60]">
              {totals.availableBonuses} доступно
            </span>
            {totals.investedInExperience > 0 ? (
              <span className="rounded-full border-2 border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-violet-200">
                {totals.investedInExperience} в опыте
              </span>
            ) : null}
          </div>
          {lastEventAt ? (
            <p className="mt-1.5 text-xs text-[#6d7f78]">
              Последняя операция:{" "}
              {new Date(lastEventAt).toLocaleString("ru-RU")}
            </p>
          ) : null}
        </div>

        <ChevronDown
          className={cn(
            "mt-1 h-5 w-5 shrink-0 text-[#f9bc60] transition-transform sm:mt-0",
            expanded && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {expanded ? (
        <div className="border-t-2 border-[#abd1c6]/10 bg-black/15 px-4 py-4 sm:px-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-[#abd1c6]">История операций</p>
            <div className="flex gap-2">
              <Link
                href={`/admin/users/${user.id}`}
                className={adminCtaButtonClass}
              >
                Досье
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={profileHref(user.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1 rounded-lg border-2 border-[#abd1c6]/25 px-3 text-xs font-bold text-[#abd1c6] hover:border-[#f9bc60]/40 hover:text-[#f9bc60]"
              >
                Профиль
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-xl border-2 border-[#abd1c6]/15 bg-[#001e1d]/40 px-3 py-3 sm:px-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-block rounded-full border-2 px-2.5 py-0.5 text-[11px] font-bold",
                          categoryBadgeClass(event.category),
                        )}
                      >
                        {event.categoryLabel}
                      </span>
                      <span className="text-xs text-[#6d7f78]">
                        {new Date(event.createdAt).toLocaleString("ru-RU")}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-[#fffffe]">
                      {event.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[#abd1c6]/95">
                      {event.description}
                    </p>
                  </div>
                  <p
                    className={cn(
                      "shrink-0 text-lg font-black tabular-nums sm:pl-4",
                      amountClass(event.kind),
                    )}
                  >
                    {formatAmount(event.amountBonuses)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function BonusLedgerSection({ ledgerUsers, profileHref }: Props) {
  const [query, setQuery] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ledgerUsers;
    return ledgerUsers.filter((group) => {
      const hay = [
        group.user.name,
        group.user.username ?? "",
        group.user.email ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [ledgerUsers, query]);

  if (ledgerUsers.length === 0) {
    return (
      <AdminPanel title="Журнал пуст" accent="neutral">
        <p className="text-[#abd1c6]">
          Операций с бонусами пока нет.
        </p>
      </AdminPanel>
    );
  }

  return (
    <div className="space-y-4">
      <AdminPanel
        title="Журнал по пользователям"
        subtitle={`${ledgerUsers.length} пользователей · разверните строку для деталей`}
        accent="gold"
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск: имя, @username, email"
          className={adminFieldClass}
        />
      </AdminPanel>

      {filtered.length === 0 ? (
        <AdminPanel title="Ничего не найдено" accent="neutral">
          <p className="text-[#abd1c6]">Никого не найдено по запросу.</p>
        </AdminPanel>
      ) : (
        <div className="space-y-3">
          {filtered.map((group) => (
            <LedgerUserRow
              key={group.user.id}
              group={group}
              profileHref={profileHref}
              expanded={expandedUserId === group.user.id}
              onToggle={() =>
                setExpandedUserId((current) =>
                  current === group.user.id ? null : group.user.id,
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
