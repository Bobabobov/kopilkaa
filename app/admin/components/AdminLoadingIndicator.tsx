"use client";

interface AdminLoadingIndicatorProps {
  loading: boolean;
}

export function AdminLoadingIndicator({ loading }: AdminLoadingIndicatorProps) {
  if (!loading) return null;

  return (
    <div className="flex justify-center items-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-[#abd1c6] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#abd1c6] font-medium">Загружаем ещё заявки...</p>
      </div>
    </div>
  );
}
