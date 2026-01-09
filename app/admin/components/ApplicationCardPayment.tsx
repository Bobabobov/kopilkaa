// app/admin/components/ApplicationCardPayment.tsx
"use client";
import type { ApplicationItem } from "../types";

interface ApplicationCardPaymentProps {
  payment: string;
  bankName?: string | null;
}

function splitPayment(raw: string, bankName?: string | null) {
  if (bankName) return { bankName, payment: raw };
  const lines = (raw || "").split(/\n/);
  const first = lines[0] || "";
  if (/^банк:/i.test(first)) {
    const derivedBank = first.replace(/^банк:\s*/i, "").trim();
    const rest = lines.slice(1).join("\n").trim();
    return { bankName: derivedBank || undefined, payment: rest || raw };
  }
  return { bankName: undefined, payment: raw };
}

export default function ApplicationCardPayment({
  payment,
  bankName,
}: ApplicationCardPaymentProps) {
  const parsed = splitPayment(payment, bankName);
  return (
    <details className="toggle text-sm mb-4 sm:mb-6">
      <summary className="flex items-center gap-2 cursor-pointer select-none text-[#f9bc60] hover:text-[#e8a545] font-bold transition-colors">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Показать реквизиты
      </summary>
      <div className="mt-3 p-3 bg-[#001e1d]/40 rounded-xl border border-[#abd1c6]/20">
        <div className="text-[#abd1c6] break-words text-sm sm:text-base">
          <div className="flex flex-col gap-2">
            {parsed.bankName && (
              <div>
                <span className="text-[#f9bc60] font-semibold">Банк:</span>{" "}
                <span className="text-[#e8f2ef]">{parsed.bankName}</span>
              </div>
            )}
            <div>
              <span className="text-[#f9bc60] font-semibold">Реквизиты:</span>{" "}
              <span className="text-[#e8f2ef]">{parsed.payment || "Не указаны"}</span>
            </div>
          </div>
        </div>
      </div>
    </details>
  );
}

