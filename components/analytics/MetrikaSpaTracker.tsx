"use client";

import { useEffect, useState } from "react";
import { useMetrika } from "@/hooks/analytics/useMetrika";
import {
  COOKIE_CONSENT_ACCEPTED_EVENT,
  hasCookieConsent,
} from "@/lib/cookieConsent";

export default function MetrikaSpaTracker() {
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

  useMetrika(isEnabled);
  return null;
}
