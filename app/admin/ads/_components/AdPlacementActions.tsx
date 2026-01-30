// app/admin/ads/components/AdPlacementActions.tsx
"use client";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface AdPlacementActionsProps {
  activeCount: number;
  onCleanup: () => void;
  onAddNew: () => void;
}

export default function AdPlacementActions({
  activeCount,
  onCleanup,
  onAddNew,
}: AdPlacementActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-[#001e1d]/40 to-[#002724]/40 border border-[#abd1c6]/10">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#f9bc60]/10 border border-[#f9bc60]/20">
          <LucideIcons.TrendingUp size="sm" className="text-[#f9bc60]" />
        </div>
        <div>
          <div className="text-xs text-[#abd1c6]/70 uppercase tracking-wide">
            Активных размещений
          </div>
          <div className="text-2xl font-bold text-[#f9bc60]">{activeCount}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onCleanup}
          className="px-4 py-2.5 bg-[#001e1d] hover:bg-red-600/10 text-red-400 font-medium rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all duration-200 flex items-center gap-2 text-sm hover:shadow-lg hover:shadow-red-500/10"
        >
          <LucideIcons.Clock size="sm" />
          Очистить истёкшие
        </button>
        <button
          onClick={onAddNew}
          className="px-5 py-2.5 bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#f9bc60]/20 transition-all duration-200 flex items-center gap-2 text-sm"
        >
          <LucideIcons.Plus size="sm" />
          Добавить размещение
        </button>
      </div>
    </div>
  );
}
