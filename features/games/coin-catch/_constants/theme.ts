/**
 * Цвета и стили для UI игры «Монетка».
 * Совместимы с палитрой проекта (Копилка) и shadcn-темами.
 */
export const GAME_THEME = {
  /** Фон страницы и overlay */
  bg: {
    page: "bg-[#0f1614]",
    card: "bg-[#001e1d]",
    cardMuted: "bg-[#0d2827]",
    header: "bg-[#001e1d]/98",
  },
  /** Границы (золотой акцент) */
  border: {
    default: "border-[#f9bc60]/40",
    strong: "border-[#f9bc60]/50",
    light: "border-[#f9bc60]/20",
  },
  /** Текст */
  text: {
    primary: "text-[#fffffe]",
    secondary: "text-[#abd1c6]",
    accent: "text-[#f9bc60]",
  },
  /** Кнопки: основная (золотая), вторичная (outline) */
  button: {
    primary:
      "bg-[#f9bc60] text-[#001e1d] hover:bg-[#ffd700] active:scale-[0.98] font-bold",
    outline:
      "border-2 border-[#f9bc60]/40 text-[#f9bc60] hover:bg-[#001e1d] hover:border-[#f9bc60]/60 bg-[#001e1d]/95",
  },
  /** Тени */
  shadow: {
    card: "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
    overlay: "shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
  },
} as const;
