interface KickIconProps {
  className?: string;
}

export function KickIcon({ className }: KickIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      {/* Блокированная буква K - левая вертикальная часть */}
      <rect x="4" y="4" width="4" height="4" rx="0.5" />
      <rect x="4" y="9" width="4" height="4" rx="0.5" />
      <rect x="4" y="14" width="4" height="4" rx="0.5" />
      {/* Средняя часть */}
      <rect x="9" y="9" width="4" height="4" rx="0.5" />
      {/* Правая верхняя часть */}
      <rect x="14" y="4" width="4" height="4" rx="0.5" />
      <rect x="14" y="9" width="4" height="4" rx="0.5" />
      {/* Правая нижняя часть */}
      <rect x="14" y="14" width="4" height="4" rx="0.5" />
      <rect x="9" y="14" width="4" height="4" rx="0.5" />
    </svg>
  );
}
