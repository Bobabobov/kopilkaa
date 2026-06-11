import { useEffect, type RefObject } from "react";

export function useGlassModalScrollLock(
  isOpen: boolean,
  dialogRef: RefObject<HTMLElement | null>,
  onClose?: () => void,
) {
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.();
    };

    const preventBackgroundScroll = (event: Event) => {
      const target = event.target;
      if (target instanceof Node && dialogRef.current?.contains(target)) {
        return;
      }
      event.preventDefault();
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("wheel", preventBackgroundScroll, {
      passive: false,
    });
    document.addEventListener("touchmove", preventBackgroundScroll, {
      passive: false,
    });

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("wheel", preventBackgroundScroll);
      document.removeEventListener("touchmove", preventBackgroundScroll);

      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;
      document.documentElement.style.overflow = originalHtmlOverflow;

      window.scrollTo(0, scrollY);
    };
  }, [dialogRef, isOpen, onClose]);
}
