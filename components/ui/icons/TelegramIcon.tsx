interface TelegramIconProps {
  className?: string;
}

export function TelegramIcon({ className }: TelegramIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <path d="M21.83 2.318a1.39 1.39 0 0 0-1.48-.173L2.36 9.594a1.39 1.39 0 0 0 .09 2.57l4.195 1.61 1.666 4.997a1.39 1.39 0 0 0 2.423.43l2.393-2.832 4.165 3.147a1.39 1.39 0 0 0 2.205-.81l2.9-13.605a1.39 1.39 0 0 0-.767-1.583ZM8.446 12.406 4.78 11.04l12.023-5.07-6.92 6.505a1.39 1.39 0 0 0-.366.531l-1.07-.6Zm1.452 3.503-.8-2.344 2.12 1.477-1.32.867Zm7.351 1.242-4.893-3.566 5.138-4.832-2.41 8.398 2.165-.001Z" />
    </svg>
  );
}


