"use client";

import Script from "next/script";

const METRIKA_ID = 106107046;

/**
 * Явный внешний script src — так проще находят SEO/аудиторы; инициализация после загрузки tag.js.
 */
export default function YandexMetrikaCounter() {
  return (
    <Script
      id="yandex-metrika-tag"
      src={`https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`}
      strategy="afterInteractive"
      onLoad={() => {
        window.ym?.(METRIKA_ID, "init", {
          ssr: true,
          webvisor: true,
          clickmap: true,
          ecommerce: "dataLayer",
          accurateTrackBounce: true,
          trackLinks: true,
        });
      }}
    />
  );
}
