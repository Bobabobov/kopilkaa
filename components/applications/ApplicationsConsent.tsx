"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  trustAck1: boolean;
  setTrustAck1: (v: boolean) => void;
  trustAck2: boolean;
  setTrustAck2: (v: boolean) => void;
  trustAck3: boolean;
  setTrustAck3: (v: boolean) => void;
  policiesAccepted: boolean;
  setPoliciesAccepted: (v: boolean) => void;
  ackError: boolean;
};

const checkboxBase =
  "h-5 w-5 shrink-0 rounded-md border-2 transition-all duration-200 focus:ring-2 focus:ring-[#f9bc60] focus:ring-offset-2 focus:ring-offset-[#0b2a24] cursor-pointer accent-[#f9bc60]";

/** Выделение ключевой фразы в тексте */
function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold text-[#f9bc60]">
      {children}
    </span>
  );
}

export function ApplicationsConsent({
  trustAck1,
  setTrustAck1,
  trustAck2,
  setTrustAck2,
  trustAck3,
  setTrustAck3,
  policiesAccepted,
  setPoliciesAccepted,
  ackError,
}: Props) {
  const allTrustAcked = trustAck1 && trustAck2 && trustAck3;

  return (
    <div
      className={cn(
        "rounded-2xl border shadow-lg overflow-hidden",
        "bg-gradient-to-b from-[#0d2e28] via-[#0b2a24] to-[#082420]",
        ackError
          ? "border-[#e16162]/60 ring-2 ring-[#e16162]/25"
          : "border-[#2c4f45]/70",
      )}
    >
      {/* Заголовок блока */}
      <div className="flex items-center gap-3 px-5 sm:px-6 pt-5 sm:pt-6 pb-2">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f9bc60]/20 text-[#f9bc60] shadow-inner"
          aria-hidden
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
        <span className="text-sm font-bold uppercase tracking-widest text-[#abd1c6]">
          Перед отправкой заявки
        </span>
      </div>

      <div className="space-y-5 px-5 sm:px-6 pb-5 sm:pb-6">
        {/* Блок 1: три чекбокса про уровень доверия */}
        <div
          className={cn(
            "rounded-xl border p-5 transition-all duration-300 space-y-4 shadow-inner",
            allTrustAcked
              ? "border-[#f9bc60]/50 bg-[#f9bc60]/8"
              : "border-[#2c4f45]/60 bg-[#001e1d]/40",
          )}
        >
          <p className="text-base sm:text-lg font-bold text-[#fffffe] pb-0.5">
            Я прочитал(а) и понимаю:
          </p>
          <label className="flex cursor-pointer select-none items-start gap-3 py-1">
            <input
              type="checkbox"
              className={cn(
                checkboxBase,
                "border-[#2c4f45] bg-[#0b2a24] text-[#f9bc60] checked:border-[#f9bc60] checked:bg-[#f9bc60] mt-0.5",
              )}
              checked={trustAck1}
              onChange={(e) => setTrustAck1(e.target.checked)}
            />
            <span className="text-sm sm:text-base text-[#e8f0ed] leading-relaxed">
              уровень доверия{" "}
              <Highlight>не гарантирует одобрение заявки</Highlight>;
            </span>
          </label>
          <label className="flex cursor-pointer select-none items-start gap-3 py-1">
            <input
              type="checkbox"
              className={cn(
                checkboxBase,
                "border-[#2c4f45] bg-[#0b2a24] text-[#f9bc60] checked:border-[#f9bc60] checked:bg-[#f9bc60] mt-0.5",
              )}
              checked={trustAck2}
              onChange={(e) => setTrustAck2(e.target.checked)}
            />
            <span className="text-sm sm:text-base text-[#e8f0ed] leading-relaxed">
              решение о поддержке принимается{" "}
              <Highlight>индивидуально</Highlight>;
            </span>
          </label>
          <label className="flex cursor-pointer select-none items-start gap-3 py-1">
            <input
              type="checkbox"
              className={cn(
                checkboxBase,
                "border-[#2c4f45] bg-[#0b2a24] text-[#f9bc60] checked:border-[#f9bc60] checked:bg-[#f9bc60] mt-0.5",
              )}
              checked={trustAck3}
              onChange={(e) => setTrustAck3(e.target.checked)}
            />
            <span className="text-sm sm:text-base text-[#e8f0ed] leading-relaxed">
              сумма поддержки может быть{" "}
              <Highlight>меньше запрошенной</Highlight> или заявка может быть{" "}
              <Highlight>отклонена</Highlight>.
            </span>
          </label>
        </div>

        {/* Блок 2: согласие с документами */}
        <div
          className={cn(
            "rounded-xl border p-5 transition-all duration-300 shadow-inner",
            policiesAccepted
              ? "border-[#f9bc60]/50 bg-[#f9bc60]/8"
              : "border-[#2c4f45]/60 bg-[#001e1d]/40",
          )}
        >
          <label className="flex cursor-pointer select-none items-start gap-3 py-1">
            <input
              type="checkbox"
              className={cn(
                checkboxBase,
                "border-[#2c4f45] bg-[#0b2a24] text-[#f9bc60] checked:border-[#f9bc60] checked:bg-[#f9bc60] mt-0.5",
              )}
              checked={policiesAccepted}
              onChange={(e) => setPoliciesAccepted(e.target.checked)}
            />
            <span className="text-sm sm:text-base text-[#e8f0ed] leading-relaxed">
              Продолжая, вы принимаете условия{" "}
              <Link
                href="/terms"
                className="font-bold text-[#f9bc60] underline decoration-2 decoration-[#f9bc60]/70 underline-offset-2 hover:text-[#ffd180] hover:decoration-[#f9bc60] transition-colors"
              >
                пользовательского соглашения
              </Link>
              {" "}и{" "}
              <Link
                href="/terms"
                className="font-bold text-[#f9bc60] underline decoration-2 decoration-[#f9bc60]/70 underline-offset-2 hover:text-[#ffd180] hover:decoration-[#f9bc60] transition-colors"
              >
                Политики в отношении обработки персональных данных
              </Link>
              .
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default ApplicationsConsent;
