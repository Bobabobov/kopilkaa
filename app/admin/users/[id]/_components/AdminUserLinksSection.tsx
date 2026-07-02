"use client";

import Link from "next/link";
import { AdminCollapsiblePanel, AdminRiskBadge } from "@/app/admin/applications/[id]/_components/AdminCollapsiblePanel";
import { adminListRowClass } from "@/app/admin/_components/admin-ui";
import type { AdminUserLinkRef } from "@/types/admin";

interface AdminUserLinksSectionProps {
  links: {
    samePayment: AdminUserLinkRef[];
    sameIp: AdminUserLinkRef[];
    sameDevice: AdminUserLinkRef[];
  };
}

export function AdminUserLinksSection({ links }: AdminUserLinksSectionProps) {
  const total =
    links.samePayment.length + links.sameIp.length + links.sameDevice.length;

  return (
    <div id="section-links" className="scroll-mt-24">
      <AdminCollapsiblePanel
        title="Связанные аккаунты"
        badge={<AdminRiskBadge count={total} cleanLabel="Чисто" />}
        defaultOpen={total > 0}
      >
        <p className="mb-3 text-xs text-[#abd1c6]/70">
          Совпадения по реквизитам (заявки и выводы), IP и отпечатку устройства.
        </p>

        {total === 0 ? (
          <p className="text-sm text-[#10B981]/90">
            Совпадений с другими аккаунтами не найдено.
          </p>
        ) : (
          <div className="space-y-4">
            <LinkGroup title="По реквизитам" items={links.samePayment} />
            <LinkGroup title="По IP" items={links.sameIp} />
            <LinkGroup title="По устройству" items={links.sameDevice} />
          </div>
        )}
      </AdminCollapsiblePanel>
    </div>
  );
}

function LinkGroup({
  title,
  items,
}: {
  title: string;
  items: AdminUserLinkRef[];
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#f9bc60]">
        {title} ({items.length})
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2 ${adminListRowClass}`}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#fffffe]">
                {item.name || "Без имени"}
              </p>
              <p className="truncate text-xs text-[#abd1c6]/70">
                {item.email || item.id}
              </p>
            </div>
            <Link
              href={`/admin/users/${item.id}`}
              className="shrink-0 text-xs font-medium text-[#f9bc60] hover:underline"
            >
              Открыть →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
