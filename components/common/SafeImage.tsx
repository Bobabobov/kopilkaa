"use client";

import { ImgHTMLAttributes } from "react";

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "onError"> {
  src: string | null | undefined;
  fallback?: React.ReactNode;
  onLoadError?: () => void;
}

/**
 * Компонент для безопасной загрузки изображений
 * Скрывает ошибки загрузки и показывает fallback
 */
export function SafeImage({ 
  src, 
  fallback, 
  onLoadError,
  className,
  alt,
  ...props 
}: SafeImageProps) {
  if (!src) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        // Предотвращаем показ ошибки в консоли
        e.preventDefault();
        e.stopPropagation();
        
        // Скрываем изображение
        const target = e.currentTarget;
        target.style.display = "none";
        target.src = ""; // Очищаем src, чтобы предотвратить повторные попытки загрузки
        
        // Вызываем callback, если передан
        if (onLoadError) {
          onLoadError();
        }
      }}
      onLoad={(e) => {
        // Убеждаемся, что изображение видимо при успешной загрузке
        e.currentTarget.style.display = "";
      }}
      {...props}
    />
  );
}

