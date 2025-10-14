"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function TowerBlocksGame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Скрываем шапку и баннер для этой страницы
    const banner = document.querySelector('[data-top-banner]');
    const header = document.querySelector('header');
    
    if (banner) banner.style.display = 'none';
    if (header) header.style.display = 'none';
    
    // Устанавливаем источник iframe после монтирования компонента
    if (iframeRef.current) {
      iframeRef.current.src = "/tower-blocks/index.html";
    }

    // Восстанавливаем шапку и баннер при выходе со страницы
    return () => {
      if (banner) banner.style.display = '';
      if (header) header.style.display = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-black z-50">
      {/* Кнопка назад */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          href="/games"
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          ← Назад к играм
        </Link>
      </div>

      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        title="Tower Blocks Game"
        allow="fullscreen"
        style={{ width: "100vw", height: "100vh" }}
      />
    </div>
  );
}
