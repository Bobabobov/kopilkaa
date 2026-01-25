"use client";
import { useEffect } from "react";
import { setupProfilePreloading } from "@/lib/profilePreloader";

export default function ProfilePreloadInitializer() {
  useEffect(() => {
    // В DEV Next.js Fast Refresh может спамить предупреждениями из-за динамических импортов/observer'ов.
    // Предзагрузку включаем только в PROD (для реальных пользователей).
    if (process.env.NODE_ENV !== "production") return;

    setupProfilePreloading();
  }, []);

  return null; // Этот компонент ничего не рендерит
}
