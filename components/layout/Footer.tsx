"use client";
import Link from "next/link";

export default function Footer(){
  return (
    <footer className="border-t border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/20">
      <div className="container-p mx-auto py-6 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="opacity-80">© {new Date().getFullYear()} «Копилка»</div>
        <div className="flex items-center gap-4 opacity-80">
          <Link href="/public">Истории</Link>
          <Link href="/applications">Заявка</Link>
          <Link href="/auth">Вход</Link>
        </div>
      </div>
    </footer>
  );
}
