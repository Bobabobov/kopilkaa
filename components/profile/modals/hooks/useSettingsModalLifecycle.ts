import { useEffect, useRef, useState } from "react";

interface UseSettingsModalLifecycleParams {
  isOpen: boolean;
  onClose: () => void;
  dialogRef: React.RefObject<HTMLDivElement>;
}

export function useSettingsModalLifecycle({ isOpen, onClose, dialogRef }: UseSettingsModalLifecycleParams) {
  const [mounted, setMounted] = useState(false);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  // Монтирование для Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Управление клавишами и блокировка скролла
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, onClose]);

  // Focus trap + restore focus
  useEffect(() => {
    if (!isOpen) return;
    lastActiveElementRef.current = document.activeElement as HTMLElement | null;

    const dialog = dialogRef.current;
    const getFocusable = () => {
      if (!dialog) return [] as HTMLElement[];
      const nodes = dialog.querySelectorAll<HTMLElement>(
        [
          "a[href]",
          "button:not([disabled])",
          "textarea:not([disabled])",
          "input:not([disabled])",
          "select:not([disabled])",
          "[tabindex]:not([tabindex='-1'])",
        ].join(","),
      );
      return Array.from(nodes).filter((el) => {
        const style = window.getComputedStyle(el);
        const hidden =
          style.display === "none" || style.visibility === "hidden" || el.getAttribute("aria-hidden") === "true";
        return !hidden;
      });
    };

    const focusables = getFocusable();
    const initial = focusables[0] || dialog;
    if (initial) setTimeout(() => initial.focus(), 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    dialog?.addEventListener("keydown", onKeyDown);

    return () => {
      dialog?.removeEventListener("keydown", onKeyDown);
      if (lastActiveElementRef.current) {
        lastActiveElementRef.current.focus();
      }
    };
  }, [isOpen, dialogRef]);

  return { mounted, lastActiveElementRef };
}
