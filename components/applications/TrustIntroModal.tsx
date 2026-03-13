"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcons } from "@/components/ui/LucideIcons";

type Props = {
  open: boolean;
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
  onConfirm: () => void;
};

export function TrustIntroModal({
  open,
  checked,
  onCheckedChange,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-0 z-[60] flex items-center justify-center px-3 sm:px-4"
    >
      <div className="absolute inset-0 bg-[#001e1d]/80 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="relative w-full max-w-[840px] max-h-[84vh] overflow-y-auto rounded-[28px] border border-white/10 bg-gradient-to-br from-white/12 via-white/6 to-white/10 shadow-[0_26px_80px_rgba(0,0,0,0.75)] p-6 sm:p-7 lg:p-8 space-y-6 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:h-0"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="absolute inset-x-8 top-4 h-1 rounded-full bg-gradient-to-r from-[#f9bc60] via-[#abd1c6] to-[#f9bc60] opacity-80 blur-[1px]" />
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.02 }}
          className="space-y-3 max-w-[70ch]"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f9bc60]/40 bg-[#f9bc60]/12 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#f9bc60] shadow-[0_0_20px_rgba(249,188,96,0.45)]">
            <LucideIcons.AlertTriangle size="xs" />
            Важно перед подачей заявки
          </div>
          <h2 className="text-2xl sm:text-[30px] font-semibold text-[#fffffe] leading-tight drop-shadow-[0_0_26px_rgba(0,0,0,0.55)]">
            Копилка помогает не во всех ситуациях
          </h2>
          <p className="text-sm sm:text-base text-[#e5f2ee] leading-relaxed">
            Мы заранее обозначаем границы проекта, чтобы избежать недопонимания.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#e6f1ec] backdrop-blur-sm">
              <LucideIcons.Shield size="xs" className="text-[#abd1c6]" />
              Без долгов и кредитов
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#e6f1ec] backdrop-blur-sm">
              <LucideIcons.Heart size="xs" className="text-[#e16162]" />
              Без медицины и лечения
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#e6f1ec] backdrop-blur-sm">
              <LucideIcons.Home size="xs" className="text-[#f9bc60]" />
              Бытовая помощь
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.08 }}
          className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6 items-start"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut", delay: 0.1 }}
            className="space-y-2.5 rounded-2xl bg-white/4 p-4 sm:p-4.5 relative overflow-hidden border border-white/10 backdrop-blur-md"
          >
            <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#e16162]/70 rounded-full" />
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-[#e16162]/22 blur-3xl" />
            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[#d9e6e0]">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1c4037]/60 text-[#f9bc60]">
                <LucideIcons.XCircle size="xs" />
              </span>
              Мы не помогаем с:
            </div>
            <span className="inline-flex items-center w-fit rounded-full border border-[#e16162]/30 bg-[#e16162]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#e16162]">
              Нельзя
            </span>
            <ul className="space-y-2.5 text-sm text-[#dbe7e2] leading-snug">
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#ffe0dd] flex items-center gap-2">
                  <span className="inline-flex px-1.5 py-0.5 rounded-full bg-[#e16162]/20 text-[10px] font-bold text-[#ffc9c2]">
                    ВАЖНО
                  </span>
                  Кредиты и займы
                </div>
                <div className="text-xs text-[#9fb2ab]">
                  Банковские кредиты, рассрочки, потребительские займы и похожие
                  обязательства — <span className="font-semibold text-[#ffe0dd]">никогда не одобряются через Копилку</span>.
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#e3f0ea]">• МФО и займы «до зарплаты»</div>
                <div className="text-xs text-[#9fb2ab]">Онлайн-займы и быстрые деньги.</div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#e3f0ea]">
                  • Долги, просрочки, коллекторы
                </div>
                <div className="text-xs text-[#9fb2ab]">Штрафы, пени и коллекторы.</div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#e3f0ea]">• Лечение и лекарства</div>
                <div className="text-xs text-[#9fb2ab]">Лечение, обследования и препараты.</div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#e3f0ea]">• Медицинские сборы</div>
                <div className="text-xs text-[#9fb2ab]">Реабилитация, анализы, платные процедуры.</div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#e3f0ea]">• Азартные игры и ставки</div>
                <div className="text-xs text-[#9fb2ab]">
                  Букмекеры, казино, лотереи и рискованные игровые активности
                </div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#ffe0dd] flex items-center gap-2">
                  <span className="inline-flex px-1.5 py-0.5 rounded-full bg-[#e16162]/20 text-[10px] font-bold text-[#ffc9c2]">
                    ВАЖНО
                  </span>
                  Дробление одной цели на множество заявок
                </div>
                <div className="text-xs text-[#9fb2ab]">
                  <span className="font-semibold text-[#ffe0dd]">Одна цель — одна заявка.</span> Нельзя
                  разбивать одну покупку на серию похожих заявок.
                </div>
              </li>
            </ul>
            <p className="text-[11px] text-[#9fb2ab]">
              Если сомневаетесь, подходит ли ваша ситуация — лучше сначала уточните у поддержки.
            </p>
          </motion.div>

          <div className="hidden md:block w-px h-full bg-[#2c4f45]/60 mx-1" />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: "easeOut", delay: 0.12 }}
            className="space-y-3.5 rounded-2xl bg-white/4 p-4 sm:p-5 relative overflow-hidden transition-colors duration-200 border border-white/10 backdrop-blur-md"
          >
            <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#2f6f5a]/90 rounded-full" />
            <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-[#f9bc60]/28 blur-3xl" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/0 via-white/0 to-white/[0.03]" />
            <div className="space-y-2 relative">
              <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-[#f6fcf9] drop-shadow-[0_0_12px_rgba(246,252,249,0.12)]">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#2f6f5a]/70 text-[#f9bc60]">
                  <LucideIcons.CheckCircle2 size="sm" />
                </span>
                Мы можем помочь с:
              </div>
              <div className="h-px w-16 bg-[#2c4f45]/40" />
            </div>
            <span className="inline-flex items-center w-fit rounded-full border border-[#f9bc60]/30 bg-[#f9bc60]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#f9bc60]">
              Можно
            </span>
            <ul className="space-y-2.5 text-sm text-[#f1fbf7] leading-snug relative">
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#f2faf6]">• Еда и напитки</div>
                <div className="text-xs text-[#c8d9d2]">Покупка продуктов, перекус, вода, чай, кофе.</div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#f2faf6]">• Небольшие бытовые расходы</div>
                <div className="text-xs text-[#c8d9d2]">Базовые вещи первой необходимости.</div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#f2faf6]">
                  • Проезд, связь и мелкие расходы
                </div>
                <div className="text-xs text-[#c8d9d2]">Транспорт, связь, интернет и мелкие траты.</div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#f2faf6]">• Небольшой подарок</div>
                <div className="text-xs text-[#c8d9d2]">Небольшой подарок без крупных затрат.</div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#f2faf6]">• Донат в игру или сервис</div>
                <div className="text-xs text-[#c8d9d2]">Игры, подписки и небольшие цифровые покупки.</div>
              </li>
              <li className="space-y-1 pl-1">
                <div className="font-semibold text-[#f2faf6]">
                  • Поддержка в обычной жизненной ситуации
                </div>
                <div className="text-xs text-[#c8d9d2]">
                  Небольшая помощь здесь и сейчас без долгов и серьёзных обязательств.
                </div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 0.16 }}
          className="space-y-3.5 border-t border-white/10 pt-3.5"
        >
            <div className="space-y-3 rounded-2xl bg-white/5 p-4 sm:p-5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[#f6fcf9]">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2f6f5a]/70 text-[#f9bc60]">
                <LucideIcons.Image size="xs" />
              </span>
              Как работает система отчётов
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-[#cfdcd6] leading-relaxed">
              <li>
                <span className="font-semibold text-[#fef8e7]">
                  1. После первой одобренной заявки вы один раз оставляете отзыв с фото
                </span>{" "}
                — это обязательный шаг перед следующей заявкой.
              </li>
              <li>
                <span className="font-semibold text-[#fef8e7]">
                  2. Для каждой новой заявки прикрепляйте короткий фото‑отчёт
                </span>{" "}
                по прошлой одобренной заявке (чек, товар, переписка и т.п.).
              </li>
            </ul>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-[11px] sm:text-xs text-[#d5e4de]">
              <div className="rounded-xl border border-[#2f6f5a]/70 bg-[#14352f]/80 px-3 py-2 flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2f6f5a] text-[#f9bc60] text-[10px] font-bold">
                  1
                </span>
                <div>
                  <div className="font-semibold text-[#f2faf6]">Заполните заявку</div>
                  <div className="text-[#c1d3cd]">
                    Кратко и честно опишите ситуацию и цель.
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-[#2f6f5a]/70 bg-[#14352f]/80 px-3 py-2 flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2f6f5a] text-[#f9bc60] text-[10px] font-bold">
                  2
                </span>
                <div>
                  <div className="font-semibold text-[#f2faf6]">Дождитесь решения</div>
                  <div className="text-[#c1d3cd]">
                    Админ смотрит историю заявок, отзыв и отчёты.
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-[#2f6f5a]/70 bg-[#14352f]/80 px-3 py-2 flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2f6f5a] text-[#f9bc60] text-[10px] font-bold">
                  3
                </span>
                <div>
                  <div className="font-semibold text-[#f2faf6]">Сделайте отчёт</div>
                  <div className="text-[#c1d3cd]">
                    После помощи прикрепите фото результата, чтобы следующие заявки одобряли быстрее.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "rounded-xl p-3 sm:p-4 transition-colors border border-white/10",
              checked ? "bg-emerald-500/15" : "bg-white/4",
            )}
          >
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-[#2c4f45] bg-transparent text-[#f9bc60] focus:ring-[#f9bc60] focus:ring-offset-0"
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
              />
              <span className="text-sm text-[#e6f1ec] leading-relaxed">
                Я понимаю условия и подаю подходящую заявку
              </span>
            </label>
          </div>

          <div className="sticky bottom-0 pt-2 pb-1 bg-gradient-to-t from-[#001e1d] via-[#001e1d]/80 to-transparent">
            <button
              type="button"
              disabled={!checked}
              onClick={() => {
                if (!checked) return;
                onConfirm();
              }}
              className={cn(
                "w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all shadow-lg",
                checked
                  ? "bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] hover:shadow-[0_12px_30px_rgba(249,188,96,0.4)]"
                  : "bg-white/10 text-[#8ea09a] cursor-not-allowed",
              )}
            >
              Понятно, продолжить
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default TrustIntroModal;
