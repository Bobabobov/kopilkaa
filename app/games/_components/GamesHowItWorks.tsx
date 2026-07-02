'use client';

import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { GAMES_FAQ } from '@/lib/games/catalog';
import { cn } from '@/lib/utils';
import { useLobbyMotionProfile } from './effects/useLobbyMotionProfile';

export function GamesHowItWorks() {
  const { heavyBlur } = useLobbyMotionProfile();
  const glassBlur = heavyBlur ? 'backdrop-blur-xl' : 'backdrop-blur-md';

  return (
    <motion.section
      id='games-faq'
      aria-label='Как работают игры'
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className='scroll-mt-24 pb-8 sm:pb-12'
    >
      <div
        className={cn(
          'overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60',
          glassBlur,
        )}
      >
        <div className='flex items-center gap-2 border-b border-zinc-800 px-4 py-4 sm:px-5 sm:py-5 md:px-6'>
          <HelpCircle className='h-4 w-4 shrink-0 text-emerald-500/60' />
          <h2 className='font-mono text-xs uppercase tracking-widest text-zinc-300 sm:text-sm'>
            Как это работает
          </h2>
        </div>

        <div className='px-4 sm:px-5 md:px-6'>
          <Accordion type='single' collapsible className='w-full'>
            {GAMES_FAQ.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className='border-zinc-800'
              >
                <AccordionTrigger className='min-h-[44px] text-left text-sm text-zinc-200 hover:text-emerald-400 hover:no-underline sm:text-base'>
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className='font-mono text-xs leading-relaxed text-zinc-500 sm:text-sm'>
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
