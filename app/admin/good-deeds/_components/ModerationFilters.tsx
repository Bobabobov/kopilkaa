import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AdminFilterChips,
  AdminPanel,
  adminFieldClass,
} from "@/app/admin/_components/admin-ui";
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

const STATUS_IDS: StatusFilter[] = ["PENDING", "ALL", "APPROVED", "REJECTED"];

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
    <AdminPanel
      title="Фильтры"
      subtitle="Поиск и статус в очереди"
      className="mb-5"
      accent="neutral"
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a1b2]" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Поиск: задание, цикл, пользователь, текст истории..."
              className={`${adminFieldClass} pl-10`}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortBy)}
            className={`${adminFieldClass} lg:w-52`}
          >
            <option value="created_desc">Сначала новые</option>
            <option value="created_asc">Сначала старые</option>
            <option value="reward_desc">По награде (убыв.)</option>
          </select>
          <Button
            type="button"
            variant="outline"
            onClick={onReload}
            className="h-[44px] rounded-xl border-2 border-[#abd1c6]/30 text-[#abd1c6] hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]"
          >
            Обновить
          </Button>
        </div>
        <AdminFilterChips
          activeId={statusFilter}
          onChange={(id) => onStatusFilterChange(id as StatusFilter)}
          items={STATUS_IDS.map((status) => ({
            id: status,
            label:
              status === "ALL"
                ? "Все"
                : status === "PENDING"
                  ? "На проверке"
                  : STATUS_LABELS[status],
            count:
              status === "PENDING"
                ? pendingCount
                : undefined,
          }))}
        />
      </div>
    </AdminPanel>
  );
}
