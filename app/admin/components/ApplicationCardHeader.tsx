// app/admin/components/ApplicationCardHeader.tsx
"use client";
import Link from "next/link";
import { useCallback } from "react";
import { getAvatarFrame } from "@/lib/header-customization";
import type { ApplicationItem } from "../types";

interface ApplicationCardHeaderProps {
  application: ApplicationItem;
  visibleEmails: Set<string>;
  onToggleEmail: (id: string) => void;
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

  return (
    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4 sm:mb-6">
      <div className="min-w-0 flex-1 basis-0">
        <Link
          href={`/admin/applications/${it.id}`}
          scroll={false}
          onClick={rememberScroll}
          className="text-base sm:text-lg md:text-xl font-black clamp-2 break-words max-w-full text-[#fffffe] hover:text-[#f9bc60] hover:underline transition-colors cursor-pointer"
          title="Открыть полную заявку"
        >
          {it.title}
        </Link>

        {/* Сумма запроса - выделенная */}
        <div className="mt-3 mb-2">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#f9bc60] to-[#e8a545] rounded-xl sm:rounded-2xl border border-[#f9bc60]/50 shadow-lg">
            <span className="text-[#001e1d] font-black text-base sm:text-lg">
              ₽{it.amount.toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm text-[#001e1d] font-bold">
              Сумма запроса
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2">
          {/* Аватарка автора */}
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            {(() => {
              const frame = getAvatarFrame(it.user.avatarFrame || "none");
              const frameKey = it.user.avatarFrame || "none";

              if (frame.type === "image") {
                // Рамка-картинка
                return (
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    {/* Рамка как фон */}
                    <div
                      className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat rounded-full"
                      style={{
                        backgroundImage: `url(${(frame as any).imageUrl || "/default-avatar.png"})`,
                      }}
                    />
                    {/* Аватар поверх рамки */}
                    <div className="absolute inset-0.5 rounded-full overflow-hidden">
                      <img
                        src={it.user.avatar || "/default-avatar.png"}
                        alt={it.user.name || "Автор"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/default-avatar.png";
                        }}
                      />
                    </div>
                  </div>
                );
              } else {
                // CSS рамка (only 'none' remains now)
                return (
                  <div
                    className={`w-full h-full rounded-full ${frame.className}`}
                  >
                    <img
                      src={it.user.avatar || "/default-avatar.png"}
                      alt={it.user.name || "Автор"}
                      className={`w-full h-full object-cover rounded-full ${frameKey === "rainbow" ? "rounded-full" : ""}`}
                      onError={(e) => {
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                    />
                  </div>
                );
              }
            })()}
          </div>

          {/* Информация об авторе */}
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm text-[#abd1c6] break-words">
              <span className="font-bold">Автор:</span>{" "}
              <Link
                href={`/profile/${it.user.id}`}
                className="text-[#f9bc60] hover:text-[#e8a545] hover:underline transition-colors font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                {it.user.name ||
                  (!it.user.hideEmail
                    ? (it.user.email ? it.user.email.split("@")[0] : "Пользователь")
                    : "Пользователь")}
              </Link>
            </div>
            <div className="text-xs text-[#abd1c6]/70">
              {shownEmails.has(it.id) ? (
                <span>
                  {!it.user.hideEmail ? it.user.email : "Email скрыт"}
                </span>
              ) : (
                <button
                  onClick={() => onToggleEmail(it.id)}
                  className="text-[#f9bc60] hover:text-[#e8a545] hover:underline cursor-pointer font-semibold"
                >
                  {!it.user.hideEmail ? "Показать email" : "Email скрыт"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

