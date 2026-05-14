export const COOKIE_CONSENT_KEY = "cookie_consent";
export const COOKIE_CONSENT_ACCEPTED_EVENT = "cookie-consent-accepted";

function escapeCookieName(name: string): string {
  return name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const escapedName = escapeCookieName(name);
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${escapedName}=([^;]*)`),
  );

  return match ? decodeURIComponent(match[1]) : null;
}

export function hasCookieConsent(): boolean {
  return getCookie(COOKIE_CONSENT_KEY) === "accepted";
}

export function setCookieConsentAccepted(): void {
  if (typeof document === "undefined") return;

  const isSecure = window.location.protocol === "https:";
  const securePart = isSecure ? "; Secure" : "";

  document.cookie = `${COOKIE_CONSENT_KEY}=accepted; Max-Age=31536000; Path=/; SameSite=Lax${securePart}`;

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(COOKIE_CONSENT_ACCEPTED_EVENT));
  }
}
