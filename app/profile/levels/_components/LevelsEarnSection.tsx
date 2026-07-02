'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Gamepad2, Gift, HeartHandshake } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { LevelsSectionHeader } from './LevelsSectionHeader';

const EARN_SOURCES = [
  {
    href: '/good-deeds',
    icon: HeartHandshake,
    title: 'Добрые дела',
    description: 'Стабильный источник бонусов за задания',
    accent: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
  },
  {
    href: '/profile#profile-daily-bonus',
    icon: Gift,
    title: 'Ежедневный бонус',
    description: 'Заходите каждый день и копите серию',
    accent: 'text-[#f9bc60]',
    iconBg: 'bg-[#f9bc60]/10',
  },
  {
    href: '/games',
    icon: Gamepad2,
    title: 'Игры',
    description: 'Риск и награда в игровых модулях',
    accent: 'text-violet-300',
    iconBg: 'bg-violet-500/10',
  },
] as const;

export function LevelsEarnSection() {
  return (
    <motion.section
      id="levels-earn"
      aria-label="Как заработать бонусы"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-28"
    >
      <LevelsSectionHeader
        kicker="Экономика"
        title="Откуда берутся бонусы"
        subtitle="Три способа пополнить баланс для роста уровня"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {EARN_SOURCES.map((source, index) => {
          const Icon = source.icon;
          return (
            <motion.div
              key={source.href}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
            >
              <Link href={source.href} className="group block h-full">
                <Card
                  variant="darkGlass"
                  padding="md"
                  hoverable
                  className="h-full border-white/[0.06] bg-[#004643]/20 backdrop-blur-xl"
                >
                  <div
                    className={cn(
                      'mb-3 flex h-10 w-10 items-center justify-center rounded-xl',
                      source.iconBg,
                      source.accent,
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-base font-semibold text-[#fffffe]">
                    {source.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#abd1c6]/65">
                    {source.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#abd1c6]/50 transition-colors group-hover:text-[#f9bc60]">
                    Открыть
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
