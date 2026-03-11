// app/admin/components/ApplicationCardHeader.tsx
"use client";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import { getAvatarFrame } from "@/lib/header-customization";
import { LucideIcons } from "@/components/ui/LucideIcons";
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

  const deviceLabel =
    it.clientDevice === "android"
      ? "Android"
      : it.clientDevice === "ios"
        ? "iPhone"
        : it.clientDevice === "desktop"
          ? "ПК"
          : it.clientDevice
            ? it.clientDevice
            : null;

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
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
            <span className="text-[#abd1c6]/80 font-semibold">ID</span>
            <span
              className="font-mono text-[#fffffe] font-bold break-all"
              title={it.id}
            >
              {it.id}
            </span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[#abd1c6] backdrop-blur-sm">
            <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-white/10 border border-white/10">
              <span className="block w-2 h-2 rounded-full bg-[#f9bc60]" />
            </span>
            <span className="font-semibold">Создана:</span>
            <span className="text-[#fffffe] font-bold">{ageLabel}</span>
          </span>
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

      <div className="flex-shrink-0 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-3 sm:p-3.5">
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
          <div className="text-xs text-[#abd1c6]/80 uppercase tracking-wide">
            Автор
          </div>
          <div className="text-sm text-[#fffffe] break-words line-clamp-2 sm:text-sm font-bold">
            <Link
              href={`/profile/${it.user.id}`}
              className="text-[#f9bc60] hover:text-[#e8a545] hover:underline transition-colors"
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
          {deviceLabel && (
            <div className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-[#abd1c6]">
              <LucideIcons.Smartphone size="xs" className="opacity-80" />
              <span className="font-semibold">Устройство:</span>
              <span className="text-[#fffffe] font-medium">{deviceLabel}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
