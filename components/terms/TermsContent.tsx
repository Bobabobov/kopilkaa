"use client";

import { motion } from "framer-motion";
import TermsSection from "./TermsSection";

export default function TermsContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-[#abd1c6]/20"
    >
      <div className="relative z-10 max-w-none">

        {/* 1. Преамбула */}
        <TermsSection number="1" title="Преамбула. Публичная оферта" delay={0.3}>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">1.1.</strong> Настоящее Соглашение является публичной
            офертой владельца онлайн-платформы «Копилка» (далее — «Платформа»,
            «Сервис», «Администратор») и определяет условия использования Сервиса.
          </p>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">1.2.</strong> Использование Сервиса означает полное и
            безоговорочное принятие Пользователем условий настоящего Соглашения.
          </p>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">1.3.</strong> Администратор вправе изменять условия
            Соглашения в любое время. Новая редакция вступает в силу с момента
            публикации на Сайте.
          </p>
        </TermsSection>

        {/* 2. Термины */}
        <TermsSection number="2" title="Основные понятия" delay={0.4}>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">2.1.</strong> <strong>Платформа «Копилка»</strong> —
            онлайн-сервис, предоставляющий Пользователям возможность подавать
            заявки для рассмотрения Администратором, а также добровольно
            поддерживать работу и развитие Платформы.
          </p>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">2.2.</strong> <strong>Пользователь</strong> — физическое
            лицо старше 18 лет, использующее Сервис.
          </p>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">2.3.</strong> <strong>Заявка</strong> — обращение
            Пользователя к Администратору с описанием жизненной ситуации для
            рассмотрения возможности финансовой поддержки со стороны Платформы.
          </p>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">2.4.</strong> <strong>Донат</strong> — добровольный
            безвозмездный платёж Пользователя в поддержку работы и развития
            Платформы. Донаты не являются пожертвованиями конкретным лицам.
          </p>
        </TermsSection>

        {/* 3. Регистрация */}
        <TermsSection number="3" title="Регистрация и аккаунт" delay={0.5}>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">3.1.</strong> Для доступа к функционалу Сервиса
            Пользователь проходит регистрацию и предоставляет достоверные данные.
          </p>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">3.2.</strong> Пользователь несёт ответственность за все
            действия, совершённые под его аккаунтом.
          </p>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">3.3.</strong> Администратор вправе отказать в регистрации
            или ограничить доступ без объяснения причин.
          </p>
        </TermsSection>

        {/* 4. Использование */}
        <TermsSection number="4" title="Использование Сервиса" delay={0.6}>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">4.1.</strong> Пользователь вправе подавать заявки,
            добровольно поддерживать Платформу и использовать Сервис в рамках его
            назначения.
          </p>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">4.2.</strong> Запрещается использование Сервиса для
            мошенничества, распространения недостоверной информации и нарушения
            законодательства.
          </p>
        </TermsSection>

        {/* 5. Заявки */}
        <TermsSection number="5" title="Заявки и финансовая поддержка" delay={0.7}>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">5.1.</strong> Подача заявки не гарантирует получение
            финансовой поддержки.
          </p>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">5.2.</strong> Решение о возможности, размере и сроках
            поддержки принимается Администратором самостоятельно.
          </p>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">5.3.</strong> В случае одобрения поддержка предоставляется
            безвозмездно и без обязательств возврата.
          </p>
        </TermsSection>

        {/* 6. Донаты */}
        <TermsSection number="6" title="Донаты и поддержка Платформы" delay={0.8}>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">6.1.</strong> Донаты являются добровольной поддержкой
            Платформы и не дают гарантий получения поддержки.
          </p>
          <p className="text-[#fffffe] leading-relaxed">
            <strong className="text-[#f9bc60]">6.2.</strong> Донаты не адресные и не привязаны к заявкам.
          </p>
        </TermsSection>

        {/* 7. Ответственность */}
        <TermsSection number="7" title="Ответственность" delay={0.9}>
          <p className="text-[#fffffe] leading-relaxed">
            Администратор не несёт ответственности за решения о поддержке,
            действия Пользователей и возможные убытки, связанные с использованием
            Сервиса.
          </p>
        </TermsSection>

        {/* 8. Персональные данные */}
        <TermsSection number="8" title="Конфиденциальность" delay={1.0}>
          <p className="text-[#fffffe] leading-relaxed">
            Персональные данные обрабатываются в соответствии с законодательством
            РФ и используются исключительно для работы Платформы.
          </p>
        </TermsSection>

        {/* 9. Заключение */}
        <TermsSection number="9" title="Заключительные положения" delay={1.1}>
          <p className="text-[#fffffe] leading-relaxed">
            Соглашение регулируется законодательством Российской Федерации и
            действует бессрочно.
          </p>
        </TermsSection>

      </div>
    </motion.div>
  );
}
