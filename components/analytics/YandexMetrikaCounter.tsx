"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  COOKIE_CONSENT_ACCEPTED_EVENT,
  hasCookieConsent,
} from "@/lib/cookieConsent";

const METRIKA_ID = 106107046;

/**
 * Явный внешний script src — так проще находят SEO/аудиторы; инициализация после загрузки tag.js.
 */
export default function YandexMetrikaCounter() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    setIsEnabled(hasCookieConsent());

    const handleConsentAccepted = () => {
      setIsEnabled(true);
    };

    window.addEventListener(
      COOKIE_CONSENT_ACCEPTED_EVENT,
      handleConsentAccepted,
    );

    return () => {
      window.removeEventListener(
        COOKIE_CONSENT_ACCEPTED_EVENT,
        handleConsentAccepted,
      );
    };
  }, []);

  if (!isEnabled) return null;

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
