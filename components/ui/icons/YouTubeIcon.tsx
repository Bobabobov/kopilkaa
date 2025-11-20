interface YouTubeIconProps {
  className?: string;
}

export function YouTubeIcon({ className }: YouTubeIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <path d="M21.8 8.001a2.75 2.75 0 0 0-1.938-1.948C18.095 5.75 12 5.75 12 5.75s-6.095 0-7.862.303A2.75 2.75 0 0 0 2.2 8C1.9 9.784 1.9 12 1.9 12s0 2.216.3 4a2.75 2.75 0 0 0 1.938 1.948C6 18.25 12 18.25 12 18.25s6.095 0 7.862-.303A2.75 2.75 0 0 0 21.8 16c.3-1.784.3-4 .3-4s0-2.216-.3-4Zm-11.8 6.25v-4.5L15.5 12l-5.5 2.25Z" />
    </svg>
  );
}


