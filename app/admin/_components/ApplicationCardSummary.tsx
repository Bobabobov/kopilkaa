// app/admin/components/ApplicationCardSummary.tsx
"use client";

interface ApplicationCardSummaryProps {
  summary: string;
}

export default function ApplicationCardSummary({
  summary,
}: ApplicationCardSummaryProps) {
  if (!summary?.trim()) return null;

  return (
    <div className="bg-[#001e1d]/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-[#abd1c6]/10">
      <p className="text-[10px] uppercase tracking-wide font-bold text-[#abd1c6]/70 mb-1">
        Кратко
      </p>
      <p className="text-[#abd1c6] line-clamp-3 break-words max-w-full leading-relaxed text-sm sm:text-base">
        {summary}
      </p>
    </div>
  );
}
