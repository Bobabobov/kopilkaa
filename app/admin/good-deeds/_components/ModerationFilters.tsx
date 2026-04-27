import { Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { STATUS_LABELS } from "../_lib/constants";
import type { SortBy, StatusFilter } from "../_lib/types";

type Props = {
  query: string;
  sortBy: SortBy;
  statusFilter: StatusFilter;
  pendingCount: number;
  onQueryChange: (value: string) => void;
  onSortByChange: (value: SortBy) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
  onReload: () => void;
};

export function ModerationFilters({
  query,
  sortBy,
  statusFilter,
  pendingCount,
  onQueryChange,
  onSortByChange,
  onStatusFilterChange,
  onReload,
}: Props) {
  return (
    <Card variant="darkGlass" className="mb-5 space-y-3">
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-[#94a1b2] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Поиск: задание, неделя, пользователь, текст истории..."
            className="w-full rounded-xl border border-[#abd1c6]/25 bg-[#003b3a]/70 pl-9 pr-3 py-2.5 text-sm text-[#fffffe] placeholder:text-[#94a1b2] outline-none focus:border-[#f9bc60]"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as SortBy)}
          className="rounded-xl border border-[#abd1c6]/25 bg-[#003b3a]/70 px-3 py-2.5 text-sm text-[#fffffe] outline-none focus:border-[#f9bc60]"
        >
          <option value="created_desc">Сначала новые</option>
          <option value="created_asc">Сначала старые</option>
          <option value="reward_desc">По награде (убыв.)</option>
          <option value="story_desc">По длине истории (убыв.)</option>
        </select>
        <Button
          type="button"
          variant="outline"
          onClick={onReload}
          className="rounded-xl border-[#abd1c6]/35 text-[#abd1c6] hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]"
        >
          Обновить
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(["PENDING", "ALL", "APPROVED", "REJECTED"] as const).map((status) => (
          <Button
            key={status}
            type="button"
            size="sm"
            variant={statusFilter === status ? "default" : "outline"}
            onClick={() => onStatusFilterChange(status)}
            className={
              statusFilter === status
                ? "bg-[#f9bc60] text-[#001e1d] hover:bg-[#f7b24a]"
                : "border-[#abd1c6]/35 text-[#abd1c6] hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]"
            }
          >
            {status === "ALL"
              ? "Все"
              : status === "PENDING"
                ? `На проверке (${pendingCount})`
                : STATUS_LABELS[status]}
          </Button>
        ))}
      </div>
    </Card>
  );
}
