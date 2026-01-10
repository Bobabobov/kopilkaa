# Просмотр логов на сервере

## PM2 логи (основной способ)

Приложение запущено через PM2 с именем `kopilka`. Используйте следующие команды:

### Основные команды PM2:

```bash
# Посмотреть логи в реальном времени (LIVE) - просто запустите без дополнительных параметров
pm2 logs kopilka

# Или для всех процессов
pm2 logs

# Для выхода из режима просмотра нажмите Ctrl+C

# Посмотреть последние 100 строк и продолжить следить в реальном времени
pm2 logs kopilka --lines 100

# Посмотреть только ошибки
pm2 logs kopilka --err

# Посмотреть только стандартный вывод
pm2 logs kopilka --out

# Посмотреть логи с конкретной даты
pm2 logs kopilka --timestamp "YYYY-MM-DD HH:mm:ss"

# Очистить логи
pm2 flush kopilka

# Посмотреть информацию о процессе
pm2 info kopilka

# Посмотреть статус процесса
pm2 status kopilka

# Посмотреть мониторинг в реальном времени
pm2 monit
```

### Логи PM2 (файлы):

PM2 хранит логи в `~/.pm2/logs/`:

```bash
# Посмотреть путь к файлам логов
pm2 info kopilka | grep "log path"

# Читать файлы напрямую
tail -f ~/.pm2/logs/kopilka-out.log    # Стандартный вывод
tail -f ~/.pm2/logs/kopilka-error.log  # Ошибки

# Посмотреть последние 50 строк
tail -n 50 ~/.pm2/logs/kopilka-error.log

# Поиск по логам
grep "error" ~/.pm2/logs/kopilka-error.log
grep "ERROR" ~/.pm2/logs/kopilka-out.log | tail -20
```

## Системные логи (journald)

Если приложение запущено как systemd сервис:

```bash
# Логи systemd
journalctl -u kopilka -f              # В реальном времени
journalctl -u kopilka -n 100          # Последние 100 строк
journalctl -u kopilka --since today   # С начала дня
journalctl -u kopilka --since "1 hour ago"  # За последний час
```

## Next.js логи

Next.js логи выводятся в консоль. Если нужно перенаправить в файл, можно использовать:

```bash
# В package.json изменить скрипт start:
# "start": "next start -H 0.0.0.0 -p 3000 2>&1 | tee -a logs/app.log"

# Или через PM2 с выводом в файл:
pm2 start npm --name kopilka -- start --log logs/app.log
```

## Поиск ошибок

```bash
# Найти все ошибки в логах PM2
grep -i "error" ~/.pm2/logs/kopilka*.log | tail -50

# Найти ошибки TypeScript
grep -i "type error" ~/.pm2/logs/kopilka-error.log

# Найти ошибки сборки
grep -i "build error\|failed to compile" ~/.pm2/logs/kopilka-error.log

# Найти ошибки API
grep -i "api.*error\|route.*error" ~/.pm2/logs/kopilka-error.log
```

## Мониторинг в реальном времени

```bash
# PM2 мониторинг (CPU, память, логи) - интерактивный дашборд
pm2 monit

# Просмотр логов в реальном времени (LIVE) - основной способ
pm2 logs kopilka

# Просмотр только ошибок в реальном времени
pm2 logs kopilka --err

# Просмотр только стандартного вывода в реальном времени
pm2 logs kopilka --out

# Просмотр логов с таймстемпами
pm2 logs kopilka --timestamp

# Просмотр логов всех процессов в реальном времени
pm2 logs

# Или простой tail нескольких логов (альтернативный способ)
tail -f ~/.pm2/logs/kopilka-out.log
tail -f ~/.pm2/logs/kopilka-error.log

# Следить за несколькими файлами одновременно
tail -f ~/.pm2/logs/kopilka-*.log
```

**Важно:** Для выхода из режима просмотра в реальном времени нажмите `Ctrl+C`

## Полезные команды для отладки

```bash
# Перезапустить приложение и посмотреть логи
pm2 restart kopilka && pm2 logs kopilka --lines 50

# Посмотреть использование ресурсов
pm2 show kopilka

# Экспортировать все логи в файл
pm2 logs kopilka --lines 1000 > /tmp/kopilka-logs.txt

# Посмотреть логи за конкретный период (через grep)
grep "2026-01-10" ~/.pm2/logs/kopilka-out.log
```

## Другие места для логов

```bash
# Логи Next.js сборки (если сохраняются)
cat .next/build.log 2>/dev/null || echo "Файл не найден"

# Логи npm (если были ошибки при установке)
cat npm-debug.log 2>/dev/null || echo "Файл не найден"

# Системные логи (если используется nginx/apache как прокси)
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Решение ошибки "Cannot read properties of null (reading 'digest')"

Эта ошибка обычно связана с проблемами работы `cookies()` в Next.js 14.2.33. Для решения:

1. **Убедитесь, что используется последняя версия кода** (с улучшенной обработкой ошибок в `lib/auth.ts`)
2. **Переустановите зависимости и пересоберите**:

```bash
cd /opt/kopilkaa
npm ci --no-audit --no-fund
npm run build
pm2 restart kopilka
```

3. **Если ошибка повторяется**, проверьте использование `getSession()` в Server Components - он должен использоваться только в async Server Components или API routes.

4. **Добавлен `sharp` для оптимизации изображений** - установите зависимости заново:
```bash
npm ci --no-audit --no-fund
```
