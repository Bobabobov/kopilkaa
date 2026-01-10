import { useEffect, useState, type RefObject } from "react";

interface UseFloatingMenuOptions {
  isOpen: boolean;
  anchorRef: RefObject<HTMLElement>;
  menuSelector?: string; // css селектор контейнера меню (для клика внутри)
  onClose: () => void;
  offset?: number;
}

/**
 * Управляет позицией и закрытием выпадающего меню, отрисованного через портал.
 */
export function useFloatingMenu({
  isOpen,
  anchorRef,
  menuSelector,
  onClose,
  offset = 8,
}: UseFloatingMenuOptions) {
  const [style, setStyle] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });

  // Вычисление позиции относительно кнопки
  useEffect(() => {
    if (!isOpen) return;
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    setStyle({
      top: rect.bottom + offset,
      right: window.innerWidth - rect.right,
    });
  }, [isOpen, offset, anchorRef]);

  // Закрытие по клику вне кнопки/меню
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = anchorRef.current;
      const insideAnchor = anchor?.contains(target);
      const insideMenu = menuSelector ? target.closest(menuSelector) : null;
      if (insideAnchor || insideMenu) return;
      onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, menuSelector, onClose, anchorRef]);

  return style;
}
