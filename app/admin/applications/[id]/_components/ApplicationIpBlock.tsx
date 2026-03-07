// app/admin/applications/[id]/_components/ApplicationIpBlock.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
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

  if (!hasIp && !hasSameIp) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="mb-6"
    >
      <div
        className="rounded-lg sm:rounded-xl border p-3 sm:p-5 lg:p-6 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.7)] min-w-0 overflow-hidden"
        style={{
          backgroundColor: "#0b1615",
          borderColor: "rgba(171,209,198,0.25)",
        }}
      >
        <h3
          className="text-sm font-semibold mb-2 flex items-center gap-2"
          style={{ color: "#abd1c6" }}
        >
          <span aria-hidden>🌐</span>
          IP при подаче заявки
        </h3>
        <p
          className="font-mono text-sm break-all"
          style={{ color: "#e8f2ef" }}
        >
          {submitterIp ?? "—"}
        </p>
        {isLocalhost && (
          <p className="text-xs mt-1" style={{ color: "#94a1b2" }}>
            Локальный адрес (заявка с этого сервера или localhost).
          </p>
        )}
        <div className="mt-4 pt-4 border-t border-[#abd1c6]/20">
          <p
            className="text-xs font-semibold mb-2"
            style={{ color: "#e8a545" }}
          >
            Повторы по IP
          </p>
          {hasSameIp ? (
            <>
              <p className="text-xs text-[#94a1b2] mb-2">
                С этого IP уже подавались заявки:
              </p>
                <ul className="space-y-1.5 text-sm min-w-0">
                {sameIpApplications.map((app) => (
                  <li key={app.id} className="flex flex-wrap items-baseline gap-1 min-w-0 break-words">
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="text-[#abd1c6] hover:text-[#f9bc60] transition-colors underline underline-offset-2"
                    >
                      Заявка от{" "}
                      {new Date(app.createdAt).toLocaleDateString("ru-RU")}
                    </Link>
                    <span className="text-[#94a1b2]">—</span>
                    <Link
                      href={`/profile/${app.user.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#abd1c6] hover:text-[#f9bc60] transition-colors underline underline-offset-2"
                    >
                      {app.user.email ?? app.user.name ?? app.user.id}
                    </Link>
                    <span className="text-[#94a1b2] text-xs">
                      (id: {app.id.slice(0, 10)}…)
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-[#94a1b2]">
              В других заявках этот IP не встречался.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
