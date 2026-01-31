"use client";

import { useCallback } from "react";
import { buildAuthModalUrl } from "@/lib/authModalUrl";
import { useAuth } from "@/hooks/useAuth";

/**
 * Хук для секции "Как это работает" на главной странице.
 * Обрабатывает клик по кнопке "Начать" с учётом авторизации.
 */
export function useHowItWorksAuth() {
  const { isAuthenticated, loading } = useAuth();

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
