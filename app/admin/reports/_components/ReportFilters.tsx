// app/admin/reports/components/ReportFilters.tsx
"use client";

interface ReportFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

export default function ReportFilters({
  statusFilter,
  onStatusChange,
}: ReportFiltersProps) {
  const filters = [
    { value: "all", label: "Все" },
    { value: "pending", label: "Ожидают" },
    { value: "reviewed", label: "Рассмотрены" },
    { value: "resolved", label: "Решены" },
    { value: "dismissed", label: "Отклонены" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onStatusChange(filter.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            statusFilter === filter.value
              ? "bg-[#f9bc60] text-[#001e1d]"
              : "bg-[#001e1d]/30 text-[#abd1c6] hover:bg-[#001e1d]/40"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
