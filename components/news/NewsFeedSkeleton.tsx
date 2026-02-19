"use client";

import { CardSkeleton } from "@/components/ui/Card";

export function NewsFeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton
          key={i}
          lines={4}
          className="min-h-[200px] rounded-2xl border border-[#abd1c6]/20"
        />
      ))}
    </div>
  );
}
