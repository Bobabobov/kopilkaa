// app/admin/applications/[id]/components/ApplicationPaymentDetails.tsx
"use client";
import { motion } from "framer-motion";

interface ApplicationPaymentDetailsProps {
  payment: string;
  bankName?: string;
  onCopyError: (message: string) => void;
}

function splitPayment(raw: string, bankName?: string) {
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

export default function ApplicationPaymentDetails({
  payment,
  bankName,
  onCopyError,
}: ApplicationPaymentDetailsProps) {
  const parsed = splitPayment(payment, bankName);
  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(payment)
      .then(() => {
        const btn = e.target as HTMLButtonElement;
        const icon = btn.querySelector(".copy-icon") as HTMLElement;
        const text = btn.querySelector(".copy-text") as HTMLElement;
        if (icon && text) {
          icon.textContent = "✓";
          text.textContent = "Скопировано";
          btn.style.backgroundColor = "#10b981";
          setTimeout(() => {
            icon.textContent = "📋";
            text.textContent = "Копировать";
            btn.style.backgroundColor = "";
          }, 1500);
        }
      })
      .catch(() => {
        onCopyError("Выделите текст вручную");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mb-6"
    >
      <details className="toggle">
        <summary
          className="flex items-center gap-2 cursor-pointer select-none font-medium transition-colors text-base sm:text-lg mb-4 hover:opacity-80"
          style={{ color: "#f9bc60" }}
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
        <div
          className="open-only rounded-xl border relative group p-4 sm:p-6 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.7)]"
          style={{
            backgroundColor: "#0b1615",
            borderColor: "rgba(171,209,198,0.25)",
          }}
        >
          <dl className="space-y-2 break-all text-anywhere pr-12 sm:pr-16">
            {parsed.bankName && (
              <div>
                <dt
                  className="font-medium text-sm sm:text-base"
                  style={{ color: "#abd1c6" }}
                >
                  Банк
                </dt>
                <dd
                  className="select-all text-sm sm:text-base"
                  style={{ color: "#e8f2ef" }}
                >
                  {parsed.bankName}
                </dd>
              </div>
            )}
            <div>
              <dt
                className="font-medium text-sm sm:text-base"
                style={{ color: "#abd1c6" }}
              >
                Реквизиты
              </dt>
              <dd
                className="select-all text-sm sm:text-base"
                style={{ color: "#e8f2ef" }}
              >
                {parsed.payment || "Не указаны"}
              </dd>
            </div>
          </dl>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg text-xs bg-[#004643] border border-[#f9bc60]/30 hover:border-[#f9bc60] backdrop-blur-sm shadow-sm"
            style={{ color: "#f9bc60" }}
            title="Копировать реквизиты"
          >
            <span className="copy-icon">📋</span>
            <span className="copy-text hidden sm:inline">Копировать</span>
          </button>
        </div>
      </details>
    </motion.div>
  );
}
