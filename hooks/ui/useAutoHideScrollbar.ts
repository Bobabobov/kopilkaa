import { useEffect, useRef } from "react";

export function useAutoHideScrollbar() {
  // Начальное значение null, чтобы удовлетворить типы React.useRef
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;

      if (target.classList.contains("custom-scrollbar")) {
        // Убираем класс скрытия
        target.classList.remove("scrollbar-hidden");

        // Очищаем предыдущий таймер
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Устанавливаем новый таймер на скрытие через 2 секунды
        timeoutRef.current = setTimeout(() => {
          target.classList.add("scrollbar-hidden");
        }, 2000);
      }
    };

    // Добавляем обработчик на все элементы с кастомным скроллбаром
    const scrollElements = document.querySelectorAll(".custom-scrollbar");

    scrollElements.forEach((element) => {
      element.addEventListener("scroll", handleScroll, { passive: true });
    });

    // Очистка при размонтировании
    return () => {
      scrollElements.forEach((element) => {
        element.removeEventListener("scroll", handleScroll);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
}
