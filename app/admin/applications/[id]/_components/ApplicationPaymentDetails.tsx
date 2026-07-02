// app/admin/applications/[id]/components/ApplicationPaymentDetails.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { SameApplicationRef } from "../types";
import { parseSbpPayment } from "@/lib/sbp/formatPayment";

interface ApplicationPaymentDetailsProps {
  payment: string;
  bankName?: string;
  samePaymentApplications?: SameApplicationRef[];
  onCopyError: (message: string) => void;
  /** repeats — только повторы (блок рисков); details — реквизиты для перевода (блок решения) */
  mode?: "details" | "repeats";
}

function PaymentRepeatsList({
  samePaymentApplications,
}: {
  samePaymentApplications: SameApplicationRef[];
}) {
  const hasSamePayment = samePaymentApplications.length > 0;

  return (
    <div className="min-w-0">
      {hasSamePayment ? (
        <>
          <p className="text-xs sm:text-sm text-[#94a1b2] mb-2">
            Эти реквизиты также использовались в других заявках:
          </p>
          <ul className="space-y-1.5 text-sm min-w-0">
            {samePaymentApplications.map((app) => (
              <li
                key={app.id}
                className="flex flex-wrap items-baseline gap-1 min-w-0 break-words"
              >
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
          В других заявках такие реквизиты не встречались.
        </p>
      )}
    </div>
  );
}

function PaymentDetailsCard({
  payment,
  bankName,
}: {
  payment: string;
  bankName?: string;
}) {
  const parsed = parseSbpPayment(payment, bankName);
  const displayPhone = parsed.phone || parsed.raw || "Не указан";

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(displayPhone)
      .then(() => {
        const btn = e.currentTarget as HTMLButtonElement;
        const icon = btn.querySelector(".copy-icon") as HTMLElement;
        const text = btn.querySelector(".copy-text") as HTMLElement;
        if (icon && text) {
          icon.textContent = "✓";
          text.textContent = "Скопировано";
          btn.classList.add("bg-emerald-600");
          setTimeout(() => {
            icon.textContent = "📋";
            text.textContent = "Копировать";
            btn.classList.remove("bg-emerald-600");
          }, 1500);
        }
      })
      .catch(() => {
        console.warn("Clipboard copy for payment details was rejected");
      });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl relative group p-3 sm:p-5 min-w-0 w-full overflow-hidden">
      <dl className="space-y-3 pr-12 sm:pr-16 min-w-0">
        {parsed.bankName && (
          <div className="min-w-0 overflow-hidden">
            <dt className="font-semibold text-xs sm:text-sm uppercase tracking-wide text-[#94a1b2]">
              Банк
            </dt>
            <dd
              className="select-all text-sm sm:text-base break-words rounded-xl bg-black/10 px-3 py-2"
              style={{
                color: "#e8f2ef",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {parsed.bankName}
            </dd>
          </div>
        )}
        <div className="min-w-0 overflow-hidden">
          <dt className="font-semibold text-xs sm:text-sm uppercase tracking-wide text-[#94a1b2]">
            Телефон СБП
          </dt>
          <dd
            className="select-all text-sm sm:text-base break-words whitespace-pre-wrap rounded-xl bg-black/10 px-3 py-2"
            style={{
              color: "#e8f2ef",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {displayPhone}
          </dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs bg-[#004643] border border-[#f9bc60]/30 hover:border-[#f9bc60] backdrop-blur-sm shadow-sm touch-manipulation text-[#f9bc60]"
        title="Копировать реквизиты"
      >
        <span className="copy-icon">📋</span>
        <span className="copy-text hidden sm:inline">Копировать</span>
      </button>
    </div>
  );
}

export default function ApplicationPaymentDetails({
  payment,
  bankName,
  samePaymentApplications = [],
  onCopyError: _onCopyError,
  mode = "details",
}: ApplicationPaymentDetailsProps) {
  if (mode === "repeats") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="min-w-0 w-full"
      >
        <PaymentRepeatsList samePaymentApplications={samePaymentApplications} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="min-w-0 w-full"
    >
      <details className="toggle min-w-0">
        <summary className="flex items-center gap-2 cursor-pointer select-none font-semibold transition-colors text-base sm:text-lg text-[#f9bc60] hover:opacity-90">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            />
          </svg>
          <span className="label-closed">Показать реквизиты</span>
          <span className="label-open">Скрыть реквизиты</span>
        </summary>
        <div className="open-only mt-3 min-w-0">
          <PaymentDetailsCard payment={payment} bankName={bankName} />
        </div>
      </details>
    </motion.div>
  );
}
