#!/bin/bash

# Скрипт для деплоя приложения на сервере
set -e  # Остановить выполнение при ошибке

echo "🚀 Делаем грязь."

# Переходим в директорию проекта
cd /opt/kopilkaa

echo "📥 Обновление кода из репозитория..."
# ВАЖНО:
# - На сервере не правим код руками (иначе git pull будет конфликтовать).
# - npm install на сервере менять НЕ надо (оно меняет package-lock.json).
# - Этот блок приводит папку проекта к состоянию origin/main.
git fetch origin
git reset --hard origin/main

echo "📦 Установка зависимостей (npm ci, строго по package-lock.json)..."
npm ci --no-audit --no-fund

echo "🧩 Синхронизируем миграции (если правили БД вручную)..."
# Если колонка была добавлена вручную (через prisma db execute), отмечаем миграцию как применённую,
# чтобы `migrate deploy` не падал на повторном ALTER TABLE.
if npx prisma migrate resolve --applied 20260103090000_add_hero_badge_override >/dev/null 2>&1; then
  echo "✅ Миграция 20260103090000_add_hero_badge_override отмечена как применённая"
else
  echo "ℹ️  Миграция 20260103090000_add_hero_badge_override уже была отмечена как применённая"
fi
# На проде filledMs уже есть — снимаем failed с упавшей миграции, помечаем filledMs как применённую.
# Без --rolled-back migrate deploy отказывается применять новые миграции (P3009).
npx prisma migrate resolve --rolled-back 20260220120000_add_filled_ms_and_story_edit_ms || true
npx prisma migrate resolve --applied 20260220110000_add_filled_ms || true

echo "🗄️  Применяем миграции базы данных..."
npx prisma migrate deploy

echo "🧬 Генерируем Prisma Client..."
npx prisma generate

echo "🧹 Чистим кеш Next.js..."
rm -rf .next .turbo node_modules/.cache || true

echo "🔨 Собираем проект..."
npm run build

echo "🔄 Останавливаем приложение перед перезапуском..."
pm2 stop kopilka || true
sleep 2

echo "🔄 Перезапускаем приложение..."
if pm2 describe kopilka >/dev/null 2>&1; then
  pm2 delete kopilka || true
fi

pm2 start npm --name kopilka -- start
pm2 save || true

echo "✅ Деплой завершен!"
echo "📊 Статус приложения:"
pm2 status kopilka || pm2 status

