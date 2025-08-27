"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle(){
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if(!mounted) return (
    <button
      className="btn-ghost border border-black/5 dark:border-white/10 rounded-xl p-2"
      aria-label="Toggle theme"
    >
      <Sun className="w-4 h-4" />
    </button>
  );

  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="btn-ghost border border-black/5 dark:border-white/10 rounded-xl p-2"
      aria-label="Переключить тему"
      title="Переключить тему"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
