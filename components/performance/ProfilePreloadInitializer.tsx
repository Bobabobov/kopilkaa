"use client";
import { useEffect } from "react";
import { setupProfilePreloading } from "@/lib/profilePreloader";

export default function ProfilePreloadInitializer() {
  useEffect(() => {
    // Инициализируем предзагрузку профиля только на клиенте
    setupProfilePreloading();

    // Добавляем обработчик для предзагрузки при навигации
    const handleRouteChange = () => {
      // Переинициализируем предзагрузку для новых ссылок
      setTimeout(() => {
        setupProfilePreloading();
      }, 100);
    };

    // Слушаем изменения в DOM для новых ссылок
    const observer = new MutationObserver(() => {
      handleRouteChange();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // Этот компонент ничего не рендерит
}




