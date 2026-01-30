# Аудит рефакторинга: что сделано и что осталось

## Что сделано

### 1. AdminUsersClient (админка пользователей)

- **Было:** один файл ~460 строк.
- **Сделано:**
  - `app/admin/users/_components/types.ts` — `AdminUser`, `VALID_BADGES`
  - `hooks/admin/useAdminUsers.ts` — загрузка, поиск, пагинация, удаление, бейджи, trust delta
  - `AdminUsersHeader.tsx` — заголовок и поиск
  - `TrustDeltaControl.tsx` — кнопки ±1 уровень доверия
  - `AdminUserCard.tsx` — карточка пользователя
  - `AdminUsersList.tsx` — список (loading, empty, сетка, load more)
  - `AdminBadgeModal.tsx` — модалка выбора бейджа
  - `AdminUsersClient.tsx` — ~85 строк, только композиция

### 2. AdvertisingContact (форма рекламы)

- **Было:** ~775 строк.
- **Сделано:**
  - Валидация и утилиты вынесены в отдельные модули
  - `hooks/advertising/useAdRequestForm.ts` — состояние и логика формы
  - Компоненты: `AdRequestFormHeader`, `AdRequestContactFields`, `AdRequestFormatSelect`, `AdRequestImagesBlock`, `AdRequestDurationField`, `AdRequestMessageField`, `AdRequestSubmitButton`
  - `AdvertisingContact.tsx` — ~116 строк, оркестратор

### 3. TermsContent (условия)

- **Было:** ~683 строки.
- **Сделано:**
  - `components/terms/sections/` — Section01–Section13 (отдельный компонент на раздел)
  - `sectionsConfig.ts` — массив `{ number, title, delay, Content }`
  - `TermsContent.tsx` — ~30 строк, рендер по конфигу

### 4. Achievements (достижения)

- **Сделано:** полное удаление фичи:
  - страницы `app/achievements`, `app/admin/achievements`
  - API `app/api/achievements`, `app/api/admin/achievements`, `app/api/users/[userId]/achievements`
  - `lib/achievements`, компоненты в `components/achievements` и `components/profile`
  - модели и миграция в Prisma
  - обновлены импорты и ссылки по проекту

### 5. useSettings (настройки профиля)

- **Было:** ~646 строк.
- **Сделано:**
  - `components/profile/hooks/settings/types.ts` — типы
  - `settings/api.ts` — слой API (loadUser, patchProfile, phone, avatar, password, export, delete)
  - `useLocalNotification.ts` — уведомления
  - `handlers/` — profileHandlers, phoneHandler, socialHandler, avatarHandlers, passwordHandlers, exportDeleteHandlers
  - `useSettings.ts` (в settings/) — тонкий хук ~115 строк
  - Точка входа `hooks/useSettings.ts` — реэкспорт

### 6. useApplicationFormState (форма заявки)

- **Было:** ~601 строка.
- **Сделано:**
  - `hooks/applications/formState/` — constants, types, storage, useAuth, usePersistence, useIntroOverflow, useTrustAndReview, validation, amountUtils, upload, submitApi
  - Тонкий `useApplicationFormState.ts` в formState/
  - Реэкспорт и `LIMITS` из `hooks/applications/useApplicationFormState.ts`

### 7. GameCanvas (игра Coin Catch)

- **Было:** ~394 строки.
- **Сделано:**
  - `LeaderboardIcons.tsx`, `leaderboardUtils.ts`, `LeaderboardPanel.tsx`
  - `AudioSetupOverlay.tsx`, `useCoinCatchGame.ts`
  - `GameCanvas.tsx` — ~69 строк, композиция

### 8. HowItWorks (главная)

- **Было:** ~258 строк.
- **Сделано:**
  - `components/home/how-it-works/` — config, HowItWorksHeader, HowItWorksStepCard, HowItWorksDisclaimer, HowItWorksCta, useHowItWorksAuth
  - `HowItWorks.tsx` — ~36 строк

### 9. OtherUserProfile (профиль другого пользователя)

- **Было:** ~236 строк.
- **Сделано:**
  - `components/profile/other-user/types.ts` — `OtherUserProfileUser`, `OtherUserProfileProps`
  - `useOtherUserProfile.ts` — составной хук (useOtherUserData, useOtherUserTrust, useOtherUserFriendship, модалка жалобы, редирект)
  - `OtherUserProfileBackLink.tsx` — ссылка «Мой профиль»
  - `OtherUserProfileContent.tsx` — разметка: back link, ProfileHeaderCard, MutualFriends, сетка секций
  - `OtherUserProfile.tsx` — ~90 строк: useOtherUserProfile, ранние выходы, Content + Toast + ReportModal

### 10. HeroSection (главная)

- **Было:** ~195 строк.
- **Сделано:**
  - `components/home/hero-section/types.ts` — `HeroStats`, `HeroSectionProps`
  - `HeroSectionHeadline.tsx` — заголовок и подзаголовок
  - `HeroSectionCta.tsx` — кнопки «Рассказать историю», DonateButton, ссылки (истории, как это работает)
  - `HeroSectionAds.tsx` — AdSection (feed / sidebar по брейкпоинту)
  - `HeroSectionStats.tsx` — блок статистики (коллекция, истории, выплачено, участники)
  - `HeroSection.tsx` — ~27 строк, только композиция + TelegramChannel

---

## Что осталось (кандидаты на разбиение)

Крупные монолиты из плана разбиты. Новых кандидатов на приоритетное разбиение нет; при появлении тяжёлых файлов — добавлять в таблицу ниже.

| Файл | Строк | Примечание |
| ---- | ----- | ---------- |
| —    | —     | —          |

Дальше по плану: архитектура и долг (границы слоёв, типизация, ошибки, тесты, конфиги) — см. раздел ниже.

---

## Архитектура и долг (не разбиение файлов)

- **Границы слоёв** — описаны в `docs/ARCHITECTURE.md`; в коде местами ещё смешаны.
- **Feature-first** — частично (admin/users, applications formState, coin-catch, how-it-works); не везде.
- **Типизация** — часть `any` закрыта отключением правил; при желании можно заменить на нормальные типы.
- **Ошибки** — единого подхода к логам и error boundaries нет. Добавлен `docs/ERROR_HANDLING.md` с рекомендациями; применять по мере правок.
- **Тесты** — юнит/интеграционных нет.
- **Константы/конфиг** — разбросаны по модулям, можно свести в общие конфиги по фичам.

### Сделано по обработке ошибок (API)

- `app/api/auth/check-email/route.ts` — добавлены try/catch, логирование, ответ 500 при падении; формат ошибки `{ error: string }`.
- `app/api/admin/applications/route.ts` — обёрнута логика в try/catch, при ошибке — `console.error` и 500.
- `app/api/auth/logout/route.ts` — добавлены try/catch и ответ 500 при падении.
- `app/api/applications/mine/route.ts` — обёрнута логика в try/catch, при ошибке — `console.error` и 500.
- `app/api/admin/applications/stats/route.ts` — обёрнута логика в try/catch, при ошибке — 500.
- `app/api/users/search/route.ts` — вызов `getSession()` перенесён в try, при любой ошибке — 500; формат ошибки `{ error: string }`.
- `app/api/notifications/route.ts` — формат ошибки 401 приведён к `{ error: string }`; массив уведомлений типизирован (`NotificationItem` вместо `any[]`).
- `app/api/users/report/route.ts` — весь POST в try/catch, `getSession()` внутри try; все ответы об ошибках — `{ error: string }`; в catch только `console.error` и 500 без деталей в ответе.

### Следующие шаги (по приоритету)

1. **Ошибки** — при правке остальных API/форм ориентироваться на `docs/ERROR_HANDLING.md` (try/catch, статусы, логи).
2. **Границы слоёв** — при добавлении кода: хуки в `hooks/<domain>/`, переиспользуемый UI в `components/`, роут-специфичный — в `app/<route>/_components/`.
3. **Типизация** — по желанию заменять `any` на конкретные типы в одном модуле за раз.
4. **Конфиги** — при росте фичи выносить тексты/лимиты в конфиг (как в how-it-works, hero-section).
5. **Тесты** — при появлении требований добавить Vitest/Jest и покрыть критичные пути.
6. **Error boundary** — при необходимости добавить React Error Boundary (см. `docs/ERROR_HANDLING.md`).

---

## Итог по разбиению

- Крупные монолиты (AdminUsers, AdvertisingContact, Terms, useSettings, useApplicationFormState, GameCanvas, HowItWorks, OtherUserProfile, **HeroSection**) разнесены по модулям и тонким точкам входа.
- Achievements удалены.
- Публичные API и импорты сохранены; страницы и роуты не ломались.
- Линт и формат проходят.

План разбиения крупных файлов выполнен. Дальше — архитектура и долг (см. раздел «Архитектура и долг»).

---

## Краткое резюме: что сделали

| Категория | Сделано |
| --------- | ------- |
| **Разбиение монолитов** | 10 крупных файлов/хуков разнесены по модулям: AdminUsersClient, AdvertisingContact, TermsContent, useSettings, useApplicationFormState, GameCanvas, HowItWorks, OtherUserProfile, HeroSection + полное удаление Achievements. |
| **Обработка ошибок (API)** | 9 роутов приведены к `docs/ERROR_HANDLING.md`: check-email, admin/applications, logout, applications/mine, admin/applications/stats, users/search, profile/friends, friends/suggestions, applications POST; плюс notifications, users/report (формат `{ error: string }`, try/catch). |
| **Документация** | `docs/ARCHITECTURE.md` — границы слоёв; `docs/ERROR_HANDLING.md` — рекомендации по ошибкам; `docs/REFACTORING_AUDIT.md` — аудит и план. |
| **Исправления** | Импорты в OtherUserProfileContent (MutualFriends, OtherUserPersonalStats, OtherUserActivity) — исправлены default/named. |
| **Тесты** | Vitest подключён; тесты `__tests__/lib/utils.test.ts` (cn), `__tests__/lib/time.test.ts` (formatTimeAgo, formatRelativeDate). |
| **Конфиги** | `components/home/config.ts` — герой + how-it-works, якоря секций главной. |
| **Типизация** | В `app/api/notifications/route.ts` массив уведомлений типизирован (`NotificationItem` вместо `any[]`). |

---

## Что осталось (по приоритету)

| № | Задача | Состояние |
| - | ------ | --------- |
| 1 | **Ошибки** | Часть API ещё без единого try/catch или с разным форматом ошибки (`message` vs `error`). При правке — ориентироваться на `docs/ERROR_HANDLING.md`. |
| 2 | **Границы слоёв** | Описаны в ARCHITECTURE; при новом коде — хуки в `hooks/<domain>/`, UI в `components/`, роут-специфичное в `app/<route>/_components/`. Хуков в `lib/` нет. |
| 3 | **Типизация** | Много `any` (в т.ч. в API и формах). По желанию заменять по одному модулю. |
| 4 | **Конфиги** | Добавлен `components/home/config.ts` (герой + how-it-works, якоря). Остальные фичи — по мере роста выносить в конфиг. |
| 5 | **Тесты** | Vitest подключён; тесты: `__tests__/lib/utils.test.ts` (cn), `__tests__/lib/time.test.ts` (formatTimeAgo, formatRelativeDate). Расширять покрытие по мере правок. |
| 6 | **Error boundary** | Нет; при необходимости добавить и описать в ERROR_HANDLING. |

---

## Оценка проекта

**Сильные стороны**

- **Структура:** Next.js App Router, разделение app/components/features/hooks/lib — предсказуемо. После рефакторинга крупные монолиты разбиты, точки входа тонкие.
- **Документация:** Есть ARCHITECTURE, ERROR_HANDLING, LOGS, REFACTORING_AUDIT — понятно, куда класть код и как обрабатывать ошибки.
- **Фичи:** Админка, заявки, профиль, друзья, истории, реклама, донаты, игра — широкий функционал; часть фич вынесена в feature-модули (coin-catch, how-it-works).
- **Публичный контракт:** Реэкспорты и импорты сохранены; страницы и API не ломались. Линт и формат проходят.

**Слабые стороны / риски**

- **Ошибки:** Часть API уже приведена к try/catch и `{ error: string }`; при правке остальных — ориентироваться на `docs/ERROR_HANDLING.md`. На клиенте нет Error Boundary.
- **Типизация:** Много `any` остаётся; в notifications массив типизирован. Заменять по одному модулю при правках.
- **Тесты:** Есть Vitest и 2 тест-файла (utils, time). Покрытие минимальное — расширять по мере необходимости.
- **Конфиги:** Главная страница собрана в `components/home/config.ts`; остальные фичи — по мере роста.

**Итоговая оценка**

Проект в хорошем состоянии для поддержки и развития: структура и документы заложены, крупный технический долг по монолитам снят, обработка ошибок начата и зафиксирована в гайде. Оценка **7/10**: крепкая база; довести до 8–9 помогут последовательное применение ERROR_HANDLING в остальных API, постепенное вытеснение `any` и появление хотя бы минимального набора тестов.
