"use client";

import { useEffect, useRef } from "react";

interface YandexRTBAdProps {
  blockId: string;
  type?: string;
  platform?: string;
  className?: string;
}

declare global {
  interface Window {
    yaContextCb?: Array<() => void>;
    Ya?: {
      Context: {
        AdvManager: {
          render: (config: {
            blockId: string;
            type: string;
            platform: string;
          }) => void;
        };
      };
    };
  }
}

export default function YandexRTBAd({
  blockId,
  type = "floorAd",
  platform = "touch",
  className = "",
}: YandexRTBAdProps) {
  const renderedRef = useRef(false);

  useEffect(() => {
    if (renderedRef.current) return;
    if (typeof window === "undefined") return;

    // Инициализируем массив callbacks, если его еще нет
    if (!window.yaContextCb) {
      window.yaContextCb = [];
    }

    // Добавляем функцию в очередь - она выполнится автоматически
    // когда скрипт Yandex RTB загрузится
    const renderAd = () => {
      if (
        typeof window !== "undefined" &&
        window.Ya &&
        window.Ya.Context &&
        window.Ya.Context.AdvManager
      ) {
        try {
          window.Ya.Context.AdvManager.render({
            blockId,
            type,
            platform,
          });
          renderedRef.current = true;
        } catch (error) {
          console.error("Error rendering Yandex RTB ad:", error);
        }
      }
    };

    window.yaContextCb.push(renderAd);

    // Если скрипт уже загружен (редкий случай), вызываем сразу
    if (window.Ya && window.Ya.Context && window.Ya.Context.AdvManager) {
      renderAd();
    }

    // Cleanup не требуется, так как yaContextCb - глобальный массив
  }, [blockId, type, platform]);

  return (
    <div className={`yandex-rtb-container ${className}`} id={`yandex-rtb-${blockId}`}>
      {/* Yandex RTB blockId: {blockId} */}
      {/* Рекламный блок будет вставлен сюда через Yandex RTB */}
    </div>
  );
}
