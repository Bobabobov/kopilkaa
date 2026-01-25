import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    screens: {
      // 320–768 — телефоны (по умолчанию и с sm / md)
      sm: "480px", // маленькие телефоны / вертикальные
      md: "768px", // большие телефоны и компактные планшеты
      // 768–992 — планшеты
      lg: "992px", // планшеты и маленькие ноутбуки
      // 992+ — обычные и большие мониторы
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "hsl(138 50% 45%)", // мягкий зелёный
          fg: "hsl(138 35% 12%)",
          muted: "hsl(138 40% 92%)",
          ring: "hsl(138 50% 40%)",
        },
        // Pastel цвета для фона
        "pastel-mint": {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        "pastel-aqua": {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        "pastel-sage": {
          50: "#f6f7f6",
          100: "#e3e7e3",
          200: "#c7d2c7",
          300: "#a3b5a3",
          400: "#7a8f7a",
          500: "#5f735f",
          600: "#4a5a4a",
          700: "#3d4a3d",
          800: "#333d33",
          900: "#2c332c",
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
