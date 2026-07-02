'use client';

import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LEVELS_HUB_FAQ } from '@/lib/userLevel/levelsHubData';
import { cn } from '@/lib/utils';
import { LevelsSectionHeader } from './LevelsSectionHeader';
import { useLevelsMotionProfile } from './effects/useLevelsMotionProfile';

export function LevelsHowItWorks() {
  const { heavyBlur } = useLevelsMotionProfile();
  const glassBlur = heavyBlur ? 'backdrop-blur-xl' : 'backdrop-blur-md';

  return (
    <motion.section
      id="levels-faq"
      aria-label="Как работает система уровней"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-28 pb-4"
    >
      <LevelsSectionHeader
        kicker="Справка"
        title="Частые вопросы"
        subtitle="Короткие ответы о механике уровней и бонусов"
      />

      <div
        className={cn(
          'overflow-hidden rounded-2xl border border-[#abd1c6]/15 bg-[#004643]/40',
          glassBlur,
        )}
      >
        <div className="flex items-center gap-2 border-b border-[#abd1c6]/10 px-4 py-3.5 sm:px-5">
          <HelpCircle className="h-4 w-4 shrink-0 text-[#f9bc60]/70" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#abd1c6]/70 sm:text-xs">
            FAQ · level_ascension
          </span>
        </div>

        <div className="px-3 sm:px-4 md:px-5">
          <Accordion type="single" collapsible className="w-full">
            {LEVELS_HUB_FAQ.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-[#abd1c6]/10"
              >
                <AccordionTrigger className="min-h-[48px] py-3 text-left text-sm text-[#fffffe] hover:text-[#f9bc60] hover:no-underline sm:text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-[#abd1c6]/75">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </motion.section>
  );
}
