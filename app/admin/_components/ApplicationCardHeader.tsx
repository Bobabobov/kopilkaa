// app/admin/components/ApplicationCardHeader.tsx
"use client";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import { getAvatarFrame } from "@/lib/header-customization";
import type { ApplicationItem } from "../types";

interface ApplicationCardHeaderProps {
  application: ApplicationItem;
  visibleEmails: Set<string>;
  onToggleEmail: (id: string) => void;
}

function getStatusBadge(status: ApplicationItem["status"]) {
  switch (status) {
    case "PENDING":
      return {
        label: "В обработке",
        className: "bg-[#f9bc60]/12 text-[#f9bc60] border border-[#f9bc60]/35",
      };
    case "APPROVED":
      return {
        label: "Одобрено",
        className: "bg-[#10B981]/12 text-[#10B981] border border-[#10B981]/35",
      };
    case "REJECTED":
      return {
        label: "Отказано",
        className: "bg-[#e16162]/12 text-[#e16162] border border-[#e16162]/35",
      };
    case "CONTEST":
      return {
        label: "Конкурс",
        className: "bg-[#9b87f5]/12 text-[#9b87f5] border border-[#9b87f5]/35",
      };
    default:
      return {
        label: status,
        className: "bg-white/5 text-[#abd1c6] border border-white/10",
      };
  }
}

function getAgeLabel(createdAt: string): string {
  const created = new Date(createdAt).getTime();
  if (!Number.isFinite(created)) return "";
  const diffMs = Date.now() - created;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "меньше часа назад";
  if (diffHours < 24) return `${diffHours} ч назад`;
  const days = Math.floor(diffHours / 24);
  return `${days} дн назад`;
}

export default function ApplicationCardHeader({
  application: it,
  visibleEmails,
  onToggleEmail,
}: ApplicationCardHeaderProps) {
  const shownEmails = visibleEmails;
  const rememberScroll = useCallback(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("admin-scroll", String(window.scrollY));
  }, []);

  const authorName =
    it.user.name ||
    (!it.user.hideEmail && it.user.email
      ? it.user.email.split("@")[0]
      : "Пользователь");

  const statusBadge = getStatusBadge(it.status);
  const ageLabel = useMemo(() => getAgeLabel(it.createdAt), [it.createdAt]);

  return (
    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 min-w-0 flex-1 w-full">
      <div className="min-w-0 flex-1 basis-0 w-full overflow-visible flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold backdrop-blur-sm ${statusBadge.className}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {statusBadge.label}
          </span>
          {it.countTowardsTrust && (
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-bold bg-white/5 text-[#abd1c6] border border-white/10 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f9bc60]" />
              Влияет на доверие
            </span>
          )}
          <span
            className="text-[#abd1c6]/80 font-mono break-all"
            title={it.id}
          >
            ID: {it.id}
          </span>
          <span className="text-[#abd1c6]/60">Создана: {ageLabel}</span>
        </div>

        <Link
          href={`/admin/applications/${it.id}`}
          scroll={false}
          onClick={rememberScroll}
          className="block text-base sm:text-lg md:text-xl font-black line-clamp-2 break-words text-[#fffffe] hover:text-[#f9bc60] hover:underline transition-colors cursor-pointer"
          title={it.title.length > 80 ? it.title : "Открыть полную заявку"}
        >
          {it.title}
        </Link>

        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#f9bc60] to-[#e8a545] rounded-xl sm:rounded-2xl border border-[#f9bc60]/50 shadow-lg w-fit">
          <span className="text-[#001e1d] font-black text-base sm:text-lg">
            ₽{it.amount.toLocaleString()}
          </span>
          <span className="text-xs sm:text-sm text-[#001e1d] font-bold">
            Сумма запроса
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-start gap-3">
        <div className="w-10 h-10 sm:w-9 sm:h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#abd1c6]/30">
          {(() => {
            const frame = getAvatarFrame(it.user.avatarFrame || "none");
            const frameKey = it.user.avatarFrame || "none";

            if (frame.type === "image") {
              return (
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat rounded-full"
                    style={{
                      backgroundImage: `url(${(frame as any).imageUrl || "/default-avatar.png"})`,
                    }}
                  />
                  <div className="absolute inset-0.5 rounded-full overflow-hidden">
                    <img
                      src={resolveAvatarUrl(it.user.avatar)}
                      alt={it.user.name || "Автор"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                </div>
              );
            }
            return (
              <div className={`w-full h-full rounded-full ${frame.className}`}>
                <img
                  src={resolveAvatarUrl(it.user.avatar)}
                  alt={it.user.name || "Автор"}
                  className={`w-full h-full object-cover rounded-full ${frameKey === "rainbow" ? "rounded-full" : ""}`}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />
              </div>
            );
          })()}
        </div>
        <div className="min-w-0">
          <div className="text-sm text-[#abd1c6] break-words line-clamp-2 sm:text-xs">
            <span className="font-bold">Автор:</span>{" "}
            <Link
              href={`/profile/${it.user.id}`}
              className="text-[#f9bc60] hover:text-[#e8a545] hover:underline transition-colors font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              {authorName}
            </Link>
          </div>
          <div className="text-xs text-[#abd1c6]/70 break-all">
            {shownEmails.has(it.id) ? (
              <span>{!it.user.hideEmail ? it.user.email : "Email скрыт"}</span>
            ) : (
              <button
                onClick={() => onToggleEmail(it.id)}
                className="text-[#f9bc60] hover:text-[#e8a545] hover:underline cursor-pointer font-semibold text-left"
              >
                {!it.user.hideEmail ? "Показать email" : "Email скрыт"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
