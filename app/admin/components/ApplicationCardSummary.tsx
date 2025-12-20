// app/admin/components/ApplicationCardSummary.tsx
"use client";
import type { ApplicationItem } from "../types";

interface ApplicationCardSummaryProps {
  summary: string;
}

export default function ApplicationCardSummary({
  summary,
}: ApplicationCardSummaryProps) {
  return (
    <div className="bg-[#001e1d]/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-[#abd1c6]/10">
      <div className="text-[#abd1c6] clamp-2 break-words max-w-full leading-relaxed text-sm sm:text-base">
        {summary}
      </div>
    </div>
  );
}

