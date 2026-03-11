// app/admin/applications/[id]/_components/ApplicationIpBlock.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { statusRu } from "@/lib/status";
import type { SameApplicationRef } from "../types";

interface ApplicationIpBlockProps {
  submitterIp: string | null | undefined;
  sameIpApplications?: SameApplicationRef[];
}

export default function ApplicationIpBlock({
  submitterIp,
  sameIpApplications = [],
}: ApplicationIpBlockProps) {
  const hasSameIp = sameIpApplications.length > 0;
  const hasIp = submitterIp && submitterIp.trim() !== "";
  const isLocalhost =
    submitterIp === "::1" ||
    submitterIp === "127.0.0.1" ||
    submitterIp?.startsWith("127.");
  const repeatCount = sameIpApplications.length;

  if (!hasIp && !hasSameIp) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="mb-6"
    >
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 sm:p-5 lg:p-6 shadow-[0_22px_60px_rgba(0,0,0,0.55)] min-w-0 overflow-hidden">
        {/* Верхняя строка: IP и краткий вывод */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
          <div>
            <h3
              className="text-sm font-semibold flex items-center gap-2"
              style={{ color: "#e5e7eb" }}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#004643]/80 text-xs">
                🌐
              </span>
              IP при подаче заявки
            </h3>
            <p
              className="font-mono text-sm break-all mt-1"
              style={{ color: "#e8f2ef" }}
            >
              {submitterIp ?? "—"}
            </p>
            {isLocalhost && (
              <p className="text-xs mt-1" style={{ color: "#94a1b2" }}>
                Локальный адрес — тестовая или внутренняя заявка (localhost).
              </p>
            )}
          </div>

          <div className="inline-flex flex-wrap gap-2 mt-1 sm:mt-0">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              {repeatCount === 0
                ? "Повторов по IP нет"
                : `Повторов по IP: ${repeatCount}`}
            </span>
            {repeatCount >= 3 && !isLocalhost && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/60 bg-amber-400/10 px-2 py-1 text-[11px] font-semibold text-amber-100">
                ⚠️ Возможны повторные заявки с этого адреса
              </span>
            )}
          </div>
        </div>

        {/* Список заявок с этим IP */}
        <div className="mt-3 pt-3 border-t border-white/10">
          {hasSameIp ? (
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer select-none text-xs sm:text-sm text-[#abd1c6] mb-2">
                <span>
                  Показать заявки с этим IP ({repeatCount})
                </span>
                <span className="text-[11px] opacity-70 group-open:rotate-180 transition-transform">
                  ⌄
                </span>
              </summary>
              <ul className="space-y-1.5 text-sm min-w-0 mt-1">
                {sameIpApplications.map((app) => {
                  const statusText = app.status ? statusRu[app.status] : null;
                  const shortDescription = app.summary || app.title || null;

                  return (
                    <li
                      key={app.id}
                      className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 min-w-0 break-words text-xs sm:text-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/admin/applications/${app.id}`}
                          className="text-[#e5e7eb] hover:text-[#f9bc60] transition-colors underline underline-offset-2"
                        >
                          {new Date(app.createdAt).toLocaleDateString("ru-RU")} • заявка
                        </Link>
                        {statusText && (
                          <span
                            className={`ml-1 inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] uppercase tracking-wide ${
                              app.status === "APPROVED"
                                ? "border border-emerald-400/70 bg-emerald-500/15 text-emerald-200"
                                : app.status === "REJECTED"
                                  ? "border border-red-400/70 bg-red-500/15 text-red-200"
                                  : "border border-amber-300/70 bg-amber-400/15 text-amber-100"
                            }`}
                          >
                            {statusText}
                          </span>
                        )}
                        {shortDescription && (
                          <p className="mt-0.5 text-[11px] text-[#94a1b2] line-clamp-1">
                            {shortDescription}
                          </p>
                        )}
                      </div>
                      <div className="mt-0.5 sm:mt-0 text-[11px] text-[#9ca3af]">
                        <Link
                          href={`/profile/${app.user.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#abd1c6] hover:text-[#f9bc60] transition-colors underline underline-offset-2"
                        >
                          {app.user.email ?? app.user.name ?? app.user.id}
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </details>
          ) : (
            <p className="text-xs sm:text-sm text-[#94a1b2]">
              Это первая заявка с этого IP в системе.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
