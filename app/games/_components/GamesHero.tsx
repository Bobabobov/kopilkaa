'use client';

import { motion } from 'framer-motion';

export function GamesHero() {
  return (
    <div className='relative overflow-hidden px-4 pb-8 pt-6 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8'>
      <div className='relative z-10 mx-auto max-w-5xl'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className='text-center'
        >
          <p className='mb-3 font-mono text-xs uppercase tracking-[0.35em] text-emerald-500/40 sm:text-sm'>
            // game_lobby.sys
          </p>

          <h1 className='bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-400 bg-clip-text text-4xl font-black uppercase tracking-tight text-transparent sm:text-5xl'>
            Игры и интерактивы
          </h1>

          <p className='mx-auto mt-5 max-w-2xl px-4 font-mono text-sm leading-relaxed text-emerald-500/60 sm:text-base'>
            {'>'} Внутренние модули для усиления активности: рискуйте бонусами,
            тренируйте реакцию и умножайте награды
          </p>
        </motion.div>
      </div>
    </div>
  );
}
