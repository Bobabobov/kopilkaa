"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AdminSectionLabel,
  AdminStatGrid,
} from "@/app/admin/_components/admin-ui";
import type { AdminUserDetail } from "../types";

interface AdminUserHeaderStripProps {
  user: AdminUserDetail;
  onCopy: (text: string, label: string) => void;
}

export function AdminUserHeaderStrip({ user, onCopy }: AdminUserHeaderStripProps) {
  const displayName = user.name || user.username || "Без имени";

  return (
    <header className="mb-4 overflow-hidden rounded-2xl border-2 border-[#f9bc60]/25 bg-gradient-to-r from-[#004643]/80 to-[#001e1d]/90 shadow-lg shadow-black/10">
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col items-center gap-3 border-l-4 border-[#f9bc60] pl-4 sm:flex-row sm:items-start">
          <Avatar className="h-16 w-16 shrink-0 border-2 border-[#f9bc60]/40 shadow-md shadow-[#f9bc60]/10">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={displayName} />
            ) : null}
            <AvatarFallback className="bg-[#f9bc60]/10 text-[#f9bc60]">
              <LucideIcons.User className="h-7 w-7" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 text-center sm:text-left">
            <AdminSectionLabel accent="gold" className="mb-1 justify-center sm:justify-start">
              Досье пользователя
            </AdminSectionLabel>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
              <h1 className="text-xl font-bold text-[#fffffe] sm:text-2xl">
                {displayName}
              </h1>
              {user.role === "ADMIN" ? (
                <Badge className="text-[0.6rem] uppercase">Админ</Badge>
              ) : null}
              {user.isBanned ? (
                <Badge
                  variant="outline"
                  className="border-red-500/50 text-[0.6rem] text-red-300"
                >
                  Бан
                </Badge>
              ) : null}
              {user.linkCount > 0 ? (
                <Badge
                  variant="outline"
                  className="border-[#f9bc60]/45 text-[0.6rem] text-[#f9bc60]"
                >
                  Связи: {user.linkCount}
                </Badge>
              ) : null}
            </div>
            <p className="mt-1 break-all text-sm text-[#abd1c6]/85">
              {user.email || "Без email"}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 border-2 border-[#abd1c6]/30 text-xs hover:border-[#f9bc60]/50 hover:text-[#f9bc60]"
              >
                <Link
                  href={`/profile/${user.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Профиль
                  <LucideIcons.ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-[#abd1c6] hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
                onClick={() => onCopy(user.id, "ID")}
              >
                ID
              </Button>
              {user.email ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-[#abd1c6] hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
                  onClick={() => onCopy(user.email!, "Email")}
                >
                  Email
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <AdminStatGrid
          className="w-full lg:max-w-md"
          columns={2}
          items={[
            { label: "Уровень", value: user.level, tone: "pending" },
            { label: "Заявки", value: user.applicationStats.total },
            {
              label: "На балансе",
              value: user.wallet.availableBonuses,
              tone: "pending",
              highlight: user.wallet.availableBonuses > 0,
            },
            { label: "Друзья", value: user.social.friendsAccepted },
          ]}
        />
      </div>
    </header>
  );
}
