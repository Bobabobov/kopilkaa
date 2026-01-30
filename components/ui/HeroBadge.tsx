"use client";

import { motion, useReducedMotion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { HeroBadge as HeroBadgeType } from "@/lib/heroBadges";

type HeroBadgeSize = "xs" | "sm" | "md";

const sizeMap: Record<
  HeroBadgeSize,
  { wrap: string; icon: "xs" | "sm" | "md"; text: string }
> = {
  xs: { wrap: "h-5 px-2", icon: "xs", text: "text-[11px]" },
  sm: { wrap: "h-6 px-2.5", icon: "xs", text: "text-xs" },
  md: { wrap: "h-7 px-3", icon: "sm", text: "text-sm" },
};

export function HeroBadge({
  badge,
  size = "sm",
  className = "",
}: {
  badge?: HeroBadgeType | null;
  size?: HeroBadgeSize;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  if (!badge) return null;

  const { wrap, icon, text } = sizeMap[size];

  const common =
    "relative inline-flex items-center justify-center select-none flex-shrink-0 " +
    "ring-1 ring-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.25)]";

  // На мобилках показываем полный текст (без сокращений), но делаем его компактнее по размеру.
  const Label = ({ full }: { full: string; short: string }) => (
    <span className={`ml-1 whitespace-nowrap leading-none ${text}`}>
      {full}
    </span>
  );

  const Base = motion.span;

  const shimmerNode = (
    color: string,
    durationSec: number,
    delaySec: number,
  ) => {
    if (reduceMotion) return null;
    return (
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <motion.span
          aria-hidden
          className="absolute -inset-y-2 -left-1/2 w-1/2 rotate-12 opacity-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          }}
          animate={{
            x: ["-140%", "240%"],
            opacity: [0, 0.55, 0],
          }}
          transition={{
            duration: durationSec,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: delaySec,
          }}
        />
      </motion.span>
    );
  };

  // IMPORTANT: visually readable without text; keep accessibility via title + sr-only.
  switch (badge) {
    case "observer":
      return (
        <Base
          className={`${common} ${wrap} gap-1 rounded-full bg-white/5 border border-white/15 text-white/85 ${className}`}
          title="Наблюдатель"
          whileHover={
            reduceMotion
              ? undefined
              : {
                  opacity: 0.92,
                  boxShadow: "0 12px 28px rgba(0,0,0,0.30)",
                }
          }
        >
          <LucideIcons.Eye size={icon} className="text-white/75" />
          <Label full="Наблюдатель" short="Набл." />
          <span className="sr-only">Наблюдатель</span>
        </Base>
      );

    case "member":
      return (
        <Base
          className={`${common} ${wrap} gap-1 rounded-xl bg-gradient-to-br from-[#abd1c6]/25 to-white/5 border border-[#abd1c6]/25 text-[#abd1c6] ${className}`}
          title="Участник"
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
          animate={
            reduceMotion
              ? undefined
              : {
                  opacity: [1, 0.92, 1],
                  scale: [1, 1, 1],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  // редкий pulse (раз в ~12s)
                  duration: 1.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 10.8,
                }
          }
          whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        >
          <motion.span
            aria-hidden
            animate={reduceMotion ? undefined : { rotate: [0, 3, 0, -3, 0] }}
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 2.2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 9.8,
                  }
            }
            className="inline-flex"
          >
            <LucideIcons.User size={icon} className="text-[#abd1c6]" />
          </motion.span>
          <Label full="Участник" short="Участ." />
          <span className="sr-only">Участник</span>
        </Base>
      );

    case "active":
      return (
        <Base
          className={`${common} ${wrap} gap-1 rounded-full border border-[#f9bc60]/35 bg-[#f9bc60]/10 ring-1 ring-[#f9bc60]/20 text-[#f9bc60] ${className}`}
          title="Активный участник"
          animate={
            reduceMotion
              ? undefined
              : {
                  boxShadow: [
                    "0 10px 26px rgba(0,0,0,0.28)",
                    "0 14px 34px rgba(249,188,96,0.16)",
                    "0 10px 26px rgba(0,0,0,0.28)",
                  ],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 2.8,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 3.2,
                }
          }
          whileHover={
            reduceMotion
              ? undefined
              : {
                  scale: 1.03,
                  boxShadow: "0 18px 44px rgba(249,188,96,0.22)",
                }
          }
        >
          <motion.span
            aria-hidden
            animate={reduceMotion ? undefined : { y: [0, -1.5, 0] }}
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 0.55,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatDelay: 9.45,
                  }
            }
            className="inline-flex"
          >
            <LucideIcons.Shield size={icon} className="text-[#f9bc60]" />
          </motion.span>
          <Label full="Активный" short="Актив." />
          <span className="sr-only">Активный участник</span>
        </Base>
      );

    case "hero":
      return (
        <Base
          className={`${common} ${wrap} gap-1 rounded-2xl border border-[#f9bc60]/45 bg-gradient-to-br from-[#f9bc60]/22 to-[#004643]/30 text-[#f9bc60] ${className}`}
          title="Герой"
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={
            reduceMotion ? undefined : { duration: 0.22, ease: "easeOut" }
          }
          whileHover={
            reduceMotion
              ? undefined
              : {
                  boxShadow:
                    "0 0 0 2px rgba(249,188,96,0.35), 0 18px 44px rgba(249,188,96,0.18)",
                }
          }
        >
          {shimmerNode("rgba(249,188,96,0.22)", 1.2, 12)}
          <LucideIcons.Star size={icon} className="text-[#f9bc60]" />
          <Label full="Герой" short="Герой" />
          <span className="sr-only">Герой</span>
        </Base>
      );

    case "honor":
      return (
        <Base
          className={`${common} ${wrap} gap-1 rounded-full border-2 border-[#C0C0C0]/55 bg-gradient-to-br from-white/10 to-[#001e1d]/40 text-[#C0C0C0] ${className}`}
          title="Почётный герой"
          whileHover={
            reduceMotion
              ? undefined
              : {
                  boxShadow:
                    "0 0 0 2px rgba(192,192,192,0.32), 0 0 0 4px rgba(255,255,255,0.08), 0 18px 44px rgba(0,0,0,0.30)",
                }
          }
        >
          {shimmerNode("rgba(255,255,255,0.20)", 1.2, 10)}
          <motion.span
            aria-hidden
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 26, ease: "linear", repeat: Infinity }
            }
            className="inline-flex"
          >
            <LucideIcons.Medal size={icon} className="text-[#C0C0C0]" />
          </motion.span>
          <Label full="Почётный герой" short="Почёт." />
          <span className="sr-only">Почётный герой</span>
        </Base>
      );

    case "legend":
      return (
        <Base
          className={`${common} ${wrap} gap-1 rounded-[14px] border border-[#FFD700]/55 bg-gradient-to-br from-[#FFD700]/18 via-[#f9bc60]/10 to-[#004643]/35 text-[#FFD700] ${className}`}
          title="Легенда"
          initial={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
          animate={
            reduceMotion
              ? undefined
              : {
                  opacity: 1,
                  scale: [1, 1.01, 1],
                  boxShadow: [
                    "0 12px 30px rgba(0,0,0,0.30)",
                    "0 18px 44px rgba(255,215,0,0.18)",
                    "0 12px 30px rgba(0,0,0,0.30)",
                  ],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 3.4,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 2.8,
                }
          }
          whileHover={
            reduceMotion
              ? undefined
              : {
                  boxShadow:
                    "0 18px 52px rgba(255,215,0,0.22), 0 0 0 2px rgba(255,215,0,0.22)",
                }
          }
        >
          {!reduceMotion && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
              style={{
                background:
                  "radial-gradient(120% 120% at 50% 10%, rgba(255,215,0,0.18), transparent 55%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.65, 0] }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
          )}
          {shimmerNode("rgba(255,215,0,0.22)", 1.0, 8)}
          <LucideIcons.Crown size={icon} className="text-[#FFD700]" />
          <Label full="Легенда" short="Леген." />
          <span className="sr-only">Легенда</span>
        </Base>
      );

    case "tester":
      return (
        <Base
          className={`${common} ${wrap} gap-1 rounded-xl border border-[#10B981]/50 bg-gradient-to-br from-[#10B981]/20 to-[#001e1d]/40 text-[#10B981] ${className}`}
          title="Тестировщик"
          initial={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.015, 0.99, 1],
                  boxShadow: [
                    "0 12px 30px rgba(0,0,0,0.30)",
                    "0 16px 40px rgba(16,185,129,0.25)",
                    "0 14px 35px rgba(16,185,129,0.20)",
                    "0 12px 30px rgba(0,0,0,0.30)",
                  ],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : { duration: 2.5, ease: "easeInOut", repeat: Infinity }
          }
          whileHover={
            reduceMotion
              ? undefined
              : {
                  scale: 1.05,
                  boxShadow:
                    "0 20px 60px rgba(16,185,129,0.30), 0 0 0 3px rgba(16,185,129,0.30)",
                }
          }
        >
          {!reduceMotion && (
            <>
              {/* Постоянный фон с легкой пульсацией */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit]"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.20), transparent 70%)",
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
              </motion.span>

              {/* Эффект "пузырьков" */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.span
                    key={i}
                    aria-hidden
                    className="absolute w-1 h-1 rounded-full bg-[#10B981]"
                    style={{
                      left: `${20 + i * 30}%`,
                      bottom: "10%",
                    }}
                    animate={{
                      y: [0, -40, 0],
                      opacity: [0.5, 0.8, 0.5],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.4,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  />
                ))}
              </motion.span>
            </>
          )}
          {/* Вращающаяся иконка с легким наклоном */}
          <motion.span
            animate={
              reduceMotion
                ? undefined
                : {
                    rotate: [0, 4, -4, 0],
                  }
            }
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="inline-flex"
          >
            <LucideIcons.TestTube size={icon} className="text-[#10B981]" />
          </motion.span>
          <Label full="Тестировщик" short="Тест." />
          <span className="sr-only">Тестировщик</span>
        </Base>
      );

    case "custom":
    default:
      return (
        <Base
          className={`${common} ${wrap} gap-1 rounded-[16px] border border-fuchsia-300/50 bg-gradient-to-br from-fuchsia-500/15 to-[#001e1d]/50 text-fuchsia-200 ${className}`}
          title="Уникальный статус"
          animate={
            reduceMotion
              ? undefined
              : {
                  boxShadow: [
                    "0 12px 32px rgba(0,0,0,0.30)",
                    "0 18px 46px rgba(217,70,239,0.20)",
                    "0 12px 32px rgba(0,0,0,0.30)",
                  ],
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 3.6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 3.2,
                }
          }
        >
          {shimmerNode("rgba(217,70,239,0.22)", 1.0, 9)}
          <LucideIcons.Award size={icon} className="text-fuchsia-200" />
          <Label full="Уникальный" short="Уник." />
          <span className="sr-only">Уникальный статус</span>
        </Base>
      );
  }
}
