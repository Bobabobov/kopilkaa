"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const METRIKA_ID = 106107046;

function buildUrl(pathname: string, search: string) {
  const p = pathname || "/";
  const q = search || "";
  return p + (q ? "?" + q : "");
}

export function useMetrika() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastHitRef = useRef<string | null>(null);

  useEffect(() => {
    const search = searchParams?.toString() ?? "";
    const url = buildUrl(pathname || "/", search);
    if (lastHitRef.current === url) return;
    lastHitRef.current = url;

    let cancelled = false;
    let attempt = 0;
    const maxAttempts = 10;

    const sendHit = () => {
      if (cancelled) return;
      attempt += 1;

      if (typeof window !== "undefined" && typeof window.ym === "function") {
        try {
          window.ym(METRIKA_ID, "hit", url);
        } catch {
          // ignore
        }
        return;
      }

      if (attempt < maxAttempts) {
        setTimeout(sendHit, 250);
      }
    };

    sendHit();

    return () => {
      cancelled = true;
    };
  }, [pathname, searchParams?.toString()]);
}


