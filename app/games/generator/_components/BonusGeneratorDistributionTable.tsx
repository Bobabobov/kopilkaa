'use client';

import {
  formatGeneratorProbability,
  GENERATOR_REWARD_TIERS,
} from '@/lib/games/bonusGeneratorDistribution';
import { cn } from '@/lib/utils';

export function BonusGeneratorDistributionTable() {
  return (
    <div className='mt-6 overflow-hidden rounded-2xl border border-emerald-500/20 bg-zinc-900/40 p-6 shadow-2xl backdrop-blur-xl'>
      <h2 className='text-lg font-bold text-zinc-100 sm:text-xl'>
        Таблица распределения вознаграждений
      </h2>
      <p className='mt-2 text-sm text-zinc-400'>
        Прозрачные условия программы лояльности для каждого запуска генератора.
      </p>

      <div className='mt-5 overflow-hidden rounded-xl border border-emerald-500/10'>
        <table className='w-full text-left text-sm'>
          <thead>
            <tr className='border-b border-emerald-500/10 bg-emerald-950/20'>
              <th className='px-4 py-3 font-semibold text-zinc-400'>Вероятность</th>
              <th className='px-4 py-3 font-semibold text-zinc-400'>Вознаграждение</th>
            </tr>
          </thead>
          <tbody>
            {GENERATOR_REWARD_TIERS.map((tier) => (
              <tr
                key={`${tier.probabilityPercent}-${tier.reward}`}
                className={cn(
                  'border-b border-emerald-500/5 last:border-b-0',
                  tier.isMega && 'bg-amber-500/[0.07]',
                )}
              >
                <td className='px-4 py-3 font-medium text-zinc-100'>
                  {formatGeneratorProbability(tier.probabilityPercent)}
                </td>
                <td
                  className={cn(
                    'px-4 py-3 text-zinc-400',
                    tier.isMega && 'font-semibold text-amber-400',
                  )}
                >
                  {tier.rewardDescription}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
