"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AdminCollapsiblePanel,
} from "@/app/admin/applications/[id]/_components/AdminCollapsiblePanel";
import { Button } from "@/components/ui/button";
import { formatDateShort, formatDateTime } from "@/lib/time";
import { toDisplayExperience } from "@/lib/userLevel/economy";
import { AdminStatGrid, AdminTabBar } from "@/app/admin/_components/admin-ui";
import {
  BONUS_SOURCE_LABELS,
  type BonusSourceCategory,
} from "@/lib/admin/bonusGrantCategory";
import type { BonusLedgerEvent } from "@/lib/admin/bonusLedger";
import type { AdminUserDetail } from "../types";

const BONUS_LEDGER_PAGE_INITIAL = 5;
const BONUS_LEDGER_PAGE_STEP = 30;

type BonusLedgerTabId = "incoming" | "outgoing" | "info";

const BONUS_SOURCE_ORDER: BonusSourceCategory[] = [
  "goodDeeds",
  "referrals",
  "dailyBonus",
  "dailyChest",
  "adminManual",
  "other",
];

function formatBonusAmount(amount: number): string {
  if (amount > 0) return `+${amount}`;
  if (amount < 0) return String(amount);
  return "0";
}

function bonusAmountClass(kind: BonusLedgerEvent["kind"]): string {
  if (kind === "earn") return "text-emerald-300";
  if (kind === "spend") return "text-rose-300";
  return "text-[#94a1b2]";
}

function BonusLedgerEventRow({ event }: { event: BonusLedgerEvent }) {
  return (
    <li className="flex justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="font-medium text-[#fffffe]/95">{event.title}</p>
        <p className="mt-0.5 text-[#abd1c6]/80">
          {event.description}
          {event.applicationId ? (
            <>
              {" "}
              <Link
                href={`/admin/applications/${event.applicationId}`}
                className="text-[#f9bc60] hover:underline"
              >
                → заявка
              </Link>
            </>
          ) : null}
        </p>
        <p className="mt-0.5 text-[10px] text-[#abd1c6]/55">
          {formatDateShort(event.createdAt)} · {event.categoryLabel}
        </p>
      </div>
      <span
        className={`shrink-0 tabular-nums font-medium ${bonusAmountClass(event.kind)}`}
      >
        {formatBonusAmount(event.amountBonuses)}
      </span>
    </li>
  );
}

function BonusLedgerEventList({
  events,
  visibleCount,
  onShowMore,
  onCollapse,
}: {
  events: BonusLedgerEvent[];
  visibleCount: number;
  onShowMore: () => void;
  onCollapse: () => void;
}) {
  if (events.length === 0) {
    return <p className="text-sm text-[#abd1c6]/60">Записей нет.</p>;
  }

  const visibleEvents = events.slice(0, visibleCount);
  const remaining = events.length - visibleCount;
  const canShowMore = remaining > 0;
  const canCollapse = visibleCount > BONUS_LEDGER_PAGE_INITIAL;

  return (
    <>
      <ul className="divide-y divide-[#abd1c6]/10 text-xs">
        {visibleEvents.map((event) => (
          <BonusLedgerEventRow key={event.id} event={event} />
        ))}
      </ul>
      {canShowMore || canCollapse ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {canShowMore ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-1 text-xs text-[#abd1c6] hover:text-[#f9bc60] sm:flex-none"
              onClick={onShowMore}
            >
              Показать ещё {Math.min(remaining, BONUS_LEDGER_PAGE_STEP)}
            </Button>
          ) : null}
          {canCollapse ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="flex-1 text-xs text-[#abd1c6]/70 hover:text-[#abd1c6] sm:flex-none"
              onClick={onCollapse}
            >
              Свернуть
            </Button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

interface AdminUserDossierProps {
  user: AdminUserDetail;
}

export function AdminUserDossier({ user }: AdminUserDossierProps) {
  return (
    <div className="space-y-3">
      <div id="section-profile" className="scroll-mt-24">
        <AdminCollapsiblePanel
          title="Профиль и вход"
          badge={<span className="text-[11px] text-[#abd1c6]/70">Аккаунт</span>}
          defaultOpen
        >
          <ProfileGrid user={user} />
        </AdminCollapsiblePanel>
      </div>

      <div id="section-economy" className="scroll-mt-24">
        <AdminCollapsiblePanel
          title="Бонусы и уровень"
          badge={
            <span className="text-[11px] font-semibold text-[#f9bc60]">
              {user.wallet.availableBonuses} на балансе
            </span>
          }
          defaultOpen
        >
          <EconomyBlock user={user} />
        </AdminCollapsiblePanel>
      </div>

      <div id="section-good-deeds" className="scroll-mt-24">
        <AdminCollapsiblePanel
          title="Добрые дела"
          badge={
            <span className="text-[11px] text-[#abd1c6]/70">
              {user.goodDeeds.stats.total} заданий
            </span>
          }
        >
          <GoodDeedsBlock user={user} />
        </AdminCollapsiblePanel>
      </div>

      <div id="section-reviews" className="scroll-mt-24">
        <AdminCollapsiblePanel
          title="Отзывы"
          badge={
            <span className="text-[11px] text-[#abd1c6]/70">
              {user.reviews.length}
            </span>
          }
        >
          <ReviewsBlock user={user} />
        </AdminCollapsiblePanel>
      </div>

      <div id="section-referrals" className="scroll-mt-24">
        <AdminCollapsiblePanel
          title="Реферальная программа"
          badge={
            <span className="text-[11px] text-[#abd1c6]/70">
              {user.referrals.invitedCount} приглашённых
            </span>
          }
        >
          <ReferralsBlock user={user} />
        </AdminCollapsiblePanel>
      </div>

      <div id="section-social" className="scroll-mt-24">
        <AdminCollapsiblePanel
          title="Социальное и активность"
          badge={
            <span className="text-[11px] text-[#abd1c6]/70">
              {user.achievements.length} ачивок
            </span>
          }
        >
          <SocialBlock user={user} />
        </AdminCollapsiblePanel>
      </div>

      <AdminCollapsiblePanel
        title="Технический след"
        badge={
          <span className="text-[11px] text-[#abd1c6]/70">
            {user.techTrace.ips.length} IP
          </span>
        }
      >
        <TechBlock user={user} />
      </AdminCollapsiblePanel>
    </div>
  );
}

function ProfileGrid({ user }: { user: AdminUserDetail }) {
  const rows: { label: string; value: string }[] = [
    { label: "ID", value: user.id },
    { label: "Email", value: user.email ?? "—" },
    { label: "Телефон", value: user.phone ?? "—" },
    { label: "Username", value: user.username ? `@${user.username}` : "—" },
    {
      label: "Регистрация",
      value: formatDateTime(user.createdAt),
    },
    {
      label: "Последний визит",
      value: user.lastSeen ? formatDateTime(user.lastSeen) : "—",
    },
    {
      label: "Последний комментарий",
      value: user.lastCommentAt ? formatDateTime(user.lastCommentAt) : "—",
    },
    {
      label: "Уровень / опыт",
      value: `${user.level} · ${toDisplayExperience(user.experience)} XP`,
    },
    {
      label: "Вход",
      value: [
        user.auth.hasEmail && `email${user.auth.emailVerified ? " ✓" : ""}`,
        user.auth.hasPhone && `тел.${user.auth.phoneVerified ? " ✓" : ""}`,
        user.auth.hasGoogle && "Google",
        user.auth.hasTelegram && "Telegram",
      ]
        .filter(Boolean)
        .join(", ") || "—",
    },
    { label: "Google", value: user.googleEmail ?? "—" },
    { label: "Telegram ID", value: user.telegramId ?? "—" },
    { label: "Реф. код", value: user.referralCode ?? "—" },
    {
      label: "Настройки",
      value: [
        user.hideEmail && "скрывает email",
        user.hideFromHeroes && "скрыт из героев",
        user.bonusWithdrawalBlocked && "вывод заблокирован",
        user.heroBadgeOverride && "hero badge override",
      ]
        .filter(Boolean)
        .join(" · ") || "—",
    },
    { label: "Секретная последовательность", value: String(user.maxSequenceRecord) },
  ];

  if (user.vkLink) rows.push({ label: "VK", value: user.vkLink });
  if (user.youtubeLink) rows.push({ label: "YouTube", value: user.youtubeLink });
  if (user.telegramLink) rows.push({ label: "Telegram ссылка", value: user.telegramLink });
  if (user.adminEconomyResetAt) {
    rows.push({
      label: "Сброс экономики",
      value: formatDateShort(user.adminEconomyResetAt),
    });
  }

  return (
    <>
      {user.isBanned ? (
        <div className="mb-4 rounded-xl border-2 border-red-500/35 bg-red-500/10 p-3 text-sm">
          <p className="font-semibold text-red-200">Заблокирован</p>
          {user.bannedReason ? (
            <p className="mt-1 text-red-100/90">{user.bannedReason}</p>
          ) : null}
          <p className="mt-1 text-xs text-red-200/80">
            {user.bannedUntil
              ? `До ${formatDateTime(user.bannedUntil)}`
              : "Бессрочно"}
          </p>
        </div>
      ) : null}
      <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-xl border-2 border-[#abd1c6]/15 bg-[#001e1d]/40 px-3 py-2"
          >
            <dt className="text-[0.65rem] uppercase tracking-wide text-[#abd1c6]/55">
              {row.label}
            </dt>
            <dd className="mt-0.5 break-all text-sm text-[#fffffe]">{row.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function EconomyBlock({ user }: { user: AdminUserDetail }) {
  const w = user.wallet;
  const ledger = user.bonusLedger;
  const [activeTab, setActiveTab] = useState<BonusLedgerTabId>("incoming");
  const [visibleCounts, setVisibleCounts] = useState<
    Record<BonusLedgerTabId, number>
  >({
    incoming: BONUS_LEDGER_PAGE_INITIAL,
    outgoing: BONUS_LEDGER_PAGE_INITIAL,
    info: BONUS_LEDGER_PAGE_INITIAL,
  });

  const incomingEvents = useMemo(
    () => ledger.events.filter((event) => event.amountBonuses > 0),
    [ledger.events],
  );
  const outgoingEvents = useMemo(
    () => ledger.events.filter((event) => event.amountBonuses < 0),
    [ledger.events],
  );
  const infoEvents = useMemo(
    () => ledger.events.filter((event) => event.amountBonuses === 0),
    [ledger.events],
  );

  const eventsByTab: Record<BonusLedgerTabId, BonusLedgerEvent[]> = {
    incoming: incomingEvents,
    outgoing: outgoingEvents,
    info: infoEvents,
  };

  const ledgerTabs = [
    { id: "incoming" as const, label: "Поступления", badge: incomingEvents.length },
    { id: "outgoing" as const, label: "Списания", badge: outgoingEvents.length },
    ...(infoEvents.length > 0
      ? [{ id: "info" as const, label: "События", badge: infoEvents.length }]
      : []),
  ];

  const activeEvents = eventsByTab[activeTab];
  const visibleCount = visibleCounts[activeTab];

  const sourceItems = BONUS_SOURCE_ORDER.map((key) => ({
    key,
    label: BONUS_SOURCE_LABELS[key],
    value: ledger.bySource[key],
  })).filter((item) => item.value > 0);

  const hasAnyEvents = ledger.events.length > 0;

  return (
    <div className="space-y-4">
      <AdminStatGrid
        columns={3}
        items={[
            { label: "На балансе", value: w.availableBonuses, tone: "pending", highlight: w.availableBonuses > 0 },
            { label: "Всего начислено", value: w.totalEarnedBonuses },
            { label: "Вложено в опыт", value: w.bonusesInvestedInExperience },
            { label: "Выведено", value: w.withdrawnBonuses },
            {
              label: "В ожидании вывода",
              value: w.pendingWithdrawalBonuses,
              tone: w.pendingWithdrawalBonuses > 0 ? "pending" : "default",
            },
          ]}
      />

      {sourceItems.length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#abd1c6]/65">
            Откуда начислено
          </p>
          <AdminStatGrid
            columns={3}
            items={sourceItems.map((item) => ({
              label: item.label,
              value: item.value,
              tone: "success" as const,
            }))}
          />
        </div>
      ) : null}

      {hasAnyEvents ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#abd1c6]/65">
            История операций с бонусами
          </p>
          <AdminTabBar
            className="mb-3"
            tabs={ledgerTabs}
            activeId={activeTab}
            onChange={(id) => setActiveTab(id as BonusLedgerTabId)}
          />
          <BonusLedgerEventList
            events={activeEvents}
            visibleCount={visibleCount}
            onShowMore={() =>
              setVisibleCounts((prev) => ({
                ...prev,
                [activeTab]: prev[activeTab] + BONUS_LEDGER_PAGE_STEP,
              }))
            }
            onCollapse={() =>
              setVisibleCounts((prev) => ({
                ...prev,
                [activeTab]: BONUS_LEDGER_PAGE_INITIAL,
              }))
            }
          />
        </div>
      ) : (
        <p className="text-sm text-[#abd1c6]/60">Операций с бонусами нет.</p>
      )}
    </div>
  );
}

function GoodDeedsBlock({ user }: { user: AdminUserDetail }) {
  const g = user.goodDeeds;
  const w = g.withdrawals;
  return (
    <div className="space-y-4">
      <p className="text-sm text-[#abd1c6]/85">
        Задания: {g.stats.approved} одобр. / {g.stats.pending} в работе /{" "}
        {g.stats.rejected} откл. · Выводы: {w.stats.approved} одобр. /{" "}
        {w.stats.pending} в работе
      </p>
      {g.submissions.length > 0 ? (
        <ul className="divide-y divide-[#abd1c6]/10 text-sm">
          {g.submissions.map((s) => (
            <li key={s.id} className="flex justify-between gap-2 py-2">
              <span className="min-w-0 text-[#fffffe]">{s.taskTitle}</span>
              <span className="shrink-0 text-xs text-[#abd1c6]">
                {formatDateShort(s.createdAt)} · {s.reward} б. · {s.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#abd1c6]/60">Заданий нет.</p>
      )}
      {w.items.length > 0 ? (
        <>
          <p className="text-xs font-semibold uppercase text-[#abd1c6]/65">
            Заявки на вывод
          </p>
          <ul className="divide-y divide-[#abd1c6]/10 text-sm">
            {w.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-2 py-2">
                <span className="text-[#fffffe]">
                  {item.bankName} · {item.amountBonuses} б.
                </span>
                <span className="text-xs text-[#abd1c6]">
                  {formatDateShort(item.createdAt)} · {item.status}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}

function ReviewsBlock({ user }: { user: AdminUserDetail }) {
  if (user.reviews.length === 0) {
    return <p className="text-sm text-[#abd1c6]/60">Отзывов нет.</p>;
  }
  return (
    <ul className="space-y-3">
      {user.reviews.map((r) => (
        <li
          key={r.id}
          className="rounded-xl border-2 border-[#abd1c6]/15 bg-[#001e1d]/40 p-3"
        >
          <p className="text-xs text-[#abd1c6]/65">
            {formatDateShort(r.createdAt)}
            {r.applicationTitle ? ` · ${r.applicationTitle}` : null}
          </p>
          <p className="mt-1 line-clamp-4 text-sm text-[#fffffe]/90 whitespace-pre-wrap">
            {r.content}
          </p>
        </li>
      ))}
    </ul>
  );
}

function ReferralsBlock({ user }: { user: AdminUserDetail }) {
  const r = user.referrals;
  return (
    <div className="space-y-3 text-sm">
      <p className="text-[#abd1c6]/85">
        Кликов по ссылке: {r.clicksCount} · Приглашено: {r.invitedCount}
      </p>
      {r.referredBy ? (
        <p className="text-[#abd1c6]">
          Пришёл по рефералке:{" "}
          <UserAdminLink
            userId={r.referredBy.userId}
            label={r.referredBy.name || r.referredBy.email || r.referredBy.userId}
          />
          {" · "}
          {formatDateShort(r.referredBy.registeredAt)}
        </p>
      ) : (
        <p className="text-[#abd1c6]/60">Не регистрировался по чужой ссылке.</p>
      )}
      {r.invited.length > 0 ? (
        <ul className="divide-y divide-[#abd1c6]/10">
          {r.invited.map((inv) => (
            <li key={inv.userId} className="flex justify-between gap-2 py-2">
              <UserAdminLink
                userId={inv.userId}
                label={inv.name || inv.email || inv.userId.slice(0, 8)}
              />
              <span className="shrink-0 text-xs text-[#abd1c6]/70">
                {formatDateShort(inv.registeredAt)}
                {inv.bonusGrantedAt ? " · бонус ✓" : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[#abd1c6]/60">Никого не приглашал.</p>
      )}
    </div>
  );
}

function SocialBlock({ user }: { user: AdminUserDetail }) {
  const s = user.social;
  return (
    <div className="space-y-4 text-sm">
      <AdminStatGrid
        columns={2}
        items={[
          { label: "Друзья", value: s.friendsAccepted },
          { label: "Заявки в друзья", value: s.friendsPending, tone: s.friendsPending > 0 ? "pending" : "default" },
          { label: "Донаты (шт.)", value: s.donationsCount },
          { label: "Донаты (сумма)", value: s.donationsTotal, tone: "success" },
        ]}
      />
      {user.loginStreak ? (
        <p className="text-[#abd1c6]/85">
          Серия входов: {user.loginStreak.current} (макс. {user.loginStreak.max})
          {user.loginStreak.lastVisitDate
            ? ` · последний день ${user.loginStreak.lastVisitDate}`
            : ""}
        </p>
      ) : null}
      {user.achievements.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {user.achievements.map((a) => (
            <span
              key={a.slug}
              className="rounded-lg border border-[#abd1c6]/20 bg-[#001e1d]/50 px-2 py-1 text-xs text-[#abd1c6]"
              title={a.unlockedAt}
            >
              {a.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[#abd1c6]/60">Ачивок нет.</p>
      )}
    </div>
  );
}

function TechBlock({ user }: { user: AdminUserDetail }) {
  return (
    <div className="space-y-3 text-sm">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-[#abd1c6]/65">
          IP при подаче заявок
        </p>
        {user.techTrace.ips.length > 0 ? (
          <p className="break-all font-mono text-xs text-[#fffffe]/90">
            {user.techTrace.ips.join(" · ")}
          </p>
        ) : (
          <p className="text-[#abd1c6]/60">Нет данных</p>
        )}
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-[#abd1c6]/65">
          Отпечатки устройств
        </p>
        {user.techTrace.devices.length > 0 ? (
          <ul className="space-y-1 font-mono text-xs text-[#fffffe]/90">
            {user.techTrace.devices.map((d, i) => (
              <li key={i}>
                {d.fingerprintShort}
                {d.clientDevice ? ` (${d.clientDevice})` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[#abd1c6]/60">Нет данных</p>
        )}
      </div>
    </div>
  );
}
function UserAdminLink({ userId, label }: { userId: string; label: string }) {
  return (
    <Link
      href={`/admin/users/${userId}`}
      className="font-medium text-[#f9bc60] hover:underline"
    >
      {label}
    </Link>
  );
}
