"use client";

import { useState, useEffect, useCallback } from "react";
import { buildAuthModalUrl } from "@/lib/authModalUrl";

export function useHowItWorksAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setIsAuthenticated(!!d.user);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleStartClick = useCallback(() => {
    if (loading) return;
    if (isAuthenticated) {
      window.location.href = "/applications";
    } else {
      window.location.href = buildAuthModalUrl({
        pathname: window.location.pathname,
        search: window.location.search,
        modal: "auth/signup",
      });
    }
  }, [loading, isAuthenticated]);

  return { isAuthenticated, loading, handleStartClick };
}
