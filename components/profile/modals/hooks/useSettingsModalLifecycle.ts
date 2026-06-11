import { useEffect, useRef } from "react";

interface UseSettingsModalLifecycleParams {
  isOpen: boolean;
  dialogRef: React.RefObject<HTMLDivElement | null>;
}

export function useSettingsModalLifecycle({
  isOpen,
  dialogRef,
}: UseSettingsModalLifecycleParams) {
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  // Focus trap + restore focus (scroll lock и Escape — в GlassModal)
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
          style.display === "none" ||
          style.visibility === "hidden" ||
          el.getAttribute("aria-hidden") === "true";
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

  return { lastActiveElementRef };
}
