// app/terms/page.tsx
"use client";

import { motion } from "framer-motion";
import UniversalBackground from "@/components/ui/UniversalBackground";

export default function TermsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <UniversalBackground />
      
      <div className="pt-32 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Заголовок */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Пользовательское соглашение
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              и Политика конфиденциальности
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-500">
              <span>Версия: 1.0</span>
              <span>•</span>
              <span>Дата вступления в силу: 25.09.2025</span>
            </div>
          </motion.div>

          {/* Основной контент */}
          <motion.div 
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/30 dark:border-gray-700/30"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="prose prose-lg dark:prose-invert max-w-none">
              
              {/* Преамбула */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</span>
                  Преамбула: публичная оферта и акцепт
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p><strong>1.1.</strong> Настоящий документ (далее — «Соглашение») является публичной офертой владельца онлайн-сервиса «Копилка» (далее — «Сервис», «Мы», «Администратор») для любого дееспособного лица (далее — «Пользователь», «Вы»).</p>
                  <p><strong>1.2.</strong> Использование Сервиса (регистрация, вход, публикация заявки, отправка пожертвования, просмотр материалов) означает полное и безоговорочное согласие с настоящим Соглашением.</p>
                  <p><strong>1.3.</strong> Если Вы не согласны с условиями — немедленно прекратите использование Сервиса.</p>
                </div>
              </section>

              {/* Термины */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</span>
                  Термины
                </h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p><strong>Сервис «Копилка»</strong> — интернет-платформа по адресу: https://kopilka-online.ru</p>
                  <p><strong>Администратор</strong> — единственный владелец и оператор Сервиса: частное лицо, управляющее платформой без привлечения модераторов.</p>
                  <p><strong>Аккаунт</strong> — учётная запись Пользователя.</p>
                  <p><strong>Заявка</strong> — просьба о помощи (текст, фото, реквизиты), опубликованная Пользователем.</p>
                  <p><strong>Пожертвование</strong> — добровольный безвозмездный перевод средств в пользу Пользователя.</p>
                  <p><strong>Контент</strong> — любые материалы (тексты, фото), размещённые Пользователями.</p>
                  <p><strong>Модерация</strong> — решение Администратора о публикации или удалении Заявки/Аккаунта.</p>
                  <p><strong>Платёжные сервисы</strong> — сторонние провайдеры платежей (например, ЮKassa, CloudPayments, банковские переводы).</p>
                </div>
              </section>

              {/* Общие положения */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</span>
                  Общие положения
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p><strong>3.1.</strong> «Копилка» — это платформа для взаимопомощи, а не благотворительный фонд. Мы не собираем деньги от имени сервиса и не гарантируем успешный сбор.</p>
                  <p><strong>3.2.</strong> Администратор вправе отклонять Заявки или удалять их без объяснения причин, если они нарушают правила.</p>
                  <p><strong>3.3.</strong> Работа Сервиса предоставляется «как есть». Возможны технические сбои и перерывы.</p>
                </div>
              </section>

              {/* Регистрация и Аккаунт */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</span>
                  Регистрация и Аккаунт
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p><strong>4.1.</strong> Регистрация доступна с 18 лет (или с 14 лет при согласии родителей и использовании собственных средств).</p>
                  <p><strong>4.2.</strong> Пользователь обязан предоставлять правдивую информацию и поддерживать её актуальность.</p>
                  <p><strong>4.3.</strong> Ответственность за сохранность пароля несёт Пользователь.</p>
                  <p><strong>4.4.</strong> Допускается только один Аккаунт на человека.</p>
                </div>
              </section>

              {/* Верификация */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">5</span>
                  Верификация
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p><strong>5.1.</strong> Администратор может запросить документы для подтверждения личности и законности сбора.</p>
                  <p><strong>5.2.</strong> Отказ предоставить данные может привести к удалению Заявки или блокировке Аккаунта.</p>
                </div>
              </section>

              {/* Размещение Заявок */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">6</span>
                  Размещение Заявок
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p><strong>6.1. Формат:</strong></p>
                  <ul className="ml-6 space-y-2">
                    <li>• Заголовок — до 40 символов,</li>
                    <li>• Кратко — до 140 символов,</li>
                    <li>• История — 200–3000 символов,</li>
                    <li>• Реквизиты — 10–200 символов,</li>
                    <li>• До 5 фото.</li>
                  </ul>
                  <p><strong>6.2.</strong> Запрещено публиковать ложь, экстремизм, сцены насилия, порнографию, чужие персональные данные.</p>
                  <p><strong>6.3.</strong> Вся ответственность за достоверность информации лежит на Пользователе.</p>
                </div>
              </section>

              {/* Пожертвования */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">7</span>
                  Пожертвования
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p><strong>7.1.</strong> Все переводы являются добровольными и безвозвратными.</p>
                  <p><strong>7.2.</strong> Администратор не участвует в переводе средств и не является их получателем.</p>
                  <p><strong>7.3.</strong> Операции проходят через платёжные сервисы по их правилам.</p>
                </div>
              </section>

              {/* Комиссии и возвраты */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">8</span>
                  Комиссии и возвраты
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p><strong>8.1.</strong> Комиссии устанавливаются платёжными сервисами.</p>
                  <p><strong>8.2.</strong> Администратор не взимает дополнительной комиссии.</p>
                  <p><strong>8.3.</strong> Возврат возможен только в случае ошибки или сбоя системы (см. Политику возвратов).</p>
                </div>
              </section>

              {/* Контент и права */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">9</span>
                  Контент и права
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p><strong>9.1.</strong> Права на сайт, дизайн и программный код принадлежат Администратору.</p>
                  <p><strong>9.2.</strong> Права на материалы остаются у Пользователей, но они предоставляют Сервису неисключительное право использовать их для публикации.</p>
                  <p><strong>9.3.</strong> Пользователь несёт ответственность за нарушение авторских прав.</p>
                </div>
              </section>

              {/* Запрещённые действия */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">10</span>
                  Запрещённые действия
                </h2>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4"><strong>Запрещено:</strong></p>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• мошенничество, вымогательство, обман;</li>
                    <li>• публикация недостоверной информации;</li>
                    <li>• вмешательство в работу Сервиса (атаки, подбор паролей);</li>
                    <li>• использование чужих Аккаунтов.</li>
                  </ul>
                </div>
              </section>

              {/* Ответственность */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">11</span>
                  Ответственность
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p><strong>11.1. Администратор не отвечает за:</strong></p>
                  <ul className="ml-6 space-y-2">
                    <li>• правдивость заявок;</li>
                    <li>• работу сторонних платёжных сервисов;</li>
                    <li>• любые убытки, понесённые Пользователями.</li>
                  </ul>
                  <p><strong>11.2.</strong> Пользователь полностью отвечает за свои действия.</p>
                </div>
              </section>

              {/* Споры и право */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">12</span>
                  Споры и право
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p><strong>12.1.</strong> Все претензии направляются на email: <a href="mailto:support@kopilka-online.ru" className="text-emerald-600 dark:text-emerald-400 hover:underline">support@kopilka-online.ru</a>. Срок ответа — 30 дней.</p>
                  <p><strong>12.2.</strong> Споры подлежат рассмотрению в суде по месту жительства Администратора.</p>
                  <p><strong>12.3.</strong> Применяется законодательство Российской Федерации.</p>
                </div>
              </section>

              {/* Изменение правил */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">13</span>
                  Изменение правил
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p><strong>13.1.</strong> Администратор вправе изменять условия.</p>
                  <p><strong>13.2.</strong> Новая версия вступает в силу с момента публикации на сайте.</p>
                </div>
              </section>

              {/* Контакты */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">14</span>
                  Контакты
                </h2>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>Администратор «Копилки»</strong></p>
                  <p className="text-gray-700 dark:text-gray-300">Email: <a href="mailto:support@kopilka-online.ru" className="text-emerald-600 dark:text-emerald-400 hover:underline">support@kopilka-online.ru</a></p>
                </div>
              </section>

              {/* Политика конфиденциальности */}
              <section className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-lg font-bold">🔒</span>
                  Политика конфиденциальности
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>Мы обрабатываем минимальные данные: email, логин, пароль, фото.</p>
                  <p>Данные нужны для работы сервиса (регистрация, заявки, авторизация).</p>
                  <p>Мы не передаём данные третьим лицам, кроме случаев, предусмотренных законом.</p>
                  <p>Вы вправе запросить удаление данных, написав на email.</p>
                </div>
              </section>

              {/* Политика cookies */}
              <section className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-lg font-bold">🍪</span>
                  Политика cookies
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>Cookies используются для авторизации и удобства работы.</p>
                  <p>Вы можете отключить cookies в браузере, но это ограничит работу Сервиса.</p>
                </div>
              </section>

              {/* Политика возвратов */}
              <section className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-bold">💰</span>
                  Политика возвратов
                </h2>
                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p>Пожертвования не возвращаются.</p>
                  <p>Исключение: ошибка или сбой при платеже.</p>
                  <p>Запрос возврата подаётся в течение 14 дней с приложением подтверждений.</p>
                </div>
              </section>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}