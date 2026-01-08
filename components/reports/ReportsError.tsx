// Компонент отображения ошибки загрузки отчетов
"use client";

interface ReportsErrorProps {
  error: string;
  onRetry: () => void;
}

export default function ReportsError({ error, onRetry }: ReportsErrorProps) {
  return (
    <div className="rounded-xl border border-[#e16162]/40 bg-[#001e1d]/40 p-4 text-[#e16162] flex items-center justify-between">
      <span>{error}</span>
      <button
        onClick={onRetry}
        className="px-3 py-2 text-sm rounded-lg bg-[#f9bc60] text-[#001e1d] font-semibold"
      >
        Обновить
      </button>
    </div>
  );
}


