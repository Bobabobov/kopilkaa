"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  trustAcknowledged: boolean;
  setTrustAcknowledged: (v: boolean) => void;
  policiesAccepted: boolean;
  setPoliciesAccepted: (v: boolean) => void;
  ackError: boolean;
};

export function ApplicationsConsent({
  trustAcknowledged,
  setTrustAcknowledged,
  policiesAccepted,
  setPoliciesAccepted,
  ackError,
}: Props) {
  return (
    <div
      className={cn(
        "space-y-3 rounded-2xl border bg-[#0b2a24]/60 backdrop-blur-sm p-4 sm:p-5",
        ackError ? "border-[#e16162]/70" : "border-[#2c4f45]/50",
      )}
    >
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-[#2c4f45] bg-transparent text-[#f9bc60] focus:ring-[#f9bc60] focus:ring-offset-0"
          checked={trustAcknowledged}
          onChange={(e) => setTrustAcknowledged(e.target.checked)}
        />
        <span className="text-xs sm:text-sm text-[#c7dad2] leading-relaxed">
          Я прочитал(а) и понимаю, что:
          <br />— уровень доверия не гарантирует одобрение заявки;
          <br />— решение о поддержке принимается индивидуально;
          <br />— сумма поддержки может быть меньше запрошенной или заявка может
          быть отклонена.
        </span>
      </label>

      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-[#2c4f45] bg-transparent text-[#f9bc60] focus:ring-[#f9bc60] focus:ring-offset-0"
          checked={policiesAccepted}
          onChange={(e) => setPoliciesAccepted(e.target.checked)}
        />
        <span className="text-xs sm:text-sm text-[#c7dad2] leading-relaxed">
          Продолжая, вы принимаете условия{" "}
          <Link
            href="/terms"
            className="underline decoration-[#f9bc60]/70 underline-offset-2 hover:decoration-[#f9bc60]"
          >
            пользовательского соглашения и Политики в отношении обработки
            персональных данных
          </Link>
          .
        </span>
      </label>
    </div>
  );
}

export default ApplicationsConsent;
