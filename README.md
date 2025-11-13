app/* — страницы и маршруты Next.js (App Router)
app/api/* — серверные обработчики и API-эндпоинты
app/profile/* — страница личного профиля и связанные подпути
app/[...]/page.tsx — отдельные страницы (игры, админка, демо и т.д.)

components/* — переиспользуемые компоненты интерфейса
components/profile/* — компоненты профиля (основной и профиль друга)
components/ui/* — общие UI-элементы (тосты, диалоги, фон и пр.)

lib/* — вспомогательные функции (авторизация, база данных, утилиты оформления)
lib/auth.ts — работа с сессией
lib/db.ts — подключение Prisma

prisma/schema.prisma — схема базы данных (Prisma)

public/* — статические файлы (изображения, шрифты, скрипты)
public/logo.svg — логотип проекта
public/tower-blocks/* — ресурсы игры

styles/globals.css — глобальные стили
styles/fonts.css — подключение шрифтов

types/* — общие типы TypeScript (если есть)

package.json — зависимости и скрипты
next.config.mjs — конфигурация Next.js
tsconfig.json — настройки TypeScript
postcss.config.mjs / tailwind.config.ts — конфигурация Tailwind/PostCSS (если используются)
README.md — описание проекта (если есть)
