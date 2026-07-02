'use client';

export default function AdminLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl min-w-0 py-12">
      <div className="mb-6 h-8 w-48 animate-pulse rounded-lg bg-[#004643]/40" />
      <div className="mb-8 h-4 w-72 animate-pulse rounded bg-[#004643]/30" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-[#abd1c6]/10 bg-[#004643]/20"
          />
        ))}
      </div>
    </div>
  );
}
