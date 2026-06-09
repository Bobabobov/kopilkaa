'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  ClipboardList,
  Gift,
  Shield,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buildAuthModalUrl } from '@/lib/authModalUrl';
import { DEFAULT_AVATAR } from '@/lib/avatar';
import type { Route } from 'next';

const DEMO_STATS = [
  { label: 'Заявки', value: '2', icon: ClipboardList },
  { label: 'Одобрено', value: '1', icon: Star },
  { label: 'Друзья', value: '8', icon: Users },
  { label: 'Бонусы', value: '120', icon: Gift },
];

export default function KopiDemoProfile() {
  const signupHref = buildAuthModalUrl({
    pathname: '/profile/demo',
    search: '',
    modal: 'auth/signup',
  }) as Route;

  return (
    <div className="relative min-h-screen overflow-hidden pb-10 pt-4 sm:pt-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto mb-6 max-w-4xl px-3 sm:px-4"
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
              Демо-профиль
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#abd1c6]">
              Так будет выглядеть ваш личный кабинет после регистрации. Это
              пример — данные здесь условные.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-4xl px-3 sm:px-4">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(165deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_100%)] shadow-[0_8px_40px_rgba(0,0,0,0.25)]"
        >
          <div className="relative h-28 sm:h-36 bg-[linear-gradient(135deg,#004643_0%,#001e1d_100%)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,188,96,0.25),transparent_55%)]" />
          </div>

          <div className="relative px-4 pb-5 sm:px-6 sm:pb-6">
            <div className="-mt-12 mb-4 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-3xl border-4 border-[#001e1d] bg-[#004643] shadow-xl sm:h-28 sm:w-28">
                  <Image
                    src={DEFAULT_AVATAR}
                    alt="Аватар по умолчанию"
                    fill
                    sizes="(max-width: 640px) 96px, 112px"
                    className="object-cover"
                  />
                </div>
                <div className="pb-1">
                  <h1 className="text-2xl font-bold text-[#fffffe] sm:text-3xl">
                    Тут твое имя
                  </h1>
                  <p className="text-sm text-[#abd1c6]">@tyt_tvoi_nik</p>
                </div>
              </div>
              <Badge className="w-fit bg-[#f9bc60] text-[#001e1d] hover:bg-[#f9bc60]">
                Участник с января 2025
              </Badge>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#f9bc60]" />
                <span className="text-sm text-[#abd1c6]">Уровень доверия:</span>
                <Badge variant="default">Уровень 2</Badge>
              </div>
              <span className="hidden h-5 w-px bg-white/10 sm:inline" />
              <p className="text-sm text-[#abd1c6]">
                Поддержка:{' '}
                <span className="font-semibold text-[#f9bc60]">до 15 000 ₽</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DEMO_STATS.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <Icon className="mb-2 h-5 w-5 text-[#f9bc60]" />
                    <p className="text-2xl font-bold text-[#fffffe]">{stat.value}</p>
                    <p className="text-xs text-[#abd1c6]">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-5 grid gap-4 md:grid-cols-2"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#f9bc60]" />
              <h2 className="text-lg font-bold text-[#fffffe]">Мои истории</h2>
            </div>
            <p className="text-sm leading-relaxed text-[#abd1c6]">
              Здесь будут ваши опубликованные истории и статусы заявок после
              одобрения.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Gift className="h-5 w-5 text-[#f9bc60]" />
              <h2 className="text-lg font-bold text-[#fffffe]">Бонусы и активность</h2>
            </div>
            <p className="text-sm leading-relaxed text-[#abd1c6]">
              Баллы за «Добрые дела» и реферальная программа — всё собрано в одном
              месте.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
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
            Создать свой профиль
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
