'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';
import { BarChart3, LineChart, TrendingUp } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getHonorLimitChartData,
  getXpCurveChartData,
  type HonorLimitChartPoint,
  type XpCurveChartPoint,
} from '@/lib/userLevel/levelsHubData';
import { getMaxApplicationAmount } from '@/lib/level-config';
import type { UserLevelProgress } from '@/lib/userLevel';
import { cn } from '@/lib/utils';
import { LevelsSectionHeader } from './LevelsSectionHeader';
import { useLevelsMotionProfile } from './effects/useLevelsMotionProfile';
import { ChartMeasureBox } from './ChartMeasureBox';

function ChartTooltip({
  active,
  payload,
  label,
  valueLabel,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload?: HonorLimitChartPoint | XpCurveChartPoint }>;
  label?: string;
  valueLabel: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  const headline =
    point.payload && 'headline' in point.payload
      ? point.payload.headline
      : undefined;

  return (
    <div className="rounded-xl border border-[#f9bc60]/25 bg-[#001e1d]/95 px-3 py-2.5 text-xs shadow-xl backdrop-blur-md">
      <p className="font-semibold text-[#f9bc60]">{label}</p>
      {headline ? (
        <p className="mt-0.5 text-[#abd1c6]">{headline}</p>
      ) : null}
      <p className="mt-1 font-mono text-[#fffffe]">
        {valueLabel}: {point.value.toLocaleString('ru-RU')}
      </p>
    </div>
  );
}

interface LevelsChartsSectionProps {
  userLevel: UserLevelProgress;
}

export function LevelsChartsSection({ userLevel }: LevelsChartsSectionProps) {
  const [activeTab, setActiveTab] = useState('honor');
  const { heavyBlur } = useLevelsMotionProfile();
  const glassBlur = heavyBlur ? 'backdrop-blur-xl' : 'backdrop-blur-md';
  const honorData = getHonorLimitChartData();
  const xpData = getXpCurveChartData();
  const currentLimit = getMaxApplicationAmount(userLevel.level);
  const maxHonor = honorData[honorData.length - 1]?.limit ?? 0;
  const nextXp =
    xpData.find((p) => p.level === userLevel.level)?.xpNeeded ?? 0;

  return (
    <motion.section
      id="levels-charts"
      aria-label="Графики прогрессии"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="scroll-mt-28"
    >
      <LevelsSectionHeader
        kicker="Аналитика"
        title="Графики прогрессии"
        subtitle="Сравните лимиты гонорара и стоимость роста по уровням"
      />

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        <div className="rounded-xl border border-[#f9bc60]/20 bg-[#f9bc60]/8 px-3 py-2.5 sm:px-4 sm:py-3">
          <p className="text-[10px] uppercase tracking-wide text-[#abd1c6]/55">
            Ваш лимит
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-[#f9bc60] sm:text-xl">
            {currentLimit} ₽
          </p>
        </div>
        <div className="rounded-xl border border-[#abd1c6]/15 bg-[#001e1d]/40 px-3 py-2.5 sm:px-4 sm:py-3">
          <p className="text-[10px] uppercase tracking-wide text-[#abd1c6]/55">
            Макс. активный
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-[#fffffe] sm:text-xl">
            {maxHonor} ₽
          </p>
        </div>
        <div className="col-span-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-3 py-2.5 sm:col-span-1 sm:px-4 sm:py-3">
          <p className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-[#abd1c6]/55">
            <TrendingUp className="h-3 w-3" />
            Опыт на ваш ур.
          </p>
          <p className="mt-1 font-mono text-lg font-bold text-emerald-400 sm:text-xl">
            {nextXp.toLocaleString('ru-RU')}
          </p>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden rounded-2xl border border-[#abd1c6]/15 bg-[#004643]/40',
          glassBlur,
        )}
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="border-b border-[#abd1c6]/10 px-4 py-3 sm:px-5">
            <TabsList className="h-auto w-full gap-1 bg-[#001e1d]/55 p-1 sm:h-10 sm:w-auto">
              <TabsTrigger
                value="honor"
                className="flex-1 gap-1.5 data-[state=active]:bg-[#f9bc60]/15 data-[state=active]:text-[#f9bc60] sm:flex-none"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Гонорар
              </TabsTrigger>
              <TabsTrigger
                value="xp"
                className="flex-1 gap-1.5 data-[state=active]:bg-[#f9bc60]/15 data-[state=active]:text-[#f9bc60] sm:flex-none"
              >
                <LineChart className="h-3.5 w-3.5" />
                Опыт
              </TabsTrigger>
            </TabsList>
          </div>

          <div
            className="px-2 pb-4 pt-3 sm:px-5 sm:pb-5"
            role="tabpanel"
            aria-label={activeTab === 'honor' ? 'Гонорар' : 'Опыт'}
          >
            <ChartMeasureBox className="h-[240px] sm:h-[300px]">
              {(size) =>
                activeTab === 'honor' ? (
                  <BarChart
                    width={size.width}
                    height={size.height}
                    data={honorData}
                    margin={{ top: 12, right: 8, left: -8, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="rgba(171,209,198,0.07)"
                      strokeDasharray="3 6"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#abd1c6', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#abd1c6', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      content={(props) => (
                        <ChartTooltip {...props} valueLabel="Лимит, ₽" />
                      )}
                      cursor={{ fill: 'rgba(249,188,96,0.06)' }}
                    />
                    <ReferenceLine
                      x={`Ур. ${userLevel.level}`}
                      stroke="#f9bc60"
                      strokeDasharray="4 4"
                      strokeOpacity={0.7}
                    />
                    <Bar dataKey="limit" radius={[8, 8, 0, 0]} maxBarSize={52}>
                      {honorData.map((entry) => (
                        <Cell
                          key={entry.level}
                          fill={
                            entry.level === userLevel.level
                              ? 'url(#honorHighlight)'
                              : 'url(#honorGradient)'
                          }
                        />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="honorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#abd1c6" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#abd1c6" stopOpacity={0.35} />
                      </linearGradient>
                      <linearGradient id="honorHighlight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f9bc60" />
                        <stop offset="100%" stopColor="#e8a545" stopOpacity={0.7} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                ) : (
                  <AreaChart
                    width={size.width}
                    height={size.height}
                    data={xpData}
                    margin={{ top: 12, right: 8, left: -8, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="rgba(171,209,198,0.07)"
                      strokeDasharray="3 6"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#abd1c6', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#abd1c6', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      content={(props) => (
                        <ChartTooltip {...props} valueLabel="Опыт" />
                      )}
                    />
                    <ReferenceLine
                      x={`Ур. ${userLevel.level}`}
                      stroke="#f9bc60"
                      strokeDasharray="4 4"
                      strokeOpacity={0.7}
                    />
                    <Area
                      type="monotone"
                      dataKey="xpNeeded"
                      stroke="#34d399"
                      strokeWidth={2.5}
                      fill="url(#xpGradient)"
                      dot={{
                        fill: '#001e1d',
                        stroke: '#34d399',
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{ r: 6, fill: '#f9bc60', stroke: '#001e1d' }}
                    />
                  </AreaChart>
                )
              }
            </ChartMeasureBox>
          </div>
        </Tabs>
      </div>
    </motion.section>
  );
}
