"use client";

export function NewsFeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-[#abd1c6]/20 bg-[#004643]/30 p-6 animate-pulse"
        >
          <div className="h-5 w-56 bg-white/10 rounded mb-3" />
          <div className="h-4 w-full bg-white/10 rounded mb-2" />
          <div className="h-4 w-5/6 bg-white/10 rounded mb-2" />
          <div className="h-4 w-2/3 bg-white/10 rounded" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="h-24 bg-white/10 rounded-2xl" />
            <div className="h-24 bg-white/10 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  );
}


