"use client";

interface LoadingSpinnerProps {
  className?: string;
  label?: string;
}

/** Общий спиннер загрузки для центрированных состояний */
export function LoadingSpinner({ className = "", label }: LoadingSpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <div
        className="h-16 w-16 rounded-full border-4 border-[#abd1c6]/40 border-t-[#f9bc60] animate-spin"
        aria-hidden
      />
      {label && <p className="text-[#abd1c6] text-sm sm:text-base">{label}</p>}
    </div>
  );
}
