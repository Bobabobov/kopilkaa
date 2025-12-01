// components/terms/TermsContent.tsx
"use client";

import { motion } from "framer-motion";
import TermsSection from "./TermsSection";

export default function TermsContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-[#abd1c6]/20 group hover:shadow-3xl transition-all duration-500"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#f9bc60]/15 to-[#abd1c6]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-[#abd1c6]/10 to-[#f9bc60]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-[#abd1c6]/10 to-[#f9bc60]/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
      </div>

      <div className="relative z-10 max-w-none">
        {/* Преамбула */}
        <TermsSection
          number="1"
          title="Преамбула: публичная оферта и акцепт"
          delay={0.3}
        >
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">1.1.</strong> Настоящий документ (далее — «Соглашение»)
            является публичной офертой владельца онлайн-сервиса «Копилка» (далее
            — «Сервис», «Мы», «Администратор») для любого дееспособного лица
            (далее — «Пользователь», «Вы»).
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">1.2.</strong> Использование Сервиса означает полное и
            безоговорочное принятие Пользователем условий настоящего Соглашения.
            Если Пользователь не согласен с какими-либо положениями Соглашения,
            он не вправе использовать Сервис.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">1.3.</strong> Администратор вправе в любое время в
            одностороннем порядке изменять условия настоящего Соглашения без
            какого-либо специального уведомления. Новая редакция Соглашения
            вступает в силу с момента её размещения на Сайте, если иное не
            предусмотрено новой редакцией Соглашения.
          </p>
        </TermsSection>

        {/* Основные понятия */}
        <TermsSection number="2" title="Основные понятия" delay={0.4}>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">2.1.</strong> <strong className="text-[#f9bc60]">Сервис «Копилка»</strong> —
            онлайн-платформа для создания заявок на материальную помощь и
            добровольных пожертвований между пользователями.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">2.2.</strong> <strong className="text-[#f9bc60]">Пользователь</strong> — физическое
            лицо, достигшее возраста 18 лет, использующее Сервис.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">2.3.</strong> <strong className="text-[#f9bc60]">Заявка</strong> — публичное обращение
            Пользователя за материальной помощью, размещенное на Сервисе.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">2.4.</strong> <strong className="text-[#f9bc60]">Пожертвование</strong> — добровольная
            передача денежных средств одним Пользователем другому через Сервис.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">2.5.</strong> <strong className="text-[#f9bc60]">Контент</strong> — любая информация,
            размещаемая Пользователями на Сервисе: тексты, изображения, видео,
            аудио и иные материалы.
          </p>
        </TermsSection>

        {/* Регистрация и аккаунт */}
        <TermsSection
          number="3"
          title="Регистрация и аккаунт Пользователя"
          delay={0.5}
        >
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">3.1.</strong> Для использования Сервиса Пользователь должен
            пройти процедуру регистрации, предоставив достоверную информацию о
            себе.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">3.2.</strong> Пользователь обязуется:
          </p>
          <ul className="list-none ml-0 sm:ml-2 space-y-3 text-[#fffffe]">
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f9bc60] mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">предоставлять достоверную и актуальную информацию;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f9bc60] mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">своевременно обновлять регистрационные данные;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f9bc60] mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">
              нести ответственность за все действия, совершенные под его
              аккаунтом;
              </span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f9bc60] mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">не передавать доступ к аккаунту третьим лицам;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f9bc60] mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">
              уведомлять Администратора о несанкционированном использовании
              аккаунта.
              </span>
            </li>
          </ul>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">3.3.</strong> Администратор вправе отказать в регистрации
            или заблокировать аккаунт Пользователя без объяснения причин.
          </p>
        </TermsSection>

        {/* Правила использования */}
        <TermsSection
          number="4"
          title="Правила использования Сервиса"
          delay={0.6}
        >
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">4.1.</strong> Пользователь имеет право:
          </p>
          <ul className="list-none ml-0 sm:ml-2 space-y-3 text-[#fffffe]">
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">создавать заявки на материальную помощь;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">делать пожертвования другим Пользователям;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">размещать комментарии и отзывы;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">
              использовать Сервис в соответствии с его функциональным
              назначением.
              </span>
            </li>
          </ul>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">4.2.</strong> Пользователю запрещается:
          </p>
          <ul className="list-none ml-0 sm:ml-2 space-y-3 text-[#fffffe]">
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">размещать ложную или вводящую в заблуждение информацию;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">использовать Сервис для мошенничества или обмана;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">нарушать права интеллектуальной собственности третьих лиц;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">
              размещать контент, содержащий угрозы, оскорбления, дискриминацию;
              </span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">спамить или злоупотреблять функциональностью Сервиса;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">
              использовать автоматизированные средства для взаимодействия с
              Сервисом без разрешения.
              </span>
            </li>
          </ul>
        </TermsSection>

        {/* Заявки на помощь */}
        <TermsSection
          number="5"
          title="Заявки на материальную помощь"
          delay={0.7}
        >
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">5.1.</strong> Пользователь может создавать заявки на
            материальную помощь, указывая:
          </p>
          <ul className="list-none ml-0 sm:ml-2 space-y-3 text-[#fffffe]">
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f9bc60] mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">цель и обоснование необходимости помощи;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f9bc60] mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">сумму, которую планирует собрать;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f9bc60] mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">реквизиты для получения средств;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f9bc60] mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">дополнительную информацию и документы.</span>
            </li>
          </ul>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">5.2.</strong> Заявка проходит модерацию Администратором.
            Администратор вправе отклонить заявку без объяснения причин.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">5.3.</strong> Пользователь несет полную ответственность за
            достоверность информации в заявке.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">5.4.</strong> Администратор не гарантирует, что заявка будет
            одобрена или что Пользователь соберет желаемую сумму.
          </p>
        </TermsSection>

        {/* Пожертвования */}
        <TermsSection number="6" title="Пожертвования" delay={0.8}>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">6.1.</strong> Пожертвования осуществляются добровольно и
            безвозмездно.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">6.2.</strong> Администратор не несет ответственности за:
          </p>
          <ul className="list-none ml-0 sm:ml-2 space-y-3 text-[#fffffe]">
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">достоверность информации в заявках;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">использование пожертвованных средств;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">результаты помощи, оказанной через Сервис.</span>
            </li>
          </ul>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">6.3.</strong> Пожертвования не подлежат возврату, за
            исключением случаев, прямо предусмотренных законодательством.
          </p>
        </TermsSection>

        {/* Контент */}
        <TermsSection number="7" title="Контент Пользователей" delay={0.9}>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">7.1.</strong> Пользователь сохраняет права на размещаемый им
            контент, но предоставляет Администратору неисключительную лицензию
            на его использование в рамках функционирования Сервиса.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">7.2.</strong> Пользователь гарантирует, что обладает всеми
            необходимыми правами на размещаемый контент.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">7.3.</strong> Администратор вправе удалять контент,
            нарушающий условия Соглашения, без предварительного уведомления.
          </p>
        </TermsSection>

        {/* Ответственность */}
        <TermsSection number="8" title="Ответственность" delay={1.0}>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">8.1.</strong> Администратор не несет ответственности за:
          </p>
          <ul className="list-none ml-0 sm:ml-2 space-y-3 text-[#fffffe]">
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">временные технические сбои в работе Сервиса;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">действия третьих лиц, включая мошенничество;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">ущерб, причиненный использованием Сервиса;</span>
            </li>
            <li className="flex items-start gap-3 group/item">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <span className="flex-1">достоверность информации, размещенной Пользователями.</span>
            </li>
          </ul>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">8.2.</strong> Пользователь использует Сервис на свой страх и
            риск.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">8.3.</strong> В случае споров между Пользователями
            Администратор не выступает арбитром.
          </p>
        </TermsSection>

        {/* Конфиденциальность */}
        <TermsSection number="9" title="Конфиденциальность" delay={1.1}>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">9.1.</strong> Администратор обязуется защищать персональные
            данные Пользователей в соответствии с применимым законодательством.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">9.2.</strong> Персональные данные используются исключительно
            для функционирования Сервиса и не передаются третьим лицам без
            согласия Пользователя, за исключением случаев, предусмотренных
            законом.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">9.3.</strong> Пользователь может в любое время запросить
            удаление своих персональных данных.
          </p>
        </TermsSection>

        {/* Заключительные положения */}
        <TermsSection number="10" title="Заключительные положения" delay={1.2}>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">10.1.</strong> Настоящее Соглашение регулируется
            законодательством Российской Федерации.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">10.2.</strong> Все споры решаются путем переговоров. При
            недостижении соглашения споры подлежат рассмотрению в суде по месту
            нахождения Администратора.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">10.3.</strong> Если какое-либо положение Соглашения будет
            признано недействительным, остальные положения сохраняют свою силу.
          </p>

          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">10.4.</strong> Настоящее Соглашение действует до его
            прекращения любой из сторон.
          </p>
        </TermsSection>

        {/* Реквизиты */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="mt-12 p-6 sm:p-8 bg-gradient-to-br from-[#f9bc60]/10 via-[#f9bc60]/5 to-[#abd1c6]/10 rounded-2xl border border-[#f9bc60]/30 hover:border-[#f9bc60]/50 hover:shadow-lg hover:shadow-[#f9bc60]/20 transition-all duration-300 group/requisites"
        >
          <motion.h3
            whileHover={{ scale: 1.02 }}
            className="text-xl sm:text-2xl font-bold text-[#f9bc60] mb-5 flex items-center gap-3"
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-2xl"
            >
              📄
            </motion.span>
            Реквизиты получателя платежей
          </motion.h3>
          <div className="space-y-3 text-[#abd1c6]">
            <div className="flex items-center gap-3 group/item">
              <span className="w-2 h-2 rounded-full bg-[#f9bc60] flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <p className="text-[#fffffe]">
                <strong className="text-[#f9bc60]">ФИО:</strong> Стулов Федор Федорович
              </p>
            </div>
            <div className="flex items-center gap-3 group/item">
              <span className="w-2 h-2 rounded-full bg-[#f9bc60] flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <p className="text-[#fffffe]">
                <strong className="text-[#f9bc60]">ИНН:</strong> 245607255602
              </p>
            </div>
            <div className="flex items-center gap-3 group/item">
              <span className="w-2 h-2 rounded-full bg-[#f9bc60] flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <p className="text-[#fffffe]">
                <strong className="text-[#f9bc60]">Статус:</strong> Самозанятый
              </p>
            </div>
          </div>
        </motion.div>

        {/* Контакты */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="mt-6 p-6 sm:p-8 bg-gradient-to-br from-[#f9bc60]/10 via-[#f9bc60]/5 to-[#abd1c6]/10 rounded-2xl border border-[#f9bc60]/30 hover:border-[#f9bc60]/50 hover:shadow-lg hover:shadow-[#f9bc60]/20 transition-all duration-300 group/contact"
        >
          <motion.h3
            whileHover={{ scale: 1.02 }}
            className="text-xl sm:text-2xl font-bold text-[#f9bc60] mb-5 flex items-center gap-3"
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-2xl"
            >
              📞
            </motion.span>
            Контактная информация
          </motion.h3>
          <div className="space-y-3 text-[#abd1c6]">
            <div className="flex items-center gap-3 group/item">
              <span className="w-2 h-2 rounded-full bg-[#f9bc60] flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <p className="text-[#fffffe]">
                <strong className="text-[#f9bc60]">Сервис:</strong> Копилка
            </p>
            </div>
            <div className="flex items-center gap-3 group/item">
              <span className="w-2 h-2 rounded-full bg-[#f9bc60] flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <p className="text-[#fffffe]">
                <strong className="text-[#f9bc60]">Email:</strong> support@kopilka.ru
            </p>
            </div>
            <div className="flex items-center gap-3 group/item">
              <span className="w-2 h-2 rounded-full bg-[#f9bc60] flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <p className="text-[#fffffe]">
                <strong className="text-[#f9bc60]">Время ответа:</strong> в течение 24 часов
            </p>
            </div>
            <div className="flex items-center gap-3 group/item">
              <span className="w-2 h-2 rounded-full bg-[#f9bc60] flex-shrink-0 group-hover/item:scale-150 transition-transform duration-200"></span>
              <p className="text-[#fffffe]">
                <strong className="text-[#f9bc60]">Часы работы:</strong> ежедневно с 9:00 до 21:00 (МСК)
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
