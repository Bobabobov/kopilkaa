'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle2,
  ClipboardList,
  FileText,
  ImageIcon,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { buildAuthModalUrl } from '@/lib/authModalUrl';
import type { Route } from 'next';

const DEMO_FIELDS = [
  { label: 'Категория', value: 'Бытовые расходы', icon: ClipboardList },
  { label: 'Заголовок', value: 'Нужна помощь с оплатой жилья', icon: FileText },
  {
    label: 'История',
    value: 'Кратко опишите ситуацию и почему сейчас нужна поддержка…',
    icon: FileText,
  },
  { label: 'Сумма', value: '12 000 ₽', icon: Wallet },
  { label: 'Фото / документы', value: 'Можно приложить подтверждения', icon: ImageIcon },
];

export default function KopiDemoApplication() {
  const signupHref = buildAuthModalUrl({
    pathname: '/applications/demo',
    search: '',
    modal: 'auth/signup',
  }) as Route;

  return (
    <div className="relative min-h-screen overflow-hidden pb-10 pt-4 sm:pt-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-6 max-w-3xl px-3 sm:px-4"
      >
        <div
          className="flex items-start gap-3 rounded-2xl border px-4 py-4 sm:px-5"
          style={{
            borderColor: 'rgba(249, 188, 96, 0.35)',
            background: 'rgba(249, 188, 96, 0.08)',
          }}
        >
          <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#f9bc60]" />
          <div>
            <p className="text-sm font-bold text-[#fffffe] sm:text-base">
              Демо-заявка
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#abd1c6]">
              Так выглядит страница подачи заявки после входа в аккаунт. Здесь
              показан пример — отправить её нельзя.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-3xl px-3 sm:px-4">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          data-kopi-tour="application-form"
          className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(165deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_100%)] shadow-[0_8px_40px_rgba(0,0,0,0.25)]"
        >
          <div className="border-b border-white/10 px-5 py-6 sm:px-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#f9bc60]">
              Подача заявки
            </p>
            <h1 className="text-2xl font-bold text-[#fffffe] sm:text-3xl">
              Расскажите свою историю
            </h1>
            <p className="mt-2 text-sm text-[#abd1c6]">
              Заполните форму честно и подробно — так модераторы быстрее поймут
              вашу ситуацию.
            </p>
          </div>

          <div className="space-y-4 p-5 sm:p-8">
            {DEMO_FIELDS.map((field, index) => {
              const Icon = field.icon;
              return (
                <motion.div
                  key={field.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + index * 0.04 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#f9bc60]" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#abd1c6]">
                      {field.label}
                    </span>
                  </div>
                  <p className="text-sm text-[#fffffe]">{field.value}</p>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="flex items-start gap-3 rounded-2xl border border-[#f9bc60]/20 bg-[#f9bc60]/8 p-4"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#f9bc60]" />
              <p className="text-sm leading-relaxed text-[#abd1c6]">
                Перед формой вы ознакомитесь с условиями платформы и подтвердите
                согласие — только после этого откроется отправка заявки.
              </p>
            </motion.div>

            <div
              className="rounded-xl px-4 py-3 text-center text-sm font-bold opacity-60"
              style={{ background: '#f9bc60', color: '#001e1d' }}
            >
              Отправить заявку (демо)
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <Link
            href={signupHref}
            className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-sm font-bold transition-transform hover:scale-[1.02]"
            style={{
              background:
                'linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)',
              color: '#001e1d',
              boxShadow: '0 10px 30px rgba(249, 188, 96, 0.25)',
            }}
          >
            Войти и подать заявку
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
