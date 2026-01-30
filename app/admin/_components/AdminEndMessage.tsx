"use client";

interface AdminEndMessageProps {
  hasMore: boolean;
  itemsCount: number;
}

export function AdminEndMessage({ hasMore, itemsCount }: AdminEndMessageProps) {
  if (hasMore || itemsCount === 0) return null;

  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:border-[#abd1c6]/50 hover:shadow-lg hover:shadow-[#abd1c6]/20 cursor-default">
        <p className="text-[#abd1c6] font-medium transition-all duration-300 hover:text-[#f9bc60]">
          А всё, ноу заявок!
        </p>
      </div>
    </div>
  );
}
