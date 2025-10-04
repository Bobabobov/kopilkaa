// components/ui/Icon.tsx
"use client";
import { ReactNode } from "react";

interface IconProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6", 
  lg: "w-8 h-8",
  xl: "w-12 h-12"
};

export default function Icon({ 
  children, 
  className = "", 
  size = "md"
}: IconProps) {
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}

// Предустановленные иконки для сайта
export const SiteIcons = {
  // Основные иконки
  Logo: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    </Icon>
  ),

  // Деньги/копилка
  Money: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    </Icon>
  ),

  // Помощь/рука
  Help: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    </Icon>
  ),

  // Друзья/сообщество
  Friends: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99L12 11l-1.99-2.01A2.5 2.5 0 0 0 8 8H5.46c-.8 0-1.54.37-2.01.99L1 14.37V16h2.5v6H6v-6h4v6h2zm-6-6H8v-4h6v4z"/>
      </svg>
    </Icon>
  ),

  // Документ/заявка
  Document: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
      </svg>
    </Icon>
  ),

  // Статистика/график
  Stats: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z"/>
      </svg>
    </Icon>
  ),

  // Сердце/любовь
  Heart: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
      </svg>
    </Icon>
  ),

  // Стрелка вверх/рост
  TrendingUp: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
      </svg>
    </Icon>
  ),

  // Щит/безопасность
  Shield: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V16H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"/>
      </svg>
    </Icon>
  ),

  // Звезда/рейтинг
  Star: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
      </svg>
    </Icon>
  ),

  // Дополнительные иконки
  Home: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
      </svg>
    </Icon>
  ),

  // Пользователь
  User: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
      </svg>
    </Icon>
  ),

  // Выход
  Logout: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M14.08,15.59L16.67,13H7V11H16.67L14.08,8.41L15.5,7L20.5,12L15.5,17L14.08,15.59M19,3A2,2 0 0,1 21,5V9.67L19,7.67V5H5V19H19V16.33L21,14.33V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H19Z"/>
      </svg>
    </Icon>
  ),

  // Настройки
  Settings: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
      </svg>
    </Icon>
  ),

  // Поиск
  Search: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
      </svg>
    </Icon>
  ),

  // Меню
  Menu: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"/>
      </svg>
    </Icon>
  ),

  // Закрыть
  Close: ({ className = "", size = "md" }: Omit<IconProps, 'children'>) => (
    <Icon className={className} size={size}>
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
      </svg>
    </Icon>
  )
};
