"use client";

import { useEffect } from "react";

export function useIntroOverflow(introOpen: boolean): void {
  useEffect(() => {
    const html = document.documentElement;
    if (introOpen) {
      document.body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      html.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      html.style.overflow = "";
    };
  }, [introOpen]);
}
