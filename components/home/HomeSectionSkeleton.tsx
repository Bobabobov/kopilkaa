export function HomeSectionSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-3xl bg-[#004643]/30 ${className ?? "h-96"}`}
      aria-hidden
    />
  );
}
