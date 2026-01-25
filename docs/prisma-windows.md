# Prisma на Windows: устранение EPERM при `prisma generate`

Если `npx prisma generate` падает с `EPERM: operation not permitted, rename query_engine-windows.dll.node`, сделайте так:

1. Остановите `next dev` / все процессы node, которые могут держать файл.
2. Закройте VSCode/Cursor, если они могли залочить `.prisma/client`.
3. Запустите:
   ```bash
   npm run prisma:generate:winfix
   ```
   Скрипт попытаться завершить `node.exe` и заново выполнит `prisma generate`.
4. Если всё ещё не помогает — убедитесь, что антивирус/индексация не блокируют файл, и повторите шаг 3.

Проверка структуры таблиц без sqlite3:

```bash
npx prisma db execute --file prisma/_debug/pragma.sql --schema prisma/schema.prisma
```

Файл `prisma/_debug/pragma.sql` содержит:

```
PRAGMA table_info("User");
PRAGMA table_info("Application");
```
